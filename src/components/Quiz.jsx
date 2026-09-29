import React, { useState } from 'react';
import SiteCredit from './SiteCredit.jsx';
import WaveBackground from './WaveBackground.jsx';
import './Quiz.css';

function Quiz({ questions, onRestart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (option) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);
    if (option === currentQuestion.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) { setIsFinished(true); return; }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswered(false);
  };

  return (
    <div className="quiz-page">
      <WaveBackground />

      {isFinished ? (
        <ResultsCard score={score} total={questions.length} onRestart={onRestart} />
      ) : (
        <div className="quiz-card">
          <ProgressDots total={questions.length} current={currentIndex} />

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-grid">
            {currentQuestion.options.map((option) => {
              let state = '';
              if (answered) {
                if (option === currentQuestion.answer) state = 'correct';
                else if (option === selectedOption) state = 'wrong';
              } else if (option === selectedOption) {
                state = 'selected';
              }
              return (
                <button
                  key={option}
                  className={`option-pill ${state}`}
                  onClick={() => handleSelect(option)}
                  disabled={answered}
                >
                  <span>{option}</span>
                  {state === 'correct' && <span className="pill-icon">✓</span>}
                  {state === 'wrong' && <span className="pill-icon">✗</span>}
                </button>
              );
            })}
          </div>

          <div className="quiz-footer">
            <span className="score-tag">Score: {score}</span>
            <button className="next-button" onClick={handleNext} disabled={!answered}>
              {isLast ? 'See results' : 'Next question'}
            </button>
          </div>
        </div>
      )}

      <SiteCredit />
    </div>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div className="progress-row">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`progress-dot ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`} />
      ))}
    </div>
  );
}

function ResultsCard({ score, total, onRestart }) {
  const percent = Math.round((score / total) * 100);
  return (
    <div className="quiz-card results-card">
      <div className="score-badge">
        <span className="score-percent">{percent}%</span>
        <span className="score-fraction">{score}/{total}</span>
      </div>
      <h2 className="results-title">
        {percent >= 80 ? "You're crushing DSA! 🔥" : percent >= 50 ? 'Solid effort. 💪' : 'Good start — try again! 🚀'}
      </h2>
      <button className="next-button" onClick={onRestart}>Try another topic</button>
    </div>
  );
}

export default Quiz;