// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { randomUUID } = require('crypto');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

// OpenAI Setup
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL, // your Vercel URL later (ex: https://yourapp.vercel.app)
  "http://localhost:3000",  // local dev
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests like Postman/no-origin too
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Study Buddy API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', async (req, res) => {
  let dbStatus = 'ok ✅';
  try {
    await pool.query('SELECT 1');
  } catch (e) {
    dbStatus = 'failed';
  }

  res.json({
    status: 'healthy',
    database: dbStatus,
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured'
  });
});

// ===================== OPENAI ENDPOINTS =====================

// 1. Generate Study Notes
app.post('/api/ai/study-notes', async (req, res) => {
  try {
    const { topic } = req.body;
    console.log('Generating study notes for:', topic);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert tutor creating study notes. Format with: Overview (2-3 sentences), Key Points (3-5 bullet points), Study Tips (2-3 tips), Quick Memory Trick. Use clear formatting."
        },
        { role: "user", content: `Create concise study notes about: ${topic}` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    res.json({
      success: true,
      topic,
      notes: completion.choices[0].message.content,
      generated_at: new Date().toISOString(),
      powered_by: "OpenAI GPT-3.5"
    });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate notes',
      message: error.message
    });
  }
});

// 2. Generate Flashcards
app.post('/api/ai/flashcards', async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    console.log('Generating flashcards for:', topic);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            `Create exactly ${count} flashcards. Format each as:\nQ: [Clear question]\nA: [Concise answer]\n\nSeparate each flashcard with a blank line.`
        },
        { role: "user", content: `Topic: ${topic}` }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({
      success: true,
      topic,
      flashcards: completion.choices[0].message.content,
      count,
      powered_by: "OpenAI GPT-3.5"
    });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate flashcards',
      message: error.message
    });
  }
});

// 3. Explain to someone who isn't familiar with the concept 
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { concept } = req.body;
    console.log('Explaining concept:', concept);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are explaining to someone who isn't familiar with the concept. Use simple words and fun comparisons. Keep it under 200 words."
        },
        { role: "user", content: `Explain ${concept} in the simplest way possible` }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    res.json({
      success: true,
      concept,
      explanation: completion.choices[0].message.content,
      powered_by: "OpenAI GPT-3.5"
    });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.json({
      success: false,
      concept: req.body?.concept,
      explanation: `Sorry, I couldn't explain that right now. Error: ${error.message}`,
      error: error.message
    });
  }
});

// 4. Quiz Generator
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { topic, difficulty = 'medium' } = req.body;
    console.log('Generating quiz for:', topic);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a quiz with 4 multiple choice questions. Return ONLY valid JSON:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation why this is correct"
  }
]
Difficulty: ${difficulty}.`
        },
        { role: "user", content: `Create a quiz about: ${topic}` }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    try {
      const questions = JSON.parse(content);
      res.json({ success: true, topic, difficulty, questions });
    } catch {
      res.json({ success: true, topic, difficulty, questions: content, raw: true });
    }
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
});

// ===================== AUTH (uses users.name + users.password) =====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already in use' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ generate id ourselves (fixes "null value in column id")
    const userId = randomUUID();

    // Create user (store username into "name")
    const newUser = await pool.query(
  'INSERT INTO users (id, name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, name, email',
  [userId, username, email, passwordHash]
);

    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].name,
        email: newUser.rows[0].email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: userRes.rows[0].id,
        username: userRes.rows[0].name,
        email: userRes.rows[0].email
      }
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// ===================== ANALYTICS (in-memory per user, no DB) =====================

const perUserAnalytics = {}; // { [userId]: { studySessions:[], topicCounts:{}, featureUsage:{}, dailyStats:{} } }

function getUserAnalytics(userId) {
  if (!perUserAnalytics[userId]) {
    perUserAnalytics[userId] = {
      studySessions: [],
      topicCounts: {},
      featureUsage: { explain: 0, notes: 0, flashcards: 0, quiz: 0 },
      dailyStats: {}
    };
  }
  return perUserAnalytics[userId];
}

app.post('/api/analytics/track', authenticateToken, async (req, res) => {
  try {
    const { topic, type, duration, timestamp } = req.body;
    const userId = req.user.id;

    const a = getUserAnalytics(userId);

    a.studySessions.push({
      topic,
      type,
      duration: duration || 0,
      timestamp: timestamp || new Date().toISOString()
    });

    a.topicCounts[topic] = (a.topicCounts[topic] || 0) + 1;

    if (a.featureUsage[type] !== undefined) a.featureUsage[type]++;

    const today = new Date().toDateString();
    a.dailyStats[today] = (a.dailyStats[today] || 0) + 1;

    res.json({ success: true, message: 'Analytics tracked' });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to track analytics' });
  }
});

app.get('/api/analytics/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const a = getUserAnalytics(userId);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: a.dailyStats[key] || 0
      });
    }

    const topTopics = Object.entries(a.topicCounts)
      .sort(([, x], [, y]) => y - x)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    res.json({
      totalSessions: a.studySessions.length,
      featureUsage: a.featureUsage,
      topTopics,
      last7Days,
      recentSessions: a.studySessions.slice(-10).reverse()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
