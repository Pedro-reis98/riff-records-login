# Riff Records Login

Tela de login responsiva feita em Expo + React Native Web para uma loja de vinis de rock.

O objetivo do projeto e atender ao desafio da faculdade:

- uma imagem principal
- dois campos para login e senha
- um botao de acesso
- um link para recuperar senha
- um link para criar conta
- confirmacao visual depois do login

## Rodando localmente

Instale as dependencias:

```bash
npm install
```

Inicie o projeto no navegador:

```bash
npm run web
```

## Validacao

Antes de publicar, rode:

```bash
npm run deploy:check
```

Esse comando executa a checagem TypeScript e gera o build web em `dist`.

## Deploy no Render

O arquivo `render.yaml` esta configurado para publicar o projeto como Static Site no Render.

No Render:

1. Crie um novo Blueprint ou conecte o repositorio pelo painel.
2. Selecione o arquivo `render.yaml`.
3. Confirme o servico `riff-records-login`.
4. Publique.

Configuracao usada:

- Build Command: `npm ci && npm run build:web`
- Publish Directory: `dist`
- Runtime: Static
- Rewrite: `/*` para `/index.html`

Nao precisa configurar banco de dados, API ou variaveis secretas para essa versao.
