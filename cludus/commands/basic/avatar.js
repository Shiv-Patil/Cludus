const { MessageEmbed } = require("discord.js")
const { join } = require("path");
const GenericCommand = require(join("..", "..", "models", "generic_command"));

module.exports = new GenericCommand(
    async (client, interaction) => {
        const target = interaction.options.getUser("user") || interaction.user;
        const avatarEmbed = new MessageEmbed()
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true }) })
            .setTitle("Avatar")
            .setImage(target.displayAvatarURL({ size: 512, dynamic: true }))
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        return interaction.reply({ embeds: [avatarEmbed] });
    },
    {
        name: "avatar",
        usage: "avatar <user:optional>",
        category: "Basic",
        description: "Shows a user's discord avatar.",
        cooldown: 3,
        cooldownMessage: (timeLeft) => {
            return `Slow down, wait ${timeLeft} seconds before seeing another avatar.`;
        },
        options: [{
            name: "user",
            type: 6,
            description: "User to check avatar",
            required: false
        }]
    }
)

