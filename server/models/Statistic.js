const database = require('../config/database');

class Statistic {
  static findByUserId(userId) {
    return database.get(
      `SELECT partidas_jogadas, vitorias, abates_totais, pontuacao_maxima,
              total_matches, total_kills, total_deaths
       FROM users
       WHERE id = $1`,
      [userId],
    );
  }

  /**
   * Atualiza os acumuladores em uma única operação para evitar perda de dados.
   */
  static async recordMatch(userId, { victory, kills, deaths = 0, score }) {
    await database.run(
      `UPDATE users
       SET partidas_jogadas = partidas_jogadas + 1,
           vitorias = vitorias + $1,
           abates_totais = abates_totais + $2,
           total_matches = total_matches + 1,
           total_kills = total_kills + $2,
           total_deaths = total_deaths + $3,
           pontuacao_maxima = GREATEST(pontuacao_maxima, $4)
       WHERE id = $5`,
      [victory ? 1 : 0, kills, deaths, score, userId],
    );

    return this.findByUserId(userId);
  }
}

module.exports = Statistic;
