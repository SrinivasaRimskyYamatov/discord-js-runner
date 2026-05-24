require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.login(TOKEN);

client.once("ready", () => {
  console.log("Bot起動:", client.user.tag);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("!js ")) return;

  const code = message.content.slice(4);

  const result = runJS(code);

  message.reply("```\n" + result + "\n```");
});

function runJS(code) {
  let logs = [];

  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(" "));

  try {
    eval(code);
  } catch (e) {
    logs.push("Error: " + e.message);
  }

  console.log = originalLog;

  return logs.join("\n") || "(no output)";
}