
export interface ResumeSection {
  content: string;
  score: number;
  feedback: string;
  optimized?: string;
}

export interface ResumeData {
  summary: ResumeSection;
  skills: ResumeSection;
  experience: ResumeSection;
  projects: ResumeSection;
  education: ResumeSection;
}

export interface AnalysisResult {
  overallScore: number;
  keywordGaps: string[];
  resumeData: ResumeData;
  overallFeedback: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
}

export enum View {
  UPLOAD,
  ANALYSIS,
}

export interface AppState {
  view: View;
  resumeText: string;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  quickFeedback: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
