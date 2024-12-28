const axios = require("axios");
const { SlashCommandBuilder } = require("discord.js");

const fs = require("fs");
const path = require("path");

const dbPathBread = path.join(__dirname, "../../db/bread_db.json");
const dbPathUser = path.join(__dirname, "../../db/bread_user.json");

// La collection de PAINs :D
const breadData = JSON.parse(fs.readFileSync(dbPathBread, "utf8"));
const breads = Object.keys(breadData);

// La collection de USERs :D
const userBreads = JSON.parse(fs.readFileSync(dbPathUser, "utf-8"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commande")
        .setDescription("Commande un pain 🥖")
        .addStringOption((option) =>
            option
                .setName("pain")
                .setDescription("Commande un pain en particulier")
                .setRequired(false)
                .addChoices(
                    ...breads.map((bread) => ({
                        name: breadData[bread].bread_name,
                        value: breadData[bread].bread_name,
                    })), // Liste les pains possibles
                ),
        )
        .addUserOption((option) =>
            option
                .setName("cible")
                .setDescription(
                    "Commande un pain pour quelqu'un, la chance ! :D",
                )
                .setRequired(false),
        ),
    async execute(interaction) {
        const bread = interaction.options.getString("pain");
        const cible = interaction.options.getUser("cible");

        // Si pas de pain particulier, sélectionne un pain au hasard
        const chosenBread = bread || breads[Math.floor(Math.random() * breads.length)];

        const breadInfo = breadData[chosenBread];
        if (!breadInfo) {
            await interaction.reply({
                content: `Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔`,
                ephemeral: true,
            });
            return;
        }

        let response = breadInfo.commande;

        // Ajout du message pour une cible si précisée
        if (cible?.id === "1319003825331376268") {
            response += "\nAttends un peu... Mais... C'est pour moi...? 😳 Je... Je n'ai pas les mots... Merci... ❤\n";
        } else if (cible) {
            response += `\n\nCe pain est destiné à <@${cible.id}>. Quelle gentillesse! J'en suis presque jaloux...! 🥖`;
        }

        // Ajout du pain à l'utilisateur
        addBreadToUser(interaction?.user?.id || interaction.client.user.id, chosenBread);

        try {
            await interaction.reply(response);
        } catch (error) {
            console.error("Erreur lors de la commande du pain :", error);
            await interaction.reply({
                content:
                    "Que c'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔",
                ephemeral: true,
            });
        }
    },
};

function addBreadToUser(userId, breadName) {
    if (!userId) {
        console.error("Impossible d'ajouter le pain : userId est vide.");
        return;
    }

    // Ajoute l'utilisateur si celui-ci n'existe pas
    if (!userBreads[userId]) {
        userBreads[userId] = { totalBreads: 0 };
    }

    userBreads[userId][breadName] = (userBreads[userId][breadName] || 0) + 1;
    userBreads[userId].totalBreads += 1;

    /*console.log(
        `Total des pains pour l'utilisateur ${userId}: ${userBreads[userId].totalBreads}`
    );
    console.log(
        `Nombre de ${breadName} commandé: ${userBreads[userId][breadName]}`
    );*/
    
    fs.writeFileSync(dbPathUser, JSON.stringify(userBreads, null, 2));
}
