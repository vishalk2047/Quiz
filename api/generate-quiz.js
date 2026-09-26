const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
];

async function callGemini(model, prompt, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Failed');
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  // Note: no VITE_ prefix — this variable is only readable server-side, never bundled into the browser JS
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const prompt = `Generate exactly 5 multiple choice DSA quiz questions about "${topic}".
Return ONLY a valid JSON array. No markdown, no explanation, no code fences:
[
  {
    "question": "question text",
    "options": ["A", "B", "C", "D"],
    "answer": "exact matching option"
  }
]`;

  for (const model of MODELS) {
    try {
      const data = await callGemini(model, prompt, apiKey);
      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const questions = JSON.parse(clean);
      return res.status(200).json({ questions });
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  return res.status(500).json({ error: 'All models failed. Please try again later.' });
}