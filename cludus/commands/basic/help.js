const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { join } = require("path");
const GenericCommand = require(join("..", "..", "models", "generic_command"));
const MAX_EMBED_SIZE = 2000

function getCategoryTitle(category) {
    return category.charAt(0).toUpperCase() + category.slice(1) + " commands";
}

function getCategoryCommands(allCommands, category) {
    if (category === "all") return allCommands;
    return allCommands.filter(cmd => {
        return cmd.category === category;
    });
}

function getHelpPageContent(commands) {
    let overflowCommands = [];
    let pageString = "";
    for (let i = 0; i < commands.length; i++) {
        const currentPageString = pageString + `<:ReplyOne:874501963893588019>[${commands[i].name}](https://umm.nothing.here)
<:ReplyTwo:874502020554432543><:ReplyThree:874502075004907580>*${commands[i].description}*\n`;

        if (MAX_EMBED_SIZE <= currentPageString.length) {
            overflowCommands = commands.slice(i);
            break;
        }
        pageString = currentPageString;
    }
    pageString = pageString.trim();
    return [pageString, overflowCommands];
}

function getHelpPages(commands) {
    const helpPages = [];
    let pageString = "";
    while (commands.length) {
        [pageString, commands] = getHelpPageContent(commands);
        if (!pageString.length) break;
        helpPages.push(pageString);
    }
    return helpPages;
}

function getHelpEmbed(title, helpPage, page, pages) {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(helpPage)
        .setFooter({ text: `Page ${page + 1} of ${pages}` });
}

module.exports = new GenericCommand(
    async (client, interaction) => {
        const helpOf = interaction.options.getString("command");
        if (helpOf) {
            if (!client.commands.has(helpOf)) {
                return await interaction.reply("I don't have that command.");
            }
            const commandProps = client.commands.get(helpOf).props;
            return await interaction.reply({
                embeds: [new MessageEmbed()
                    .setTitle(commandProps.name)
                    .setDescription(commandProps.description + "\n" + (commandProps.helpString || '')),],
            })
        }

        const allCommands = Array.from(client.commands.values()).map(x => {
            return {
                name: x.props.name,
                description: x.props.description,
                category: x.props.category.toLowerCase(),
            };
        }).sort();
        const allCategories = new Set();
        for (let cmd of allCommands) {
            allCategories.add(cmd.category);
        }

        const options = [{ label: "All commands", value: "all" }];
        for (let category of allCategories) {
            options.push({
                label: getCategoryTitle(category),
                value: category,
            })
        }

        let categoryRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("category")
                    .addOptions(options),
            );
        let navigationRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("previous")
                    .setLabel("Previous page")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("next")
                    .setLabel("Next page")
                    .setStyle("SECONDARY")
            );

        let page = 0;
        let category = "all";
        let title = getCategoryTitle(category);
        let helpPages = getHelpPages(allCommands);
        let embed = getHelpEmbed(title, helpPages[page], page, helpPages.length);
        const message = await interaction.reply({
            embeds: [embed],
            components: [categoryRow, navigationRow],
            fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({ idle: 20000, dispose: true });

        collector.on("collect", async componentInteraction => {
            if (componentInteraction.user.id !== interaction.user.id) {
                return await componentInteraction.reply({ content: "These options are not for you. ", ephemeral: true });
            }

            switch (componentInteraction.customId) {

                case "previous":
                    if (page <= 0) return componentInteraction.update({});
                    embed = getHelpEmbed(title, helpPages[--page], page, helpPages.length);
                    return await componentInteraction.update({ embeds: [embed] });

                case "next":
                    if (page >= helpPages.length - 1) return componentInteraction.update({});
                    embed = getHelpEmbed(title, helpPages[++page], page, helpPages.length);
                    return await componentInteraction.update({ embeds: [embed] });

                case "category":
                    let _category = componentInteraction.values[0];
                    if (category === _category) return componentInteraction.update({});
                    category = _category;
                    title = getCategoryTitle(category);
                    helpPages = getHelpPages(getCategoryCommands(allCommands, category));
                    page = 0;
                    embed = getHelpEmbed(title, helpPages[page], page, helpPages.length);
                    return await componentInteraction.update({ embeds: [embed] });
            }
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "messageDelete") return true;
            if (message.editable) message.edit({ components: [] });
        });
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
