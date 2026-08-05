# Animações do Black Market

Este diretório recebe as prévias em pixel art dos gadgets do modo Outbreak.
O jogo usa os spritesheets existentes e exibe um marcador temático animado
caso uma arte ainda não tenha sido adicionada:

- `bomb_explosion_row1.png` (Bomba de Pulso, 8 x 1 frames);
- `Turret_frames.png` (Torreta Chamariz, 14 x 1 frames);
- `ice_frames.png` (Mina Cryo, 8 x 8 frames);
- `adrenalina.gif`
- `supply_drop.gif`
- `cloaking.gif`

Para os GIFs, adicione também uma imagem estática de mesmo nome em PNG. O
PNG aparece em repouso e o GIF é carregado somente durante hover ou foco.

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
