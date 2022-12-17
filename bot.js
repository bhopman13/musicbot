const { Client, Events } = require('discord.js');
const play = require('./commands/play.js')
const skip = require('./commands/skip.js')
const stop = require('./commands/stop.js')

let token = 'MTA1MzczNjMwMjYyNzAwMDQzMQ.Gws4y_.vVq1ITQGw4PiBKhJIg9B2PTRWf_1AjPDOiWgLg';
let clientId = '1053736302627000431';
let guildId = '1025362807232942080';

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

const client = new Client({
    //intents: [GatewayIntentBits.GUILD_MESSAGES, GatewayIntentBits.GUILD_MESSAGES, GatewayIntentBits.GUILD_VOICE_STATES]

    intents: [32767]
});
const settings = {
    prefix: '!',
    token: 'MTA1MzczNjMwMjYyNzAwMDQzMQ.Gws4y_.vVq1ITQGw4PiBKhJIg9B2PTRWf_1AjPDOiWgLg'
};

const { Player, RepeatMode} = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false,
});
client.player = player;
client.on("ready", () => {
    console.log("Loaded OwO");
});

client.on("command", (a) => {
    console.log(a)
})

client.login(settings.token);
client.guilds.fetch();
client.on(Events.InteractionCreate, interaction => {
    if(interaction.commandName == 'play'){
        play.execute(interaction, client).then(r => {
            console.log(r);
        });
    }
    if(interaction.commandName == 'skip'){
        skip.execute(interaction, client).then(r => {
            console.log(r);
        });
    }
    if(interaction.commandName == 'stop'){
        stop.execute(interaction, client).then(r => {
            console.log(r);
        });
    }
});

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);
    //console.log(message);
    if(command === 'play') {

    }

    if(command === 'playlist') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'skip') {
        guildQueue.skip();
    }

    if(command === 'stop') {
        guildQueue.stop();
    }

    if(command === 'removeLoop') {
        guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
    }

    if(command === 'toggleLoop') {
        guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
    }

    if(command === 'toggleQueueLoop') {
        guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
    }

    if(command === 'setVolume') {
        guildQueue.setVolume(parseInt(args[0]));
    }

    if(command === 'seek') {
        guildQueue.seek(parseInt(args[0]) * 1000);
    }

    if(command === 'clearQueue') {
        guildQueue.clearQueue();
    }

    if(command === 'shuffle') {
        guildQueue.shuffle();
    }

    if(command === 'getQueue') {
        console.log(guildQueue);
    }

    if(command === 'getVolume') {
        console.log(guildQueue.volume)
    }

    if(command === 'nowPlaying') {
        console.log(`Now playing: ${guildQueue.nowPlaying}`);
    }

    if(command === 'pause') {
        guildQueue.setPaused(true);
    }

    if(command === 'resume') {
        guildQueue.setPaused(false);
    }

    if(command === 'remove') {
        guildQueue.remove(parseInt(args[0]));
    }

    if(command === 'createProgressBar') {
        const ProgressBar = guildQueue.createProgressBar();

        // [======>              ][00:35/2:20]
        console.log(ProgressBar.prettier);
    }
})