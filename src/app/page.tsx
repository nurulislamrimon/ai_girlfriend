'use client';

import { useState } from 'react';


export default function Home() {
  const [userText, setUserText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [inputValue, setInputValue] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog: any = new SpeechRec();
    recog.lang = 'en-US';
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = async (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setUserText(spokenText);
      const aiText = await callAI(spokenText);
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

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setUserText(inputValue);
    const aiText = await callAI(inputValue);
    setAiResponse(aiText);
    speak(aiText);
    setInputValue('');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4">
      <h1 className="text-3xl font-bold text-pink-600">💖 AI Girlfriend 💖</h1>

      <div className="flex flex-col items-center space-y-2 w-full max-w-md">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Send
          </button>
          <button
            onClick={startListening}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            🎤 Speak
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md text-left">
        <p><strong>You:</strong> {userText}</p>
        <p className="mt-2"><strong>Her:</strong> {aiResponse}</p>
      </div>
    </main>
  );
}
