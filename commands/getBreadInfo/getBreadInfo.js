const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/bread_db.json");

// La collection de pains
const breadData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
const breads = Object.keys(breadData);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infopain")
        .setDescription("Informez-vous sur un pain !")
        .addStringOption(option =>
            option
                .setName("pain")
                .setDescription("Récupère les informations du pain")
                .setRequired(true)
                .addChoices(
                    ...breads.map(bread => ({ name: bread, value: bread })) // Liste les pains possibles
                )
        ),
    async execute(interaction) {
        // Récupère le pain sélectionné
        const breadName = interaction.options.getString("pain");
        const bread = breadData[breadName]; // Récupère l'objet correspondant dans breadData

        // Vérifie si le pain existe dans la base de données
        if (!bread) {
            await interaction.reply({
                content: "Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔",
                ephemeral: true,
            });
            return;
        }

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setColor("#eec07b")
            .setTitle(`${bread.emoji} ${bread.bread_name}`)
            .setDescription(bread.description)
            .setFooter({
                text: `Écrit par : ${bread.writter}`,
                iconURL: "https://i.imgur.com/0fJgG0Y.png", // Une icône optionnelle
            });

        // Ajout de l'image si elle existe
        if (bread.image_link && bread.image_link !== "null") {
            embed.setImage(bread.image_link);
        }

        // Envoie de l'embed
        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'embed :", error);
            await interaction.reply({
                content: "Une erreur est survenue en récupérant les informations du pain. Veuillez réessayer plus tard.",
                ephemeral: true,
            });
        }
    },
};
