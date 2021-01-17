require('dotenv').config();
const tmi = require('tmi.js');
const databaseFirestore = require("./databaseFirestore")

var docRef = databaseFirestore.db.collection('arcade-game').doc('player-data');

const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ process.env.TWITCH_CHANNELS ]
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `Bienvenue @${tags.username} !`);
  	}
	if(message === "!info"){
		client.say(channel, `Spawn enemies: !spawn`);
	}
	if(message === "!score"){
		client.say(channel, `http://scoring.diginight-esd-esp.com`);
	}
	if(message === "spawn"){
		client.say(channel, `ho waouh`);
		docRef.set({
			usernameTwitch: tags.username,
			spawnEnemies: 10
		}, { merge: true });
	}
});





