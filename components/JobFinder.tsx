
import React, { useState } from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

const mockJobs = [
    { id: '1', title: 'Senior Frontend Engineer', company: 'Stripe', location: 'Remote', url: '#' },
    { id: '2', title: 'React Developer', company: 'Vercel', location: 'San Francisco, CA', url: '#' },
    { id: '3', title: 'Full-Stack Engineer (AI)', company: 'OpenAI', location: 'San Francisco, CA', url: '#' },
    { id: '4', title: 'Software Engineer Intern', company: 'Google', location: 'Mountain View, CA', url: '#' },
];

const JobFinder: React.FC = () => {
    const [jobs] = useState(mockJobs);
    
    return (
        <div className="glass-panel p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BriefcaseIcon className="w-8 h-8 text-violet-400" />
                Relevant Opportunities
            </h2>
            <div className="text-sm text-slate-400 mb-6 -mt-4">(Job discovery feature simulation)</div>

            <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="p-4 bg-slate-800/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform duration-300 hover:scale-[1.02] hover:bg-slate-800">
                        <div>
                            <h3 className="font-bold text-lg text-white">{job.title}</h3>
                            <p className="text-slate-300">{job.company} - <span className="text-slate-400">{job.location}</span></p>
                        </div>
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold bg-violet-600 rounded-full hover:bg-violet-700 transition-colors whitespace-nowrap">
                            Apply Now
                        </a>
                    </div>
                ))}
            </div>

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

export default JobFinder;
