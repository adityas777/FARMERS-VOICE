import React, { useState } from 'react';
import { EligibilityResult } from '../types';
import { CheckCircleIcon, XCircleIcon, VolumeUpIcon, DocumentTextIcon, ClipboardListIcon, ChatAlt2Icon } from './icons/ResultIcons';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { translations } from '../translations';

interface SchemeCardProps {
  result: EligibilityResult;
  language: 'en-IN' | 'hi-IN';
}

type ActiveTab = 'reasoning' | 'proof' | 'documents';

const SchemeCard: React.FC<SchemeCardProps> = ({ result, language }) => {
  const { isSpeaking, speak, cancel, isSupported } = useSpeechSynthesis();
  const [activeTab, setActiveTab] = useState<ActiveTab>('reasoning');
  const t = translations[language];

  const handleListen = () => {
    if (isSpeaking) {
      cancel();
    } else {
      let summaryText = '';
      if (language === 'hi-IN') {
        summaryText = `
          ${result.schemeName} के लिए पात्रता स्थिति ${result.isEligible ? 'पात्र' : 'पात्र नहीं'} है।
          तर्क: ${result.reasoning}।
          दस्तावेज़ से प्रमाण कहता है: ${result.proofText}।
        `;
      } else {
        summaryText = `
          Eligibility status for ${result.schemeName} is ${result.isEligible ? 'Eligible' : 'Not Eligible'}.
          Reasoning: ${result.reasoning}.
          The proof from the document states: ${result.proofText}.
        `;
      }
      speak({ text: summaryText, lang: language });
    }
  };

  const TabButton: React.FC<{ tabName: ActiveTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-green-900/50 text-green-300'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden transition-all bg-gray-800 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] hover:border-gray-600">
      {/* Header */}
      <div className={`p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between ${result.isEligible ? 'bg-green-900/60 border-green-500/30' : 'bg-red-900/60 border-red-500/30'} border-b`}>
        <h4 className="text-lg font-bold text-gray-100">{result.schemeName}</h4>
        <div className={`flex items-center mt-2 sm:mt-0 px-3 py-1.5 rounded-full text-sm font-bold ${result.isEligible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {result.isEligible ? <CheckCircleIcon /> : <XCircleIcon />}
          <span className="ml-2">{result.isEligible ? t.eligibleSchemesMetric : t.notEligible}</span>
          <span className="ml-3 pl-3 text-xs font-medium opacity-80 border-l border-current/50">
            {result.confidence}% {t.confidence}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-700 pb-3 mb-4">
          <TabButton tabName="reasoning" label={t.aiReasoning} icon={<ChatAlt2Icon className="w-4 h-4" />} />
          <TabButton tabName="proof" label={t.proofFromDocument} icon={<DocumentTextIcon className="w-4 h-4" />} />
          {result.isEligible && (
            <TabButton tabName="documents" label={t.requiredDocuments} icon={<ClipboardListIcon className="w-4 h-4" />} />
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[120px]">
          {activeTab === 'reasoning' && (
            <div className="text-sm text-gray-300 space-y-2">
                <p>{result.reasoning}</p>
                {isSupported && (
                    <button 
                      onClick={handleListen} 
                      className="inline-flex items-center text-sm font-medium text-green-400 hover:text-green-300 pt-2 transition-all transform hover:scale-105"
                    >
                        <VolumeUpIcon isSpeaking={isSpeaking} />
                        <span className="ml-2">{isSpeaking ? t.stopListening : t.listenToSummary}</span>
                    </button>
                )}
            </div>
          )}
          {activeTab === 'proof' && (
             <div className="bg-yellow-900/50 border border-yellow-500/30 rounded-lg p-4 text-sm">
                <blockquote className="text-yellow-200 italic border-l-4 border-yellow-500 pl-4">
                    "{result.proofText}"
                </blockquote>
                <p className="text-xs text-yellow-400 mt-3 font-semibold text-right">
                    {t.source}: {t.page} {result.citation.page}, {result.citation.section}
                </p>
            </div>
          )}
          {activeTab === 'documents' && result.isEligible && (
            <div>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                    {result.requiredDocuments.map((doc, i) => <li key={i} className="pl-2">{doc}</li>)}
                </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;