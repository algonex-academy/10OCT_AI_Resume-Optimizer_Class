
import React, { useEffect, useState } from 'react';

interface AtsScoreDialProps {
  score: number;
}

const AtsScoreDial: React.FC<AtsScoreDialProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const scoreColorClass =
    score >= 85 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="relative flex items-center justify-center w-52 h-52 mx-auto">
      <svg className="absolute w-full h-full" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00CFFF" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="15"
        />
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className={`absolute text-5xl font-bold ${scoreColorClass} transition-colors duration-500`}>
        {Math.round(animatedScore)}
        <span className="text-2xl">%</span>
      </div>
    </div>
  );
};

export default AtsScoreDial;
