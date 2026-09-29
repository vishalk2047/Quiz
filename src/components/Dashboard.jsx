import React, { useState } from 'react';
import SiteCredit from './SiteCredit.jsx';
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

function WaveBackground() {
  return (
    <svg className="home-waves" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="home-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE3F5" />
          <stop offset="1" stopColor="#9FD1E8" />
        </linearGradient>
      </defs>
      <rect width="1440" height="800" fill="url(#home-sky)" />
      <path fill="#8FC6E4" opacity="0.9" d="M0 210C220 180 420 260 660 240C920 218 1140 140 1440 165L1440 800L0 800Z" />
      <path fill="#63AECB" opacity="0.9" d="M0 300C240 270 460 360 700 335C960 308 1180 220 1440 250L1440 800L0 800Z" />
      <path fill="#3F94AE" opacity="0.9" d="M0 400C240 365 480 460 740 430C1000 400 1200 320 1440 345L1440 800L0 800Z" />
      <path fill="#2C7B8E" opacity="0.95" d="M0 500C260 462 500 545 760 512C1020 480 1220 410 1440 430L1440 800L0 800Z" />
      <path fill="#1F6470" opacity="0.95" d="M0 590C260 555 520 625 780 595C1040 565 1230 505 1440 520L1440 800L0 800Z" />
      <path fill="#16505A" d="M0 665C260 635 520 690 780 665C1040 640 1230 590 1440 605L1440 800L0 800Z" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg className="home-diamond" viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="20,3 33,15 20,37 7,15" fill="none" stroke="#EAF6FA" strokeWidth="1.4" opacity="0.85" />
      <polygon points="20,3 33,15 20,15" fill="#EAF6FA" opacity="0.25" />
      <line x1="7" y1="15" x2="33" y2="15" stroke="#EAF6FA" strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="3" x2="20" y2="37" stroke="#EAF6FA" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

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

      <div className="home-container">
        <header className="home-nav">
          <h1 className="home-brand">QuizBuzz</h1>
          <nav className="home-nav-links">
            <button type="button" className="home-nav-link" onClick={go('home')}>Home</button>
            <button type="button" className="home-nav-link" onClick={go('dashboard')}>Dashboard</button>
            <button type="button" className="home-nav-link" onClick={go('profile')}>Profile</button>
          </nav>
        </header>

        <main className="home-main">
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
      </div>


      <SiteCredit />
    </div>
  );
}

export default Dashboard;