const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = "marouane.ma7boub@gmail.com";
const a_very_long_and_very_secure_token = process.env.SECURE_TOKEN;

const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
};

const VALID_ANSWERS = {
  city_born: [
    "casablanca",
    "casa",
    "الدار البيضاء",
    "كازا",
    "casablanka",
    "kazablanca",
    "kaza"
  ],

  dream_dest: [
    "japan", "japon", "tokyo", "اليابان",
    "germany", "allemagne", "ألمانيا", "المانيا", "lalman", "l'allemagne", "لالمان", "alaman", "alamanya",
    "korea", "south korea", "كوريا", "كوريا الجنوبية",
    "saudi arabia", "saudia", "ksa", "السعودية",
    "mekkah", "mecca", "makkah", "مكة", "مكة المكرمة",
    "madinah", "medina", "المدينة", "المدينة المنورة"
  ],

  current_city: [
    "mohammedia", "المحمدية", "mohammadieh", "mohamadia", "muhammadiyah", "mohammediya",
    "casablanca", "casa", "الدار البيضاء", "كازا", "casablanka", "kazablanca", "kaza"
  ],

  tv_show: [
    "better call saul", "bcs",
    "game of thrones", "games of thrones", "got", "le trone de fer", "game of throne", "صراع العروش",
    "breaking bad", "bb", "brba", "بريكينج باد",
    "daredevil", "ديرديفيل",
    "loki", "لوكي"
  ],

  animal: [
    "cats", "cat", "chat", "chats", "قطة", "قط", "القطط", "kitty",
    "cheval", "horse", "horses", "حصان", "خيول", "خيل"
  ],

  game: [
    "resident evil", "re", "ريزدنت ايفل",
    "pes", "pro evolution soccer", "بيس",
    "ghost of tsushima", "ghost", "شبح تسوشيما",
    "elden ring", "er", "الدن رينغ"
  ],

  subject: [
    "svt", "biology", "biologie", "science vie et terre", "علوم الحياة و الارض", "svt high school", "science", "العلوم"
  ],

  anime: [
    "hunter x hunter", "hxh", "هنتر", "hunter hunter", "hunterxhunter",
    "dragon ball", "dragon ball z", "dragon ball super", "db", "dbz", "dbs", "دراغون بول",
    "naruto", "ناروتو", "naruto shippuden",
    "one piece", "op", "ون بيس",
    "attack on titan", "aot", "shingeki no kyojin", "snk", "هجوم العمالقة",
    "death note", "مذكرة الموت",
    "bleach", "بليتش"
  ],

  color: [
    "cyan", "سماوي",
    "black", "noir", "أسود",
    "white", "blanc", "أبيض",
    "green", "vert", "أخضر"
  ],

  sport: [
    "football", "soccer", "foot", "كرة القدم", "كورة",
    "chess", "الشطرنج", "échecs"
  ],

  hobby: [
    "coding", "programmation", "البرمجة", "code",
    "gaming", "jeux vidéo", "ألعاب", "video games",
    "anime", "الانمي", "الأنمي", "أنمي",
    "movies", "films", "أفلام", "cinema",
    "gym", "fitness", "الرياضة", "workout"
  ]
};

const logToDiscord = async (message, color = 3447003) => {
  if (!DISCORD_WEBHOOK) return;

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            description: message,
            color: color,
            timestamp: new Date().toISOString(),
            footer: { text: "Security System" },
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`Discord returned ${response.status}: ${await response.text()}`);
    }
  } catch (e) {
    console.error("Webhook Error", e);
  }
};

const escapeHtml = (value) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });

const createEmailHtml = (message) => {
  const formattedMessage = escapeHtml(message)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f4f7fb;color:#172033;font-family:Arial,sans-serif;">
        <div style="padding:40px 16px;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <div style="padding:24px 28px;background:#102a43;color:#ffffff;">
              <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#9fb3c8;">Portfolio</div>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:700;">New notification</h1>
            </div>
            <div style="padding:28px;">
              <div style="padding:20px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;font-size:15px;line-height:1.7;">
                ${formattedMessage}
              </div>
            </div>
            <div style="padding:16px 28px;border-top:1px solid #edf2f7;color:#718096;font-size:12px;">
              Sent automatically from your portfolio contact system.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

const logToEmail = async (message) => {
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: "New portfolio notification",
        text: message,
        html: createEmailHtml(message),
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
    }
  } catch (e) {
    console.error("Email notification error", e);
  }
};

const logNotification = async (message, color = 3447003) => {
  await Promise.allSettled([
    logToDiscord(message, color),
    logToEmail(message),
  ]);
};

app.get("/", (req, res) => {
  res.send("You're in, thanks ✅");
});

app.post("/api/verify-token", (req, res) => {
  const { token } = req.body;
  if (token === a_very_long_and_very_secure_token) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/api/verify", async (req, res) => {
  const { questionId, answer } = req.body;

  if (!VALID_ANSWERS[questionId]) return res.json({ success: false });

  const isCorrect = VALID_ANSWERS[questionId].some(
    (correct) => normalize(correct) === normalize(answer)
  );

  if (isCorrect) {
    await logNotification(
      `💡 **Correct Answer:** ${questionId} - **Answer:** ${answer}`,
      16776960
    );
  } else {
    await logNotification(
      `❌ **Incorrect Answer:** ${questionId} - **Attempt:** ${answer}`,
      15548997
    );
  }

  res.json({ success: isCorrect });
});

app.post("/api/unlock", async (req, res) => {
  const { selections } = req.body;

  let allCorrect = true;
  let summary = [];

  Object.values(selections).forEach((item) => {
    const validOptions = VALID_ANSWERS[item.id];
    const isCorrect =
      validOptions &&
      validOptions.some((opt) => normalize(opt) === normalize(item.answer));
    if (!isCorrect) allCorrect = false;
    summary.push(`${item.id}: ${item.answer}`);
  });

  if (allCorrect) {
    await logNotification(`🔓 **ACCESS GRANTED**\nUser unlocked the profile.`, 5763719);
    return res.json({ success: true, token: a_very_long_and_very_secure_token });
  } else {
    await logNotification(
      `⚠️ **Failed Attempt**\nUser tried:\n${summary.join("\n")}`,
      15548997
    );
    return res.json({ success: false });
  }
});

app.post("/api/log", async (req, res) => {
  const { message, color } = req.body;
  await logNotification(message, color);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
