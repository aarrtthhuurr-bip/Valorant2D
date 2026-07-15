const database = require('../config/database');

class Statistic {
  static findByUserId(userId) {
    return database.get(
      `SELECT partidas_jogadas, vitorias, abates_totais, pontuacao_maxima
       FROM users
       WHERE id = $1`,
      [userId],
    );
  }

  /**
   * Atualiza os acumuladores em uma única operação para evitar perda de dados.
   */
  static async recordMatch(userId, { victory, kills, score }) {
    await database.run(
      `UPDATE users
       SET partidas_jogadas = partidas_jogadas + 1,
           vitorias = vitorias + $1,
           abates_totais = abates_totais + $2,
           pontuacao_maxima = GREATEST(pontuacao_maxima, $3)
       WHERE id = $4`,
      [victory ? 1 : 0, kills, score, userId],
    );

    return this.findByUserId(userId);
  }
}

module.exports = Statistic;
