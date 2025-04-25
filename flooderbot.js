const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');

const authPath = process.env.AUTH_FILE || './auth_sub.json';
const { state, saveState } = useSingleFileAuthState(authPath);

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: { level: 'silent' },
    browser: ['FloodBot', 'Baileys', '1.0.0']
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    if (text === ".flood") {
      await sock.sendMessage(sender, { text: "Flood dummy response from FloodBot" });
    }
  });
}

startBot();