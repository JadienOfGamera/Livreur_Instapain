const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const breadDbPath = path.join(__dirname, "../../db/bread_db.json");
const breadCreatorPath = path.join(__dirname, "../../db/bread_creator.json");
const breadData = JSON.parse(fs.readFileSync(breadDbPath, "utf8"));
const bakerData = JSON.parse(fs.readFileSync(breadCreatorPath, "utf8"));
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
                    ...breads.map(bread => ({ name: bread, value: bread }))
                )
        ),
    async execute(interaction, client) {
        const breadName = interaction.options.getString("pain");
        const bread = breadData[breadName];

        if (!bread) {
            await interaction.reply({
                content: "Je ne connais pas ce pain. Peut-être que Certos pourra m'aider. 🤔",
                ephemeral: true,
            });
            return;
        }

        const creatorId = bread.creator_id;
        const baker = bakerData[creatorId] || { baker_name: "Créateur inconnu" };

        const embed = new EmbedBuilder()
            .setColor("#eec07b")
            .setTitle(`${bread.emoji || "🥖"} ${bread.bread_name}`)
            .setDescription(bread.description || "Aucune description disponible pour ce pain.")
            .setFooter({
                text: `Écrit par : ${bread.writter || "Inconnu"}`,
                iconURL: "https://i.imgur.com/0fJgG0Y.png",
            });

        if (bread.image_link && bread.image_link !== "null") {
            embed.setImage(bread.image_link);
        }

        embed.addFields({
            name: "Inventé par",
            value: baker.baker_name || "Créateur inconnu",
            inline: true,
        });

        try {
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            await message.react("🥖");
            const filter = (reaction, user) =>
                reaction.emoji.name === "🥖" && user.id !== client.user.id;

            const collector = message.createReactionCollector({ filter, time: 60000 });

            collector.on("collect", async (reaction, user) => {
                try {
                    const command = client.commands.get("commande");
                    if (!command) {
                        console.error("Commande /commande introuvable !");
                        return;
                    }

                    const fakeInteraction = {
                        options: {
                            getString: () => breadName,
                            getUser: () => user,
                        },
                        reply: async response => {
                            await interaction.followUp({
                                content: response,
                                ephemeral: true,
                            });
                        },
                    };

                    await command.execute(fakeInteraction);
                } catch (error) {
                    console.error("Erreur lors de l'exécution de la commande :", error);
                }
            });

            collector.on("end", () => {
                message.reactions.removeAll().catch(console.error);
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'embed :", error);
            await interaction.reply({
                content: "Une erreur est survenue en récupérant les informations du pain. Veuillez réessayer plus tard.",
                ephemeral: true,
            });
        }
    },
};
