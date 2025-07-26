const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/get-jobid", async (req, res) => {
    const placeId = "111601519518423";

    try {
        const url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=100`;
        const response = await axios.get(url);
        const servers = response.data.data;

        const server = servers.find(s => s.playing < s.maxPlayers);

        if (server) {
            return res.json({ jobId: server.id });
        } else {
            return res.status(404).json({ error: "No available servers" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch servers" });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
