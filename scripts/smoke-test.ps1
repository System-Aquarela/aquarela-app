param(
  [string]$ApiUrl = 'http://127.0.0.1:3333',
  [string]$Email = 'ana@aquarela.local',
  [string]$Password = 'aquarela123',
  [string]$FaceImagePath
)

$ErrorActionPreference = 'Stop'

function Invoke-Api {
  param([string]$Method, [string]$Path, $Body)
  $params = @{
    Method = $Method
    Uri = "$ApiUrl$Path"
    Headers = @{ Authorization = "Bearer $script:AccessToken" }
    DisableKeepAlive = $true
  }
  if ($null -ne $Body) {
    $params.ContentType = 'application/json; charset=utf-8'
    $params.Body = $Body | ConvertTo-Json -Depth 12
  }
  Invoke-RestMethod @params
}

function Upload-File {
  param([string]$Path, [string]$FilePath, [string]$MimeType)
  $raw = & curl.exe --silent --show-error --fail -X POST "$ApiUrl$Path" -H "Authorization: Bearer $script:AccessToken" -F "file=@$FilePath;type=$MimeType"
  if ($LASTEXITCODE -ne 0) { throw "Falha no upload para $Path" }
  $raw | ConvertFrom-Json
}

$health = Invoke-RestMethod "$ApiUrl/health" -DisableKeepAlive
if (-not $health.ok) { throw 'Health check da API falhou.' }

$login = Invoke-RestMethod -Method Post -Uri "$ApiUrl/auth/login" -ContentType 'application/json' -DisableKeepAlive -Body (@{ email = $Email; password = $Password } | ConvertTo-Json)
$script:AccessToken = $login.accessToken

$profile = (Invoke-Api Post '/profiles' @{
  name = 'Perfil Smoke Test'
  nickname = 'QA local'
  age = 70
  city = 'Ambiente Docker'
}).profile

try {
  $logoPath = (Resolve-Path (Join-Path $PSScriptRoot '..\info\AquarelaLogo.jpeg')).Path
  $upload = Upload-File "/media/upload?profileId=$($profile.id)" $logoPath 'image/jpeg'
  $asset = $upload.asset

  $profile = (Invoke-Api Patch "/profiles/$($profile.id)" @{
    photoMediaId = $asset.id
    favoriteSubjects = @('Família', 'Música')
    favoriteSongs = @('Canção de teste')
    sensitiveTopics = @('Tema reservado')
  }).profile
  if (-not $profile.photoUrl) { throw 'Foto privada do perfil não foi vinculada.' }

  $person = (Invoke-Api Post "/profiles/$($profile.id)/people" @{
    name = 'Pessoa de Teste'
    relation = 'Familiar'
    description = 'Cadastro criado pelo smoke test.'
    scannerConsent = [bool]$FaceImagePath
  }).person

  $memory = (Invoke-Api Post "/profiles/$($profile.id)/memories" @{
    title = 'Memória do smoke test'
    period = 'Hoje'
    story = 'Registro usado para validar persistência, mídia e vínculos.'
    category = 'Família'
    mediaId = $asset.id
    peopleIds = @($person.id)
    isFavorite = $true
  }).memory
  if ($memory.peopleInvolved -notcontains 'Pessoa de Teste') { throw 'Vínculo entre memória e pessoa não foi persistido.' }

  Invoke-Api Post "/profiles/$($profile.id)/diary" @{
    mood = 'Tranquilo'
    interaction = 'Boa interação de teste'
    orientation = 'Sem observação relevante'
    recognition = 'Registro de teste'
  } | Out-Null

  Invoke-Api Post "/profiles/$($profile.id)/visits" @{
    generatedSmile = $true
    generatedConversation = $true
    generatedDiscomfort = $false
    observation = 'Visita criada pelo smoke test.'
  } | Out-Null

  $report = Invoke-Api Get "/profiles/$($profile.id)/reports" $null
  $pdf = Invoke-Api Post "/profiles/$($profile.id)/reports/export" @{}
  $pdfUrl = if ($pdf.url.StartsWith('http')) { $pdf.url } else { "$ApiUrl$($pdf.url)" }
  $pdfStatus = & curl.exe --silent --output NUL --write-out '%{http_code}' $pdfUrl
  if ($pdfStatus -ne '200') { throw "Download privado do PDF retornou $pdfStatus." }

  $anonymousUrl = "http://localhost:9000/$($asset.bucket)/$($asset.objectKey)"
  $anonymousStatus = & curl.exe --silent --output NUL --write-out '%{http_code}' $anonymousUrl
  if ($anonymousStatus -eq '200') { throw 'O objeto do MinIO está acessível anonimamente.' }

  if ($FaceImagePath) {
    $resolvedFace = (Resolve-Path $FaceImagePath).Path
    Upload-File "/people/$($person.id)/face-images" $resolvedFace 'image/jpeg' | Out-Null
    $recognition = Upload-File "/scanner/recognize?profileId=$($profile.id)" $resolvedFace 'image/jpeg'
    if (-not $recognition.matches -or $recognition.matches[0].personId -ne $person.id) {
      throw 'O reconhecimento facial não encontrou a pessoa cadastrada.'
    }
  }

  $export = Invoke-Api Get "/profiles/$($profile.id)/export" $null
  if ($export.profile.id -ne $profile.id) { throw 'Exportação de dados inconsistente.' }

  [PSCustomObject]@{
    ok = $true
    health = $health.services
    profileId = $profile.id
    memoryId = $memory.id
    connectionScore = $report.connection.score
    privateMediaStatus = $pdfStatus
    anonymousMinioStatus = $anonymousStatus
    facialRecognition = [bool]$FaceImagePath
  } | ConvertTo-Json -Depth 5
}
finally {
  Invoke-Api Delete "/profiles/$($profile.id)" $null | Out-Null
}
