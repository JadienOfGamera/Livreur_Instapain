const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPathUser = path.join(__dirname, "../../db/bread_user.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Affiche à quel point un utilisateur est gourmand :D")
    .addUserOption((option) =>
      option
        .setName("cible")
        .setDescription("Cible un utilisateur précis 👀")
        .setRequired(false),
    ),
  async execute(interaction) {
    const cible = interaction.options.getUser("cible");
    const userId = cible ? cible.id : interaction.user.id;

    // Relire le fichier JSON à chaque exécution
    const userBreads = JSON.parse(fs.readFileSync(dbPathUser, "utf-8"));
    const userData = userBreads[userId];

    if (!userData) {
      await interaction.reply({
        content: `Aucune donnée trouvée pour <@${userId}>. Je n'ai pas mémoire que cette personne ait déjà commandé un pain. 🤔`,
        ephemeral: true,
      });
      return;
    }

    const embedColor = userData.color || "#eec07b";
    const totalBreads = userData.totalBreads || 0;

    const breadDetails = Object.entries(userData)
      .filter(([key]) => key !== "totalBreads" && key !== "color")
      .map(([breadName, quantity]) => `${breadName} : ${quantity}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({
        name: cible ? cible.username : interaction.user.username,
        iconURL: cible ? cible.displayAvatarURL() : interaction.user.displayAvatarURL(),
      })
      .setTitle(`Stats :`)
      .setDescription(`Cet utilisateur a commandé **${totalBreads} pain(s)** !`)
      .addFields({
        name: "Détails des pains commandés :",
        value: breadDetails || "Aucun pain commandé pour l'instant. 😔",
      });

    await interaction.reply({ embeds: [embed] });
  },
};
