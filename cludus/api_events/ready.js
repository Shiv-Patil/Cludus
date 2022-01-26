const { join } = require("path");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.assets = await require(join(
            __dirname,
            "..",
            "utils",
            "dialogue",
            "load_assets.js"
        ))();

        console.log(`Logged in as ${client.user.username}`);
    },
};
