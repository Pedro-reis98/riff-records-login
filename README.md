# Riff Records Login

Aplicação de autenticação para uma loja de vinis de rock, feita com Expo + React Native Web, API Express e Postgres.

## O que tem no projeto

- tela de login responsiva
- cadastro local de usuário
- login com usuário e senha
- troca local de senha
- área logada simples
- API Node/Express
- banco Postgres
- deploy no Render com Web Service + Database

## Rodando localmente

Instale as dependências do app:

```bash
npm install
```

Instale as dependências da API:

```bash
npm --prefix server install
```

Crie os arquivos de ambiente:

```powershell
Copy-Item .env.example .env
Copy-Item server/.env.example server/.env
```

Suba o Postgres local:

```bash
docker compose up -d
```

Prepare as tabelas:

```bash
npm run api:db:init
```

Inicie a API:

```bash
npm run api:dev
```

Em outro terminal, inicie o app:

```bash
npm run web
```

## Validação

Antes de publicar, rode:

```bash
npm run typecheck
npm run build:web
```

## Deploy no Render

O `render.yaml` está configurado como Blueprint. Ele cria:

- um Web Service `riff-records-login`
- um Postgres `riff-records-db`
- build estático do Expo Web em `dist`
- API Node servindo o frontend e os endpoints `/auth/*`

No Render:

1. Conecte o repositório.
2. Escolha Blueprint e selecione o `render.yaml`.
3. Preencha `APP_URL` com a URL pública do serviço, por exemplo `https://riff-records-login.onrender.com`.

O `DATABASE_URL` e o `JWT_SECRET` são gerados automaticamente pelo Render.

## Fluxo de conta

O cadastro é local. A pessoa escolhe nome, usuário e senha. Não existe confirmação por e-mail, token externo ou serviço de envio de mensagens.

A recuperação de acesso também é local: informe o usuário, digite uma nova senha e salve.

## Rotas

- `/` login
- `/register` criar conta
- `/recover` trocar senha
- `/home` confirmação de acesso
