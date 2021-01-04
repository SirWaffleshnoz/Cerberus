const config = require("../config.json");
const fs = require("fs");

exports.run = (bot, msg) => {
	if (msg.channel.type === "dm" && msg.author.id == bot.user.id)
		console.log("[DM] " + bot.user.username + " -> " + msg.channel.recipient.username + " | " + msg.content)
	else if (msg.channel.type === "dm" && msg.author.id != bot.user.id)
		console.log("[DM] " + msg.channel.recipient.username + " -> " + bot.user.username + " | " + msg.content)

	if (!msg.channel.type === "text" || !msg.guild || msg.author.bot) return;

	bot.processMessage(msg);

	//reply array shenanigans
	const responseObject = {
		
	};
	if (responseObject[msg.content.toLowerCase()]) {
		msg.channel.send(responseObject[msg.content.toLowerCase()]);
	}

	const msg1 = msg.content.toLowerCase();
	//includes
	/**
	if (msg1.includes("test")) {
		msg.channel.send("test")
	}
	*/
}