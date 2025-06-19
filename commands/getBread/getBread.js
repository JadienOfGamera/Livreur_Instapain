const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const Bread = require("../../models/Bread");

const data = new SlashCommandBuilder()
    .setName("commande")
    .setDescription("Commande un pain 🥖")
    .addStringOption(option =>
        option
            .setName("pain")
            .setDescription("Commande un pain en particulier")
            .setRequired(false) // pas de choices ici, on les ajoutera dynamiquement
    )
    .addUserOption((option) =>
        option
            .setName("cible")
            .setDescription("Commande un pain pour quelqu'un, la chance ! :D")
            .setRequired(false),
    );

function injectChoices(breadsChoices) {
    const option = data.options.find(opt => opt.name === "pain");
    if (option) {
        option.addChoices(...breadsChoices);
    }
}

module.exports = {
    data,
    injectChoices,
    async execute(interaction) {
        const breadNameInput = interaction.options.getString("pain");
        const cible = interaction.options.getUser("cible");

        const allBreads = await Bread.find({}).lean();
        if (!allBreads || allBreads.length === 0) {
            return interaction.reply({
                content: "Il n'y a aucun pain disponible en base. 😢",
                ephemeral: true,
            });
        }

        let breadDoc;
        if (breadNameInput) {
            breadDoc = allBreads.find(b => b.bread_name.toLowerCase() === breadNameInput.toLowerCase());
            if (!breadDoc) {
                return interaction.reply({
                    content: `Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔`,
                    ephemeral: true,
                });
            }
        } else {
            breadDoc = allBreads[Math.floor(Math.random() * allBreads.length)];
        }

        let response = breadDoc.commande;

        if (cible?.id === "1319003825331376268") {
            response += "\nAttends un peu... Mais... C'est pour moi...? 😳 Je... Je n'ai pas les mots... Merci... ❤\n";
        } else if (breadDoc.bread_name === "Pain-Étoile" && cible) {
            response += `\n\nHey, <@${cible.id}>, <@${interaction?.user?.id}> souhaites partager un Etoilé avec toi, profitez de ce moment ^^ !`;
        } else if (cible) {
            response += `\n\nCe pain est destiné à <@${cible.id}>. Quelle gentillesse! J'en suis presque jaloux...! 🥖`;
        }

        await addBreadToUser(interaction.user, breadDoc.bread_name);

        try {
            await interaction.reply(response);
        } catch (error) {
            console.error("Erreur lors de la commande du pain :", error);
            await interaction.reply({
                content: "Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔",
                ephemeral: true,
            });
        }
    },
};

async function addBreadToUser(user, breadName) {
    try {
        let userDoc = await User.findOne({ user_id: user.id });
        const breadDoc = await Bread.findOne({ bread_name: breadName });
        if (!breadDoc) {
            console.warn(`Pain ${breadName} non trouvé en base.`);
            return;
        }

        if (!userDoc) {
            userDoc = new User({
                user_id: user.id,
                user_name: user.username,
                user_level: 0,
                user_bread_prefered: breadDoc._id,
                user_bread_total: 1,
                user_bread_consumption: [{ bread: breadDoc._id, count: 1 }],
                user_color: "#eec07b"
            });
        } else {
            userDoc.user_bread_total += 1;

            const existing = userDoc.user_bread_consumption.find(c => c.bread.equals(breadDoc._id));
            if (existing) {
                existing.count += 1;
            } else {
                userDoc.user_bread_consumption.push({ bread: breadDoc._id, count: 1 });
            }
        }

        await userDoc.save();
        console.log(breadName + ` ajouté pour l'utilisateur ${user.username} (${user.id})`);
    } catch (err) {
        console.error("Erreur lors de l'ajout du pain à l'utilisateur :", err);
    }
}