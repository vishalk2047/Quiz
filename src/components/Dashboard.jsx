import React, { useState } from 'react';
import SiteCredit from './SiteCredit.jsx';
import WaveBackground from './WaveBackground.jsx';
import './Dashboard.css';

const DSA_TOPICS = [
  'Arrays',
  'Linked Lists',
  'Stacks & Queues',
  'Binary Trees & BST',
  'Graphs',
  'Sorting Algorithms',
  'Dynamic Programming',
  'Recursion & Backtracking',
  'Hashing & Hash Maps',
  'Heaps & Priority Queues',
  'Searching Algorithms',
  'Time & Space Complexity',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 15;

function Dashboard({ onStart, onNavigate }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [count, setCount] = useState('');

  const n = Number(count);
  const countValid = count !== '' && Number.isInteger(n) && n >= MIN_QUESTIONS && n <= MAX_QUESTIONS;
  const showCountError = count !== '' && !countValid;
  const canSubmit = Boolean(topic && difficulty && countValid);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onStart(topic, difficulty, n);
  };

  const go = (page) => () => onNavigate && onNavigate(page);

  return (
    <div className="home-page">
      <WaveBackground />

      <header className="home-header-container">
        <h1 className="home-brand">
          <span className="quiz">Quiz</span><span className="buzz">Buzz</span>
        </h1>
        <nav className="home-nav-links">
          <button type="button" className="home-nav-link" onClick={go('home')}>Home</button>
          <button type="button" className="home-nav-link" onClick={go('dashboard')}>Dashboard</button>
          <button type="button" className="home-nav-link" onClick={go('profile')}>Profile</button>
        </nav>
      </header>

      <main className="home-content-container">
        <form className="home-form" onSubmit={handleSubmit}>
          <section className="home-section">
            <h2 className="home-heading">Configure your new quiz</h2>
            <select
              className="home-field"
              aria-label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">Pick a specific topic...</option>
              {DSA_TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </section>

          <section className="home-section">
            <h2 className="home-heading">Set the challenge level</h2>
            <select
              className="home-field"
              aria-label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Choose your difficulty...</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="number"
              className="home-field"
              aria-label="Number of questions"
              placeholder="Number of questions..."
              min={MIN_QUESTIONS}
              max={MAX_QUESTIONS}
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
            {showCountError && (
              <p className="home-error">Enter a whole number from {MIN_QUESTIONS} to {MAX_QUESTIONS}.</p>
            )}
          </section>

          <button type="submit" className="home-button" disabled={!canSubmit}>
            Generate New Quiz
          </button>
        </form>
      </main>

      <SiteCredit />
    </div>
  );
}

export default Dashboard;