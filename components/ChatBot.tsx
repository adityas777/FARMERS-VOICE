import React, { useState, useRef, useEffect } from 'react';
import { FarmerProfile, EligibilityResult } from '../types';
import { GoogleGenAI } from "@google/genai";
import { SendIcon } from './icons/UiIcons';
import { BotIcon } from './icons/AudioIcons';
import { translations } from '../translations';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

interface ChatBotProps {
  profile: FarmerProfile;
  results: EligibilityResult[];
  language: 'en-IN' | 'hi-IN';
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const ChatBot: React.FC<ChatBotProps> = ({ profile, results, language }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: `${t.hello} ${profile.name}! ${t.botGreeting}` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when language changes
  useEffect(() => {
    setMessages([
      { role: 'bot', text: `${t.hello} ${profile.name}! ${t.botGreeting}` }
    ]);
  }, [language, profile.name, t.hello, t.botGreeting]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const context = `
      User Profile:
      - Name: ${profile.name}
      - State: ${profile.state}
      - District: ${profile.district}
      - Land Holding: ${profile.landHolding} acres
      - Crop: ${profile.cropType}
      - Category: ${profile.socialCategory}

      Eligibility Results:
      ${results.map(r => `- ${r.schemeName}: ${r.isEligible ? 'Eligible' : 'Not Eligible'}. Reasoning: ${r.reasoning}`).join('\n')}
    `;

    const prompt = `
      You are a helpful assistant for "Niti-Setu", a platform that helps Indian farmers find government schemes.
      The user is asking a question about their eligibility report or general agricultural schemes.
      
      Context:
      ${context}
      
      User Question: "${userMessage}"
      
      Instructions:
      1. Answer the user's question accurately based on the context provided and your knowledge of Indian agricultural schemes.
      2. If the user asks in a language other than English (like Hindi, Marathi, etc.), respond in that same language.
      3. Be polite, helpful, and concise.
      4. If you don't know the answer, suggest they contact their local agricultural office.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex items-center space-x-3">
        <div className="bg-green-900/50 p-2 rounded-full border border-green-500/30">
          <BotIcon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100">{t.nitiSetuAssistant}</h3>
          <p className="text-xs text-gray-400">{t.askDoubts}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-400 p-3 rounded-lg rounded-bl-none border border-gray-600 text-sm animate-pulse">
              {t.assistantThinking}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900/30">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.typeQuestion}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 p-2 rounded-lg transition-colors"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
