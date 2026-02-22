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

  let text = "__النقاط المطلوبه للترقيه__\n\n";

  ranks.forEach((r) => {
    text += `<@&${r.id}> | **${r.points} نقطة**\n`;
  });

  const embed = new EmbedBuilder()
    .setTitle("📈 ترقيات الإدارة")
    .setDescription(text)
    .setColor(0xffd700);

  // محاولة إرسال الصورة مع التأكد
  try {
    embed.setImage(
      "https://cdn.discordapp.com/attachments/1471928643545469010/1474966840517071102/InShot_20260222_044502162.jpg?ex=699bc56a&is=699a73ea&hm=915b0b91e0de0875a9bc984f4be8f6a2d424df8d359468eb251d0822a9043752&"
    );
  } catch {}

  return message.channel.send({ embeds: [embed] });
}
 /* ---------- ! زر الرسالة ---------- */
if (content.startsWith("$s ")) {

  if (!message.member.roles.cache.has(config.highRole))
    return;

  const text = content.slice(3).trim();
  if (!text) return message.reply("❌ اكتب الرسالة!");

  const role = message.guild.roles.cache.get("1471161762819604593");
  if (!role) return message.reply("❌ الرتبة غير موجودة");

  try {

    role.members.forEach(member => {

      member.send(
        `<@${member.id}>\n\n${text}`
      ).catch(() => {});

    });

    return message.channel.send("✅ تم إرسال الرسالة للرتبة");

  } catch (err) {
    console.log(err);
  }
}
/* ---------- !قوانين ---------- */

if (content === "!قوانين") {

  const embed = new EmbedBuilder()
    .setTitle("📜 قوانين الإدارة")
    .setDescription(`
\`\`\`قوانين الإدارة\`\`\`

- **1** __ الإحترام أولاً وآخراً وقبل كل شيء سواء للاعضاء او للادارة او العليا__

- **2** __ يمنع السب او المزح الثقيل بالشات حتى لو شخص تمون عليه .__

- ** 3 ** __ يمنع إستخدامك لصلاحياتك من قبل الإدارة في نطاق خارج الإدارة تحاسب عليه حتى لو مزح __

- **4** __عدم  تكبير المواضيع في الشات بين اثنين يمزحون مزح خفيف __
-# طالما مافي اي الفاظ 

- **5** __يمنع الدق بالكلام على اعضاء او خلق مشاكل __

- **6** __ عدم مجادلة اداري منعًا باتًا حتى وان كان غلطان واذا هنالك مشكلة عليك فتح تكت عليا__

- **7** __ ممنوع التحذير بالشات منعًا باتًا تجنبًا للمجادلة واكتفوا بتحذيرات البوت وفي حال تكلم بالشات عن التحذير اطلبوا منه يفتح تكت__


**__ •  8 ممنوع مجادلة العليا في اي قرار__** 

<@1471870076062797940>
`)
    .setColor(0x00ffff);

  return message.channel.send({ embeds: [embed] });
}
  // ===============================
// 📊 أمر التوب العام
// ===============================
if (content === "T") {

  // ---------- التاريخ ----------
  const today = new Date().toISOString().split("T")[0];

  const weekKey = (() => {
    const now = new Date();
    const d = new Date(now);
    d.setDate(now.getDate() - now.getDay());
    return d.toISOString().split("T")[0];
  })();

  const year = new Date().getFullYear().toString();

  // ---------- القوائم ----------
  let dayList = [];
  let weekList = [];
  let yearList = [];

  // ---------- قراءة النشاط ----------
  for (let user in data.activity || {}) {

    const activity = data.activity[user];

    const dayCount = activity?.day?.[today] || 0;
    const weekCount = activity?.week?.[weekKey] || 0;
    const yearCount = activity?.year?.[year] || 0;

    if (dayCount > 0) dayList.push([user, dayCount]);
    if (weekCount > 0) weekList.push([user, weekCount]);
    if (yearCount > 0) yearList.push([user, yearCount]);
  }

  // ---------- الترتيب ----------
  dayList.sort((a, b) => b[1] - a[1]);
  weekList.sort((a, b) => b[1] - a[1]);
  yearList.sort((a, b) => b[1] - a[1]);

  // ---------- النص ----------
  let text = `📊 **التوب العام**\n\n`;

  text += `🏆 يومي\n`;
  dayList.slice(0, 5).forEach((v, i) => {
    text += `${i + 1}- <@${v[0]}> | ${v[1]} رسالة\n`;
  });

  text += `\n📌 أسبوعي\n`;
  weekList.slice(0, 5).forEach((v, i) => {
    text += `${i + 1}- <@${v[0]}> | ${v[1]} رسالة\n`;
  });

  text += `\n🌟 سنوي\n`;
  yearList.slice(0, 5).forEach((v, i) => {
    text += `${i + 1}- <@${v[0]}> | ${v[1]} رسالة\n`;
  });

  return message.channel.send(text || "لا يوجد نشاط");
}
/* ======== اسكت ======== */

if (content.startsWith("$اسكت")) {

  if (!message.member.roles.cache.has(config.highRole))
    return message.reply("❌ ليس لديك صلاحية");

  const member = message.mentions.members.first();
  if (!member) return message.reply("❌ منشن الشخص");

  const args = content.split(" ");

  const timeText = args[2];
  if (!timeText) return message.reply("❌ اكتب المدة مثل 5m");

  /* ===== تحويل الوقت ===== */

  const match = timeText.match(/(\d+)([mhd])/);

  if (!match) return message.reply("❌ صيغة الوقت خطأ");

  const value = parseInt(match[1]);
  const unit = match[2];

  let ms = 0;

  if (unit === "m") ms = value * 60000;
  if (unit === "h") ms = value * 3600000;
  if (unit === "d") ms = value * 86400000;

  try {

    await member.timeout(ms, "Timeout بواسطة البوت");

    return message.channel.send(`✅ تم إسكات <@${member.id}> لمدة ${timeText}`);

  } catch {

    return message.reply("❌ لا أستطيع إعطاء تايم أوت");
  }
}
  ///* ---------- مهام ---------- */

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

  const guild = message.guild;
  if (!guild) return;

  const role = message.mentions.roles.first();
  const member = message.mentions.members.first();

  const text = content.split(" ").slice(2).join(" ");
  if (!text) return message.reply("❌ اكتب الرسالة!");

  try {

    /* ===== استدعاء رتبة ===== */

    if (role) {

      role.members.forEach(m => {
        m.send(`<@${m.id}>\n\n${text}`).catch(() => {});
      });

      return message.reply("✅ تم استدعاء الرتبة");
    }

    /* ===== استدعاء عضو ===== */

    if (member) {

      await member.send(`<@${member.id}>\n\n${text}`)
        .catch(() => {
          message.reply("❌ لا أستطيع إرسال الرسالة للخاص");
        });

      return message.reply("✅ تم الاستدعاء");
    }

    return message.reply("❌ منشن عضو أو رتبة!");

  } catch (err) {
    console.log(err);
  }
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
