const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPathUser = path.join(__dirname, "../../db/bread_user.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modifcouleur")
    .setDescription("Personnalise-toi un peu en choisissant ta couleur !")
    .addStringOption((option) =>
      option
        .setName("couleur")
        .setDescription("Couleur en hexa")
        .setRequired(true)
    ),
  async execute(interaction) {
    const color = interaction.options.getString("couleur");
    const userId = interaction.user.id;

    let userBreads;
    try {
      userBreads = JSON.parse(fs.readFileSync(dbPathUser, "utf-8"));
    } catch (err) {
      console.error("Erreur de lecture du fichier : ", err);
      return interaction.reply({
        content: "Une erreur est survenue lors de la lecture des données. Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    }

    const userData = userBreads[userId];

    if (!userData) {
      await interaction.reply({
        content: `Aucune donnée trouvée pour <@${userId}>. Je n'ai pas mémoire que cette personne ait déjà commandé un pain. 🤔`,
        ephemeral: true,
      });
      return;
    }

    let updatedColor = color;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      console.log("Format correct et contient '#'. " + color);
    } else if (/^[0-9A-Fa-f]{6}$/.test(color)) {
      //console.log("Format correct, mais il manque le '#'.");
      updatedColor = "#" + color;
    } else {
      //console.log("Le format est incorrect.");
      return interaction.reply({
        content: `Commande refusée :/. ${color} n'est pas une valeur en hexadécimale.`,
        ephemeral: true,
      });
    }

    userBreads[userId].color = updatedColor;

    try {
      fs.writeFileSync(dbPathUser, JSON.stringify(userBreads, null, 2));
      console.log("Couleur mise à jour avec succès pour l'utilisateur ", userId);
    } catch (err) {
      console.error("Erreur lors de l'écriture du fichier : ", err);
      return interaction.reply({
        content: "Une erreur est survenue lors de la mise à jour de votre couleur. Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Commande acceptée ^^. Votre nouvelle couleur est maintenant : ${updatedColor}`,
      ephemeral: true,
    });
  },
};
