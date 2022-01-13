const { join } = require("path");
const GenericCommand = require(join("..", "..", "models", "generic_command"));

module.exports = new GenericCommand(
    async (client, interaction) => {
        const createTime = interaction.createdTimestamp;
        await interaction.reply({
            content: "Testing latency..."
        });
        return await interaction.editReply({
            content: `Pong! ${Date.now() - createTime} ms.`
        });
    },
    {
        name: "ping",
        usage: "ping",
        category: "Basic",
        description: "Tests bot latency",
        cooldown: 3,
        cooldownMessage: (timeLeft) => {
            return `Please wait ${timeLeft} seconds before using this command again.
(Yeah ping command has a cooldown too :P)`;
        }
    }
)

