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
  let current = "<@1471101769236090971>";
  for (let r of ranks) {
    if (points >= r.points) current = `<@&${r.id}>`;
  }
  return current;
}

// ========== عند تشغيل البوت ==========
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ========== الأوامر ==========
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

  // !me
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

  // $m
  if (content === "$m") {
    const text = `
*** 📜 أوامر البوت ***

!me → يعرض معلوماتك النقاط والرتبة
!مهام → يعرض مهام الإدارة ونقاطها
!ترقيات → يعرض نقاط الترقي للرتب
!n → يعرض ترتيب النقاط
!n @user +/- رقم → تعديل نقاط العضو
!خط → إرسال صورة الخط
`;

    const embed = new EmbedBuilder()
      .setTitle("🤖 أوامر البوت")
      .setDescription(text)
      .setColor(0x00ffff);

    return message.channel.send({ embeds: [embed] });
  }

  // !مهام
  if (content === "!مهام") {
    let text = "*** Management tasks 📌 ***\n\n";

    text += "استلام تكت : **3**\n";
    text += "محاسبة عضو : **2**\n";
    text += "فعاليه في الشات : **3**\n";
    text += "مساعدة عضو : **1**\n";
    text += "تأيم أوت لمخالف : **2**\n";
    text += "مشاركة في لعبه في الشات : **1**\n";

    const embed = new EmbedBuilder()
      .setTitle("📋 المهام الإدارية")
      .setDescription(text)
      .setColor(0x00ffff);

    return message.channel.send({ embeds: [embed] });
  }

  // !استدعاء
  if (content.startsWith("!استدعاء")) {
    const args = content.split(" ");
    const userId = args[1];
    const text = args.slice(2).join(" ");

    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) return message.reply("❌ اكتب ID صحيح");
    if (!text) return message.reply("❌ اكتب رسالة");

    await member.send(`📌 لديك استدعاء جديد:\n\n${text}`).catch(() => {
      message.reply("❌ لا أستطيع إرسال الرسالة للخاص");
    });

    return message.reply("✅ تم الاستدعاء عبر الخاص");
  }

  // !خط
  if (content === "!خط") {
    await message.delete().catch(() => {});

    return message.channel.send({
      files: [
        "https://cdn.discordapp.com/attachments/1471151896613097644/1474945852643737682/InShot_20260220_001522642.jpg",
      ],
    });
  }

  // !n ترتيب
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
if (content === "!قوانين") {
  const text = `
\`\`\`قوانين الإدارة\`\`\`

- **1** __ الإحترام أولاً وآخراً وقبل كل شيء سواء للاعضاء او للادارة او العليا__

- **2** __ يمنع السب او المزح الثقيل بالشات حتى لو شخص تمون عليه .__

- **3** __ يمنع إستخدامك لصلاحياتك من قبل الإدارة في نطاق خارج الإدارة تحاسب عليه حتى لو مزح __

- **4** __عدم تكبير المواضيع في الشات بين اثنين يمزحون مزح خفيف __
-# طالما مافي اي الفاظ 

- **5** __يمنع الدق بالكلام على اعضاء او خلق مشاكل __

- **6** __ عدم مجادلة اداري منعًا باتًا حتى وان كان غلطان واذا هنالك مشكلة عليك فتح تكت عليا__

- **7** __ ممنوع التحذير بالشات منعًا باتًا تجنبًا للمجادلة واكتفوا بتحذيرات البوت وفي حال تكلم بالشات عن التحذير اطلبوا منه يفتح تكت__

**__ •  8 ممنوع مجادلة العليا في اي قرار__** 
<@&1387058128801234955>
`;

  const embed = new EmbedBuilder()
    .setTitle("📜 قوانين الإدارة")
    .setDescription(text)
    .setColor(0x00ffff);

  return message.channel.send({ embeds: [embed] });
}
    const embed = new EmbedBuilder()
      .setTitle("📋 ترتيب النقاط")
      .setDescription(text || "لا يوجد نقاط")
      .setColor(0x808080);

    return message.channel.send({ embeds: [embed] });
  }

  // !
  // !n @user تعديل نقاط
  if (content.startsWith("!n ")) {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ منشن الشخص!");

    const args = content.split(" ");
    const change = args[2];

    let pts = data.users[member.id] || 0;

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

    const num = parseInt(change);
    if (isNaN(num)) return message.reply("❌ لازم رقم");

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
