const { join } = require("path");
const GenericCommand = require(join("..", "..", "models", "generic_command"));

module.exports = new GenericCommand(
    async (client, interaction) => {
        const helpOf = interaction.options.getString("command");
        if (helpOf) {
            if (!client.commands.has(helpOf)) {
                return interaction.reply("I don't have that command.");
            }
        }
        return interaction.reply("Not implemented yet <:TFLmao:865971134595334174>");
    },
    {
        name: "help",
        category: "Basic",
        description: "Help related to the bot commands",
        cooldown: 5,
        perms: ["EMBED_LINKS"],
        options: [{
            name: "command",
            type: 3,
            description: "Command to get help of",
            required: false
        }]
    }
)
