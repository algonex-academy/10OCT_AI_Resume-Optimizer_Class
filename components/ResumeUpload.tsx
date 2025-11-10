import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ResumeUploadProps {
  onAnalyze: (resumeText: string, jobDescription: string) => void;
  error: string | null;
}

// Mock resume text to simulate file parsing
const MOCKED_RESUME_TEXT = `
John Doe
Software Engineer | San Francisco, CA | john.doe@email.com | linkedin.com/in/johndoe

Summary:
Results-driven Software Engineer with over 5 years of experience in developing, testing, and maintaining web applications. Adept at leveraging modern frameworks like React and Node.js to build high-quality, scalable software. Proven ability to collaborate effectively in agile environments to deliver projects on time.

Skills:
- Languages: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3
- Frontend: React, Redux, Next.js, Tailwind CSS, Webpack
- Backend: Node.js, Express.js, REST APIs, GraphQL
- Databases: PostgreSQL, MongoDB
- Testing: Jest, React Testing Library, Cypress
- Tools: Git, Docker, CI/CD (GitHub Actions), Jira

Experience:
Senior Frontend Engineer | Innovatech Solutions | 2020 - Present
- Led the development of a new customer-facing analytics dashboard using React and TypeScript, resulting in a 30% increase in user engagement.
- Architected a reusable component library, reducing development time for new features by 40%.
- Mentored three junior engineers, fostering their growth and improving team productivity.

Software Engineer | Digital Creations | 2018 - 2020
- Developed and maintained features for a large-scale e-commerce platform using React and Redux.
- Contributed to a 15% improvement in page load times by optimizing frontend performance.

Education:
B.S. in Computer Science | University of Technology | 2014 - 2018

Projects:
- AI Resume Optimizer: A personal project to analyze resumes against job descriptions using generative AI. (React, Node.js, Gemini API)
`;

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onAnalyze, error }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
    } else if (file) {
      alert('Please upload a PDF or DOCX file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeFile && jobDescription.trim()) {
      // In a real application, you would use a library like pdf.js (for PDF)
      // or mammoth.js (for DOCX) to parse the file content into text.
      // For this demonstration, we'll use mocked text to ensure functionality.
      onAnalyze(MOCKED_RESUME_TEXT, jobDescription);
    }
  };
  
  const removeFile = () => {
    setResumeFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <label className="block text-lg font-semibold mb-2 text-cyan-300">
              Upload Your Resume
            </label>
            {!resumeFile ? (
              <label 
                htmlFor="resume-upload" 
                className={`flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-slate-600 rounded-md cursor-pointer hover:bg-slate-800/50 transition-colors ${isDragOver ? 'bg-slate-800/50 border-cyan-400' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadIcon className="w-10 h-10 mb-4 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF or DOCX</p>
                </div>
                <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              </label>
            ) : (
              <div className="w-full h-96 bg-slate-900/50 border border-slate-700 rounded-md p-4 flex flex-col justify-center items-center">
                  <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
                      <FileIcon className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                      <div className="text-left overflow-hidden">
                          <p className="font-semibold truncate" title={resumeFile.name}>{resumeFile.name}</p>
                          <p className="text-sm text-slate-400">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button type="button" onClick={removeFile} aria-label="Remove file" className="ml-4 p-2 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0">
                          <TrashIcon className="w-5 h-5" />
                      </button>
                  </div>
                   <p className="text-xs text-slate-500 mt-4 text-center">
                        Note: File parsing is mocked for this demo.<br/>A pre-defined resume text will be used for analysis.
                   </p>
              </div>
            )}
          </div>
          <div className="glass-panel p-6">
            <label htmlFor="job-description" className="block text-lg font-semibold mb-2 text-violet-300">
              Paste Job Description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full h-96 bg-slate-900/50 border border-slate-700 rounded-md p-4 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-300 resize-none"
              required
            ></textarea>
          </div>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        <div className="text-center">
          <button
            type="submit"
            disabled={!resumeFile || !jobDescription.trim()}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity duration-300"></span>
            <UploadIcon className="w-6 h-6 mr-2" />
            Analyze My Resume
          </button>
        </div>
      </form>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ResumeUpload;