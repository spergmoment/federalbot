    exports.run = (msg, bot, args) => {
        const Discord = require("discord.js");
        if (msg.member.roles.find(r => r.name === "Congress")) {
            msg.delete()
                .then(async m => {
                    if (args[0]) {
                        await msg.channel.fetchMessages({
                                limit: args[0],
                            })
                            .then(async msgs => {
                                await msg.channel.bulkDelete(msgs)
                                    .catch(error => console.log(error.stack));
                            });
                        await msg.channel.send("Cleared " + args[0] + " messages.")
                            .then(async m => {
                                setTimeout(async () => {
                                    await m.delete();
                                }, 2500);
                            });
                    } else {
                        await msg.channel.fetchMessages({
                                limit: 20,
                            })
                            .then(async msgs => {
                                await msg.channel.bulkDelete(msgs)
                                    .catch(error => console.log(error.stack));
                            });
                        await msg.channel.send("Cleared 20 messages.")
                            .then(async m => {
                                setTimeout(async () => {
                                    await m.delete();
                                }, 2500);
                            });
                    }
                });
        } else {
            const bruh = new Discord.RichEmbed()
                .setAuthor(msg.author.tag, msg.author.avatarURL, msg.author.avatarURL)
                .setTimestamp()
                .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff)
                    .toString(16)
                    .substr(1, 6));
            bruh.setDescription("You lack permissions to use this command.");
            msg.channel.send(bruh);
        }
    };
