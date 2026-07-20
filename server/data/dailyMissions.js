function buildMissions(difficulty, configs) {
  return Array.from({ length: 30 }, (_, index) => {
    const config = configs[index % configs.length];
    const level = Math.floor(index / configs.length);
    const target = config.target + level * config.step;
    return {
      id: `${difficulty}-${String(index + 1).padStart(2, '0')}`,
      difficulty,
      metric: config.metric,
      target,
      reward: config.reward + Math.min(level, config.rewardStep || 4),
      description: config.label(target),
    };
  });
}

const EASY = buildMissions('easy', [
  { metric: 'matches', target: 1, step: 1, reward: 5, label: (n) => `Conclua ${n} partida(s)` },
  { metric: 'kills', target: 5, step: 2, reward: 6, label: (n) => `Elimine ${n} inimigos` },
  { metric: 'score', target: 800, step: 250, reward: 6, label: (n) => `Some ${n.toLocaleString('pt-BR')} pontos` },
]);
const MEDIUM = buildMissions('medium', [
  { metric: 'matches', target: 3, step: 1, reward: 12, label: (n) => `Conclua ${n} partidas` },
  { metric: 'kills', target: 18, step: 4, reward: 14, label: (n) => `Elimine ${n} inimigos` },
  { metric: 'wins', target: 2, step: 1, reward: 16, label: (n) => `Vença ${n} partida(s)` },
]);
const HARD = buildMissions('hard', [
  { metric: 'kills', target: 40, step: 8, reward: 22, label: (n) => `Elimine ${n} inimigos` },
  { metric: 'wins', target: 4, step: 1, reward: 28, label: (n) => `Vença ${n} partidas` },
  { metric: 'outbreak_wave', target: 12, step: 3, reward: 31, label: (n) => `Alcance a onda ${n} no Outbreak` },
]);

const DAILY_MISSIONS = [...EASY, ...MEDIUM, ...HARD];
const MISSIONS_BY_ID = new Map(DAILY_MISSIONS.map((mission) => [mission.id, mission]));

function missionsForUser(userId, date = new Date()) {
  const day = Math.floor(date.getTime() / 86400000);
  const cycleDay = ((day % 30) + 30) % 30;
  return [EASY, MEDIUM, HARD].map((bank, difficultyIndex) => bank[(cycleDay + Number(userId) * (difficultyIndex + 3)) % 30]);
}

module.exports = { DAILY_MISSIONS, MISSIONS_BY_ID, missionsForUser };
