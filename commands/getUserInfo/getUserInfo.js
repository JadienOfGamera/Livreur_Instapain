const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

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

    const userBreads = await User.findOne({ user_id: user.id });
    const userData = userBreads[userId];

    if (!userData) {
        userData = new User({
           user_id: cible.id,
           user_name: cible.username,
           user_level: 0,
           user_bread_prefered: '',
           user_bread_total: 1,
           user_bread_consumption: [],
           user_color: "#eec07b"
         });
    }
    
    await userData.save();

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
