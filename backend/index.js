const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow JSON data

// --- SECRETS (Only Server sees this) ---
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

// Helper: Clean up text for comparison
const normalize = (str) => {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي') // Arabic normalization
    .trim();
};

// --- THE "TRUTH" (Hardcoded Secure Answers) ---
const VALID_ANSWERS = {
  city_born: ["casablanca", "casa", "الدار البيضاء", "كازا"],
  mom_name: ["fatiha", "ftouh", "فتيحة"],
  dream_dest: ["japan", "japon", "tokyo", "اليابان"],
  current_city: ["mohammedia", "المحمدية"],
  tv_show: ["better call saul", "bcs"],
  animal: ["cats", "cat", "chat", "chats", "قطة", "قط", "القطط"],
  game: ["resident evil", "re", "ريزدنت ايفل"],
  subject: ["svt", "biology", "science vie et terre", "علوم الحياة و الارض", "svt high school"],
  anime: ["hunter x hunter", "hxh", "هنتر"]
};

// --- ROUTE 1: Verify Answer ---
app.post('/api/verify', (req, res) => {
  const { questionId, answer } = req.body;

  if (!VALID_ANSWERS[questionId]) return res.json({ success: false });

  const userAnswer = normalize(answer);
  // Check if user answer matches ANY valid option
  const isCorrect = VALID_ANSWERS[questionId].some(correct => normalize(correct) === userAnswer);

  res.json({ success: isCorrect });
});

// --- ROUTE 2: Log to Discord (Proxy) ---
app.post('/api/log', async (req, res) => {
  const { message, color } = req.body;
  if (!DISCORD_WEBHOOK) return res.status(500).json({ error: "No Webhook" });

  try {
    // Server talks to Discord (Secure)
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          description: message,
          color: color || 3447003,
          timestamp: new Date().toISOString(),
          footer: { text: "Secure Backend System" }
        }]
      })
    });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Log failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});