const fs = require("fs");
var channel = null,
	stdin = process.openStdin();

module.exports = (bot) => {
	/**
	 * Core message processing functions
	 */

	bot.permLevel = function (msg) {
		if (msg.author.id == bot.config.owner)
			return 3;
        if (msg.author.id == '392436381806493696') // and mod team jace himself
			return 2;
		else
			return 1;
	}

	bot.processMessage = function (msg) {
		if (channel && msg.channel.id == channel) bot.log(msg.guild.name + " | " + msg.channel.name + " | " + msg.member.displayName + " | " + msg.cleanContent);

		if (msg.author.bot) return;

		if (msg.content.startsWith(bot.config.prefix)) {
			try {
				msg.args = msg.content.split(/\s+/g)
				msg.content = msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.length) || null
				var command = msg.args.shift().slice(bot.config.prefix.length).toLowerCase()
				var cmd = bot.commands.get(command) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
				var perms = bot.permLevel(msg)
				if (!cmd) return;
				else if (perms < cmd.permission) return msg.reply("you do not have permission to do this!")
				else {
					bot.logCommand(command, msg.content, msg.author.username, msg.channel.name, msg.guild.name)
					try {
						cmd.main(bot, msg);
					} catch (err) {
						msg.channel.send("Oh no! We encountered an error:\n```" + err.stack + "```")
					}
				}
			} catch (err) {
				msg.channel.send("Oh no! We encountered an error:\n```" + err.stack + "```");
				bot.error(err.stack);
			}
		}
	}

	/**
	 * Core bot functions
	 */

	bot.awaitConsoleInput = function () {
		stdin.addListener("data", function (d) {
			d = d.toString().trim()
			if (d.startsWith("channels")) {
				bot.channels.forEach(channel => {
					if (channel.type == "text" && channel.permissionsFor(channel.guild.me).has(["READ_MESSAGES", "SEND_MESSAGES"]))
						bot.log(channel.guild.name + " | #" + channel.name + " | (" + channel.id + ")")
				})
			} else if (d.startsWith("bind") && channel) {
				d = d.substring(d.indexOf(" ") + 1, d.length)
				if (bot.channels.get(d)) {
					channel = d;
					bot.log("Console rebound to channel " + bot.channels.get(d).name + " in " + bot.channels.get(d).guild.name + "!");
				}
			} else if (channel) {
				try {
					bot.channels.get(channel).send(d);
				} catch (err) {
					bot.log(err);
				}
			} else {
				if (bot.channels.get(d)) {
					channel = d;
					bot.log("Console bound to channel " + bot.channels.get(d).name + " in " + bot.channels.get(d).guild.name + "!");
				}
			}
		});
	}

	//list
	bot.setupList = function () {
		bot.db = require('./db.json');
		console.log("[LIST] | List database found!")


		writeList();

		setInterval(function () {
			writeList();
		}, 21000);

		function writeList() {
			var listJson = fs.readFileSync("./db.json"),
				listParsed = JSON.parse(listJson)
			if (JSON.stringify(listParsed) == JSON.stringify(bot.db)) return; // Only writes if there's a difference

			fs.writeFileSync("./db.json", JSON.stringify(bot.db, null, 3));
			console.log("[LIST] | List database successfully saved to file!")
			return "List database successfully saved to file!";
		}
		console.log("[LIST] | List database initialized!")

	}

	/**
	 * Logging functions
	 */

	bot.logCommand = function (command, arguments, user, channel, server) {
		bot.log(`\n**Command Executed:** ${command}\n**User:** ${user}\n**Arguments:** ${arguments}\n**Server:** ${server}\n**Channel:**# ${channel}`)
	}

	bot.error = function (err) {
		console.log(this.timestamp() + " [ERROR] | " + err.stack)
	}

	bot.debug = function (txt) {
		console.log(this.timestamp() + " [DEBUG] | " + txt)
	}

	bot.warn = function (txt) {
		console.log(this.timestamp() + " [WARN]  | " + txt)
	}

	bot.log = function (txt) {
		console.log(this.timestamp() + "  [LOG]  | " + txt)
	}

	bot.timestamp = function () {
		var currentTime = new Date(),
			hours = currentTime.getHours(),
			minutes = currentTime.getMinutes(),
			seconds = currentTime.getSeconds()
		if (minutes < 10)
			minutes = "0" + minutes;
		if (seconds < 10)
			seconds = "0" + seconds;
		return '[' + hours + ':' + minutes + ':' + seconds + ']';
	}
}