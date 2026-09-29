const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
];

// Stores previously generated questions for each topic.
// Example:
// {
//   "Stack": [
//     "Which principle does a stack follow?",
//     "What is the time complexity of push operation?"
//   ],
//   "Queue": [...]
// }
const topicHistory = new Map();

async function callGemini(model, prompt, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1.1,
          topP: 0.97,
          topK: 64,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed');
  }

  return data;
}


// Fisher-Yates shuffle
// IMPORTANT: answer is kept synchronized with the shuffled options.
function shuffleOptions(question) {
  const options = [...question.options];
  const correctAnswer = question.answer;

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    ...question,
    options,
    answer: correctAnswer,
  };
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const {
    topic,
    questionCount,
  } = req.body || {};

  if (!topic) {
    return res.status(400).json({
      error: 'Missing topic',
    });
  }


  // ------------------------------------------
  // Validate number of questions
  // ------------------------------------------

  const count = Number(questionCount);

  if (!Number.isInteger(count) || count < 3 || count > 15) {
    return res.status(400).json({
      error: 'Question count must be between 3 and 15',
    });
  }


  // ------------------------------------------
  // Gemini API key
  // ------------------------------------------

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Server misconfigured: missing API key',
    });
  }


  // ------------------------------------------
  // Random variation
  // ------------------------------------------

  const seed = Math.random()
    .toString(36)
    .slice(2, 10);

  const angles = [
    'edge cases and tricky corner scenarios',
    'real-world application and practical use',
    'comparing it against a related but different structure or algorithm',
    'time and space complexity trade-offs',
    'implementation details and common pitfalls',
    'a numeric or example-based walkthrough',
  ];

  const angle =
    angles[Math.floor(Math.random() * angles.length)];


  // ------------------------------------------
  // Get history for THIS topic only
  // ------------------------------------------

  const normalizedTopic = topic.trim().toLowerCase();

  const previousQuestions =
    topicHistory.get(normalizedTopic) || [];

  const hasPreviousQuiz = previousQuestions.length > 0;


  // ------------------------------------------
  // Build prompt
  // ------------------------------------------

  let prompt;


  // ==========================================
  // FIRST QUIZ FOR THIS TOPIC
  // ==========================================

  if (!hasPreviousQuiz) {

    prompt = `Generate exactly ${count} multiple choice DSA quiz questions about "${topic}".

Session ID: ${seed}
Use the session ID as a variation signal to help generate fresh questions. Do not mention or output the session ID.

Requirements:
- Generate exactly ${count} questions.
- Lean toward this angle where it fits naturally: ${angle}.
- All questions must be directly related to "${topic}".
- Each question must have exactly 4 options.
- Exactly ONE option must be correct.
- Mix difficulty across the questions.
- Make all questions meaningfully different from each other.
- Do not create multiple questions testing the same underlying concept.
- Do not simply change numbers, variable names, or wording to make a question appear different.
- Explore different concepts, subtopics, edge cases, implementation details, complexity, code/output, and practical applications where applicable.
- Avoid defaulting to the most commonly seen textbook question for every question.

Return ONLY a valid JSON array. No markdown, no explanation, no code fences:

[
  {
    "question": "question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "exact matching option"
  }
]`;

  }


  // ==========================================
  // SAME TOPIC HAS BEEN GENERATED BEFORE
  // ==========================================

  } else {

    const historyText = previousQuestions
      .map((question, index) => {
        return `${index + 1}. ${question}`;
      })
      .join('\n');

    prompt = `Generate exactly ${count} NEW multiple choice DSA quiz questions about "${topic}".

Session ID: ${seed}
Use the session ID as a variation signal to help generate fresh questions. Do not mention or output the session ID.

Previously generated questions for this topic:

${historyText}

IMPORTANT:
- Generate exactly ${count} NEW questions.
- Do NOT repeat any of the questions listed above.
- Do NOT test the same underlying concept as any question listed above.
- Changing only the wording, numbers, variable names, or example is NOT considered a new question.
- Explore different concepts, subtopics, edge cases, implementation details, complexity, code/output, and practical applications that were NOT covered previously.
- The questions should require different reasoning from the previous questions.
- All questions must be directly related to "${topic}".
- Each question must have exactly 4 options.
- Exactly ONE option must be correct.
- Mix difficulty across the questions.
- Lean toward this angle where it fits naturally: ${angle}.

Before returning the result, internally check that none of the generated questions test the same underlying concept as the previously generated questions.

Return ONLY a valid JSON array. No markdown, no explanation, no code fences:

[
  {
    "question": "question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "exact matching option"
  }
]`;
  }


  // ------------------------------------------
  // Try Gemini models
  // ------------------------------------------

  for (const model of MODELS) {

    try {

      const data = await callGemini(
        model,
        prompt,
        apiKey
      );

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Gemini returned empty response');
      }


      // Remove accidental markdown code fences
      const clean = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();


      const rawQuestions = JSON.parse(clean);


      // ------------------------------------------
      // Validate Gemini response
      // ------------------------------------------

      if (!Array.isArray(rawQuestions)) {
        throw new Error('Gemini response is not an array');
      }

      if (rawQuestions.length !== count) {
        throw new Error(
          `Expected ${count} questions but received ${rawQuestions.length}`
        );
      }


      for (const question of rawQuestions) {

        if (
          !question.question ||
          !Array.isArray(question.options) ||
          question.options.length !== 4 ||
          !question.answer
        ) {
          throw new Error(
            'Invalid question structure returned by Gemini'
          );
        }

        if (!question.options.includes(question.answer)) {
          throw new Error(
            'Answer does not match any option'
          );
        }
      }


      // ------------------------------------------
      // Save questions for THIS topic
      // ------------------------------------------

      const newQuestions =
        rawQuestions.map(q => q.question);

      const updatedHistory = [
        ...previousQuestions,
        ...newQuestions,
      ];

      topicHistory.set(
        normalizedTopic,
        updatedHistory
      );


      // ------------------------------------------
      // Shuffle options
      // ------------------------------------------

      const questions =
        rawQuestions.map(shuffleOptions);


      // ------------------------------------------
      // Send response
      // ------------------------------------------

      return res.status(200).json({
        questions,
      });

    } catch (err) {

      console.warn(
        `Model ${model} failed:`,
        err.message
      );
    }
  }


  return res.status(500).json({
    error: 'All models failed. Please try again later.',
  });
}