import React, { useState } from 'react';
import Login from './components/Login.jsx';
import WaveBackground from './components/WaveBackground.jsx';
import Dashboard from './components/Dashboard.jsx';
import Quiz from './components/Quiz.jsx';
import SiteCredit from './components/SiteCredit.jsx';
import { generateQuizQuestions } from './api/gemini.js';
import './components/Quiz.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    setError(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={async () => setIsLoggedIn(true)} />;
  }

  if (loading) {
    return (
      <div className="quiz-page">
        <WaveBackground />
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <div className="loader-emoji">⚡</div>
          <h2 className="question-text">Generating your quiz...</h2>
          <p className="question-para">Almost there! Hang tight.</p>
        </div>
        <SiteCredit />
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <WaveBackground />
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <div className="loader-emoji">⚠️</div>
          <h2 className="question-text">{error}</h2>
          <button className="next-button" onClick={handleRestart}>Try again</button>
        </div>
        <SiteCredit />
      </div>
    );
  }

  return questions
    ? <Quiz questions={questions} onRestart={handleRestart} />
    : <Dashboard onStart={handleStart} />;
}

export default App;