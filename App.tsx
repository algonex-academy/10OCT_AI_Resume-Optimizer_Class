
import React, { useState, useCallback } from 'react';
import { AnalysisResult, ResumeData, JobListing, AppState, View } from './types';
import { analyzeResumeWithPro, getQuickFeedback, optimizeSectionWithPro } from './services/geminiService';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: View.UPLOAD,
    resumeText: '',
    jobDescription: '',
    analysisResult: null,
    isLoading: false,
    error: null,
    quickFeedback: '',
  });

  const handleAnalyze = useCallback(async (resumeText: string, jobDescription: string) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null, view: View.ANALYSIS }));

    try {
      // Low-latency quick feedback
      const quickFeedbackPromise = getQuickFeedback(resumeText, jobDescription);

      // High-quality, deep analysis
      const analysisResultPromise = analyzeResumeWithPro(resumeText, jobDescription);

      const quickFeedback = await quickFeedbackPromise;
      setAppState(prev => ({ ...prev, quickFeedback }));
      
      const analysisResult = await analysisResultPromise;
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        resumeText,
        jobDescription,
        analysisResult,
      }));
    } catch (err) {
      console.error(err);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to analyze resume. Please check your inputs and try again.',
        view: View.UPLOAD,
      }));
    }
  }, []);

  const handleOptimize = useCallback(async (section: keyof ResumeData, content: string) => {
    try {
      const optimizedContent = await optimizeSectionWithPro(section, content, appState.jobDescription);
      
      setAppState(prev => {
        if (!prev.analysisResult) return prev;
        
        const newResumeData = { ...prev.analysisResult.resumeData };
        if (section in newResumeData) {
          (newResumeData as any)[section].optimized = optimizedContent;
        }

        return {
          ...prev,
          analysisResult: {
            ...prev.analysisResult,
            resumeData: newResumeData,
          },
        };
      });
      return optimizedContent;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to optimize section.');
    }
  }, [appState.jobDescription]);

  const handleNewAnalysis = () => {
    setAppState({
      view: View.UPLOAD,
      resumeText: '',
      jobDescription: '',
      analysisResult: null,
      isLoading: false,
      error: null,
      quickFeedback: '',
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white antialiased relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 h-96 w-96 bg-gradient-to-br from-cyan-900 to-transparent rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-gradient-to-tl from-violet-900 to-transparent rounded-full opacity-30 blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <main className="mt-12">
          {appState.view === View.UPLOAD && (
            <ResumeUpload onAnalyze={handleAnalyze} error={appState.error} />
          )}
          {appState.view === View.ANALYSIS && (
            <AnalysisDashboard
              isLoading={appState.isLoading}
              result={appState.analysisResult}
              onOptimize={handleOptimize}
              onNewAnalysis={handleNewAnalysis}
              quickFeedback={appState.quickFeedback}
            />
          )}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default App;
