import React from 'react';

// Shared background used across Dashboard, Quiz, and results screens
export function WaveBackground() {
  return (
    <svg className="app-waves" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="app-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE3F5" />
          <stop offset="1" stopColor="#9FD1E8" />
        </linearGradient>
      </defs>
      <rect width="1440" height="800" fill="url(#app-sky)" />
      <path fill="#8FC6E4" opacity="0.9" d="M0 210C220 180 420 260 660 240C920 218 1140 140 1440 165L1440 800L0 800Z" />
      <path fill="#63AECB" opacity="0.9" d="M0 300C240 270 460 360 700 335C960 308 1180 220 1440 250L1440 800L0 800Z" />
      <path fill="#3F94AE" opacity="0.9" d="M0 400C240 365 480 460 740 430C1000 400 1200 320 1440 345L1440 800L0 800Z" />
      <path fill="#2C7B8E" opacity="0.95" d="M0 500C260 462 500 545 760 512C1020 480 1220 410 1440 430L1440 800L0 800Z" />
      <path fill="#1F6470" opacity="0.95" d="M0 590C260 555 520 625 780 595C1040 565 1230 505 1440 520L1440 800L0 800Z" />
      <path fill="#16505A" d="M0 665C260 635 520 690 780 665C1040 640 1230 590 1440 605L1440 800L0 800Z" />
    </svg>
  );
}

export default WaveBackground;