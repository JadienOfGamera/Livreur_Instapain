const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Regarde tout ce que je peux faire :D'),
  async execute(interaction) {

    const commands = interaction.client.commands;

    const helpEmbed = new EmbedBuilder()
      .setColor('#eec07b')
      .setTitle(':french_baguette: Liste des commandes :french_baguette:')
      .setDescription('Voici la liste des commandes disponibles que je peux performer ^^ :');

    commands.forEach(command => {
      helpEmbed.addFields({
        name: `/${command.data.name}`,
        value: command.data.description,
        inline: false,
      });
    });

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};
