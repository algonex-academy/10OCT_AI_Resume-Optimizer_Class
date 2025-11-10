
import React from 'react';
import { AnalysisResult, JobListing } from '../types';
import AtsScoreDial from './AtsScoreDial';
import OptimizationSuggestions from './OptimizationSuggestions';
import JobFinder from './JobFinder';
import { SparklesIcon } from './icons/SparklesIcon';

interface AnalysisDashboardProps {
  isLoading: boolean;
  result: AnalysisResult | null;
  onOptimize: (section: any, content: string) => Promise<string>;
  onNewAnalysis: () => void;
  quickFeedback: string;
}

const LoadingSkeleton: React.FC = () => (
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      <p className="mt-4 text-lg text-slate-300">Performing deep analysis using Thinking Mode...</p>
      <p className="text-sm text-slate-400">This may take a moment as our AI performs a comprehensive evaluation.</p>
    </div>
);


const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ isLoading, result, onOptimize, onNewAnalysis, quickFeedback }) => {

  if (isLoading && !result) {
    return (
        <div className="max-w-5xl mx-auto p-8 glass-panel text-center">
            {quickFeedback && (
                <div className="mb-8 p-4 border border-violet-500/50 bg-violet-500/10 rounded-lg animate-fade-in">
                    <h3 className="font-bold text-violet-300 text-lg mb-2">Initial Feedback (Low-Latency Mode):</h3>
                    <p className="text-slate-300 whitespace-pre-wrap">{quickFeedback}</p>
                </div>
            )}
            <LoadingSkeleton />
        </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Something went wrong. Please try another analysis.</p>
        <button onClick={onNewAnalysis} className="mt-4 px-6 py-2 bg-violet-600 rounded-full hover:bg-violet-700 transition-colors">Start Over</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-center mb-8">
        <button onClick={onNewAnalysis} className="px-6 py-2 border border-slate-600 rounded-full hover:bg-slate-800 transition-colors text-slate-300">
          Start New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-panel p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Overall ATS Score</h2>
            <AtsScoreDial score={result.overallScore} />
            <p className="mt-4 text-slate-400">{result.overallFeedback}</p>
          </div>
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-cyan-400" />
              Keyword Gaps
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.keywordGaps.map((keyword, index) => (
                <span key={index} className="bg-rose-500/20 text-rose-300 text-sm font-medium px-2.5 py-1 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
             <p className="mt-4 text-xs text-slate-500">These keywords from the job description are missing in your resume. Consider adding them where relevant.</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <OptimizationSuggestions resumeData={result.resumeData} onOptimize={onOptimize} />
        </div>
      </div>
      
      <JobFinder />

       <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AnalysisDashboard;
