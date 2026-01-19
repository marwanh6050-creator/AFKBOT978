const express = require('express');
const mineflayer = require('mineflayer');
const config = require('./settings.json');

const app = express();
app.get('/', (req, res) => res.send('Bot is Alive!'));
app.listen(8080);

function createBot() {
		console.log('🔄 [System] جاري محاولة الدخول...');

		const bot = mineflayer.createBot({
				host: config.server.ip,
				port: config.server.port,
				username: config['bot-account'].username,
				version: config.server.version,
				auth: 'offline'
		});

		let chatInterval;

		bot.once('spawn', () => {
				console.log('✅ [Success] البوت دخل السيرفر وبدأ "النط" و "الكلام"!');

				// 1. يفضل ينط (Anti-AFK)
				bot.setControlState('jump', true);

				// 2. تسجيل الدخول التلقائي
				if (config.utils['auto-auth'].enabled) {
						setTimeout(() => {
								bot.chat(`/login ${config.utils['auto-auth'].password}`);
						}, 3000);
				}

				// 3. يبعت رسالة في الشات كل 3 دقائق عشان يظبط حاله
				chatInterval = setInterval(() => {
						const lines = [
								"NuttellaHUB is here! 🚀",
								"Don't mind me, just jumping around! ⚡",
								"Server is great today! ❤️",
								"I am never AFK! 😂"
						];
						const randomLine = lines[Math.floor(Math.random() * lines.length)];
						bot.chat(randomLine);
				}, 180000); 
		});

		// 4. يرد على الناس لو حد نده عليه
		bot.on('chat', (username, message) => {
				if (username === bot.username) return;
				if (message.toLowerCase().includes('nuttella')) {
						bot.chat(`Yes ${username}, I am jumping and active!`);
				}
		});

		// 5. نظام إعادة الدخول لو السيرفر فصل
		bot.on('end', () => {
				console.log('⚠️ [Warning] البوت خرج، هحاول أرجع كمان 20 ثانية...');
				clearInterval(chatInterval);
				bot.removeAllListeners();
				setTimeout(createBot, 20000);
		});

		bot.on('error', (err) => console.log('❗ [Error] مشكلة: ' + err.message));
}

createBot();
