import bread_db from "../db/bread_db.json" with { type: "json" };
const axios = require('axios');
const { SlashCommandBuilder, resolveGuildTemplateCode } = require('discord.js');

// La collection de PAINs :D
const breads = ['Pain', 'niaP', 'Chasseur', 'Ruche', 'Kyrofortant', 'Gigotant', 'Cosmique'];

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