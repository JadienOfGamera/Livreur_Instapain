const axios = require("axios");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commandelait")
        .setDescription("Commande un lait à la menthe :laitalamenthe:")
        .addUserOption((option) =>
            option
                .setName("cible")
                .setDescription(
                    "Commande un lait pour quelqu'un ^^",
                )
                .setRequired(false),
        ),
    async execute(interaction) {
        const cible = interaction.options.getUser("cible");

        let response = "Je ne suis pas sûr de comprendre l'intérêt pour du lait à la menthe à la place d'un pain, mais il faut de tout pour faire un univers n'est ce pas? ^^ Un petit lait pour toi <:laitalamenthe:1323596506019663964>";

        if (cible?.id === "1319003825331376268") {
            response += "\nOh, c'est pour moi? J'accepte volontier, merci ^^\n";
        } else if (cible) {
            response += `\n\nC'est pour <@${cible.id}> :)`;
        }

        try {
            await interaction.reply(response);
        } catch (error) {
            console.error("Erreur lors de la commande du lait :", error);
            await interaction.reply({
                content:
                    "Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔",
                ephemeral: true,
            });
        }
    },
};
