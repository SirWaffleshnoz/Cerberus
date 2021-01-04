const Discord = require('discord.js');
const bot = new Discord.Client(require("./config.json").opts);
require('./funcs.js')(bot);
const readdir = require("fs").readdir;

bot.commands = new Discord.Collection();

readdir('./commands/', (err, files) => {
	bot.log(`Loading ${files.length} command modules!`);
	files.forEach(f => {
		try {
			var name = require(`./commands/${f}`).name
			bot.commands.set(name, require(`./commands/${f}`));
		} catch (e) {
			bot.log(`Unable to load command ${f}: ${e}`);
		}
	});
	bot.log(`Command modules loaded!`);
});

readdir('./embeds/', (err, files) => {
	bot.log(`Loading ${files.length} embed modules!`);
	files.forEach(fembeds => {
		try {
			var name = require(`./embeds/${fembeds}`).name
			bot.commands.set(name, require(`./embeds/${fembeds}`));
		} catch (eembeds) {
			bot.log(`Unable to load command ${fembeds}: ${eembeds}`);
		}
	});
	bot.log(`embed modules loaded!`);
});

readdir('./events/', (err, files) => {
	bot.log(`Loading ${files.length} events!`);
	files.forEach(file => {
		bot.on(file.split(".")[0], (...args) => {
			require(`./events/${file}`).run(bot, ...args);
		});
	});
	bot.log(`Events loaded!`);
});

var restart;
bot.on('ready', () => {
	restart = bot.channels.cache.get('783433241825902702'); // Channel to send notification
});

const TARGET_HOUR_R = 4;
const TARGET_MINUTE_R = 30;

setInterval(function () {
	var d2 = new Date();
	if (d2.getMinutes() !== TARGET_MINUTE_R || d2.getHours() !== TARGET_HOUR_R) return; // Return if current minute is not the notify minute
	setTimeout(function () {
		process.exit();
	}, 1000);
	restart.send("[AUTO RESTART] | DNC Bot successfully restarted!")
}, 60 * 1000); // Check every minute

bot.login(require("./config.json").token);