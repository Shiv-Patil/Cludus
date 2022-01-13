const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { join } = require("path");
require("dotenv").config();

const token = process.env.DISCORD_CLIENT_TOKEN;
if (!token) {
    throw new Error("Please set a client token in the env file.");
}

const clientId = "874982413917380638";
const guildId = "847436129254113300";

const commands = [];
const commandDirectories = fs.readdirSync(join(__dirname, "commands"));
for (const cDirectory of commandDirectories) {  // Sub-directory to organise command files
    const commandFiles = fs.readdirSync(join(__dirname, "commands", cDirectory)).filter(file => file.endsWith(".js"));
    for (const cFile of commandFiles) {
        const command = require(join(__dirname, "commands", cDirectory, cFile));
        commands.push(command.props);
    }
}
console.log(commands);

const rest = new REST({ version: '9' }).setToken(token);

const arg = process.argv[2];

if (arg === "global") {
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
    })();
} else {
    console.log("Registering guild commands...");
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
    })();
}

