module.exports = {
    name: 'help',
    permission: 1,
    main: function(bot, msg) {
        msg.reply("this bot is still a WIP, so I only have a temporary help page for you, sorry!\nGithub: https://github.com/SirWaffleshnoz/Cerberus");
        msg.channel.send("**c!list add <@user>**: Adds a user to the database.\n**c!list delete <@user>**: Removes a user from the NST list, but keeps them on the database.\n**c!list view <@user>**: Views a user's information that's in the database.\n**c!setreason <@user> <reason>**: Sets the reason as to why the user is on the NST.\n**c!setreason <@user>**: Clears a user's database 'reason'.")
    }
}