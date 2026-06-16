# Aquarela 🎨

Aquarela é um aplicativo móvel desenhado para **aproximar famílias e preservar memórias**. Especialmente voltado para apoiar familiares de idosos (e pessoas com problemas de memória ou Alzheimer), o aplicativo atua como uma ponte afetiva, ajudando a reviver bons momentos de forma guiada, sensível e altamente personalizada.

---

## 🌟 Principais Funcionalidades

- **Diário de Memórias**: Registre e guarde histórias familiares nos mais diversos formatos (Fotos, Vídeos, Áudios, Textos e Músicas marcantes).
- **Player de Memórias (Visita em Andamento)**: Transformamos o momento da visita em algo especial. Acesse um carrossel / player visual de memórias para mostrar ao idoso, facilitando o gatilho de boas lembranças. Acompanha registro de reação (se sorriu, se conversou, se ficou calmo).
- **Perfil Humanizado do Idoso**:
  - Foto e informações vitais.
  - **Assuntos favoritos**: para saber como puxar um bom papo.
  - **Músicas favoritas**: com integração e visualização em lista.
  - **Temas Sensíveis**: alertas visuais para evitar assuntos que possam causar desconforto ou gatilhos negativos.
- **Identidade Visual Acolhedora**: Design cuidadosamente pensado com paleta de cores suaves (terracota, azuis calmos, verdes serenos e beges) e cantos arredondados, reduzindo atritos visuais e trazendo conforto emocional.

---

## 🛠 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas de desenvolvimento mobile:

- **[React Native](https://reactnative.dev/)**: Framework para a construção da interface nativa.
- **[Expo](https://expo.dev/)**: Plataforma que facilita a criação, testes e deploy do aplicativo móvel.
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de navegação baseado em arquivos (file-based routing), tornando a organização de telas muito mais intuitiva.
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem principal do projeto, garantindo tipagem estática, auto-completar e menos bugs em tempo de execução.

---

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para testar o aplicativo no seu computador e em seu próprio celular.

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (Versão 18 LTS ou superior recomendada).
- [Aplicativo Expo Go](https://expo.dev/client) instalado no seu celular (disponível para Android e iOS).

### Passo a Passo

1. **Clone ou baixe** este repositório para o seu computador.
2. Navegue até o diretório do aplicativo móvel:
   ```bash
   cd apps/mobile
   ```
3. Instale as dependências do projeto:
   ```bash
   npm install
   ```
   *(Ou utilize `yarn` caso prefira: `yarn install`)*
4. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npm run start
   ```
   *(Se houver necessidade de limpar o cache, você pode usar `npx expo start -c`)*
5. **Teste no celular**:
   - Abra a câmera do seu celular (no iOS) ou o aplicativo Expo Go (no Android).
   - Escaneie o **QR Code** que apareceu no seu terminal.
   - O aplicativo fará o bundle e abrirá diretamente na sua tela!

---

## 📁 Estrutura de Pastas (Mobile)

A pasta principal de código está em `apps/mobile/app` e `apps/mobile/src`:

```
Aquarela/
└── apps/
    └── mobile/
        ├── app/                  # Telas e Rotas (Expo Router)
        │   ├── (tabs)/           # Telas do menu de navegação inferior (Home, Memórias, Perfil)
        │   ├── auth/             # Fluxo de autenticação (Login, Cadastro)
        │   ├── memories/         # Fluxo de visualização e criação de memórias
        │   ├── visits/           # Fluxo de "Visitas em Andamento" e histórico
        │   ├── _layout.tsx       # Layout Global
        │   └── welcome.tsx       # Tela inicial
        └── src/                  # Componentes reaproveitáveis e lógicas
            ├── components/       # Componentes visuais da interface (Botões, Inputs, Cards)
            ├── design/           # Sistema de cores, espaçamentos (theme.ts)
            └── store/            # Gerenciamento de estado (AppContext)
```

---

## 🤝 Equipe
Projeto construído para a **Liga Jovem**! Focado no bem-estar de quem já cuidou de nós a vida inteira.