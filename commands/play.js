
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song OwO')
        .addStringOption(option => {
            return option.setName('song')
                .setDescription("Song to play")
                .setRequired(true)
        }),
    async execute(interaction, client) {
        await interaction.deferReply();
        let user = interaction.user;
        let guild = interaction.guild;
        let song = interaction.options.get('song').value;
        let member = await interaction.guild.members.fetch(user).then(member => {
            return member;
        });
        if(song == undefined){
            return;
        }
        let queue = client.player.getQueue(guild.id);
        if(queue == undefined){
            queue = client.player.createQueue(guild.id);
        }
        await queue.join(member.voice.channel);
        let newSong = await queue.play(song).catch(err => {
            console.log(err);
            if(!queue)
                queue.stop();
        });
        try {
            await interaction.editReply(`${queue.nowPlaying.name}\n${queue.nowPlaying.url}`);
        }catch (e){
            console.error(e);
        }

    },
};