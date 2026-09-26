import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Quiz from './components/Quiz.jsx';
import { generateQuizQuestions } from '../api/gemini.js';
import './components/Quiz.css';
import './App.css';

function App() {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      const qs = await generateQuizQuestions(topic);
      setQuestions(qs);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setQuestions(null);
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-blob blob-one" />
        <div className="quiz-blob blob-two" />
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <div className="loader-emoji">⚡</div>
          <h2 className="question-text">Generating your quiz...</h2>
          {/* <p className="score-tag">Asking Gemini to craft 5 questions for you</p> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-blob blob-one" />
        <div className="quiz-blob blob-two" />
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <div className="loader-emoji">⚠️</div>
          <h2 className="question-text">{error}</h2>
          <button className="next-button" onClick={handleRestart}>Try again</button>
        </div>
      </div>
    );
  }

  return questions
    ? <Quiz questions={questions} onRestart={handleRestart} />
    : <Dashboard onStart={handleStart} />;
}

export default App;