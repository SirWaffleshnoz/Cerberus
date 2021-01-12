var Discord = require('discord.js');

module.exports = {
    name: 'list',
    permission: 1,
    main: async function(bot, msg) {
        if (msg.member.roles.cache.some(role => role.name === 'Cerberus Access')) {
            var x = msg.content.split(' ').splice(0)[0];
            var log = msg.guild.channels.cache.get(bot.config.logChannel);  //logs the stuff

            //list add <@user>
            if (x != null && x == "add") {
                var target = msg.mentions.users.array()[0];

                if (target != null) {
                    msg.reply("adding user...");
                    if (!bot.db[target.id] && !target.bot) {
                        bot.db[target.id] = {
                            id: target.id,
                            dateAdded: new Date(),
                            reason: null
                        }
                    } else {
                        bot.db[target.id].dateAdded = new Date();
                    }

                    msg.reply("user added! Please enter a reason:").then(() => {
                        const filter = m => msg.author.id === m.author.id;
                    
                        msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                            .then(messages => {
                                msg.channel.send(`You've entered: ${messages.first().content}`);
                                bot.db[target.id].reason = messages.first().content;
                                msg.channel.send(`Reason entered!`);

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
                                log.send(`**${target.username}#${target.discriminator} (${target.id})** was added to the National Security Threat list by ${msg.author.toString()}.`)
                                log.send(ui);
                            })
                            .catch(() => {
                                msg.channel.send('You did not enter any input! Leaving reason blank...');
                                msg.channel.send(`You've entered: ${messages.first().content}`);
                                bot.db[target.id].reason = messages.first().content;
                                msg.channel.send(`Reason entered!`);

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
                                log.send(`**${target.username}#${target.discriminator} (${target.id})** was added to the National Security Threat list by ${msg.author.toString()}.`)
                                log.send(ui);
                            });
                    });
                } else {
                    msg.reply("mention someone! Usage: `c!list add <@user> <reason>`");
                }
            } else if (x != null && x == "delete") {
                var target = msg.mentions.users.array()[0];

                if (target != null) {
                    msg.reply("deleting user...");
                    if (!bot.db[target.id] && !target.bot) {
                        bot.db[target.id] = {
                            id: target.id,
                            dateAdded: null,
                            reason: null
                        }
                    } else {
                        bot.db[target.id].dateAdded = null;
                        bot.db[target.id].reason = null;
                    }

                    msg.reply("user deleted! All done!");
                    log.send(`**${target.username}#${target.discriminator} (${target.id})** was removed from the National Security Threat list by ${msg.author.toString()}.`)
                } else {
                    msg.reply("mention someone! Usage: `c!list delete <@user>`");
                }
            } else if (x != null && x == "view") {
                var target = msg.mentions.users.array()[0];

                if (target != null) {
                    if (bot.db[target.id]) {
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
                    } else {
                        msg.reply("this user is not registered with Cerberus.")
                    }
                } else {
                    msg.reply('mention a user! Usage: `c!list view <@user>`');
                }
            } else {
                msg.reply("something went wrong! Usage: `c!list <add|delete|view> <@user>`")
            }
        } else {
            msg.reply("you do not have permission!");
        }
    }
}