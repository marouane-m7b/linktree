const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
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
  city_born: ["casablanca", "casa", "الدار البيضاء", "كازا"],

  dream_dest: [
    "japan",
    "japon",
    "tokyo",
    "اليابان",
    "russia",
    "روسيا",
    "korea",
    "south korea",
    "كوريا",
    "saudi arabia",
    "saudia",
    "السعودية",
    "mekkah",
    "mecca",
    "مكة",
    "madinah",
    "medina",
    "المدينة",
  ],

  current_city: ["mohammedia", "المحمدية"],

  tv_show: [
    "better call saul",
    "bcs",
    "game of thrones",
    "got",
    "breaking bad",
  ],

  animal: [
    "cats",
    "cat",
    "chat",
    "chats",
    "قطة",
    "قط",
    "القطط",
    "cheval",
    "horse",
    "حصان",
    "خيول",
  ],

  game: [
    "resident evil",
    "re",
    "ريزدنت ايفل",
    "red dead redemption",
    "red dead",
    "rdr",
    "red dead redemption 2",
    "rdr2",
  ],

  subject: [
    "svt",
    "biology",
    "biologie",
    "science vie et terre",
    "علوم الحياة و الارض",
    "svt high school",
  ],

  anime: [
    "hunter x hunter",
    "hxh",
    "هنتر",
    "dragon ball",
    "dragon ball z",
    "dragon ball super",
    "db",
    "dbz",
    "dbs",
  ],

  color: ["cyan", "black", "white"],

  sport: [
    "football",
    "soccer",
    "chess",
    "كرة القدم",
    "الشطرنج",
    "football français",
    "échecs",
  ],

  hobby: [
    "coding",
    "programmation",
    "البرمجة",
    "gaming",
    "jeux vidéo",
    "ألعاب",
    "anime",
    "الأنمي",
    "movies",
    "films",
    "أفلام",
    "gym",
    "fitness",
    "الرياضة",
  ],
};

const logToDiscord = async (message, color = 3447003) => {
  if (!DISCORD_WEBHOOK) return;
  try {
    await fetch(DISCORD_WEBHOOK, {
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
  } catch (e) {
    console.error("Webhook Error", e);
  }
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

app.post("/api/verify", (req, res) => {
  const { questionId, answer } = req.body;

  if (!VALID_ANSWERS[questionId]) return res.json({ success: false });

  const isCorrect = VALID_ANSWERS[questionId].some(
    (correct) => normalize(correct) === normalize(answer)
  );

  if (isCorrect) {
    logToDiscord(
      `💡 **Correct Answer:** ${questionId} - **Answer:** ${answer}`,
      16776960
    );
  } else {
    logToDiscord(
      `❌ **Incorrect Answer:** ${questionId} - **Attempt:** ${answer}`,
      15548997
    );
  }

  res.json({ success: isCorrect });
});

app.post("/api/unlock", (req, res) => {
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
    logToDiscord(`🔓 **ACCESS GRANTED**\nUser unlocked the profile.`, 5763719);
    return res.json({ success: true, token: a_very_long_and_very_secure_token });
  } else {
    logToDiscord(
      `⚠️ **Failed Attempt**\nUser tried:\n${summary.join("\n")}`,
      15548997
    );
    return res.json({ success: false });
  }
});

app.post("/api/log", (req, res) => {
  const { message, color } = req.body;
  logToDiscord(message, color);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
