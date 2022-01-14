const { join } = require("path");
const on_command = require(join("..", "client_events", "on_command.js"))

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return;
        return await on_command.execute(client, interaction);
    }
}
