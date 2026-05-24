require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// --------------------
// Webサーバー（Render対策）
// --------------------
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Web server running on port", PORT);
});

// --------------------
// Discord Bot
// --------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once("ready", () => {
  console.log("Bot起動:", client.user.tag);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("!js ")) return;

  const code = message.content.slice(4);

  let logs = [];
  const originalLog = console.log;

  console.log = (...args) => logs.push(args.join(" "));

  try {
    eval(code);
  } catch (e) {
    logs.push("Error: " + e.message);
  }

  console.log = originalLog;

  message.reply("```\n" + (logs.join("\n") || "(no output)") + "\n```");
});

client.login(TOKEN);