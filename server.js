const express = require('express');
const path = require('path');
const AutoEntertain = require('./AutoEntertain');
const AutoSense = require('./AutoSense');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/dimension', async (req, res) => {
    const { dimension, key, mediaInput } = req.body;
    try {
        switch (dimension) {
            case 'P':
                const autoSense = new AutoSense(key);
                await autoSense.fetchData();
                const prediction = autoSense.predict();
                const explanation = autoSense.explainPrediction();
                res.send({ prediction, explanation });
                break;
            case 'E':
                const autoEntertain = new AutoEntertain(key);
                const mediaList = await autoEntertain.getMedia();
                const mediaChoice = mediaInput;
                try {
                    const interestedMedia = await autoEntertain.promptForMovieChoice(mediaChoice);
                    res.send(interestedMedia);
                } catch (error) {
                    res.status(404).send({ error: error.message });
                }
                break;
            case 'I':
                res.status(501).send({ error: "Information Feature Not Implemented yet." });
                break;
            default:
                res.status(400).send({ error: 'Invalid Choice!' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
