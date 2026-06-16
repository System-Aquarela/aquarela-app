# Aquarela Mobile App

Este é o aplicativo móvel do projeto Aquarela, construído utilizando:
- **React Native** com **Expo**
- **TypeScript**
- **Expo Router** para navegação baseada em arquivos
- **AsyncStorage** para persistência de dados locais

## Estrutura de Pastas
A estrutura interna segue a divisão em features (Feature-Sliced Design simplificado):
- `/app`: Telas da aplicação (roteamento).
- `/src/components`: Componentes visuais genéricos (UI).
- `/src/design`: Tokens de design (cores, tipografia, espaçamento).
- `/src/features`: Lógica de negócio, componentes e hooks isolados por domínio (ex: `memories`, `visits`).
- `/src/services`: Serviços e integração (armazenamento local).
- `/src/types`: Definições de tipos TypeScript.
- `/src/mocks`: Dados simulados (já que não há backend).

## Como rodar localmente

1. Na raiz do monorepo, acesse esta pasta:
```bash
cd apps/mobile
```

2. Instale as dependências caso ainda não tenha feito:
```bash
npm install
```

3. Inicie o bundler do Expo:
```bash
npm run start
```

## Dados Fictícios
Toda a interação de backend e persistência real é simulada utilizando o `AsyncStorage` com preenchimento inicial através da pasta `/src/mocks`.
