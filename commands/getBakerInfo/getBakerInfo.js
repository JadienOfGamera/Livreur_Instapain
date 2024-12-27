const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/bread_creator.json");
const bakerData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
const bakers = Object.keys(bakerData);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infocuistot")
        .setDescription("Informez-vous sur un cuistôt d'Instapain !")
        .addStringOption(option =>
            option
                .setName("cuistot")
                .setDescription("Récupère les informations du pain")
                .setRequired(true)
                .addChoices(
                    ...bakers.map(baker => ({ name: baker, value: baker }))
                )
        ),
    async execute(interaction, client) {
        const bakerName = interaction.options.getString("cuistot");
        const baker = bakerData[bakerName];

        if (!baker) {
            await interaction.reply({
                content: "Je ne connais pas ce pain. Peut-être que Certos pourra m'aider. 🤔",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#eec07b")
            .setTitle(`${baker.baker_name}`)
            .setDescription(baker.description)
            .setFooter({
                text: `Affiliation : ${baker.affiliation}`,
                iconURL: "https://i.imgur.com/0fJgG0Y.png",
            });

        if (baker.image_link && baker.image_link !== "null") {
            embed.setImage(baker.image_link);
        }

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