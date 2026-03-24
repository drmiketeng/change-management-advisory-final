
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface PrayerPlayerProps {
  text: string;
}

export const PrayerPlayer: React.FC<PrayerPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Split text into sentences for granular tracking
    const splitSentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    setSentences(splitSentences);
    synth.current = window.speechSynthesis;

    // Cleanup on unmount
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, [text]);

  const handlePlayPause = () => {
    if (!synth.current) return;

    // If already playing, toggle pause/resume
    if (isPlaying) {
      if (isPaused) {
        synth.current.resume();
        setIsPaused(false);
      } else {
        synth.current.pause();
        setIsPaused(true);
      }
      return;
    }

    // Initial Start
    startSpeaking();
  };

  const handleStop = () => {
    if (!synth.current) return;
    synth.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentSentenceIndex(0);
  };

  const startSpeaking = () => {
    if (!synth.current) return;

    setIsPlaying(true);
    setIsPaused(false);
    
    // Construct the full utterance
    const fullText = sentences.join(' ');
    utterance.current = new SpeechSynthesisUtterance(fullText);
    
    // Try to find a soothing voice if possible
    const voices = synth.current.getVoices();
    const calmVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English')) || voices[0];
    if (calmVoice) utterance.current.voice = calmVoice;
    
    utterance.current.rate = 0.85; // Slower, more reverent pace
    utterance.current.pitch = 1;

    // Track boundaries
    utterance.current.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
         const percentage = (event.charIndex / fullText.length) * 100;
         setProgress(Math.min(percentage, 100));
         
         let currentLength = 0;
         for (let i = 0; i < sentences.length; i++) {
             currentLength += sentences[i].length;
             if (currentLength > event.charIndex) {
                 setCurrentSentenceIndex(i);
                 break;
             }
         }
      }
    };

    utterance.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setCurrentSentenceIndex(sentences.length);
    };

    synth.current.speak(utterance.current);
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-indigo-900 font-bold flex items-center">
          <Volume2 className="w-4 h-4 mr-2" />
          Audio Prayer Guidance
        </h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${isPaused ? 'bg-amber-100 text-amber-700' : 'bg-indigo-200/50 text-indigo-600'}`}>
           {isPlaying && !isPaused ? `Playing... ${currentSentenceIndex + 1}/${sentences.length}` : isPaused ? 'Paused' : 'Ready to play'}
        </span>
      </div>

      <div className="w-full bg-indigo-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div 
          className={`bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-linear ${isPaused ? 'opacity-50' : 'opacity-100'}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            className={`flex-grow py-2 rounded-lg font-semibold flex items-center justify-center transition-colors ${
              isPlaying && !isPaused
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> {isPaused ? 'Resume' : 'Play Prayer'}
              </>
            )}
          </button>
          
          {(isPlaying || isPaused) && (
              <button 
                onClick={handleStop}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium flex items-center"
                title="Stop"
              >
                  <Square className="w-4 h-4" />
              </button>
          )}
      </div>
      
      {isPlaying && !isPaused && (
          <p className="text-xs text-center text-indigo-500 mt-2 italic animate-pulse">
              Streaming audio content...
          </p>
      )}
    </div>
  );
};
