
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending feedback
    setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFeedbackText('');
            onClose();
        }, 2000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-bold">Send Feedback</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-6">
           {submitted ? (
               <div className="text-center py-8">
                   <div className="inline-flex bg-green-100 text-green-600 p-3 rounded-full mb-3">
                       <Send className="w-6 h-6" />
                   </div>
                   <h4 className="text-lg font-bold text-slate-800">Thank You!</h4>
                   <p className="text-slate-500 mt-1">Your feedback has been received.</p>
               </div>
           ) : (
               <form onSubmit={handleSubmit}>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                       How can we improve this advisory tool?
                   </label>
                   <textarea 
                       required
                       className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none text-sm"
                       placeholder="Share your thoughts..."
                       value={feedbackText}
                       onChange={(e) => setFeedbackText(e.target.value)}
                   />
                   <div className="mt-4 flex justify-end">
                       <button 
                         type="submit"
                         className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
                       >
                           Submit <Send className="w-4 h-4 ml-2" />
                       </button>
                   </div>
               </form>
           )}
        </div>
      </div>
    </div>
  );
};
