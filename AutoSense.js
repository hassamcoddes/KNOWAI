const db = require('./dbconfig');

class AutoSense {
    constructor(type) {
        this.type = type;
        this.coefficients = [];
        this.features = [];
        this.featureNames = [];
    }

    fetchData() {
        return new Promise((resolve, reject) => {  //Promise executer function 2 parameters resolve & reject..
            const sql = 'SELECT feature_name, coefficient, feature FROM predictive_data WHERE type = ?';
            db.query(sql, [this.type], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Fetched Data:', results); // Debugging log
                    if (results.length > 0) {
                        results.forEach(row => {
                            this.featureNames.push(row.feature_name);
                            this.coefficients.push(row.coefficient);
                            this.features.push(row.feature);
                        });
                        resolve();
                    } else {
                        reject(new Error('Invalid type provided or no data available for this type'));
                    }
                }
            });
        });
    }

    predict() {
        let prediction = 0;
        for (let i = 0; i < this.coefficients.length; i++) {
            prediction += this.coefficients[i] * this.features[i];
        }
        return prediction;
    }

    explainPrediction() {
        const featureContributions = [];
        for (let i = 0; i < this.coefficients.length; i++) {
            featureContributions.push(this.coefficients[i] * this.features[i]);
        }

        let mostImportantFeatureIndex = 0;
        let mostImportantContribution = Math.abs(featureContributions[0]);

        for (let i = 1; i < featureContributions.length; i++) {
            const currentContribution = Math.abs(featureContributions[i]);
            if (currentContribution > mostImportantContribution) {
                mostImportantFeatureIndex = i;
                mostImportantContribution = currentContribution;
            }
        }

        console.log(`The prediction is most influenced by ${this.featureNames[mostImportantFeatureIndex]} with a contribution of ${featureContributions[mostImportantFeatureIndex]}.`);
        return {
            mostInfluentialFeature: this.featureNames[mostImportantFeatureIndex],
            contribution: featureContributions[mostImportantFeatureIndex]
        };
    }
}

module.exports = AutoSense;
