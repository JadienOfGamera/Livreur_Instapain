const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Chargement des données
const dbPath = path.join(__dirname, "../../db/bread_db.json");
const breadData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
const breads = Object.keys(breadData);

// Mapping des creator_id vers baker_name
const creatorMapping = {
    Certos: "Certos Qalis",
    Mae: "Mae Leven",
    Jadien: "Jadien Colm",
    // Ajoute ici d'autres correspondances si nécessaires
};

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

        if (bread.creator_id && bread.creator_id !== "null") {
            const bakerName = creatorMapping[bread.creator_id] || "Créateur inconnu";
            embed.addFields({
                name: "Inventé par",
                value: bakerName,
                inline: true,
            });
        }

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
    },
};
