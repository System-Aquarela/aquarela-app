# Aquarela Mobile App

Aplicativo móvel do projeto Aquarela, construído com React Native, Expo Router e TypeScript.

## Integração local

O app agora usa a API local em Docker como fonte de verdade para autenticação, perfis, memórias, pessoas, diário, visitas, legados, scanner e relatórios. Tokens de sessão ficam no `expo-secure-store`, com fallback para web durante testes.

Serviços esperados:

- API: `http://localhost:3333`
- Postgres local: `localhost:55432`
- MinIO: `http://localhost:9001`
- Face service: `http://localhost:8000`

Para testar em celular físico, defina a URL da API com o IP da máquina na rede:

```bash
set EXPO_PUBLIC_API_URL=http://10.10.11.182:3333
npm run --workspace mobile start
```

No PowerShell, se preferir na mesma linha:

```powershell
$env:EXPO_PUBLIC_API_URL='http://10.10.11.182:3333'; npm run --workspace mobile start
```

## Como rodar

Na raiz do monorepo:

```bash
docker compose up -d postgres minio
npm run --workspace api prisma:deploy
npm run --workspace api prisma:seed
npm run --workspace api dev
npm run --workspace mobile start
```

Login seed:

- E-mail: `ana@aquarela.local`
- Senha: `aquarela123`

## Observações

Biometria, câmera, galeria e mídia nativa exigem Expo dev build para o fluxo completo. Expo Go ainda ajuda em partes do app, mas reconhecimento/câmera/biometria devem ser testados em dev build.
