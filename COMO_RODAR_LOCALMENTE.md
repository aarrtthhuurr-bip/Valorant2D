# Como executar o Valorant2D localmente

Este guia inicia o Front-End pelo Live Server na porta `3000` e o Back-End na
porta `3001`. Quando o jogo abre por `localhost:3000` ou `127.0.0.1:3000`, ele
seleciona automaticamente a API local em `http://localhost:3001`.

## 1. Requisitos

- Node.js 20 ou superior;
- npm;
- extensão Live Server instalada no Cursor ou VS Code;
- um PostgreSQL de desenvolvimento separado do banco de produção.

Verifique o Node.js:

```bash
node --version
npm --version
```

Se você usa NVM:

```bash
nvm install 20
nvm use 20
```

## 2. Preparar o Back-End pela primeira vez

Abra um terminal na raiz do projeto:

```bash
cd "/home/arthur/Área de trabalho/Valorant2D"
```

Instale as dependências:

```bash
npm --prefix server install
```

Crie `server/.env` usando `server/.env.example` como referência. O conteúdo
mínimo para desenvolvimento é:

```dotenv
PORT=3001
NODE_ENV=development
DEVELOPMENT_DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO?sslmode=require
PG_SSL_REJECT_UNAUTHORIZED=false
```

Regras importantes:

- use um banco exclusivo para desenvolvimento;
- não coloque a conexão do banco de produção em `DEVELOPMENT_DATABASE_URL`;
- não envie `server/.env` ao GitHub;
- se a senha tiver caracteres como `@`, `#`, `%`, `/` ou `:`, converta-os para
  o formato URL encoded antes de montar a conexão;
- nunca cole senhas em prints, commits ou mensagens públicas.

## 3. Iniciar o Back-End local

Na raiz do projeto, execute:

```bash
npm run dev
```

O terminal deve exibir mensagens semelhantes a:

```text
[PostgreSQL] Conectado...
Servidor online na porta 3001.
```

Mantenha esse terminal aberto. Para encerrar o servidor, pressione `Ctrl+C`.

### Testar se o Back-End está funcionando

Abra outro terminal e execute:

```bash
curl http://localhost:3001/
```

O resultado deve ser um JSON informando que o servidor está online. Também é
possível abrir `http://localhost:3001/` no navegador.

## 4. Iniciar o Front-End na porta 3000

No Cursor ou VS Code:

1. abra o arquivo `index.html` da raiz;
2. clique com o botão direito dentro do editor;
3. escolha **Open with Live Server**;
4. confirme que o endereço aberto é um destes:

```text
http://127.0.0.1:3000/index.html
http://localhost:3000/index.html
```

O jogo detecta essa porta e utiliza `http://localhost:3001` automaticamente.

### Se o Live Server abrir em outra porta

Abra as configurações JSON do editor e adicione:

```json
{
  "liveServer.settings.port": 3000
}
```

Depois pare e reinicie o Live Server.

## 5. Alternativa sem a extensão Live Server

Com o Back-End ainda aberto no primeiro terminal, abra outro terminal na raiz e
execute:

```bash
python3 -m http.server 3000
```

Depois acesse:

```text
http://localhost:3000/
```

Encerre esse servidor com `Ctrl+C`.

## 6. Alternativa mais simples: tudo na porta 3001

O Back-End em modo de desenvolvimento também entrega os arquivos públicos do
jogo. Portanto, você pode executar apenas:

```bash
npm run dev
```

e abrir:

```text
http://localhost:3001/
```

Esse modo dispensa o Live Server e costuma ser o mais fácil para testar login,
API e banco ao mesmo tempo.

## 7. Rotina recomendada para cada sessão de desenvolvimento

Terminal 1:

```bash
cd "/home/arthur/Área de trabalho/Valorant2D"
nvm use 20
npm run dev
```

Em seguida, abra o `index.html` com o Live Server na porta `3000`.

Não é necessário executar `npm install` toda vez. Repita a instalação somente
quando `server/package.json` ou `server/package-lock.json` mudar.

## 8. Problemas comuns

### A tela mostra “Servidor indisponível”

Confirme, nesta ordem:

1. o terminal do Back-End continua aberto;
2. aparece `Servidor online na porta 3001` no terminal;
3. `http://localhost:3001/` responde no navegador;
4. o Front-End está realmente na porta `3000`;
5. `NODE_ENV=development` está definido em `server/.env`;
6. `DEVELOPMENT_DATABASE_URL` está correta;
7. a senha da conexão está em URL encoded.

Depois clique em **Tentar novamente** na tela de login.

### Erro `password authentication failed`

A senha, usuário ou host do PostgreSQL está incorreto. Copie novamente a URI do
pooler do seu provedor, substitua o marcador de senha e reinicie o Back-End.

### Erro de certificado SSL

Para o banco de desenvolvimento atual, confira:

```dotenv
PG_SSL_REJECT_UNAUTHORIZED=false
```

Em um ambiente definitivo, prefira configurar a CA do provedor em
`PG_SSL_CA_BASE64` e habilitar a validação.

### Porta 3001 já está sendo usada pelo Back-End

Descubra o processo:

```bash
lsof -i :3001
```

Encerre o servidor antigo com `Ctrl+C` no terminal em que ele está rodando.

### Porta 3000 já está sendo usada pelo Live Server

Pare a instância anterior do Live Server ou do `python3 -m http.server` antes de
abrir outra.

### Alterações antigas continuam aparecendo

1. feche a aba do jogo;
2. pare e reinicie o Live Server;
3. abra novamente `http://localhost:3000/`;
4. no DevTools, use **Application > Service Workers > Unregister** apenas se o
   navegador ainda estiver servindo uma versão antiga do PWA.

## 9. Validar o projeto antes de testar

Execute na raiz:

```bash
npm run check
```

Esse comando valida a sintaxe, a versão dos arquivos e os testes do Back-End.

## Resumo rápido

```bash
cd "/home/arthur/Área de trabalho/Valorant2D"
nvm use 20
npm run dev
```

Depois abra o `index.html` com Live Server em `http://127.0.0.1:3000/`.
