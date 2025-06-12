'use client';

import { useState } from 'react';

export default function Home() {
  const [userText, setUserText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog: SpeechRecognition = new SpeechRec();
    recog.lang = 'en-US';
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = async (event: SpeechRecognitionEvent) => {
      const userInput = event.results[0][0].transcript;
      setUserText(userInput);
      const aiText = await callAI(userInput);
      setAiResponse(aiText);
      speak(aiText);
    };

    recog.start();
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
  };

  const callAI = async (input: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      return data.text;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, something went wrong.';
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">💖 AI Girlfriend 💖</h1>
      <button
        onClick={startListening}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
      >
        Talk to Me
      </button>
      <div className="mt-6 w-full max-w-md">
        <p className="font-semibold">You: <span className="font-normal">{userText}</span></p>
        <p className="font-semibold mt-2">Her: <span className="font-normal">{aiResponse}</span></p>
      </div>
    </main>
  );
}
