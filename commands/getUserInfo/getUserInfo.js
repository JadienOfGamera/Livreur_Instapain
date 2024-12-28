const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPathUser = path.join(__dirname, "../../db/bread_user.json");

// La collection de USERs :D
const userBreads = JSON.parse(fs.readFileSync(dbPathUser, "utf-8"));

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

    const userData = userBreads[userId];
    
    if (!userData) {
      await interaction.reply({
        content: `Aucune donnée trouvée pour <@${userId}>. Je n'ai pas mémoire de lui avoir livré du pain. 🤔`,
        ephemeral: true,
      });
      return;
    }

    // Récupère le total des pains commandés
    const totalBreads = userData.totalBreads || 0;
    const name = cible ? cible.username : interaction.user.username

    // Construction de l'embed
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Stats de PAINS 🥖`)
      .setAuthor({
        name: cible ? cible.username : interaction.user.username,
        iconURL: cible ? cible.displayAvatarURL() : interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `Récapitulatif des pains commandés ^^ :\n` +
          `**Total de pains commandés : ${totalBreads}**\n`
      )
      //.setThumbnail("https://cdn-icons-png.flaticon.com/512/3075/3075977.png") // Icône de pain (facultatif)

    for (const breadName in userData) {
      if (breadName !== "totalBreads") {
        embed.addFields({
          name: breadName,
          value: `${userData[breadName]} commande(s)`,
          inline: true,
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  },
};
