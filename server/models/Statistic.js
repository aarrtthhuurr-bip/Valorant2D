const database = require('../config/database');

class Statistic {
  static findByUserId(userId) {
    return database.get(
      `SELECT partidas_jogadas, vitorias, abates_totais, pontuacao_maxima
       FROM users
       WHERE id = ?`,
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
           vitorias = vitorias + ?,
           abates_totais = abates_totais + ?,
           pontuacao_maxima = MAX(pontuacao_maxima, ?)
       WHERE id = ?`,
      [victory ? 1 : 0, kills, score, userId],
    );

    return this.findByUserId(userId);
  }
}

module.exports = Statistic;
