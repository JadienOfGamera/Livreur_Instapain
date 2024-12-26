const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../db/bread_db.json');

// La collection de PAINs :D
const breadData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
const breads = Object.keys(breadData);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infopain')
        .setDescription('Informez vous sur un pain !')
        .addStringOption(option =>
            option
                .setName('pain')
                .setDescription('Récupère les informations du pain')
                .setRequired(true)
                .addChoices(
                    ...breads.map(bread => ({ name: bread, value: bread })) // Liste les pains possibles
                )
        ),
    async execute(interaction) {
        const bread = interaction.options.getString('pain');
        let response;
        

        try {
            await interaction.reply(response);
        } catch (error) {
            console.error('Erreur lors de la demande d\'info du pain :', error);
            await interaction.reply({
                content: 'Que c\'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔',
                ephemeral: true,
            });
        }
    },
};