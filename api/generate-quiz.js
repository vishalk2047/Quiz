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
        generationConfig: {
          temperature: 1.1,
          topP: 0.97,
          topK: 64,
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Failed');
  return data;
}

// Fisher-Yates shuffle — breaks any positional pattern in the correct answer
function shuffleOptions(question) {
  const options = [...question.options];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { ...question, options };
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

  // A random seed phrase + explicit variety instructions stop the model from
  // reaching for the same "textbook default" questions every single time.
  const seed = Math.random().toString(36).slice(2, 10);
  const angles = [
    'edge cases and tricky corner scenarios',
    'real-world application and practical use',
    'comparing it against a related but different structure/algorithm',
    'time and space complexity trade-offs',
    'implementation details and common pitfalls',
    'a numeric/example-based walkthrough',
  ];
  const angle = angles[Math.floor(Math.random() * angles.length)];

  const prompt = `Generate exactly 5 multiple choice DSA quiz questions about "${topic}".

Session ID: ${seed} (ignore this, it's just to keep your output fresh and non-repetitive)

Requirements:
- Lean toward this angle where it fits naturally: ${angle}.
- Avoid defaulting to the most commonly seen textbook question for this topic — vary phrasing, specific numbers/examples, and sub-aspects each time.
- Mix difficulty across the 5 questions (some easier, some harder).
- Make sure all 5 questions are meaningfully different from each other.

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
      const rawQuestions = JSON.parse(clean);
      const questions = rawQuestions.map(shuffleOptions);
      return res.status(200).json({ questions });
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  return res.status(500).json({ error: 'All models failed. Please try again later.' });
}