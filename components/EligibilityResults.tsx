import React from 'react';
import { EligibilityResult } from '../types';
import SchemeCard from './SchemeCard';
import { translations } from '../translations';

interface EligibilityResultsProps {
  results: EligibilityResult[];
  language: 'en-IN' | 'hi-IN';
}

const EligibilityResults: React.FC<EligibilityResultsProps> = ({ results, language }) => {
  const t = translations[language];
  const eligibleSchemes = results.filter(r => r.isEligible);
  const ineligibleSchemes = results.filter(r => !r.isEligible);

  return (
    <div className="space-y-8">
      {/* Eligible Schemes Section */}
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-green-400">{t.eligibleSchemes}</h3>
            <p className="text-gray-400 mt-1">{t.eligibleDescription.replace('{count}', eligibleSchemes.length.toString())}</p>
          </div>
          <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-full font-bold border border-green-500/30">
            {eligibleSchemes.length} {t.available}
          </div>
        </div>
        
        <div className="space-y-6">
          {eligibleSchemes.length > 0 ? (
            eligibleSchemes.map((result, index) => (
              <SchemeCard key={`eligible-${index}`} result={result} language={language} />
            ))
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-xl">
              <p className="text-gray-500">{t.noEligible}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ineligible Schemes Section */}
      {ineligibleSchemes.length > 0 && (
        <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-red-400">{t.notEligible}</h3>
              <p className="text-gray-400 mt-1">{t.restrictedDescription}</p>
            </div>
            <div className="bg-red-900/30 text-red-400 px-4 py-2 rounded-full font-bold border border-red-500/30">
              {ineligibleSchemes.length} {t.restricted}
            </div>
          </div>
          
          <div className="space-y-6">
            {ineligibleSchemes.map((result, index) => (
              <SchemeCard key={`ineligible-${index}`} result={result} language={language} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityResults;