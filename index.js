app.get("/get-jobid", async (req, res) => {
    const placeId = "111601519518423";
    const url = `https://games.roblox.com/v1/games/${111601519518423}/servers/Public?sortOrder=Asc&limit=100`;

    try {
        const response = await axios.get(url);
        const servers = response.data.data;
        const server = servers.find(s => s.playing < s.maxPlayers);

        if (server) {
            return res.json({ jobId: server.id });
        } else {
            return res.status(404).json({ error: "No available servers" });
        }
    } catch (err) {
        if (err.response && err.response.status === 429) {
            // Back off and retry after suggested delay
            const retryAfter = parseInt(err.response.headers['retry-after']) || 5;
            return res.status(429).json({
                error: "Rate limited by Roblox. Please wait and retry.",
                retryAfter
            });
        }

        console.error(err);
        res.status(500).json({ error: "Failed to fetch servers" });
    }
});
