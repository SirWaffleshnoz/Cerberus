var Discord = require('discord.js');

module.exports = {
    name: "setreason",
    permission: 1,
    main: async function(bot, msg) {
        if (msg.member.roles.cache.some(role => role.name === 'Cerberus Access')) {
            var target = msg.mentions.users.array()[0];
            var log = msg.guild.channels.cache.get(bot.config.logChannel);  //logs the stuff

            if (target != null) {
                if (bot.db[target.id]) {
                    var reason = msg.content.split(' ').splice(1).join(' ');
                    if (reason) {
                        msg.reply("setting reason...");
                        bot.db[target.id].reason = reason;
                        msg.reply("set reason!");

                        if (bot.db[target.id].reason == null) {
                            var reason = 'No reason listed.';
                        } else {
                            var reason = bot.db[target.id].reason;
                        }

                        if (bot.db[target.id].dateAdded == null) {
                            var dateAdded = "This user is not on the National Security Threat list, but has been registered in the past."
                        } else {
                            var dateAdded = bot.db[target.id].dateAdded.toString();
                        }
                        var ui = new Discord.MessageEmbed()
                            .setColor(800000)
                            .setTitle('Cerberus Warning System')
                            .addField('User Info:', `${target.username}#${target.discriminator} (${target.id})`)
                            .addField('Date Added:', dateAdded)
                            .addField('Reason:', reason)
                            .setFooter(msg.guild.name, msg.guild.iconURL());
                        msg.channel.send(ui);
                        log.send(`**${target.username}#${target.discriminator} (${target.id})** had their National Security Threat list reason edited by ${msg.author.toString()}.`)
                        log.send(ui);
                    } else if (!reason) {
                        msg.reply("clearing reason...");
                        bot.db[target.id].reason = null;
                        msg.reply("cleared reason!");
                        log.send(`**${target.username}#${target.discriminator} (${target.id})** had their National Security Threat list reason cleared by ${msg.author.toString()}.`)
                        log.send(ui);
                    }
                } else {
                    msg.reply("this user is not in the database! You can add them with the command `c!list add <@user>`");
                }
            } else {
                msg.reply("mention somebody! Usage: `c!setreason <@user> <reason>`");
            }
        }
    }
}