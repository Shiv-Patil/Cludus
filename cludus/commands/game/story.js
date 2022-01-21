const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { join } = require("path");
var fs = require("fs");
const Story = require("inkjs").Story;
const GenericCommand = require(join("..", "..", "models", "generic_command"));
const storyJSON = fs.readFileSync(join("dialogues", "test_story.json"), "UTF-8").replace(/^\uFEFF/, "");

const continueButtonRow = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("continue")
            .setLabel("Continue")
            .setStyle("SECONDARY")
    );

function getChoiceRows(choices) {
    rows = [];
    for (let i = 0; i < choices.length; ++i) {
        rows.push(new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`${i}`)
                    .setLabel(choices[i].text)
                    .setStyle("SECONDARY")
            )
        );
    }
    return rows
}

function getDialogueEmbed(interaction, storyText) {
    return new MessageEmbed()
        .setTitle("Game")
        .setDescription(storyText)
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
}

function getDialogueAndChoices(interaction, story) {
    if (!story.canContinue) return { embeds: [getDialogueEmbed(interaction, "The end.")], components: [] };
    let text = story.Continue();
    let components = [continueButtonRow];
    if (story.currentChoices.length > 0) {
        components = getChoiceRows(story.currentChoices);
    }
    return { embeds: [getDialogueEmbed(interaction, text)], components: components }
}

module.exports = new GenericCommand(
    async (client, interaction) => {
        // if (!client.admins.includes(interaction.user.id)) {
        //      return interaction.reply({
        //         content: "Sorry, only bot admins can use this command (for now).",
        //         ephemeral: true
        //     });
        //  }

        let inkStory = new Story(storyJSON);
        
        if (!inkStory.canContinue) return interaction.reply({
            content: "No story available",
            ephemeral: true
        });

        const { embeds, components } = getDialogueAndChoices(interaction, inkStory);

        const message = await interaction.reply({
            embeds: embeds,
            components: components,
            fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({ idle: 30000, dispose: true });

        collector.on("collect", async componentInteraction => {
            if (componentInteraction.user.id !== interaction.user.id) {
                return await componentInteraction.reply({ content: "These options are for another player.", ephemeral: true });
            }

            if (componentInteraction.customId !== "continue") {
                inkStory.ChooseChoiceIndex(+componentInteraction.customId);
            }

            return componentInteraction.update(getDialogueAndChoices(interaction, inkStory));
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "messageDelete") return true;
            if (message.editable) message.edit({ components: [] });
        });
    },
    {
        name: "story",
        usage: "story",
        category: "Game",
        description: "(Alpha) (restricted) start RPG dialogue",
        cooldown: 15,
        cooldownMessage: (timeLeft) => {
            return `Please wait ${timeLeft} seconds before using this command again.`;
        }
    }
)

