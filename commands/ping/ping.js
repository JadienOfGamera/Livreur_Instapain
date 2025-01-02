const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("tkt c'est une solution sûr - Jadien"),
    async execute(interaction) {
        try {
            await interaction.reply("Pong !");
        } catch (error) {
            console.error("Erreur de pong ", error);
            await interaction.reply({
                content:
                    "Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔",
                ephemeral: true,
            });
        }
    },
};
