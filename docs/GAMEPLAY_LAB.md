# Laboratório de jogabilidade

Este branch concentra experimentos que ainda não pertencem à versão pública.
O código principal continua utilizável e cada melhoria pode ser desligada de
forma independente no navegador.

## Controle rápido

Abra o console do navegador e use:

```js
Valorant2DLab.set("interpolation", false);
Valorant2DLab.set("optimizedFov", false);
Valorant2DLab.set("distinctHitboxes", false);
Valorant2DLab.set("dynamicRecoil", false);
Valorant2DLab.set("performanceEconomy", false);
Valorant2DLab.set("slidingCollision", false);
Valorant2DLab.set("yoruExitProtection", false);
Valorant2DLab.set("allyCoverReload", false);
Valorant2DLab.set("syntheticKillcam", false);
Valorant2DLab.set("dynamicOmenSmoke", false);
Valorant2DLab.set("localAchievements", false);
Valorant2DLab.set("abilityFeedback", false);
Valorant2DLab.set("enhancedKillfeed", false);
Valorant2DLab.set("enhancedShopFeedback", false);
Valorant2DLab.set("enhancedToasts", false);
```

Recarregue a página depois de mudar uma opção. Para restaurar todas:

```js
Valorant2DLab.reset();
```

## Observações de segurança

- Conquistas locais concedem somente créditos da partida, nunca Core da conta.
- O bônus Core por desempenho é calculado novamente no servidor, tem teto de
  cinco Core e exige sessão e comprovante descartável da partida.
- Nenhuma configuração do laboratório é sincronizada com o perfil global.

## Escopo atual

- simulação fixa com interpolação visual entre ticks;
- quinas ativas no cálculo do FOV sem remover paredes da etapa de interseção;
- hitboxes de cabeça e corpo, recoil progressivo e recuperação da precisão;
- sliding nas colisões diagonais do jogador;
- proteção de 0,9 segundo na saída da passagem do Yoru;
- aliados procuram cobertura enquanto recarregam;
- buffer local dos últimos 4,2 segundos e reconstrução da trajetória fatal;
- smoke do Omen contrai e muda de cor antes de desaparecer;
- conquistas locais, HUD de habilidade, killfeed e feedback de compra renovados.
