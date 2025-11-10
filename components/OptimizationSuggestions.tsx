
import React, { useState } from 'react';
import { ResumeData, ResumeSection } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface OptimizationSuggestionsProps {
  resumeData: ResumeData;
  onOptimize: (section: keyof ResumeData, content: string) => Promise<string>;
}

const SectionCard: React.FC<{
    title: string;
    section: ResumeSection;
    onOptimizeClick: () => void;
    isOptimizing: boolean;
}> = ({ title, section, onOptimizeClick, isOptimizing }) => {
    return (
        <div className="glass-panel p-6 rounded-lg transition-all duration-300 hover:border-cyan-400/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-cyan-300 capitalize">{title}</h3>
                <div className="text-right">
                    <span className={`font-bold text-lg ${section.score > 80 ? 'text-green-400' : section.score > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {section.score}/100
                    </span>
                    <p className="text-xs text-slate-400">Section Score</p>
                </div>
            </div>
            <p className="text-slate-400 mb-4 whitespace-pre-wrap">{section.feedback}</p>
            <div className="bg-slate-900/50 p-4 rounded-md mb-4 max-h-40 overflow-y-auto">
                <p className="text-slate-300 whitespace-pre-wrap">{section.content}</p>
            </div>
            {section.optimized && (
                 <div className="bg-green-900/50 p-4 rounded-md mb-4 border border-green-500/50">
                    <h4 className="font-semibold text-green-300 mb-2">Optimized Version:</h4>
                    <p className="text-slate-200 whitespace-pre-wrap">{section.optimized}</p>
                </div>
            )}
            <button
                onClick={onOptimizeClick}
                disabled={isOptimizing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full hover:bg-slate-700 hover:border-violet-500 transition-colors disabled:opacity-50"
            >
                {isOptimizing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Optimizing...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5 text-violet-400" />
                        {section.optimized ? 'Regenerate' : 'Optimize with AI (Pro)'}
                    </>
                )}
            </button>
            { isOptimizing && <p className="text-center text-xs text-slate-400 mt-2">Using Thinking Mode for high-quality suggestions...</p> }
        </div>
    );
};

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ resumeData, onOptimize }) => {
    const [optimizingSection, setOptimizingSection] = useState<keyof ResumeData | null>(null);

    const handleOptimize = async (sectionKey: keyof ResumeData) => {
        setOptimizingSection(sectionKey);
        try {
            await onOptimize(sectionKey, resumeData[sectionKey].content);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setOptimizingSection(null);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Section-wise Analysis & Optimization</h2>
            {Object.entries(resumeData).map(([key, section]) => (
                <SectionCard
                    key={key}
                    title={key}
                    section={section}
                    onOptimizeClick={() => handleOptimize(key as keyof ResumeData)}
                    isOptimizing={optimizingSection === key}
                />
            ))}
             <style jsx>{`
                .glass-panel {
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 16px;
                  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
              `}</style>
        </div>
    );
};

export default OptimizationSuggestions;
