# Valorant2D

Valorant2D é um jogo de tiro tático 2D para navegador, inspirado nas mecânicas
de agentes, economia, habilidades e objetivos de Valorant. O projeto combina
Canvas HTML5, controles para computador e dispositivos móveis, autenticação,
progressão persistente, economia de skins e rankings globais.

O projeto é experimental, independente e não possui afiliação com a Riot Games.

## Jogar

A versão publicada está disponível em:

[https://aarrtthhuurr-bip.github.io/Valorant2D/](https://aarrtthhuurr-bip.github.io/Valorant2D/)

O jogo também pode ser instalado como aplicativo no celular. Abra o endereço em
um navegador compatível e escolha `Instalar` no menu do jogo ou no menu do
navegador. Em dispositivos móveis, a orientação horizontal oferece a melhor
experiência.

## Modos de jogo

### Default

O modo tático clássico. No ataque, plante a Spike e proteja-a até a detonação.
Na defesa, impeça o plant ou desarme o dispositivo. O primeiro time a conquistar
9 pontos vence. As partidas sorteiam um conjunto de 10 mapas com temas e
geometrias próprios.

### Blackout

Mantém o objetivo do modo Default, mas limita o campo de visão. Paredes,
distância, movimentação e leitura sonora tornam o posicionamento mais
importante. O modo possui 10 mapas sombrios exclusivos, separados do conjunto
utilizado no Default.

### Outbreak

Modo de sobrevivência em ondas com mapa próprio, inimigos progressivamente mais
fortes, med-kits, airdrops, modificadores, aliados e intervalos de compra.
Escudo e vida possuem regras próprias, e o ranking considera a maior onda
alcançada. A arena é reconstruída a cada partida com oito coberturas aleatórias,
mantendo o centro livre. Os inimigos também recebem pontos de entrada aleatórios
e espaçados, sempre afastados do jogador e das paredes.

### Sandbox

Ambiente livre para testar armas, agentes, habilidades e mapas. Inclui
ferramentas como:

- criação e remoção de bots;
- munição infinita;
- invulnerabilidade;
- edição de paredes e objetos;
- alteração de mapa;
- controle de visão e comportamento dos bots;
- dinheiro e habilidades para testes.

### Treino

Área destinada à prática de movimentação, mira, disparo, recarga, habilidades,
plant e desarme da Spike.

## Agentes

O jogo inclui:

- Neon;
- Viper;
- Sage;
- Omen;
- Jett;
- Killjoy;
- Raze;
- Yoru.

Cada agente possui identidade visual, habilidade e Ultimate próprias. Algumas
mecânicas, como a corrida e a barra de stamina, aparecem somente para o agente
correspondente.

## Mecânicas e sistemas

- partidas táticas com ataque, defesa, Spike e placar;
- bots aliados e inimigos com IA, visão e reação;
- arsenal com pistolas, SMGs, rifles, shotguns, sniper e arma pesada;
- skins equipáveis com inventário persistente;
- economia de créditos durante as partidas;
- moeda Core para progressão e compras da conta;
- loja de equipamentos, armas, aliados e Ultimates;
- sistema de vida, escudo, dano, headshot e recarga;
- Orbes e carregamento de Ultimate;
- configurações sincronizadas entre dispositivos;
- perfil com estatísticas consolidadas;
- ranking global para Default, Blackout e Outbreak;
- autenticação tradicional, recuperação de senha e Login com Google;
- modo convidado para jogar sem criar uma conta;
- tutorial e apresentação para novos jogadores;
- interface responsiva e controles touch com mira manual ou autofire;
- suporte a instalação como PWA.

## Controles

### Computador

| Ação | Controle padrão |
| --- | --- |
| Movimentar | `W`, `A`, `S`, `D` |
| Mirar | Mouse |
| Atirar | Clique esquerdo |
| Recarregar | `R` |
| Interagir, plantar ou desarmar | `F` |
| Habilidade | `E` |
| Ultimate | `Q` |
| Abrir loja da partida | `B` |
| Placar | `Tab` |
| Pausar ou voltar | `Esc` |

As teclas e sensibilidades podem ser alteradas no menu de opções.

### Celular e tablet

A interface mobile é ativada automaticamente em dispositivos touch. Ela inclui
joystick de movimento, joystick de mira, disparo, recarga, interação,
habilidade, Ultimate, loja e pausa.

Nas opções mobile também é possível:

- alternar entre mira manual e autofire;
- definir o alcance do autofire;
- ajustar tamanho e opacidade do HUD;
- inverter a posição dos controles para canhotos;
- restaurar o layout touch original.

## Opções

O painel de configurações reúne:

- preferências gerais e informações exibidas no HUD;
- controles, teclas, sensibilidade e opções mobile;
- aparência e comportamento da mira;
- volume geral, música, efeitos e disparos;
- resolução, modo de tela, limite de FPS e qualidade visual;
- recursos de acessibilidade.

As preferências de contas autenticadas são salvas no servidor e carregadas ao
entrar em outro computador ou celular.

## Tecnologias

### Front-end

- HTML5;
- CSS responsivo;
- JavaScript sem framework;
- Canvas 2D;
- Google Identity Services;
- Web App Manifest e Service Worker.

### Back-end

- Node.js 20 ou superior;
- Express;
- PostgreSQL;
- driver `pg`;
- Helmet;
- CORS;
- rate limiting;
- Google Auth Library.

### Hospedagem

- front-end: GitHub Pages;
- API: Render;
- banco de dados: PostgreSQL gerenciado, atualmente compatível com Supabase,
  Neon ou outro provedor que forneça `DATABASE_URL`.

## Fluxo de versões

O desenvolvimento segue três níveis:

- `main`: versão pública estável, utilizada pelo GitHub Pages e pelo Render;
- `develop`: integração e validação local da próxima versão;
- `feature/nome-da-mudanca`: trabalho isolado de uma funcionalidade.

Versões publicadas recebem tags imutáveis no formato SemVer:

```text
v1.0.0     versão principal
v1.1.0     nova funcionalidade compatível
v1.1.1     correção sem nova funcionalidade
```

Fluxo recomendado:

```bash
git switch develop
git switch -c feature/nome-da-mudanca

# implementar e testar

git switch develop
git merge --no-ff feature/nome-da-mudanca

# após a homologação da versão completa
git switch main
git merge --no-ff develop
git tag -a v1.0.0 -m "Valorant2D v1.0.0"
git push origin main --tags
```

A `main` não deve receber experimentos diretamente. Uma tag permite restaurar
ou inspecionar qualquer versão publicada sem depender de branches antigas.

## Executar o projeto localmente

Clone o repositório:

```bash
git clone https://github.com/aarrtthhuurr-bip/Valorant2D.git
cd Valorant2D
```

Instale as dependências do servidor:

```bash
cd server
npm install
cd ..
```

Crie `server/.env` a partir de `server/.env.example` e preencha
`DEVELOPMENT_DATABASE_URL` com a conexão de um PostgreSQL exclusivo para
testes. O servidor recusa iniciar em desenvolvimento sem essa variável para
evitar o uso acidental do banco público.

Inicie Front-End e Back-End juntos pela raiz:

```bash
npm run dev
```

Abra:

```text
http://localhost:3001/
```

Nesse endereço, o Express entrega o Front-End e a API local juntos. Pelo Live
Server oficial do workspace, o Front-End abre na porta `3000` e usa a mesma API
local em `http://localhost:3001`.
O Express expõe apenas os arquivos públicos necessários; a pasta `server` e o
arquivo `.env` não podem ser acessados pelo navegador.

Não é recomendado abrir o `index.html` diretamente por `file://`. Recursos como
Service Worker, instalação PWA, autenticação e algumas requisições exigem um
contexto HTTP ou HTTPS.

Para testar somente a interface contra a API pública, ainda é possível executar:

```bash
python3 -m http.server 3000
```

e acessar `http://localhost:3000/`.

## Central de atualizações

As novidades da versão ficam em `updates.json`. Durante o desenvolvimento, o
arquivo permanece com `status: "draft"` e a tela automática não é exibida.
Quando toda a versão estiver aprovada, altere para `status: "published"`,
preencha a data e troque o canal para `stable`.

Somente uma versão `published` apresenta automaticamente a tela “O que há de
novo”, uma vez para cada navegador. A lista deve registrar todas as alterações
incluídas no lançamento, e não apenas os destaques mais visíveis. A tela pode
ser reaberta pelo botão de novidades no canto inferior do menu principal.

O `version-manager.js` verifica novas publicações ao abrir o jogo, ao retornar
para a aba e a cada 15 minutos. Quando encontra uma versão diferente, força a
atualização do Service Worker, remove o cache de shell anterior e recarrega a
aplicação uma única vez. O jogador não precisa limpar o cache manualmente.

Antes de publicar uma versão:

1. registre em `highlights` todas as alterações acumuladas;
2. teste mantendo `status: "draft"`;
3. remova o sufixo `-dev`, defina `status: "published"`, canal `stable` e data;
4. use o mesmo número no `CACHE_VERSION` do Service Worker;
5. atualize os parâmetros de versão dos arquivos em `index.html`;
6. execute `npm run check`;
7. crie a tag Git somente depois do merge aprovado na `main`.

No Render, `NODE_ENV=production` utiliza exclusivamente `DATABASE_URL`. No
computador, `NODE_ENV=development` utiliza exclusivamente
`DEVELOPMENT_DATABASE_URL`. Em desenvolvimento, a porta padrão do Back-End é
`3001`; em produção, o servidor sempre respeita `process.env.PORT`.

## Variáveis de ambiente

As opções disponíveis estão documentadas em `server/.env.example`.

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta HTTP do servidor |
| `NODE_ENV` | Ambiente de execução |
| `DATABASE_URL` | URI de conexão do PostgreSQL |
| `DEVELOPMENT_DATABASE_URL` | URI do PostgreSQL isolado para testes locais |
| `GOOGLE_CLIENT_ID` | Client ID do Login com Google |
| `ADMIN_USERNAME` | Conta administrativa promovida na inicialização |
| `DAILY_OFFER_SECRET` | Sal das ofertas diárias |
| `PG_POOL_MAX` | Limite do pool PostgreSQL |
| `TRUST_PROXY_HOPS` | Quantidade de proxies confiáveis no Render |
| `PG_SSL_REJECT_UNAUTHORIZED` | Validação do certificado PostgreSQL |
| `PG_SSL_CA_BASE64` | CA privada do provedor, quando necessária |
| `CORS_ORIGINS` | Origens adicionais permitidas |
| `RATE_LIMIT_*` | Limites das rotas sensíveis |

Nunca publique o arquivo `.env` ou uma `DATABASE_URL` real.

## Banco de dados

O servidor utiliza exclusivamente PostgreSQL. O esquema é verificado de forma
idempotente durante a inicialização: tabelas e colunas ausentes são preparadas
sem apagar contas, sessões, estatísticas, inventários ou preferências.

No painel do Render, adicione `DATABASE_URL` em `Environment`. Para Supabase ou
Neon, utilize a URI fornecida pelo provedor, normalmente com TLS.

O padrão recomendado é validar o certificado:

```env
PG_SSL_REJECT_UNAUTHORIZED=true
```

Caso o provedor utilize uma autoridade certificadora privada, informe-a por
`PG_SSL_CA_BASE64`. Use `PG_SSL_REJECT_UNAUTHORIZED=false` somente quando
necessário para o pooler utilizado e nunca desative o próprio TLS.

## Segurança do back-end

O servidor possui, entre outras proteções:

- queries PostgreSQL parametrizadas;
- senhas e respostas de segurança protegidas com `scrypt` e salt individual;
- tokens de sessão aleatórios armazenados somente como hash;
- validação e limitação de payloads;
- CORS com lista de origens autorizadas;
- Helmet e cabeçalhos de segurança;
- limites gerais e específicos por rota;
- respostas genéricas nas operações sensíveis;
- desafios temporários e descartáveis na recuperação de senha;
- comprovantes de partida de uso único;
- trilha de auditoria para eventos críticos;
- testes automatizados para autenticação, API, ranking e economia.

Para executar os testes:

```bash
cd server
npm test
```

## PWA

O manifesto está em `manifest.webmanifest` e o Service Worker em
`service-worker.js`.

O PWA oferece:

- execução em modo `standalone`;
- orientação horizontal;
- ícones de 192 e 512 pixels;
- cache do shell principal;
- funcionamento offline da interface já carregada;
- atualização do cache entre versões;
- suporte a safe areas e telas com notch;
- botão de instalação quando o navegador disponibiliza o evento nativo.

Após mudanças no manifesto ou no Service Worker, remova instalações antigas e
limpe os dados do site durante os testes. Navegadores podem manter versões
anteriores do manifesto por algum tempo.

## Deploy

### GitHub Pages

O front-end usa caminhos relativos para funcionar corretamente no subdiretório
`/Valorant2D/`. Um push na branch configurada para o Pages publica os arquivos
estáticos.

### Render

Configure o serviço com:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Adicione as variáveis de ambiente necessárias e confirme no log:

```text
[PostgreSQL] Esquema verificado
Servidor online
```

Instâncias gratuitas podem entrar em suspensão após um período sem tráfego. O
front-end envia um health check silencioso ao abrir a página para iniciar o
servidor antecipadamente.

## Estrutura principal

```text
Valorant2D/
├── assets/                  Imagens, sprites, skins, ícones e sons
├── server/
│   ├── config/              PostgreSQL e configurações
│   ├── controllers/         Regras das rotas
│   ├── models/              Acesso aos dados
│   ├── routes/              Endpoints da API
│   ├── test/                Testes automatizados
│   └── index.js             Entrada do servidor
├── game.js                  Estado, interface e regras do jogo
├── index.html               Estrutura da aplicação
├── styles.css               Interface desktop e mobile
├── manifest.webmanifest     Configuração do PWA
└── service-worker.js        Cache e funcionamento offline
```

## Licença e aviso

Este é um projeto educacional e experimental inspirado em jogos de tiro tático.
Valorant e seus elementos originais pertencem à Riot Games. Este repositório não
é um produto oficial e não representa a Riot Games.
