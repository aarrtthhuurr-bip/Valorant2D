const crypto = require('crypto');
const database = require('../config/database');
const Commerce = require('./Commerce');

function coreRewardForMatch(gameMode, maxWave = 0, randomInt = crypto.randomInt) {
  if (gameMode === 'outbreak') return Math.max(1, Math.trunc(Number(maxWave) || 1));
  if (gameMode === 'blackout') return randomInt(10, 21);
  return randomInt(5, 16);
}

const RANKING_CONFIGURATION = Object.freeze({
  default: Object.freeze({ metric: 'wins_default', played: 'matches_default > 0', type: 'wins' }),
  blackout: Object.freeze({ metric: 'wins_blackout', played: 'matches_blackout > 0', type: 'wins' }),
  outbreak: Object.freeze({ metric: 'highest_wave_outbreak', played: 'highest_wave_outbreak > 0', type: 'wave' }),
});

function rankingConfiguration(gameMode) {
  return RANKING_CONFIGURATION[gameMode] || null;
}

class Leaderboard {
  /**
   * O ranking oficial usa exclusivamente vitórias nos modos competitivos e
   * maior wave no Outbreak. As colunas são escolhidas por uma lista interna,
   * nunca por texto recebido do cliente.
   */
  static listByMode(gameMode, limit = 10) {
    const configuration = rankingConfiguration(gameMode);
    if (!configuration) return Promise.resolve([]);
    return database.all(
      `SELECT id AS user_id, username AS player_name,
              ${configuration.metric} AS ranking_value,
              CASE WHEN $1 = 'outbreak' THEN ${configuration.metric} ELSE 0 END AS max_wave,
              CASE WHEN $1 <> 'outbreak' THEN ${configuration.metric} ELSE 0 END AS score,
              $1::VARCHAR AS game_mode,
              '${configuration.type}'::VARCHAR AS metric_type,
              RANK() OVER (ORDER BY ${configuration.metric} DESC) AS rank_position
       FROM users
       WHERE ${configuration.played}
       ORDER BY ${configuration.metric} DESC, username ASC, id ASC
       LIMIT $2`,
      [gameMode, limit],
    );
  }

  /** Resume o histórico individual do jogador somente no modo selecionado. */
  static async personalStats(userId, gameMode) {
    const configuration = rankingConfiguration(gameMode);
    if (!configuration) return null;
    const statistics = await database.get(
      `WITH mode_entries AS (
         SELECT user_id, score, max_wave, created_at
         FROM leaderboard
         WHERE game_mode = $2
       ),
       ranked_players AS (
         SELECT id AS user_id, ${configuration.metric} AS ranking_value,
                RANK() OVER (ORDER BY ${configuration.metric} DESC) AS global_position
         FROM users
         WHERE ${configuration.played}
       )
       SELECT COUNT(*) AS total_matches,
              COALESCE(MAX(score), 0) AS personal_best,
              COALESCE(MAX(max_wave), 0) AS personal_max_wave,
              COALESCE(ROUND(AVG(score)), 0) AS average_score,
              MAX(created_at) AS last_played_at,
              (SELECT global_position FROM ranked_players WHERE user_id = $1) AS global_position,
              COALESCE((SELECT ranking_value FROM ranked_players WHERE user_id = $1), 0) AS ranking_value,
              '${configuration.type}'::VARCHAR AS metric_type,
              COALESCE((SELECT partidas_jogadas FROM users WHERE id = $1), 0) AS account_total_matches,
              COALESCE((SELECT vitorias FROM users WHERE id = $1), 0) AS account_total_wins,
              COALESCE((SELECT abates_totais FROM users WHERE id = $1), 0) AS account_total_kills
       FROM mode_entries
       WHERE user_id = $1`,
      [userId, gameMode],
    );
    return {
      total_matches: Number(statistics?.total_matches) || 0,
      personal_best: Number(statistics?.personal_best) || 0,
      personal_max_wave: Number(statistics?.personal_max_wave) || 0,
      average_score: Number(statistics?.average_score) || 0,
      ranking_value: Number(statistics?.ranking_value) || 0,
      metric_type: statistics?.metric_type || configuration.type,
      global_position: statistics?.global_position ? Number(statistics.global_position) : null,
      account_total_matches: Number(statistics?.account_total_matches) || 0,
      account_total_wins: Number(statistics?.account_total_wins) || 0,
      account_total_kills: Number(statistics?.account_total_kills) || 0,
      last_played_at: statistics?.last_played_at || null,
    };
  }

  /**
   * Consome o comprovante, atualiza estatísticas e grava o ranking na mesma
   * transação. Uma falha não deixa a partida parcialmente registrada.
   */
  static async recordCompletedMatch({ matchId, userId, playerName, gameMode, score, maxWave = 0, victory, kills, deaths = 0 }) {
    const client = await database.pool.connect();
    try {
      await client.query('BEGIN');
      const consumed = await client.query(
        `UPDATE match_submissions
         SET utilizado_em = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2 AND utilizado_em IS NULL
         RETURNING id`,
        [matchId, userId],
      );
      if (consumed.rowCount !== 1) {
        const error = new Error('Esta partida já foi registrada.');
        error.code = 'MATCH_ALREADY_RECORDED';
        throw error;
      }
      // A recompensa nasce somente depois que o comprovante descartável foi
      // consumido e dentro da mesma transação das estatísticas da partida.
      const coreReward = coreRewardForMatch(gameMode, maxWave);
      const statisticsResult = await client.query(
        `UPDATE users
         SET partidas_jogadas = partidas_jogadas + 1,
             vitorias = vitorias + $1,
             abates_totais = abates_totais + $2,
             pontuacao_maxima = GREATEST(pontuacao_maxima, $3),
             core_balance = core_balance + $4,
             core_earned_total = core_earned_total + $4,
             matches_default = matches_default + CASE WHEN $6 = 'default' THEN 1 ELSE 0 END,
             wins_default = wins_default + CASE WHEN $6 = 'default' AND $1 = 1 THEN 1 ELSE 0 END,
             kills_default = kills_default + CASE WHEN $6 = 'default' THEN $2 ELSE 0 END,
             deaths_default = deaths_default + CASE WHEN $6 = 'default' THEN $7 ELSE 0 END,
             matches_blackout = matches_blackout + CASE WHEN $6 = 'blackout' THEN 1 ELSE 0 END,
             wins_blackout = wins_blackout + CASE WHEN $6 = 'blackout' AND $1 = 1 THEN 1 ELSE 0 END,
             kills_blackout = kills_blackout + CASE WHEN $6 = 'blackout' THEN $2 ELSE 0 END,
             deaths_blackout = deaths_blackout + CASE WHEN $6 = 'blackout' THEN $7 ELSE 0 END,
             highest_wave_outbreak = CASE
               WHEN $6 = 'outbreak' THEN GREATEST(highest_wave_outbreak, $8)
               ELSE highest_wave_outbreak
             END
         WHERE id = $5
         RETURNING partidas_jogadas, vitorias, abates_totais, pontuacao_maxima,
                   core_balance, core_earned_total, matches_default, wins_default,
                   kills_default, deaths_default, matches_blackout, wins_blackout,
                   kills_blackout, deaths_blackout, highest_wave_outbreak`,
        [victory ? 1 : 0, kills, score, coreReward, userId, gameMode, deaths, maxWave],
      );
      const entryResult = await client.query(
        `INSERT INTO leaderboard
         (user_id, player_name, score, max_wave, victory, kills, deaths, core_reward, game_mode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, player_name, score, max_wave, victory, kills, deaths,
                   core_reward, game_mode, created_at`,
        [userId, playerName, score, maxWave, victory, kills, deaths, coreReward, gameMode],
      );
      await Commerce.updateMissionProgress(client, userId, { victory, kills, score, maxWave, gameMode });
      await client.query('COMMIT');
      return {
        entry: entryResult.rows[0],
        statistics: statisticsResult.rows[0],
        coreReward,
        coreBalance: Number(statisticsResult.rows[0].core_balance),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Leaderboard;
module.exports._test = { coreRewardForMatch, rankingConfiguration };
