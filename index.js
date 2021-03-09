const discord = require('discord.js'); //npm i discord.js
const client = new discord.Client();

client.on('ready', () => {
    console.log('ready');

    client.api.applications(client.user.id).guilds('server_id').commands.post({ // your server id
        data: {
            name: "hello",
            description: "Replies with Hello World!"
        }
    });

    client.api.applications(client.user.id).guilds('server_id').commands.post({
        data: {
            name: "ping",
            description: "Replies with the bots ping"
        }
    });

    client.api.applications(client.user.id).guilds('806140843621613599').commands.post({
        data: {
            name: "echo",
            description: "Echos your text as an embed!",

            options: [
                {
                    name: "content",
                    description: "Content of the embed",
                    type: 3,
                    required: true
                }
            ]
        }
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if(command == 'hello') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello World!"
                    }
                }
            });
        }

        if(command == "echo") {
            const description = args.find(arg => arg.name.toLowerCase() == "content").value;
            const embed = new discord.MessageEmbed()
                .setTitle("Echo!")
                .setDescription(description)
                .setAuthor(interaction.member.user.username);

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed)
                }
            });
        }

        if(command == 'ping') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `My ping is ${client.ws.ping}ms`
                    }
                }
            });
        }
    });
});

async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
    
    return { ...apiMessage.data, files: apiMessage.files };
}

client.login(require('./config.json').token);
