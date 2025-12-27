const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

const normalize = (str) => {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .trim();
};

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

// --- HELPER: Send to Discord ---
const logToDiscord = async (message, color = 3447003) => {
  if (!DISCORD_WEBHOOK) return;
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          description: message,
          color: color,
          timestamp: new Date().toISOString(),
          footer: { text: "Security System" }
        }]
      })
    });
  } catch (e) {
    console.error("Webhook Error", e);
  }
};

// --- ROUTE 1: Verify Single Answer ---
// UPDATED: Now logs directly to Discord if successful
app.post('/api/verify', (req, res) => {
  const { questionId, answer } = req.body;
  
  if (!VALID_ANSWERS[questionId]) return res.json({ success: false });
  
  const isCorrect = VALID_ANSWERS[questionId].some(correct => normalize(correct) === normalize(answer));
  
  if (isCorrect) {
    // Log success immediately from backend
    logToDiscord(`💡 **Correct Answer:** ${questionId}`, 16776960); // Yellow
  }

  res.json({ success: isCorrect });
});

// --- ROUTE 2: Secure Unlock ---
app.post('/api/unlock', (req, res) => {
  const { selections } = req.body; 

  let allCorrect = true;
  let summary = [];

  Object.values(selections).forEach(item => {
    const validOptions = VALID_ANSWERS[item.id];
    const isCorrect = validOptions && validOptions.some(opt => normalize(opt) === normalize(item.answer));
    if (!isCorrect) allCorrect = false;
    summary.push(`${item.id}: ${item.answer}`);
  });

  if (allCorrect) {
    logToDiscord(`🔓 **ACCESS GRANTED**\nUser unlocked the profile.`, 5763719); // Green
    return res.json({ success: true });
  } else {
    logToDiscord(`⚠️ **Failed Attempt**\nUser tried:\n${summary.join('\n')}`, 15548997); // Red
    return res.json({ success: false });
  }
});

// --- ROUTE 3: Log Link Clicks ---
app.post('/api/log', (req, res) => {
  const { message, color } = req.body;
  logToDiscord(message, color);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});