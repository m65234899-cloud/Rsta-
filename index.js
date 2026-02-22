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
  TextInputStyle
} = require("discord.js");

const fs = require("fs");

/* ================= CONFIG ================= */

const config = {
  TOKEN: process.env.BOT_TOKEN,
  highRole: "1472284690504482896",
  logoRole: "1471161762819604593",
  dataFile: "./data.json"
};

/* ================= DATA ================= */

if (!fs.existsSync(config.dataFile)) {
  fs.writeFileSync(config.dataFile, JSON.stringify({ users: {} }, null, 2));
}

function loadData() {
  return JSON.parse(fs.readFileSync(config.dataFile));
}

function saveData(data) {
  fs.writeFileSync(config.dataFile, JSON.stringify(data, null, 2));
}

/* ================= BOT ================= */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

/* ================= RANK ================= */

const ranks = [
  { id: "1471117310902272000", points: 100 },
  { id: "1471117521779425428", points: 300 },
  { id: "1471117694303473836", points: 500 },
  { id: "1471118085204214043", points: 800 },
  { id: "1471118302339403858", points: 1000 }
];

function getRank(points) {
  let rank = "<@&1471101769236090971>";

  for (let r of ranks) {
    if (points >= r.points) rank = `<@&${r.id}>`;
  }

  return rank;
}

/* ================= READY ================= */

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* ================= MESSAGE SYSTEM ================= */

client.on("messageCreate", async message => {

  if (message.author.bot) return;

  const content = message.content.trim();
  let data = loadData();

/* ---------- !me ---------- */

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

/* ---------- $m ---------- */

  if (content === "$m") {

    const text = `
!me
!مهام
!ترقيات
!n
!n @user +/- رقم
!خط
!استدعاء @user الرسالة
`;

    const embed = new EmbedBuilder()
      .setTitle("🤖 أوامر البوت")
      .setDescription(text)
      .setColor(0x00ffff);

    return message.channel.send({ embeds: [embed] });
  }

/* ---------- ترقيات ---------- */

  if (content === "!ترقيات") {

    let text = "__النقاط المطلوبة__\n\n";

    ranks.forEach(r => {
      text += `<@&${r.id}> | ${r.points} نقطة\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("📈 الترقيات")
      .setDescription(text)
      .setColor(0xffd700);

    return message.channel.send({ embeds: [embed] });
 }
 /* ---------- ! زر الرسالة ---------- */

if (content === "!") {

  if (!message.member.roles.cache.has(config.highRole))
    return message.reply("❌ هذا الأمر للإدارة فقط");

  return message.channel.send({
    content: "📩 اضغط الزر لإرسال رسالة",
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_logo_modal")
          .setLabel("✉️ إرسال رسالة")
          .setStyle(ButtonStyle.Primary)
      )
    ]
  });
}
/* ---------- !قوانين ---------- */

if (content === "!قوانين") {

  const embed = new EmbedBuilder()
    .setTitle("📜 قوانين الإدارة")
    .setDescription(`
1- الإحترام واجب للجميع  
2- يمنع السب أو المزاح الثقيل  
3- يمنع استخدام الصلاحيات خارج العمل الإداري  
4- عدم تكبير المشاكل  
5- يمنع خلق مشاكل داخل الشات  
6- يمنع مجادلة الإداريين  
7- التحذيرات عبر البوت فقط  
8- يمنع مجادلة العليا في القرارات
`)
    .setColor(0x00ffff);

  return message.channel.send({ embeds: [embed] });
}
/* ---------- مهام ---------- */

  if (content === "!مهام") {

    const embed = new EmbedBuilder()
      .setTitle("📋 المهام")
      .setDescription(`
استلام تكت : 3
محاسبة عضو : 2
فعاليه الشات : 3
مساعدة عضو : 1
تأيم أوت : 2
مشاركة لعبة : 1
`)
      .setColor(0x00ffff);

    return message.channel.send({ embeds: [embed] });
  }

/* ---------- استدعاء ---------- */

  if (content.startsWith("!استدعاء")) {

    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن الشخص");

    const text = content.split(" ").slice(2).join(" ");
    if (!text) return message.reply("❌ اكتب رسالة");

    member.send(`📌 استدعاء:\n${text}`).catch(() => {
      message.reply("❌ لا أستطيع الإرسال");
    });

    return message.reply("✅ تم الاستدعاء");
  }

/* ---------- خط ---------- */

  if (content === "!خط") {

    await message.delete().catch(() => {});

    return message.channel.send({
      files: [
        "https://cdn.discordapp.com/attachments/1471151896613097644/1474945852643737682/InShot_20260220_001522642.jpg"
      ]
    });
  }

/* ---------- ترتيب ---------- */

  if (content === "!n") {

    const sorted = Object.entries(data.users || {})
      .filter(([_, pts]) => pts > 0)
      .sort((a, b) => b[1] - a[1]);

    let text = "";
    let i = 1;

    for (let [id, pts] of sorted) {
      text += `${i}- <@${id}> | ${pts} نقطة\n`;
      i++;
    }

    const embed = new EmbedBuilder()
      .setTitle("📊 الترتيب")
      .setDescription(text || "لا يوجد نقاط")
      .setColor(0x808080);

    return message.channel.send({ embeds: [embed] });
  }

/* ---------- تعديل النقاط ---------- */

  if (content.startsWith("!n ")) {

    if (!message.member.roles.cache.has(config.highRole))
      return message.reply("❌ ليس لديك صلاحية");

    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن شخص");

    const args = content.split(" ");
    const num = parseInt(args[2]);

    if (isNaN(num)) return message.reply("❌ رقم فقط");

    if (!data.users[member.id]) data.users[member.id] = 0;

    const old = data.users[member.id];

    data.users[member.id] += num;

    if (data.users[member.id] < 0) data.users[member.id] = 0;

    saveData(data);

    return message.channel.send(
      `✅ تم تحديث النقاط\nالقديم: ${old}\nالجديد: ${data.users[member.id]}`
    );
  }

});

/* ================= LOGIN ================= */

client.login(config.TOKEN);
