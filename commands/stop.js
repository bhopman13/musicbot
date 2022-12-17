
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stops the playlist'),
    async execute(interaction, client) {
        await interaction.deferReply();
        let user = interaction.user;
        let guild = interaction.guild;
        let member = await interaction.guild.members.fetch(user).then(member => {
            return member;
        });
        let queue = client.player.getQueue(guild.id);

        if(queue == undefined){
            await interaction.editReply(`nothign to stop!`);
        }
        //let queue = client.player.createQueue(guild.id);
        queue.stop();
        try {
            await interaction.editReply(`stopped!`);
        }catch (e){
            console.error(e);
        }

    },
};