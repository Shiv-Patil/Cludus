/*

Cludus discord bot - discord.js

*/

const axios = require("axios");
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
    ],
    allowedMentions: { repliedUser: false, users: false, roles: false },
});
const fs = require("fs");
const { join } = require("path");
require("dotenv").config();

// Client events of the discord api (ready, interactionCreate, etc.)
const eventFiles = fs
    .readdirSync(join(__dirname, "api_events"))
    .filter((file) => file.endsWith(".js"));

// Collections to store bot commands and command cooldowns
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection(); // cooldowns: {command1: {user1: lastUsed, user2: lastUsed}, command2...}
client.admins = process.env.CLIENT_ADMINS
    ? process.env.CLIENT_ADMINS.split(",").map((x) => x.trim())
    : [];

// Adds to client.commands by traversing the commands directory
const commandDirectories = fs.readdirSync(join(__dirname, "commands"));
for (const cDirectory of commandDirectories) {
    // Sub-directory to organise command files
    const commandFiles = fs
        .readdirSync(join(__dirname, "commands", cDirectory))
        .filter((file) => file.endsWith(".js"));
    for (const cFile of commandFiles) {
        const command = require(join(__dirname, "commands", cDirectory, cFile));
        client.commands.set(command.props.name, command);
    }
}

for (const eFile of eventFiles) {
    const event = require(join(__dirname, "api_events", eFile));
    if (event.once) {
        // Execute once
        client.once(
            event.name,
            async (...args) => await event.execute(client, ...args)
        );
    } else {
        // Execute every time an event is called
        client.on(
            event.name,
            async (...args) => await event.execute(client, ...args)
        );
    }
}

if (process.env.DISCORD_CLIENT_TOKEN) {
    client.login(process.env.DISCORD_CLIENT_TOKEN);
} else {
    throw new Error("Please set a client token in the env file.");
}
