const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { join } = require("path");
require("dotenv").config();

if (process.argv.length === 2) {
    console.error("Usage: deploy <guild/global>");
    process.exit(1);
}

const token = process.env.DISCORD_CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
let guildId = process.env.GUILD_ID;

if (!token || !clientId) {
    throw new Error("Please check if all environment variables are set properly (DISCORD_CLIENT_TOKEN, CLIENT_ID).");
}

const commands = [];
const commandDirectories = fs.readdirSync(join(__dirname, "commands"));
for (const cDirectory of commandDirectories) {  // Sub-directory to organise command files
    const commandFiles = fs.readdirSync(join(__dirname, "commands", cDirectory)).filter(file => file.endsWith(".js"));
    for (const cFile of commandFiles) {
        const command = require(join(__dirname, "commands", cDirectory, cFile));
        commands.push(command.props);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

const type = process.argv[2].toLowerCase();
guildId = process.argv[3] ? process.argv[3] : guildId;

if (type === "global") {
    console.log("Registering global commands...");
    (async () => {
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: [] },
        );
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log("Global commands registered.");
    })().catch(e => console.log(e.message + "\n(Code " + e.code + ")"));
} else if (type === "guild") {
    if (!guildId) {
        console.log("Please specify a guildId either as an argument or as an environment variable.")
    }
    else {
        console.log("Registering guild commands for " + guildId + "...");
        (async () => {
            await rest.put(
                Routes.applicationCommands(clientId, guildId),
                { body: [] },
            );
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
            console.log("Guild commands registered.");
        })().catch(e => console.log(e.message + "\n(Code " + e.code + ")"));
    }
}

