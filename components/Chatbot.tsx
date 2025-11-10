
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ChatIcon } from './icons/ChatIcon';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = startChat();
      setMessages([{
          role: 'model',
          content: "Hi! I'm ORA, your career assistant. How can I help you today?"
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const result = await chatRef.current.sendMessageStream({ message: input });
        let text = '';
        for await (const chunk of result) {
            text += chunk.text;
        }
        const modelMessage: ChatMessage = { role: 'model', content: text };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting right now." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [input]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-110 z-50"
        aria-label="Open career advisor chatbot"
      >
        <ChatIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[calc(100%-3rem)] sm:w-96 h-[60vh] max-h-[700px] bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-40 animate-slide-up">
          <header className="p-4 border-b border-slate-700 text-center">
            <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">ORA | Career Advisor</h3>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-br-lg' : 'bg-slate-700 text-slate-200 rounded-bl-lg'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about resumes, interviews..."
              className="w-full bg-slate-900 border border-slate-600 rounded-full px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              disabled={isLoading}
            />
          </form>
        </div>
      )}
      <style jsx>{`
        .animate-slide-up {
            animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
