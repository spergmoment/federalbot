module.exports = (bot, ch) => {
    const logs = ch.guild.channels.find(r => r.name === ("logs"));
    const Discord = require("discord.js");
    const logsEmbed = new Discord.RichEmbed()
        .setDescription("")
        .setTitle("");
    const entry = ch.guild.fetchAuditLogs({ type: 12 }).then(audit => {
        const e = audit.entries.first();
        if (logs) {
            logsEmbed.setTitle("Action: Delete Channel")
                .addField("Channel Name", ch.name)
                .addField("Perpetrator", e.executor.username)
                .addField("IDs", "```Channel ID: " + ch.id + "```");
            logs.send(logsEmbed);
        }
    });
};
