const db = require('./dbconfig');

class AutoEntertain {
    constructor(key) {
        this.key = key;
        this.standardScale = 0.5;
    }

    getMedia() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM movies WHERE genre = ?';
            db.query(sql, [this.key], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    promptForMovieChoice(mediaChoice) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM movies WHERE title LIKE ?';
            db.query(sql, [`%${mediaChoice}%`], (err, results) => {
                if (err) {
                    reject(err);
                } else if (results.length === 0) {
                    reject(new Error('Movie not found'));
                } else {
                    const selectedMedia = results[0];
                    this.getRecommendations(selectedMedia)
                        .then(recommendations => {
                            resolve({ selectedMedia, recommendations });
                        })
                        .catch(reject);
                }
            });
        });
    }

    getRecommendations(selectedMedia) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM movies WHERE genre = ? AND id != ?';
            db.query(sql, [selectedMedia.genre, selectedMedia.id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const recommendations = results.filter(media => {
                        const similarityScale = this.calculateSimilarity(media, selectedMedia);
                        return similarityScale >= this.standardScale;
                    });
                    resolve(recommendations);
                }
            });
        });
    }

    calculateSimilarity(mediaElement, selectedMedia) {
        const genreResemblance = mediaElement.genre === selectedMedia.genre ? 1 : 0;
        const ratingDifference = Math.abs(mediaElement.rating - selectedMedia.rating);
        const ratingResemblance = 1 / (1 + ratingDifference);
        return (genreResemblance * 0.6) + (ratingResemblance * 0.4);
    }
}

module.exports = AutoEntertain;
