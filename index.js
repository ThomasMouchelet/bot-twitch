require('dotenv').config();
const tmi = require('tmi.js');
const databaseFirestore = require("./databaseFirestore")
const docRef = databaseFirestore.db.collection('arcade-game').doc('player-data');
const delayTwitch = 2000 // ms
const timerBonus = 10 // ms
var counter = 50;
var niveau = 1
// analytics
var analytics = {totalCountMessages: 0,spawn: 0,rage: 0,berzerk: 0,bonus: 0}
// For timer
var allowCommandes = {
	spawn: {allow: true, time: timerBonus},
	rage: {allow: true, time: timerBonus},
	berzerk: {allow: true, time: timerBonus},
	bonus: {allow: true, time: timerBonus},
}

const Timer = (option) => {
	if(allowCommandes[option].allow == true){
		allowCommandes[option].allow = false
		const interval = setInterval(() => {
			allowCommandes[option].time--
			if(allowCommandes[option].time<=0){
				allowCommandes[option].time=timerBonus
				allowCommandes[option].allow = true
				clearInterval(interval)
			}
		}, 1000);
	}
	else{
		return false;
	}
}

const handlerCounter = (channel, state) => {
	analytics.totalCountMessages++;
	analytics[state]++
	counter--
	if(counter <= 0){
		if(niveau == 1){
			counter = 200
			niveau++
		}else if(niveau == 2){
			counter = 400
			niveau++
		}
		counter = 0
		analytics = {totalCountMessages,spawn,rage,berzerk,bonus,niveau}
	}
	client.say(channel, `SirMad Apparition du boss dans ${counter} messages`);
}

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

	if(message === "!info"){
		client.say(channel, `!spawn : GlitchLit Me faire apparaitre dans le jeu`);
		client.say(channel, `!rage : PowerUpR Activer le mode rage`);
		client.say(channel, `!berzerk : SirSword Activer le mode berzerk`);
		client.say(channel, `!bonus : HolidayPresent Faire apparaitre des pièces`);
		client.say(channel, `!score : GlitchCat Tableau des scores`);
		client.say(channel, `SirMad : Apparition du boss dans ${counter} messages`);
	}

	if(message === "!score"){
		client.say(channel, `http://scoring.diginight-esd-esp.com`);
	}

	if(message === "!rage"){
		if(allowCommandes["rage"].allow==true){
			Timer("rage")
			handlerCounter(channel,"rage")
			setTimeout(() => {
				client.say(channel, `@${tags.username} active le mode rage`);
			}, delayTwitch);
			// docRef.set({
			// 	rage: true
			// }, { merge: true });
		}else{
			client.say(channel, `Encore ${allowCommandes.rage.time}s pour le mode rage`);
		}
	}

	if(message === "!spawn"){
		if(allowCommandes["spawn"].allow==true){
			Timer("spawn")
			handlerCounter(channel,"spawn")
			setTimeout(() => {
				client.say(channel, `@${tags.username} est apparu dans le jeu`);
			}, delayTwitch);
			// docRef.set({
			// 	usernameTwitch: tags.username,
			// 	spawnEnemies: 10
			// }, { merge: true });
		}else{
			client.say(channel, `Encore ${allowCommandes.spawn.time}s pour apparaitre`);
		}
	}
	
	if(message === "!berzerk"){
		if(allowCommandes["berzerk"].allow==true){
			Timer("berzerk")
			handlerCounter(channel,"berzerk")
			setTimeout(() => {
				client.say(channel, `@${tags.username} active le mode berzerk`);
			}, delayTwitch);
			// docRef.set({
			// 	berzerk: true
			// }, { merge: true });
		}else{
			client.say(channel, `Encore ${allowCommandes.berzerk.time}s pour réactiver le berzerk`);
		}
	}

	if(message === "!bonus"){
		if(allowCommandes["bonus"].allow==true){
			Timer("bonus")
			handlerCounter(channel, "bonus")
			setTimeout(() => {
				client.say(channel, `@${tags.username} active les bonus`);
			}, delayTwitch);
			// docRef.set({
			// 	bonus: true
			// }, { merge: true });
		}else{
			client.say(channel, `Encore ${allowCommandes.bonus.time}s pour un nouveau bonus`);
		}
	}
});





