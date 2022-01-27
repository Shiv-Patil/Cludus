const discord = require("discord.js");
const { join } = require("path");
var fs = require("fs");
const Generator = require(join(
    __dirname,
    "..",
    "..",
    "utils",
    "dialogue",
    "gif_generator.js"
));
const Story = require("inkjs").Story;
const GenericCommand = require(join("..", "..", "models", "generic_command"));
const { getDialogueAndChoices } = require(join(
    __dirname,
    "..",
    "..",
    "utils",
    "dialogue",
    "helper.js"
));
const storyJSON = fs
    .readFileSync(join("dialogues", "test_story.json"), "UTF-8")
    .replace(/^\uFEFF/, "");

function startUsing(client, id) {
    if (!client.storyUsers) {
        client.storyUsers = new discord.Collection();
    }
    client.storyUsers.set(id, Date.now());
}

function stopUsing(client, id) {
    if (!client.storyUsers) return;
    client.storyUsers.delete(id);
}

module.exports = new GenericCommand(
    async (client, interaction) => {
        //if (!client.admins.includes(interaction.user.id)) {
        //    return interaction.reply({
        //        content:
        //            "Sorry, only bot admins can use this command (for now).",
        //        ephemeral: true,
        //    });
        //}
        if (client.storyUsers && client.storyUsers.has(interaction.user.id))
            return interaction.reply({
                content: "You are already using this command",
                ephemeral: true,
            });

        let inkStory = new Story(storyJSON);
        let generator = new Generator(client.assets.bg, client.assets.glyphs);

        if (!inkStory.canContinue)
            return interaction.reply({
                content: "No story available",
                ephemeral: true,
            });

        const { embeds, components, files } = getDialogueAndChoices(
            interaction,
            inkStory,
            generator
        );

        const message = await interaction.reply({
            embeds: embeds,
            components: components,
            files: files,
            fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({
            idle: 30000,
            dispose: true,
        });
        startUsing(client, interaction.user.id);

        let processing = false;
        let index = 1; // Gif index

        collector.on("collect", async (componentInteraction) => {
            if (componentInteraction.user.id !== interaction.user.id) {
                return await componentInteraction.reply({
                    content: "These options are for another player.",
                    ephemeral: true,
                });
            }
            if (processing) {
                return await componentInteraction.reply({
                    content: "Hold on a second, I'm processing your request!",
                    ephemeral: true,
                });
            }
            processing = true;

            if (componentInteraction.customId !== "continue") {
                inkStory.ChooseChoiceIndex(+componentInteraction.customId);
            }

            const embedProps = getDialogueAndChoices(
                interaction,
                inkStory,
                generator,
                index++
            );
            try {
                await message.edit({
                    embeds: embedProps.embeds,
                    components: embedProps.components,
                    attachments: [],
                    files: embedProps.files,
                });
            } catch (e) {
                console.log(e);
            }
            await componentInteraction.update({});
            if (embedProps.end) collector.stop("finish");
            processing = false;
        });

        collector.on("end", async (collected, reason) => {
            stopUsing(client, interaction.user.id);
            if (reason === "messageDelete") return true;
            if (message.editable)
                message.edit({ components: [] }).catch(() => {});
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
        },
    }
);
