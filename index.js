// ======================================
// بوت نقاط فقط (زيادة + خصم + عرض + ترقيات + me)
// ======================================

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");

const fs = require("fs");

// ========== إعدادات ==========
const config = {
  TOKEN: "MTQ3MTkxODMwMTUyMDE5OTcwMA.GLcrDQ.gymgdOTz1brI3271uejvn9o3H4Jz5CAgYduflE",

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
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ========== حفظ البيانات ==========
function saveData() {
  fs.writeFileSync(config.dataFile, JSON.stringify(data, null, 2));
}

// ========== نظام الرتب ==========
const ranks = [
  { id: "1471101769236090971", points: 100 },
  { id: "1471117139497844961", points: 220 },
  { id: "1471117310902272000", points: 350 },
  { id: "1471117521779425428", points: 500 },
  { id: "1471117694303473836", points: 670 },
  { id: "1471118085204214043", points: 800 },
  { id: "1471118302339403858", points: 1000 },
];

// ========== تحديد رتبة الشخص ==========
function getRank(points) {
  let current = "بدون رتبة";

  for (let r of ranks) {
    if (points >= r.points) current = `<@&${r.id}>`;
  }

  return current;
}

// ========== الأوامر ==========
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

  // ===================== !me =====================
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

  // ===================== !ترقيات =====================
  if (content === "!ترقيات") {
    let text = "__النقاط المطلوبه للترقيه__\n\n";

    ranks.forEach((r) => {
      text += `<@&${r.id}> | **${r.points} نقطة**\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("📈 ترقيات الإدارة")
      .setDescription(text)
      .setImage(
        "https://cdn.discordapp.com/attachments/1466707904391549030/1471915849337147552/InShot_20260213_200749380.jpg"
      )
      .setColor(0xffd700);

    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !n (ترتيب) =====================
  if (content === "!n") {
    const sorted = Object.entries(data.users)
      .filter(([id, pts]) => pts > 0)
      .sort((a, b) => b[1] - a[1]);

    let text = "";
    let i = 1;

    for (let [id, pts] of sorted) {
      text += `${i}- <@${id}> | ${pts} نقطة\n`;
      i++;
    }

    const embed = new EmbedBuilder()
      .setTitle("📋 ترتيب النقاط")
      .setDescription(text || "لا يوجد أحد عنده نقاط حالياً")
      .setColor(0x808080);

    return message.channel.send({ embeds: [embed] });
  }

  // ===================== !n @user (+ أو -) =====================
  if (content.startsWith("!n ")) {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن الشخص!");

    const args = content.split(" ");
    const change = args[2]; // +4 أو -3

    let pts = data.users[member.id] || 0;

    // ✅ فقط عرض بدون تعديل
    if (!change) {
      const embed = new EmbedBuilder()
        .setTitle("📌 معلومات العضو")
        .setDescription(`
• الاسم: <@${member.id}>
• النقاط: **${pts}**
• الرتبة: ${getRank(pts)}
`)
        .setColor(0x00ffff);

      return message.channel.send({ embeds: [embed] });
    }

    // ✅ تعديل النقاط
    const num = parseInt(change);

    if (isNaN(num)) {
      return message.reply("❌ لازم تكتب رقم مثل +4 أو -3");
    }

    const oldPts = pts;
    pts += num;

    if (pts < 0) pts = 0;

    data.users[member.id] = pts;
    saveData();

    const embed = new EmbedBuilder()
      .setTitle("✅ تم تحديث النقاط")
      .setDescription(`
• العضو: <@${member.id}>
• النقاط السابقة: **${oldPts}**
• النقاط الجديدة: **${pts}**
• الرتبة الحالية: ${getRank(pts)}
`)
      .setColor(0x00ff00);

    return message.channel.send({ embeds: [embed] });
  }
});

// تشغيل البوت
client.login(config.TOKEN);
