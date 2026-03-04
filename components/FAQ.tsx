import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './icons/UiIcons';
import { translations } from '../translations';

interface FAQProps {
  language: 'en-IN' | 'hi-IN';
}

const FAQ: React.FC<FAQProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = translations[language];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-3">{t.commonQuestions}</h3>
      <div className="space-y-3">
        {t.faqs.map((faq, index) => (
          <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-200">{faq.question}</span>
              {openIndex === index ? <ChevronUpIcon className="w-4 h-4 text-green-400" /> : <ChevronDownIcon className="w-4 h-4 text-gray-400" />}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-800/50 text-sm text-gray-400 border-t border-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
