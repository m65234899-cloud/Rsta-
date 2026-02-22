// ======================================
// بوت نقاط فقط (زيادة + خصم + عرض + ترقيات + me + ارسال رسائل للمصممين)
// ======================================

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
} = require("discord.js");

const fs = require("fs");

// ========== إعدادات ==========
const config = {
  TOKEN: process.env.BOT_TOKEN,
  highRole: "1472284690504482896",
  logoRole: "1471161762819604593",
  dataFile: "./data.json",
};

// ========== إنشاء ملف البيانات ==========
if (!fs.existsSync(config.dataFile)) {
  fs.writeFileSync(config.dataFile, JSON.stringify({ users: {} }, null, 2));
}

let data = require("./data.json");

// ========== إنشاء البوت ==========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel],
});

// ========== حفظ البيانات ==========
function saveData() {
  fs.writeFileSync(config.dataFile, JSON.stringify(data, null, 2));
}

// ========== نظام الرتب ==========
const ranks = [
  { id: "1471117310902272000", points: 100 },
  { id: "1471117521779425428", points: 300 },
  { id: "1471117694303473836", points: 500 },
  { id: "1471118085204214043", points: 800 },
  { id: "1471118302339403858", points: 1000 },
];

function getRank(points) {
  let current = "<@&1471101769236090971>";
  for (let r of ranks) {
    if (points >= r.points) current = `<@&${r.id}>`;
  }
  return current;
}

// ========== ready ==========
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ========== message commands ==========
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

  // ---------- !me ----------
  if (content === "!me") {
    const pts = data.users[message.author.id] || 0;

    const embed = new EmbedBuilder()
      .setTitle("📌 معلوماتك")
      .setDescription(`
• الاسم: <@${message.author.id}>
• النقاط: **${pts}**
• الرتبة: ${getRank(pts)}
`)
      .setColor(0x00ffff);

    return message.channel.send({ embeds: [embed] });
  }

  // ---------- $m ----------
  if (content === "$m") {
    const text = `
*** 📜 أوامر البوت ***

!me
!مهام
!ترقيات
!n
!n @user +/- رقم
!خط
!استدعاء @user الرسالة
`;

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🤖 أوامر البوت")
          .setDescription(text)
          .setColor(0x00ffff)
      ]
    });
  }

  // ---------- !خط ----------
  if (content === "!خط") {
    try {
      await message.delete().catch(() => {});

      return message.channel.send({
        files: [
          "https://cdn.discordapp.com/attachments/1471151896613097644/1474945852643737682/InShot_20260220_001522642.jpg"
        ]
      });

    } catch {}
  }

  // ---------- !استدعاء ----------
  if (content.startsWith("!استدعاء")) {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ لازم تمنشن الشخص!");

    const text = content.split(" ").slice(2).join(" ");
    if (!text) return message.reply("❌ اكتب رسالة الاستدعاء!");

    await member.send(`📌 لديك استدعاء:\n\n${text}`)
      .catch(() => message.reply("❌ لا أستطيع إرسال الرسالة للخاص"));

    return message.reply("✅ تم الاستدعاء عبر الخاص");
  }

  // ---------- !مهام ----------
  if (content === "!مهام") {
    let text = "*** Management tasks 📌 ***\n\n";

    text += "استلام تكت : **3**\n";
    text += "محاسبة عضو : **2**\n";
    text += "فعاليه في الشات : **3**\n";
    text += "مساعدة عضو : **1**\n";
    text += "تأيم أوت لمخالف : **2**\n";
    text += "مشاركة في لعبه في الشات : **1**\n";

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("📋 المهام الإدارية")
          .setDescription(text)
          .setColor(0x00ffff)
          .setImage("https://cdn.discordapp.com/attachments/1466707904391549030/1471915849337147552/InShot_20260213_200749380.jpg")
      ]
    });
  }

  // ---------- !n ----------
  if (content.startsWith("!n ")) {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن الشخص!");

    const change = content.split(" ")[2];
    let pts = data.users[member.id] || 0;

    if (!change) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("📌 معلومات العضو")
            .setDescription(`
• الاسم: <@${member.id}>
• النقاط: **${pts}**
• الرتبة: ${getRank(pts)}
`)
            .setColor(0x00ffff)
        ]
      });
    }

    const num = parseInt(change);
    if (isNaN(num)) return message.reply("❌ لازم رقم");

    pts += num;
    if (pts < 0) pts = 0;

    data.users[member.id] = pts;
    saveData();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ تم تحديث النقاط")
          .setDescription(`
• العضو: <@${member.id}>
• النقاط الجديدة: **${pts}**
• الرتبة: ${getRank(pts)}
`)
          .setColor(0x00ff00)
      ]
    });
  }

});

// ========== interactions ==========
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton() && interaction.type !== InteractionType.ModalSubmit) return;

});

// تشغيل البوت
client.login(config.TOKEN);
