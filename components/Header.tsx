
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">
        <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          AI Resume Optimizer 2.0
        </span>
      </h1>
      <p className="mt-2 text-lg sm:text-xl text-slate-400">
        Upgrade Your Resume. Unlock Opportunities.
      </p>
    </header>
  );
};

export default Header;
