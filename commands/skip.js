
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the song'),
    async execute(interaction, client) {
        await interaction.deferReply();
        let user = interaction.user;
        let guild = interaction.guild;
        let member = await interaction.guild.members.fetch(user).then(member => {
            return member;
        });
        let queue = client.player.getQueue(guild.id);

        if(queue == undefined){
            await interaction.editReply(`Nothing to skip :(`);
            return;
        }

        let skipped = false;
        if(queue.skip() !== undefined){
            skipped = true;
        }
        try {
            if(skipped) {
                await interaction.editReply(`Song skipped!`);
            }else{
                await interaction.editReply(`Nothing to skip :(`);
            }
        }catch (e){
            console.error(e);
        }

    },
};