exports.run = (msg, bot, args) => {
    const Discord = require("discord.js");
     let member = msg.mentions.members.first();
    if(!member) {
        msg.channel.send("Who are you nominating?");
        msg.channel.awaitMessages(m => m.author.id === msg.author.id, {
            max:1,
            time:30000,
            errors:['time']
        }).then(async c => {
            const f = c.first();
            const m = f.mentions.members.first();
            if(m) {
                member = m;
            } else {
                return msg.channel.send("Please mention a valid member.");
            }
        }).catch(() => {
            return msg.channel.send("Time limit reached, try again.");
        });
    }
    var send = (member.displayName + " can not be nominated now. " + member.displayName + " must be impeached from their current position in order to be nominated at this time."); // used to save space
    const nom = new Discord.RichEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL, msg.author.avatarURL) // just embed stuff :)
        .setTimestamp()
        .setColor('RANDOM'); // this will be shwon on all embeds. Sets a random color, the author, and a timestamp
    if (args) {
        let role = undefined; // this is required to prevent scoping issues 
        if (msg.member.roles.find(r => r.name === "Speaker of the House")) { // checks the role
            role = msg.guild.roles.find(r => r.name === "Congress"); // the role to give
        } else if (msg.member.roles.find(r => r.name === "Chief Justice")) {
            role = msg.guild.roles.find(r => r.name === "Judge");
        } else if (msg.member.roles.find(r => r.name === "Chief of Police")) {
            role = msg.guild.roles.find(r => r.name === "Officer");
        }
        if (role) {
            if (member.roles.find(r => r.name === "Judge") || member.roles.find(r => r.name === "Officer") || member.roles.find(r => r.name === "Congress")) { // makes sure they aren't in the gov't already
                msg.channel.send(send);
            } else {
                if (role.name === "Congress") {
                    msg.channel.send("Nominate for House or Senate?"); // Note: you need to have at least 9 house members per senate member
                    msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                            max: 1,
                            time: 30000
                        }) // waits 30 secs for a message...
                        .then(async collected => {
                            if (collected.first()
                                .content.toLowerCase() == 'house') { // ...and if its content is "house"...
                                await member.addRole(msg.guild.roles.find(r => r.name === "House")); // ...give them house!
                            } else if (collected.first()
                                .content.toLowerCase() == 'senate') { // same thing here
                                await member.addRole(msg.guild.roles.find(r => r.name === "Senate")); // ^
                            } else {
                                await msg.channel.send("Please choose either House or Senate.");
                                return;
                            }
                        })
                        .catch(() => {
                            msg.channel.send("No reply after 30 seconds. Please choose either House or Senate.");
                            return;
                        });
                }
                member.addRole(role)
                    .catch(console.error);
                nom.setDescription(msg.member.displayName + ", you have successfully nominated " + member.displayName + " for " + role.name + "!");
                nom.setFooter('Nominated ' + member.displayName + ' for ' + role + ".");
                bot.logEmbed.setTitle("Nominate")
                .addField("User", member.displayName)
                .addField("Perpetrator", msg.member.displayName)
                .addField("Position", role.name);
                bot.logs.send(bot.log);
            }
        } else {
            nom.setDescription("You lack the proper role to use this command.")
                .setFooter("You lack any branch-leading role in the Permissions Object.");
        }
    } else {
        nom.setDescription("Please mention someone to nominate.");
        nom.setFooter('Error in syntax: missing args.');
    }
    msg.channel.send(nom); // putting this out here shortens the code, drastically speeds up performance, and makes sure no scoping issues occur (scoping is retarded btw)
};
