// server.js
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate-quiz', async (req, res) => {
  const { topic, count } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a computer science professor. Output valid JSON only, matching this structure: { "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 } ] }'
        },
        {
          role: 'user',
          content: `Generate ${count || 3} multiple-choice questions on ${topic || 'Data Structures and Algorithms'}.`
        }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));