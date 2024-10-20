import db from "./db.mjs";

export default function MemeDAO() {
    this.getMemes = (count) => {
        return new Promise((resolve, reject) => {
            const selectMemes = `
                SELECT id, image
                FROM memes
                ORDER BY RANDOM()
                LIMIT ?`;

            db.all(selectMemes, [count], (err, memes) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                    return;
                }

                if (!memes.length) {
                    reject(new Error("No memes found"));
                    return;
                }

                const memesData = [];
                let completed = 0;

                memes.forEach((meme) => {
                    const selectCorrectCaptions = `
                        SELECT c.id, c.text
                        FROM captions c
                        JOIN meme_captions mc ON c.id = mc.caption_id
                        WHERE mc.meme_id = ?
                        ORDER BY RANDOM()
                        LIMIT 2`;

                    const selectRandomCaptions = `
                        SELECT c.id, c.text
                        FROM captions c
                        WHERE c.id != ? AND c.id != ?
                        ORDER BY RANDOM()
                        LIMIT 5`;


                    db.all(selectCorrectCaptions, [meme.id], (err, correctCaptions) => {
                        if (err) {
                            console.error('SQL error:', err.message);
                            reject(err);
                            return;
                        }

                        db.all(selectRandomCaptions, [correctCaptions[0].id, correctCaptions[1].id], (err, randomCaptions) => {
                            if (err) {
                                console.error('SQL error:', err.message);
                                reject(err);
                                return;
                            }

                            const memeData = {
                                id: meme.id,
                                image: meme.image,
                                captions: []
                            };

                            correctCaptions.forEach(caption => {
                                memeData.captions.push({
                                    id: caption.id,
                                    text: caption.text
                                });
                            });

                            randomCaptions.forEach(caption => {
                                memeData.captions.push({
                                    id: caption.id,
                                    text: caption.text
                                });
                            });

                            memeData.captions.sort(() => Math.random() - 0.5);
                            memesData.push(memeData);

                            completed += 1;
                            if (completed === memes.length) {
                                resolve(memesData);
                            }
                        });
                    });
                });
            });
        });
    };

    this.checkAnswer = (memeId, captionId) => {
        return new Promise((resolve, reject) => {
            const checkCaption = `
                SELECT COUNT(*) AS count
                FROM meme_captions
                WHERE meme_id = ? AND caption_id = ?`;

            db.get(checkCaption, [memeId, captionId], (err, row) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                    return;
                }

                if (row.count > 0) {
                    resolve({ correct: true });
                } else {
                    resolve({ correct: false });
                }
            });
        });
    };

    this.getAnswers = (memeId) => {
        return new Promise((resolve, reject) => {
            const getCaptions = `
                SELECT c.text
                FROM meme_captions mc
                JOIN captions c ON mc.caption_id = c.id
                WHERE mc.meme_id = ?`;

            db.all(getCaptions, [memeId], (err, rows) => {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                    return;
                }

                resolve(rows);
            });
        });
    };

}
