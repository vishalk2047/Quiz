export async function generateQuizQuestions(topic, questionCount, difficulty) {
  const response = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      questionCount,
      difficulty,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate questions');
  }

  return data.questions;
}