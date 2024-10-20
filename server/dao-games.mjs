import db from "./db.mjs";

export default function GameDao() {
    this.saveRounds = (roundsData, userId) => {
        return new Promise((resolve, reject) => {
            // Creare un nuovo gioco con punteggio iniziale 0
            db.run('INSERT INTO game (user_id, score) VALUES (?, ?)', [userId, 0], function (err) {
                if (err) {
                    console.error('SQL error:', err.message);
                    return reject(err);
                }

                const gameId = this.lastID;
                let correctAnswersCount = 0;

                const saveRound = (index) => {

                    if (index >= roundsData.length) {
                        // Tutti i round sono stati salvati, ora aggiorniamo il punteggio del gioco
                        const finalScore = correctAnswersCount * 5;
                        db.run('UPDATE game SET score = ? WHERE id = ?', [finalScore, gameId], function (err) {
                            if (err) {
                                console.error('SQL error:', err.message);
                                return reject(err);
                            }
                            resolve();
                        });
                        return;
                    }

                    const round = roundsData[index];
                    db.run('INSERT INTO round (meme_id, guessed) VALUES (?, ?)', [round.memeId, round.guessed], function (err) {
                        if (err) {
                            console.error('SQL error:', err.message);
                            return reject(err);
                        }

                        const roundId = this.lastID;

                        db.run('INSERT INTO game_round (game_id, round_id) VALUES (?, ?)', [gameId, roundId], function (err) {
                            if (err) {
                                console.error('SQL error:', err.message);
                                return reject(err);
                            }

                            // Incrementa il conteggio delle risposte corrette se il round è stato indovinato
                            if (round.guessed) {
                                correctAnswersCount++;
                            }

                            // Passa al prossimo round
                            saveRound(index + 1);
                        });
                    });
                };

                // Inizia il processo di salvataggio dei round
                saveRound(0);
            });
        });
    };
}
