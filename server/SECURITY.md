# Segurança do servidor

## Controles implementados

- Queries PostgreSQL parametrizadas em toda entrada externa.
- Senhas e respostas de segurança protegidas por `scrypt` com salt individual.
- Tokens de sessão, recuperação e partida gerados com 256 bits aleatórios.
- Apenas hashes dos tokens são persistidos.
- Limites por IP e bloqueio progressivo por conta para autenticação.
- Recuperação com desafio de uso único, validade de dez minutos e cinco tentativas.
- Máximo de cinco sessões ativas por conta.
- Headers Helmet, CORS por allowlist, limite de 32 KB e respostas sensíveis sem cache.
- Submissões de estatísticas exigem comprovante temporário de partida e passam por
  verificações de duração, reutilização, abates e pontuação plausível.
- Pontuações da leaderboard usam o nome da sessão autenticada, consomem o mesmo
  comprovante descartável e são gravadas junto das estatísticas em uma transação.
- Logs de auditoria não incluem senha, resposta de segurança ou token.

## Configuração obrigatória no Render

- `NODE_ENV=production`
- `TRUST_PROXY_HOPS=1`
- `DATABASE_URL`: URI do PostgreSQL.
- `CORS_ORIGINS`: somente origens adicionais realmente confiáveis.

O pooler atual do Supabase utiliza uma cadeia que anteriormente exigiu
`PG_SSL_REJECT_UNAUTHORIZED=false`. Para validar também a identidade do banco,
adicione a CA oficial do projeto em Base64 por `PG_SSL_CA_BASE64` e defina
`PG_SSL_REJECT_UNAUTHORIZED=true`.

## Limites conhecidos

O cliente do jogo executa no navegador e está sob controle do jogador. Os
comprovantes e limites de plausibilidade reduzem fraude casual e repetição de
requisições, mas uma proteção absoluta do leaderboard exigiria simulação ou
validação autoritativa da partida no servidor.

O armazenamento de tokens no `localStorage` é protegido parcialmente pela CSP
do Front-End. Uma migração futura para Front-End e API sob o mesmo domínio
permitiria cookies `HttpOnly`, `Secure` e `SameSite`, reduzindo ainda mais o
impacto de uma eventual vulnerabilidade XSS.
