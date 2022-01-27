const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageAttachment,
} = require("discord.js");

const continueButtonRow = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("continue")
        .setLabel("Continue")
        .setStyle("SECONDARY")
);

function getChoiceRows(choices) {
    rows = [];
    for (let i = 0; i < choices.length; ++i) {
        rows.push(
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`${i}`)
                    .setLabel(choices[i].text)
                    .setStyle("SECONDARY")
            )
        );
    }
    return rows;
}

function getDialogueEmbed(interaction, title, storyText, generator, index = 0) {
    const attachment = new MessageAttachment(
        generator.renderGif(storyText),
        `gif${index}.gif`
    );
    return {
        embed: new MessageEmbed()
            .setTitle(title)
            .setImage(`attachment://gif${index}.gif`)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            }),
        attachment: attachment,
    };
}

module.exports = {
    getDialogueAndChoices: (interaction, story, generator, index = 0) => {
        if (!story.canContinue) {
            const embed = new MessageEmbed().setTitle("The End.").setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });
            return {
                embeds: [embed],
                components: [],
                files: [],
                end: true,
            };
        }
        let text = story.Continue().split(":");
        const title = text.length > 1 ? text.shift() : "Game";
        text = text.join("").trim();
        if (!text)
            return module.exports.getDialogueAndChoices(
                interaction,
                story,
                generator,
                index
            );
        let components = [continueButtonRow];
        if (story.currentChoices.length > 0) {
            components = getChoiceRows(story.currentChoices);
        }
        const embed = getDialogueEmbed(
            interaction,
            title,
            text,
            generator,
            index
        );
        return {
            embeds: [embed.embed],
            components: components,
            files: [embed.attachment],
        };
    },
};
