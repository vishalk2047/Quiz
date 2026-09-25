import React, { useState } from 'react';
import './Quiz.css';

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

function Dashboard({ onStart }) {
  const [topic, setTopic] = useState('');

  return (
    <div className="quiz-page">
      <div className="quiz-blob blob-one" />
      <div className="quiz-blob blob-two" />

      <div className="quiz-card dashboard-card">
        <div className="dashboard-icon">🧠</div>
        <h1 className="dashboard-title">DSA Quiz</h1>
        <p className="dashboard-subtitle">
          Please choose a topic
        </p>

        <select
          className="topic-select"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">Select a topic...</option>
          {DSA_TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          className="next-button generate-button"
          onClick={() => onStart(topic)}
          disabled={!topic}
        >
          Generate quiz
        </button>
      </div>
      <p className="site-credit">
        Made with ❤️ by Vishal Khatri
        </p>
    </div>
  );
}

export default Dashboard;