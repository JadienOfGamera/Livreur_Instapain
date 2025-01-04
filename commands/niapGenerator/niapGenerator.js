const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('niap')
    .setDescription('Oh, vous, vous avez conssomez un niap !')
    .addStringOption(option => 
      option.setName('texte')
        .setDescription('Texte à inverser')
        .setRequired(true)),
    
  async execute(interaction) {
    const originalText = interaction.options.getString('texte');
    const reversedText = reverseStringWithSpecialChars(originalText);
    
    return interaction.reply({
      content: `${interaction.user.username} : ${reversedText}`,
      ephemeral: false,
    });
  },
};

function reverseStringWithSpecialChars(str) {
  const reversed = str.split('').reverse().join('');
  
  const specialCharsMap = {
    'a': 'ɒ', 'b': 'ƃ', 'c': 'ɔ', 'd': 'p', 'e': 'ɘ', 'f': 'ɟ',
    'g': 'ƃ', 'h': 'ɥ', 'i': 'ɘ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'ʎ',
    'm': 'ɯ', 'n': 'ɯ', 'o': 'ɘ', 'p': 'd', 'q': 'ɹ', 'r': 'ɹ',
    's': 's', 't': 'ʇ', 'u': 'ʌ', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
    'y': 'ʎ', 'z': 'z',
    'A': 'ɒ', 'B': 'ƃ', 'C': 'ɔ', 'D': 'p', 'E': 'ɘ', 'F': 'ɟ',
    'G': 'ƃ', 'H': 'ɥ', 'I': 'ɘ', 'J': 'ɾ', 'K': 'ʞ', 'L': 'ʎ',
    'M': 'ɯ', 'N': 'ɯ', 'O': 'ɘ', 'P': 'd', 'Q': 'ɹ', 'R': 'ɹ',
    'S': 's', 'T': 'ʇ', 'U': 'ʌ', 'V': 'ʌ', 'W': 'ʍ', 'X': 'x',
    'Y': 'ʎ', 'Z': 'z',
  };
  
  let result = '';
  for (let char of reversed) {
    result += specialCharsMap[char] || char;
  }
  return result;
}