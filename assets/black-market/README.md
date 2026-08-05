# Animações do Black Market

Este diretório recebe as prévias em pixel art dos gadgets do modo Outbreak.
O jogo já procura os arquivos abaixo e exibe um marcador temático caso uma
animação ainda não tenha sido adicionada:

- `pulse_bomb.gif`
- `turret.gif`
- `cryo_mine.gif`
- `adrenalina.gif`
- `supply_drop.gif`
- `cloaking.gif`

## Formato recomendado

Prefira spritesheets PNG com fundo transparente. Diferentemente de um GIF, os
frames separados permitem controlar velocidade, pausas e interrupções pelo
JavaScript. A Bomba de Pulso utiliza:

- `bomb_explosion_row1.png`;
- 8 frames de 32 x 33 pixels;
- 250 ms por frame;
- 500 ms de pausa no último frame.

GIFs continuam aceitos como fallback para gadgets ainda não convertidos. A
interface preserva pixels nítidos por meio de `image-rendering: pixelated`.
