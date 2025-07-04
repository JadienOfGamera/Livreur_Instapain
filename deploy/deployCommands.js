const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { loadBreadChoices, getBreadChoices } = require("../init");

const BOT_TOKEN = process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const deploy = async () => {
    await loadBreadChoices();
    const breadsChoices = getBreadChoices();

    const commands = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (command.data.name === "commande") {
                if (command.data.options.length > 0) {
                    command.data.options[0].choices = breadsChoices;
                }
            }

            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(BOT_TOKEN);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error("❌ Erreur lors du déploiement :", error);
    }
};

module.exports = deploy;
