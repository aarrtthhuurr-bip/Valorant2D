# Valorant2D / Protocol Shift

Um jogo 2D em HTML, CSS e JavaScript inspirado em partidas taticas com ataque, defesa, spike, compra de armas, agentes, bots inimigos e aliados.

## Como jogar

No Windows, o jeito mais facil e dar duplo clique em:

```text
Abrir Valorant2D.cmd
```

Ele inicia o servidor local em segundo plano e abre o jogo no navegador.

Se preferir pelo terminal, rode:

```bash
python protocol_shift_server.py --open
```

Depois acesse:

```text
http://127.0.0.1:8088/
```

Se a porta `8088` estiver ocupada, o servidor tenta `8124` automaticamente. Se as duas estiverem ocupadas, ele escolhe uma porta livre e mostra o endereco no terminal.

Tambem existe o iniciador base:

```bat
start_protocol_shift_server.cmd
```

Ele usa Python 3, sem depender de Node.js.

## Controles

- `WASD`: mover
- Mouse: mirar
- Clique esquerdo: atirar
- `R`: recarregar
- `F`: plantar ou desarmar a spike
- `E`: usar habilidade do agente
- `P`: pausar
- `Tab`: mostrar placar
- `Esc`: fechar loja/menu ou abrir loja na fase de compra

## Modos

- `Jogar`: partida normal com dificuldade
- `Sandbox`: dinheiro infinito, sem tempo e posicionamento livre
- `Treino`: teste de armas, mira, recoil e dano
- `Tutorial`: guia rapido de movimento, tiro, plant e defuse

## Sistemas implementados

- Spike com plant, defuse e explosao
- Bots inimigos com estados de IA
- Bots aliados no modo facil
- Loja com armas, equipamentos e upgrades de aliados
- Economia por round, kill, headshot, plant e defuse
- Recoil, spread, headshot e queda de dano por distancia
- Placar com estatisticas
- Mapas aleatorios com temas diferentes
- Sons simples de tiro, hit, reload, plant e spike
- Debug opcional de rotas dos bots

## Observacao

Este projeto e fan-made e experimental. Ele nao usa assets oficiais e nao tem afiliacao com a Riot Games ou Valorant.
