const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setuprp')
        .setDescription('Créer les messages et réactions pour attribuer des rôles avec des limites.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option => 
            option.setName('max_serv')
                .setDescription('Nombre maximum de rôles Serveur.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('max_client')
                .setDescription('Nombre maximum de rôles Client.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('max_salon_1')
                .setDescription('Nombre maximum de rôles Role_Salon_1.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('max_salon_2')
                .setDescription('Nombre maximum de rôles Role_Salon_2.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('max_salon_3')
                .setDescription('Nombre maximum de rôles Role_Salon_3.')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n’avez pas la permission d’exécuter cette commande.',
                ephemeral: true,
            });
        }

        const maxServ = interaction.options.getInteger('max_serv');
        const maxClient = interaction.options.getInteger('max_client');
        const maxSalon1 = interaction.options.getInteger('max_salon_1');
        const maxSalon2 = interaction.options.getInteger('max_salon_2');
        const maxSalon3 = interaction.options.getInteger('max_salon_3');

        const limits = {
            '🟢': { roleName: 'Serveur', max: maxServ },
            '🔵': { roleName: 'Client', max: maxClient },
            '⚪': { roleName: 'Role_Salon_1', max: maxSalon1 },
            '🟡': { roleName: 'Role_Salon_2', max: maxSalon2 },
            '🔴': { roleName: 'Role_Salon_3', max: maxSalon3 },
        };

        const firstEmbed = new EmbedBuilder()
            .setColor('#4b70ad')
            .setTitle('Choix des rôles Serveur/Client')
            .setDescription(`
                🟢 : Rôle **Serveur** (limite : ${maxServ})
                🔵 : Rôle **Client** (limite : ${maxClient})
            `);

        const secondEmbed = new EmbedBuilder()
            .setColor('#1e8f56')
            .setTitle('Choix des salons')
            .setDescription(`
                ⚪ : Rôle **Role_Salon_1** (limite : ${maxSalon1})
                🟡 : Rôle **Role_Salon_2** (limite : ${maxSalon2})
                🔴 : Rôle **Role_Salon_3** (limite : ${maxSalon3})
            `);

        const firstMessage = await interaction.channel.send({ embeds: [firstEmbed] });
        await firstMessage.react('🟢');
        await firstMessage.react('🔵');

        const secondMessage = await interaction.channel.send({ embeds: [secondEmbed] });
        await secondMessage.react('⚪');
        await secondMessage.react('🟡');
        await secondMessage.react('🔴');

        interaction.reply({ content: 'Messages et réactions configurés.', ephemeral: true });

        const addRoleToUser = async (reaction, user, add = true) => {
            const guild = reaction.message.guild;
            const member = guild.members.cache.get(user.id);
            const roleData = limits[reaction.emoji.name];
            if (!roleData) return;

            console.log(`Tentative de recherche du rôle: ${roleData.roleName}`);  // Log pour vérifier le nom du rôle

            const role = guild.roles.cache.find(r => r.name === roleData.roleName);
            if (!role) {
                console.error(`Rôle "${roleData.roleName}" introuvable.`);
                return;
            }

            const roleCount = role.members.size;
            if (add) {
                if (roleCount >= roleData.max) {
                    await reaction.users.remove(user);
                    await user.send(`Le rôle **${roleData.roleName}** est plein (${roleData.max} maximum).`);
                    return;
                }
                await member.roles.add(role);
            } else {
                await member.roles.remove(role);
            }
        };

        const reactionHandler = async (reaction, user, add) => {
            if (user.bot) return;
            const validMessages = [firstMessage.id, secondMessage.id];
            if (!validMessages.includes(reaction.message.id)) return;

            await addRoleToUser(reaction, user, add);
        };

        interaction.client.on('messageReactionAdd', (reaction, user) =>
            reactionHandler(reaction, user, true));
        interaction.client.on('messageReactionRemove', (reaction, user) =>
            reactionHandler(reaction, user, false));
    },
};
