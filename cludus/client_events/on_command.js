const Discord = require("discord.js");

module.exports = {
    name: "onCommand",
    async execute(client, interaction) {
        // Check basic permissions
        const missingPerms = interaction.guild.me.permissionsIn(interaction.channel).missing(["SEND_MESSAGES", "VIEW_CHANNEL"]).join(", ");
        if (missingPerms) {
            return interaction.reply({
                content: "Missing permission(s): " + missingPerms,
                ephemeral: true
            });
        }

        // Check if command exists in client.commands collection
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({
            content: "Invalid command",
            ephemeral: true
        });

        // Adds command to cooldowns collection if it's not there already
        if (!client.cooldowns.has(interaction.commandName)) {
            client.cooldowns.set(interaction.commandName, new Discord.Collection());
        }

        const now = Date.now();
        const commandCooldowns = client.cooldowns.get(interaction.commandName);
        const cooldown = (command.props.cooldown || 1) * 1000;  // To milliseconds

        if (cooldown && !client.admins.includes(interaction.user.id)) {
            const timePassed = now - (commandCooldowns.get(interaction.user.id) || 0);
            // Check command cooldown
            if (timePassed < cooldown) {
                const timeLeft = (cooldown - timePassed) / 1000;
                return interaction.reply({
                    content: command.props.cooldownMessage(timeLeft.toFixed(2), interaction.user),
                    ephemeral: true
                });
            }
        }

        commandCooldowns.set(interaction.user.id, now);
        await command.execute(client, interaction);
    }
}

