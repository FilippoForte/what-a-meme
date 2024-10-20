/* Data Access Object (DAO) module for accessing users data */

import db from "./db.mjs";
import crypto from "crypto";

// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    // This function retrieves one user by id
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                }
                if (row === undefined) {
                    resolve({ error: 'User not found.' });
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id, username: row.username };

                    // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) 
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    // Function to get all games and their rounds for a specific user
    this.getUserGames = (userId) => {
        return new Promise((resolve, reject) => {
            const gamesQuery = 'SELECT id, score FROM game WHERE user_id=? ORDER BY id DESC';
            db.all(gamesQuery, [userId], (err, games) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject({ error: 'Database error' });
                } else if (games.length === 0) {
                    resolve([]);
                } else {
                    const gameIds = games.map(game => game.id);
                    const roundsQuery = `
                        SELECT gr.game_id, r.meme_id, r.guessed, m.image 
                        FROM game_round gr 
                        JOIN round r ON gr.round_id = r.id 
                        JOIN memes m ON r.meme_id = m.id 
                        WHERE gr.game_id IN (` + gameIds.map(() => '?').join(',') + `) 
                        ORDER BY gr.game_id, r.id`;

                    db.all(roundsQuery, gameIds, (err, rounds) => {
                        if (err) {
                            console.error('SQL error:', err.message);
                            reject({ error: 'Database error' });
                        } else {
                            games.forEach(game => {
                                game.rounds = rounds.filter(round => round.game_id === game.id);
                            });
                            resolve(games);
                        }
                    });
                }
            });
        });
    };

}
