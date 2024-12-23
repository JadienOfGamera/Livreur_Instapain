import bread_db from "../db/bread_db.json" with { type: "json" };
const axios = require('axios');
const { SlashCommandBuilder, resolveGuildTemplateCode } = require('discord.js');

// La collection de PAINs :D
const breads = ['Pain', 'niaP', 'Chasseur', 'Ruche', 'Kyrofortant', 'Gigotant', 'Cosmique'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commande')
        .setDescription('Commande un pain 🥖')
        .addStringOption(option =>
            option
                .setName('pain')
                .setDescription('Commande un pain en particulier')
                .setRequired(false)
                .addChoices(
                    ...breads.map(bread => ({ name: bread, value: bread })) // Liste les pains possibles
                )
        )
        .addUserOption(option =>
            option
                .setName('cible')
                .setDescription('Commande un pain pour quelqu\'un, la chance ! :D')
                .setRequired(false)
        ),
    async execute(interaction) {
        const bread = interaction.options.getString('pain');
        const cible = interaction.options.getUser('cible');

        //Si pas de pain particulier
        const chosenBread = bread || breads[Math.floor(Math.random() * breads.length)];

        let response;
        switch (chosenBread) {
            case 'Pain':
                response = `Parfois, un classico-classique est tout ce qu'il faut ! Un **${chosenBread}** pour vous, simple, mais toujours efficace! 😁`;
                break;
            case 'niaP':
                response = `¡ǝɔɐɔᴉɟɟǝ sɹnoɾnoʇ sᴉɐɯ 'ǝldɯᴉs 'snoʌ ɹnod **${chosenBread}** u∩ ¡ ʇnɐɟ lᴉ,nb ǝɔ ʇnoʇ ʇǝ ǝnbᴉssɐlɔ-oɔᴉssɐlɔ un 'sᴉoɟɹɐԀ..... Oula, j'ai la tête qui tourne moi...!`;
                break;
            case 'Chasseur':
                response = `Je vois que vous avez besoin d'énergie vous... Allez, un petit **${chosenBread}** pour vous ! Ne vous plaignez pas d'avoir faim après 🫡`;
                break;
            case 'Ruche':
                response = `Une **${chosenBread}** pour vous! Sucré et plein de miel, un vrai régal pour les gourmands! Il ne devrait plus avoir d'abeilles, mais au pire, ça ferra des protéines... !\n\n\n(j'plaisante)`;
                break;
            case 'Kyrofortant':
                response = `Oh, un **${chosenBread}**? Aucun soucis ! Vous allez apprécier son confort ^^.\nNe vous endormez pas dessus par contre!`;
                break;
            case 'Gigotant':
                response = `Oh oh... Vous êtes du genre téméraire on dirait... Pas pour me déplaire (:\nLe **${chosenBread}** va vous donner du fil à retordre, mais je sais que vous allez en triompher!`;
                break;
            case 'Cosmique':
                response = `Un **${chosenBread}** pour vous! Appréciez sa construction soignée du plus beau pain de Instapain, prêt à conquérir votre appétit!`;
                break;
            default:
                response = `Que c\'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔`;
                break;
        }

        // Ajout du message pour une cible si précisée
        if (cible.id === '<@Livreur Instapain') {
            response += "EHEHEHEHEH\n";
        }
        else if (cible) {
            response += `\nCe pain est destiné à <@${cible.id}>. Quelle gentillesse! J'en suis presque jaloux...! 🥖`;
        }

        try {
            await interaction.reply(response);
        } catch (error) {
            console.error('Erreur lors de la commande du pain :', error);
            await interaction.reply({
                content: 'Que c\'est étonnant... Je ne connais pas ce pain... Devrais-je en parler à Certos? 🤔',
                ephemeral: true,
            });
        }
    },
};