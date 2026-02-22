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
  TOKEN: process.env.BOT_TOKEN, // حط سكرتك هنا أو في متغير البيئة

  // رتبة العليا (الإدارة)
  highRole: "1472284690504482896",

  // رتبة المصممين
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

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
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
  let current = "@1471101769236090971";
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
//===================== $m =====================
if (content === "$m") {
  const text = `
*** 📜 أوامر البوت ***

!me → يعرض معلوماتك النقاط والرتبة
!مهام → يعرض مهام الإدارة ونقاطها
!ترقيات → يعرض نقاط الترقي للرتب
!n → يعرض ترتيب النقاط في السيرفر
!n @user +/- رقم → تعديل نقاط العضو
!خط → إرسال صورة الخط وحذف الرسالة

📌 نظام البوت:
- إدارة نقاط الأعضاء
- عرض الرتب تلقائياً
- نظام المهام الإدارية
`;

  const embed = new EmbedBuilder()
    .setTitle("🤖 أوامر البوت")
    .setDescription(text)
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
//===================== !مهام =====================
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
    .setColor(0x00ffff)
    .setImage(
      "https://cdn.discordapp.com/attachments/1466707904391549030/1471915849337147552/InShot_20260213_200749380.jpg"
    );

  return message.channel.send({ embeds: [
    }
     //===================== !استدعاء =====================
if (content.startsWith("!استدعاء")) {
  try {
    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ لازم تمنشن الشخص!");

    const text = content.split(" ").slice(2).join(" ");
    if (!text) return message.reply("❌ اكتب رسالة الاستدعاء!");

    // إرسال الرسالة للخاص
    await member.send(`📌 لديك استدعاء جديد:\n\n${text}`).catch(() => {
      message.reply("❌ لا أستطيع إرسال الرسالة للخاص");
    });

    return message.reply("✅ تم الاستدعاء عبر الخاص");

  } catch (err) {
    console.log(err);
  }
}                         
  //===================== !خط =====================
if (content === "!خط") {
  try {
    await message.delete().catch(() => {});

    return message.channel.send({
      files: [
        "https://cdn.discordapp.com/attachments/1471151896613097644/1474945852643737682/InShot_20260220_001522642.jpg"
      ]
    });

  } catch (err) {
    console.log(err);
  }
}
  // ===================== !n =====================
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
//===================== !قوانين =====================
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
  // ===================== !n @user (+/-) =====================
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
// ===================== ! =====================
if (content === "!") {
  if (!message.member.roles.cache.has(config.highRole)) {
    return message.reply("❌ هذا الأمر للإدارة فقط");
  }

  const modal = new ModalBuilder()
    .setCustomId("send_logo_message")
    .setTitle("إرسال رسالة للمصممين");

  const input = new TextInputBuilder()
    .setCustomId("msg")
    .setLabel("اكتب الرساله هنا")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(input));

  return message.channel.send({
    content: "📩 اضغط الزر لإرسال رسالة",
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_logo_modal")
          .setLabel("✉️ إرسال رسالة")
          .setStyle(ButtonStyle.Primary)
      ),
    ],
  });
}
// ========== الأزرار ==========
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "open_logo_modal") {
    if (!interaction.member.roles.cache.has(config.highRole)) {
      return interaction.reply({
        content: "❌ هذا الأمر للإدارة فقط",
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("send_logo_message")
      .setTitle("إرسال رسالة للمصممين");

    const input = new TextInputBuilder()
      .setCustomId("msg")
      .setLabel("اكتب الرساله هنا")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return interaction.showModal(modal);
  }

  // ===== توظيف / تعديل النقاط =====
  const [action, userId] = interaction.customId.split("_");

  if (!interaction.member.roles.cache.has(config.highRole)) {
    return interaction.reply({
      content: "❌ ما عندك صلاحية",
      ephemeral: true,
    });
  }

  if (action === "hire") {
    if (!data.users[userId]) data.users[userId] = 0;
    saveData();
    return interaction.reply({
      content: "✅ تم توظيف العضو ودخوله في نظام النقاط",
      ephemeral: true,
    });
  }

  if (action === "fire") {
    delete data.users[userId];
    saveData();
    return interaction.reply({
      content: "❌ تم فصل العضو وحذفه من نظام النقاط",
      ephemeral: true,
    });
  }

  if (action === "add" || action === "sub") {
    const modal = new ModalBuilder()
      .setCustomId(`${action}_modal_${userId}`)
      .setTitle("تعديل النقاط");

    const input = new TextInputBuilder()
      .setCustomId("points")
      .setLabel("اكتب عدد النقاط")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    return interaction.showModal(modal);
  }
});

// ========== المودال ==========
client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ModalSubmit) return;

  // إرسال الرسالة للمصممين
  if (interaction.customId === "send_logo_message") {
    const text = interaction.fields.getTextInputValue("msg");

    const role = interaction.guild.roles.cache.get(config.logoRole);
    if (!role) {
      return interaction.reply({
        content: "❌ رتبة المصممين غير موجودة",
        ephemeral: true,
      });
    }

    role.members.forEach((member) => {
      member.send(text).catch(() => {});
    });

    return interaction.reply({
      content: "✅ تم إرسال الرسالة للمصممين بالخاص",
      ephemeral: true,
    });
  }

  const parts = interaction.customId.split("_");
  const action = parts[0];
  const userId = parts[2];

  const num = parseInt(interaction.fields.getTextInputValue("points"));
  if (isNaN(num)) {
    return interaction.reply({ content: "❌ لازم رقم", ephemeral: true });
  }

  if (!data.users[userId]) data.users[userId] = 0;
  if (action === "add") data.users[userId] += num;
  if (action === "sub") data.users[userId] -= num;
  if (data.users[userId] < 0) data.users[userId] = 0;

  saveData();

  return interaction.reply({
    content: "✅ تم تحديث النقاط بنجاح",
    ephemeral: true,
  });
});

// تشغيل البوت
client.login(config.TOKEN);
