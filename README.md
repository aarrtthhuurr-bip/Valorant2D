## Valorant2D - Manual de Instruções e Funcionalidades do Projeto

## Como Abrir o Jogo Sem Servidor

- Passo 1: Obter os Arquivos do Jogo

## Opção 1 (passo 1): Download pelo GitHub

* Acesse a página do repositório no seu navegador. "https://github.com/aarrtthhuurr-bip/Valorant2D"
* Clique no botão verde escrito Code localizado na parte superior.
* Escolha a opção Download ZIP no menu suspenso.
* Aguarde o término do download do arquivo compactado.
* Extraia os arquivos do ZIP para uma pasta de sua escolha no omputador.

## Opção 2 (passo 1): Download pelo Terminal

* Certifique-se de ter o Git instalado no seu sistema.
* Abra o terminal do seu sistema operacional ou o Prompt de Comando.
* Navegue até a pasta onde deseja salvar o projeto.
* Digite o comando: "git clone https://github.com/aarrtthhuurr-bip/Valorant2D"
* Pressione Enter e aguarde o download de todos os componentes estruturais.

- Passo 2: Iniciar por Duplo Clique

* Abra o gerenciador de arquivos do seu computador.
* Entre na pasta raiz onde o projeto foi salvo ou clonado.
* Localize o arquivo principal com o nome de index.html.
* Dê um duplo clique rápido com o botão esquerdo do mouse sobre ele.

O jogo abrirá imediatamente em uma nova aba do seu navegador padrão.

Não é necessário instalar ferramentas extras, Node.js ou ligar servidores locais.

## Explicação Completa do Jogo

## 1 MODOS DE JOGO:

## Jogo Padrão

* Visibilidade total do mapa
* Posicionamento livre de agentes e projéteis
* Modo ideal para treino de recuo e linhas de tiro
* Modo Névoa (Fog Mode)
* Camada de escuridão com 50% de opacidade
* Campo de visão dinâmico que corta nas paredes (Estilo Among Us)
* Ocultação total de bots inimigos, tiros e efeitos fora do alcance

## 2 OPÇÕES:

* Geral
- Idioma
- Nome do jogador
- Mostrar Kill feed
- Mostrar dicas

* Controles
- Sensibilidade do mouse
- Reconfigurar teclas de movimentação (WASD)
- Alternar comando de agachar (Hold/Toggle)
- Tecla de compra rápida da loja

* Mira
- Cor do retículo
- Espessura das linhas internas
- Tamanho do ponto central
- Erro de movimento e erro de disparo (Ativar/Desativar)

* Áudio
- Volume geral
- Volume dos efeitos sonoros (Tiros e habilidades)
- Volume dos passos dos agentes
- Silenciar em segundo plano

* Vídeo
- Modo de tela (Janela/Tela cheia)
- Limite de taxa de quadros (FPS)
- Qualidade das texturas do mapa
- Exibir contador de desempenho (FPS e Latência)

## 3 MODO SANDBOX:

* Dinheiro infinito
* Remover/Adicionar bots
* God mode (Modo Deus)
* Edição de mapa (Adicionar/Remover paredes e caixas)
* Munição infinita
* Habilidades sem tempo de recarga (No Cooldown)
* Velocidade de movimento alterada

# 4 TUTORIAL:
* Fase 1: Movimentação básica
* Fase 2: Mecânicas de tiro e recarga
* Fase 3: Uso de habilidades utilitárias
* Fase 4: Plantação e desarme da Spike
* Fase 5: Conclusão e escolha de agente definitivo

## 5 AGENTES:

* Neon
* Viper
* Sage
* Omen
* Jett
* Killjoy
* Raze
* Yoru

## 6 MECÂNICAS PRINCIPAIS:

* Loja de Compras (Menu B)
* Compra de armamento (Pistolas, Submetralhadoras e Fuzis)
* Compra de proteção (Colete leve e Colete pesado)
* Compra de cargas para habilidades dos agentes
* Contratação de bots aliados para o round
* Coleta de Orbes e Ultimate
* Pontos de geração fixos no cenário
* Tempo de canalização para coleta
* Barra de carregamento da habilidade suprema
* Plantação e Desarme da Spike
* Zonas de demarcação (Bomb Site A e Bomb Site B)
* Cronômetro de ativação de 45 segundos
* Dispositivo de desarme progressivo
* Sistema de Vida e Escudo
* Barra HUD de saúde e proteção
* Sistema de prioridade de dano no escudo
* Animação de fadiga e eliminação do agente

## 7 CONTROLES

- `WASD`: movimentação
- Mouse: mirar
- Clique esquerdo: atirar
- `R`: recarregar
- `F`: interagir com objetivos e Orbes
- `E`: habilidade
- `Q`: Ultimate
- `B`: loja
- `Tab`: placar
- `Esc`: pausar ou voltar

Projeto experimental e independente, sem afiliação com a Riot Games.

## Disponibilidade do Back-End no Render

### Persistência do SQLite

O servidor nunca apaga nem recria deliberadamente um banco existente: ele abre
o caminho definido em `DATABASE_URL` e cria somente tabelas ou colunas ausentes.
Os logs de inicialização informam o caminho absoluto e se o arquivo já existia.

Um arquivo SQLite armazenado no filesystem efêmero do Render gratuito será
perdido em reinícios, suspensões ou novos deploys. Para contas permanentes, use
um disco persistente compatível com o serviço ou migre os dados para um banco
gerenciado, como PostgreSQL. O código da aplicação não consegue transformar
um disco efêmero em armazenamento persistente.

Configuração recomendada para um serviço com disco persistente:

1. Monte o disco do Render em `/var/data`.
2. Defina `NODE_ENV=production`.
3. Defina `DATABASE_URL=/var/data/database.sqlite`.
4. Reinicie o serviço e confirme no log a linha `[SQLite] Arquivo`.
5. Confirme que o log informa `existente, preservado` nos reinícios seguintes.

Em produção, o servidor agora rejeita `DATABASE_URL` ausente ou relativa para
evitar criar silenciosamente contas em um arquivo descartável. Se o plano não
oferecer disco persistente, a solução durável é migrar para PostgreSQL externo,
como Supabase ou Neon; isso requer substituir a camada SQLite por um driver SQL
compatível com PostgreSQL.

O Front-End envia uma requisição silenciosa ao health check do Render assim
que a página é aberta. Isso inicia o processo de ativação antes de o jogador
enviar o formulário de login.

Para monitorar a API externamente com o UptimeRobot:

1. Crie um monitor do tipo HTTP(S).
2. Use a URL `https://valorant2d.onrender.com/`.
3. Configure o intervalo para 14 minutos, caso esse intervalo esteja disponível no plano utilizado.
4. Considere o código HTTP 200 como resposta saudável.
5. Ative notificações para indisponibilidade prolongada.

Serviços gratuitos do Render entram em suspensão depois de um período sem
tráfego e possuem limites mensais. Monitores externos devem ser usados de
acordo com os termos e limites atuais do Render e do UptimeRobot. Para garantia
de disponibilidade contínua, utilize uma instância do Render que não suspenda.
