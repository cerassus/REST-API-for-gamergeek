const express = require("express");
const router = express.Router();
const Scores = require('./mongoose_model_scores');
const Database = require('./mongoose_model_games');

router.get("/scores", async (req, res) => {
    try {
        await Scores.find().then((results) => {
            res.status(200).json(results);
        });
    }
    catch(err) {
        res.json({error: err});
    }
});

router.get("/database/:difficulty", async (req, res) => {
    try {
        await Database.find({}).then((results) => {
            switch(req.params.difficulty) {
                case "easy": return res.status(200).json(results.slice(0, 120).filter(x => x.game_id))
                case "medium": return res.status(200).json(results.slice(120, 240).filter(x => x.game_id))
                case "hard": return res.status(200).json(results.slice(240, 360).filter(x => x.game_id))
                case "all": return res.status(200).json(results.filter(x => x.game_id))
                default: return res.status(200).json([])
            }
        });
    }
    catch(err) {
        res.json({error: err});
    }
});

router.post("/addNewScore", async (req, res) => {
    try {
        await Scores.insertMany(req.body);
        res.json(req.body);
    }
    catch(err) {
        res.json({error: err});
    }

});

module.exports = router;
