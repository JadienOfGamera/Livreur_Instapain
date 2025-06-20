const { SlashCommandBuilder } = require("discord.js");
const Bread = require("../../models/Bread");

const data = new SlashCommandBuilder()
    .setName("commande")
    .setDescription("Commande un pain 🥖")
    .addStringOption(option =>
        option
            .setName("pain")
            .setDescription("Commande un pain en particulier")
            .setRequired(false)
    );

function getBreadChoices(breadsChoices) {
    const option = data.options.find(opt => opt.name === "pain");
    if (option) {
        option.addChoices(...breadsChoices);
    }
}

module.exports = {
    data,
    getBreadChoices,
    async execute(interaction, client) {
        const breadName = interaction.options.getString("pain");
        const allBreads = await Bread.find({}).lean();
        if (!allBreads || allBreads.length === 0) {
            return interaction.reply({
                content: "Nos stocks sont vides... 😢",
                ephemeral: true,
            });
        }

        let bread;
        if (breadNameInput) {
            bread = allBreads.find(b => b.bread_name.toLowerCase() === breadNameInput.toLowerCase());
            if (!bread) {
                return interaction.reply({
                    content: `Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔`,
                    ephemeral: true,
                });
            }
        } else {
            bread = allBreads[Math.floor(Math.random() * allBreads.length)];
        }

        const creatorId = bread.creator_id;
        const baker = bakerData[creatorId] || { baker_name: "Créateur inconnu" };

        const embed = new EmbedBuilder()
            .setColor("#eec07b")
            .setTitle(`${bread.bread_emoji || "🥖"} ${bread.bread_name}`)
            .setDescription(bread.bread_description || "Aucune description disponible pour ce pain.")
            .setFooter({
                text: `Écrit par : ${bread.bread_writter || "Inconnu"}`,
                iconURL: "https://i.imgur.com/0fJgG0Y.png",
            });

        if (bread.bread_image_link && bread.bread_image_link !== "null") {
            embed.setImage(bread.bread_image_link);
        }

        embed.addFields({
            name: "Inventé par",
            value: baker.creator_name || "Créateur inconnu",
            inline: true,
        });

        try {
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            await message.react("🥖");
            const collector = message.createReactionCollector({ time: 60000 });

            collector.on("collect", async (reaction, user) => {
                try {
                    if (!reaction || !user || user.bot) return;

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
                        user: user,
                        reply: async (response) => {
                            await interaction.followUp({
                                content: `${user.username} a réagi. Commande initiée par ${interaction.user.username}.\n\n${response}`,
                                ephemeral: true,
                            });
                        },
                        client: client,
                    };

                    await command.execute(fakeInteraction);
                } catch (error) {
                    console.error("Erreur lors de la gestion de la réaction :", error);
                }
            });

            collector.on("end", () => {
                try {
                    message.reactions.removeAll();
                } catch (err) {
                    console.error("Erreur lors de la suppression des réactions :", err);
                }
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
