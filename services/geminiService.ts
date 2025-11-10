
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResult, ResumeData, ResumeSection } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const proModel = "gemini-2.5-pro";
const flashModel = "gemini-2.5-flash";
const flashLiteModel = "gemini-2.5-flash-lite";

const proModelConfig = {
  thinkingConfig: { thinkingBudget: 32768 },
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Overall ATS score from 0 to 100" },
    keywordGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords in the job description but missing from the resume." },
    overallFeedback: { type: Type.STRING, description: "A summary of the resume's strengths and weaknesses against the job description." },
    resumeData: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["content", "score", "feedback"],
        },
        skills: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["content", "score", "feedback"],
        },
        experience: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["content", "score", "feedback"],
        },
        projects: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["content", "score", "feedback"],
        },
        education: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["content", "score", "feedback"],
        },
      },
      required: ["summary", "skills", "experience", "projects", "education"],
    },
  },
  required: ["overallScore", "keywordGaps", "resumeData", "overallFeedback"],
};


export const analyzeResumeWithPro = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const prompt = `
    Act as an expert ATS (Applicant Tracking System) and professional resume reviewer.
    Analyze the following resume against the provided job description.
    
    First, parse the resume text into standard sections: summary, skills, experience, projects, and education. If a section is missing, state that it's not found.
    Then, for each section and for the overall resume, provide a score from 0-100 based on its alignment with the job description.
    Also provide constructive feedback for each section on how to improve it.
    Identify crucial keywords from the job description that are missing in the resume.

    **Resume Text:**
    ---
    ${resumeText}
    ---

    **Job Description:**
    ---
    ${jobDescription}
    ---

    Return the analysis in a structured JSON format.
  `;

  const response = await ai.models.generateContent({
    model: proModel,
    contents: prompt,
    config: {
      ...proModelConfig,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const jsonText = response.text;
  const result: AnalysisResult = JSON.parse(jsonText);
  return result;
};


export const getQuickFeedback = async (resumeText: string, jobDescription: string): Promise<string> => {
  const prompt = `
    Provide 3 quick, actionable tips to improve this resume for the given job description. Be concise and direct.
    
    **Resume:**
    ${resumeText}

    **Job Description:**
    ${jobDescription}
  `;
  const response = await ai.models.generateContent({
    model: flashLiteModel,
    contents: prompt,
  });
  return response.text;
};

export const optimizeSectionWithPro = async (section: keyof ResumeData, content: string, jobDescription: string): Promise<string> => {
  const prompt = `
    You are an expert resume writer. Rewrite the following resume section to make it more impactful and better aligned with the provided job description.
    Focus on using strong action verbs, quantifying achievements, and incorporating relevant keywords from the job description naturally.
    Return only the rewritten text, without any additional commentary.

    **Section to Optimize:** ${section}
    
    **Original Content:**
    ---
    ${content}
    ---
    
    **Target Job Description:**
    ---
    ${jobDescription}
    ---
  `;

  const response = await ai.models.generateContent({
    model: proModel,
    contents: prompt,
    config: proModelConfig,
  });
  return response.text;
};

let chat: Chat | null = null;

export const startChat = (): Chat => {
  if (!chat) {
    chat = ai.chats.create({
      model: flashModel,
      config: {
        systemInstruction: 'You are a helpful career advisor chatbot. Your name is ORA (Opportunity & Resume Assistant). You help users with questions about resumes, job searching, and career development. Keep your responses helpful but concise.',
      },
    });
  }
  return chat;
}
