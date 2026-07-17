const database = require('../config/database');

class Leaderboard {
  /** Retorna apenas o melhor resultado de cada conta no modo solicitado. */
  static listByMode(gameMode, limit = 10) {
    return database.all(
      `SELECT id, player_name, score, game_mode, created_at
       FROM (
         SELECT id, user_id, player_name, score, game_mode, created_at,
                ROW_NUMBER() OVER (
                  PARTITION BY user_id
                  ORDER BY score DESC, created_at ASC, id ASC
                ) AS player_position
         FROM leaderboard
         WHERE game_mode = $1
       ) AS personal_bests
       WHERE player_position = 1
       ORDER BY score DESC, created_at ASC, id ASC
       LIMIT $2`,
      [gameMode, limit],
    );
  }

  /**
   * Consome o comprovante, atualiza estatísticas e grava o ranking na mesma
   * transação. Uma falha não deixa a partida parcialmente registrada.
   */
  static async recordCompletedMatch({ matchId, userId, playerName, gameMode, score, victory, kills }) {
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
      const statisticsResult = await client.query(
        `UPDATE users
         SET partidas_jogadas = partidas_jogadas + 1,
             vitorias = vitorias + $1,
             abates_totais = abates_totais + $2,
             pontuacao_maxima = GREATEST(pontuacao_maxima, $3)
         WHERE id = $4
         RETURNING partidas_jogadas, vitorias, abates_totais, pontuacao_maxima`,
        [victory ? 1 : 0, kills, score, userId],
      );
      const entryResult = await client.query(
        `INSERT INTO leaderboard (user_id, player_name, score, game_mode)
         VALUES ($1, $2, $3, $4)
         RETURNING id, player_name, score, game_mode, created_at`,
        [userId, playerName, score, gameMode],
      );
      await client.query('COMMIT');
      return { entry: entryResult.rows[0], statistics: statisticsResult.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Leaderboard;
