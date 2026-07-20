const crypto = require('crypto');
const database = require('../config/database');
const Commerce = require('./Commerce');

function coreRewardForMatch(gameMode, maxWave = 0, randomInt = crypto.randomInt) {
  if (gameMode === 'outbreak') return Math.max(1, Math.trunc(Number(maxWave) || 1));
  if (gameMode === 'blackout') return randomInt(10, 21);
  return randomInt(5, 16);
}

class Leaderboard {
  /** Retorna apenas o melhor resultado de cada conta no modo solicitado. */
  static listByMode(gameMode, limit = 10) {
    return database.all(
      `SELECT id, player_name, score, max_wave, game_mode, created_at,
              RANK() OVER (
                ORDER BY CASE WHEN $1 = 'outbreak' THEN max_wave ELSE score END DESC
              ) AS rank_position
       FROM (
         SELECT id, user_id, player_name, score, max_wave, game_mode, created_at,
                ROW_NUMBER() OVER (
                  PARTITION BY user_id
                  ORDER BY
                    CASE WHEN $1 = 'outbreak' THEN max_wave END DESC,
                    CASE WHEN $1 <> 'outbreak' THEN score END DESC,
                    created_at ASC, id ASC
                ) AS player_position
         FROM leaderboard
         WHERE game_mode = $1
       ) AS personal_bests
       WHERE player_position = 1
       ORDER BY
         CASE WHEN $1 = 'outbreak' THEN max_wave END DESC,
         CASE WHEN $1 <> 'outbreak' THEN score END DESC,
         created_at ASC, id ASC
       LIMIT $2`,
      [gameMode, limit],
    );
  }

  /** Resume o histórico individual do jogador somente no modo selecionado. */
  static async personalStats(userId, gameMode) {
    const statistics = await database.get(
      `WITH mode_entries AS (
         SELECT user_id, score, max_wave, created_at
         FROM leaderboard
         WHERE game_mode = $2
       ),
       best_by_player AS (
         SELECT user_id,
                MAX(CASE WHEN $2 = 'outbreak' THEN max_wave ELSE score END) AS ranking_value
         FROM mode_entries
         GROUP BY user_id
       ),
       ranked_players AS (
         SELECT user_id,
                RANK() OVER (ORDER BY ranking_value DESC) AS global_position
         FROM best_by_player
       )
       SELECT COUNT(*) AS total_matches,
              COALESCE(MAX(score), 0) AS personal_best,
              COALESCE(MAX(max_wave), 0) AS personal_max_wave,
              COALESCE(ROUND(AVG(score)), 0) AS average_score,
              MAX(created_at) AS last_played_at,
              (SELECT global_position FROM ranked_players WHERE user_id = $1) AS global_position,
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
  static async recordCompletedMatch({ matchId, userId, playerName, gameMode, score, maxWave = 0, victory, kills }) {
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
             core_balance = core_balance + $4
         WHERE id = $5
         RETURNING partidas_jogadas, vitorias, abates_totais, pontuacao_maxima, core_balance`,
        [victory ? 1 : 0, kills, score, coreReward, userId],
      );
      const entryResult = await client.query(
        `INSERT INTO leaderboard (user_id, player_name, score, max_wave, core_reward, game_mode)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, player_name, score, max_wave, core_reward, game_mode, created_at`,
        [userId, playerName, score, maxWave, coreReward, gameMode],
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
module.exports._test = { coreRewardForMatch };
