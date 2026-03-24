import React, { useState, useRef, useEffect, memo } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

// Optimized ChatInput using useRef to prevent re-renders during typing
const ChatInput = memo(({ onSend, isTyping }: { onSend: (msg: string) => void, isTyping: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = inputRef.current?.value;
        if (val && val.trim()) {
            onSend(val);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
              <form 
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                  <input 
                    ref={inputRef}
                    type="text" 
                    disabled={isTyping}
                    className="flex-grow bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-60"
                    placeholder="Ask about the 3 Phases..."
                  />
                  <button 
                    type="submit" 
                    disabled={isTyping}
                    className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </form>
              <div className="text-[10px] text-center text-slate-400 mt-2">
                  Max 200 words per question.
              </div>
          </div>
    );
});

export const VirtualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'assistant', content: 'Hello. I am your Turnaround Strategy Assistant. Ask me about the 3 Phases of Transformation: Surgery, Resuscitation, and Therapy.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    // Word count check (approx)
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 200) {
        alert("Please limit your question to 200 words.");
        return;
    }

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
        const responseText = await chatWithAssistant([...messages, userMsg]);
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-teal-700 transition-transform hover:scale-105 z-[60] flex items-center justify-center"
        aria-label="Open Virtual Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[60vh] min-h-[350px] max-h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 rounded-t-2xl flex items-center flex-shrink-0">
             <div className="bg-teal-500 p-1.5 rounded-lg mr-3">
                <Bot className="w-5 h-5 text-white" />
             </div>
             <div>
                 <h3 className="font-bold text-sm">Virtual Assistant</h3>
                 <p className="text-xs text-slate-400">Turnaround Strategy Expert</p>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
             {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                         msg.role === 'user' 
                         ? 'bg-slate-800 text-white rounded-br-none' 
                         : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                     }`}>
                         {msg.content}
                     </div>
                 </div>
             ))}
             {isTyping && (
                 <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-bl-none shadow-sm">
                         <div className="flex space-x-1">
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                         </div>
                     </div>
                 </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput onSend={handleSend} isTyping={isTyping} />
        </div>
      )}
    </>
  );
};
