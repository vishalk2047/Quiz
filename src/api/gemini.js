const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
];

async function callGemini(model, prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
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

export async function generateQuizQuestions(topic) {
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
      console.log(`Trying model: ${model}`);
      const data = await callGemini(model, prompt);
      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  throw new Error('All models failed. Please try again later.');
}