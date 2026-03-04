import React, { useState, useEffect } from 'react';
import { FarmerProfile, EligibilityResult } from '../types';
import ProfileSummary from './ProfileSummary';
import EligibilityResults from './EligibilityResults';
import MetricsCard from './MetricsCard';
import ChatBot from './ChatBot';
import FAQ from './FAQ';
import { translations } from '../translations';
import { translateEligibilityResults } from '../services/api';

interface DashboardProps {
  farmerProfile: FarmerProfile;
  eligibilityResults: EligibilityResult[];
  onCheckAnother: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ farmerProfile, eligibilityResults, onCheckAnother }) => {
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [displayResults, setDisplayResults] = useState<EligibilityResult[]>(eligibilityResults);
  const [isTranslating, setIsTranslating] = useState(false);

  const t = translations[language];
  const eligibleCount = displayResults.filter(r => r.isEligible).length;

  useEffect(() => {
    const translate = async () => {
      if (language === 'en-IN') {
        setDisplayResults(eligibilityResults);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await translateEligibilityResults(eligibilityResults, language);
        setDisplayResults(translated);
      } catch (error) {
        console.error("Translation failed", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [language, eligibilityResults]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">{t.reportTitle}</h2>
          <p className="text-gray-400 mt-1">{t.analysisComplete} {farmerProfile.name}.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setLanguage('en-IN')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'en-IN' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi-IN')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'hi-IN' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              हिन्दी
            </button>
          </div>
          <button
            onClick={onCheckAnother}
            className="px-6 py-2 border border-green-500 text-green-400 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] self-start md:self-center"
          >
            {t.checkAnother}
          </button>
        </div>
      </div>

      {isTranslating && (
        <div className="flex items-center justify-center p-12 bg-gray-800/50 rounded-xl border border-gray-700 animate-pulse">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 font-medium">Translating report to {language === 'hi-IN' ? 'Hindi' : 'English'}...</p>
          </div>
        </div>
      )}

      {!isTranslating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
            <ProfileSummary profile={farmerProfile} language={language} />
            <MetricsCard
              totalChecks={1}
              responseTime="1.5s"
              schemesAnalyzed={displayResults.length}
              eligibleCount={eligibleCount}
              language={language}
            />
            <FAQ language={language} />
          </aside>
          <section className="lg:col-span-2 space-y-8">
            <EligibilityResults results={displayResults} language={language} />
            <ChatBot profile={farmerProfile} results={displayResults} language={language} />
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;