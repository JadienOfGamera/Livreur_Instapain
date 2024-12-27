const axios = require("axios");
const { SlashCommandBuilder } = require("discord.js");

const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/bread_db.json");

// La collection de PAINs :D
const breadData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
const breads = Object.keys(breadData);

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

        //Si pas de pain particulier
        const chosenBread =
            bread || breads[Math.floor(Math.random() * breads.length)];
        
        let response;
        switch (chosenBread) {
            case "Pain":
                response = breadData[chosenBread].commande;
                break;
            case "niaP":
                response = breadData[chosenBread].commande;
                break;
            case "Chasseur":
                response = breadData[chosenBread].commande;
                break;
            case "Ruche":
                response = breadData[chosenBread].commande;
                break;
            case "Kyrofortant":
                response = breadData[chosenBread].commande;
                break;
            case "Gigotant":
                response = breadData[chosenBread].commande;
                break;
            case "Cosmique":
                response = breadData[chosenBread].commande;
                break;
            default:
                response = `Que c\'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔`;
                break;
        }
        
        // Ajout du message pour une cible si précisée
        if (
            cible &&
            typeof cible.id !== "undefined" &&
            cible.id === "1319003825331376268"
        ) {
            response += "\nAttends un peu... Mais... C'est pour moi...? 😳 Je... Je n'ai pas les mots... Merci... ❤\n";
        } else if (cible) {
            response += `\n\nCe pain est destiné à <@${cible.id}>. Quelle gentillesse! J'en suis presque jaloux...! 🥖`;
        }

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
