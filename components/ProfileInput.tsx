import React, { useState, useEffect, useCallback } from 'react';
import { FarmerProfile, SocialCategory, EligibilityResult } from '../types';
import { INDIAN_STATES, CROP_TYPES, SOCIAL_CATEGORIES } from '../constants';
import { createFarmerProfile, checkEligibility } from '../services/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { BotIcon } from './icons/AudioIcons';

interface ProfileInputProps {
  onSubmit: (profile: FarmerProfile, results: EligibilityResult[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const hindiNumbers: { [key: string]: string } = {
  'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4', 'पांच': '5',
  'पाँच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9', 'दस': '10',
  'ग्यारह': '11', 'बारह': '12', 'तेरह': '13', 'चौदह': '14', 'पंद्रह': '15',
  'सोलह': '16', 'सत्रह': '17', 'अठारह': '18', 'उन्नीस': '19', 'बीस': '20',
  'आधा': '0.5', 'डेढ़': '1.5', 'ढाई': '2.5',
};

const conversationFlow = [
  {
    key: 'name',
    questions: { 'en-IN': 'What is your full name?', 'hi-IN': 'आपका पूरा नाम क्या है?' },
    parser: (transcript: string) => transcript.trim().replace(/\b(\w)/g, s => s.toUpperCase()),
  },
  {
    key: 'state',
    questions: { 'en-IN': 'Which state are you from?', 'hi-IN': 'आप किस राज्य से हैं?' },
    parser: (transcript: string) => INDIAN_STATES.find(s => transcript.toLowerCase().includes(s.toLowerCase())) || '',
  },
  {
    key: 'district',
    questions: { 'en-IN': 'And what is your district?', 'hi-IN': 'और आपका जिला कौन सा है?' },
    parser: (transcript: string) => transcript.trim().replace(/\b(\w)/g, s => s.toUpperCase()),
  },
  {
    key: 'landHolding',
    questions: { 'en-IN': 'How many acres of land do you have?', 'hi-IN': 'आपके पास कितने एकड़ जमीन है?' },
    parser: (transcript: string) => {
      let processedTranscript = transcript.toLowerCase();
      for (const word in hindiNumbers) {
        processedTranscript = processedTranscript.replace(new RegExp(word, "g"), hindiNumbers[word]);
      }
      const match = processedTranscript.match(/(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : null;
    },
  },
  {
    key: 'cropType',
    questions: { 'en-IN': 'What is your primary crop?', 'hi-IN': 'आपकी मुख्य फसल कौन सी है?' },
    parser: (transcript: string) => CROP_TYPES.find(c => transcript.toLowerCase().includes(c.toLowerCase())) || '',
  },
  {
    key: 'socialCategory',
    questions: { 'en-IN': 'What is your social category? For example, General, OBC, SC, or ST.', 'hi-IN': 'आपकी सामाजिक श्रेणी क्या है? उदाहरण के लिए, सामान्य, ओबीसी, एससी, या एसटी।' },
    parser: (transcript: string) => SOCIAL_CATEGORIES.find(c => transcript.toLowerCase().includes(c.toLowerCase())) || SocialCategory.GENERAL,
  },
];


const ProfileInput: React.FC<ProfileInputProps> = ({ onSubmit, setIsLoading, isLoading }) => {
  const [profile, setProfile] = useState<Omit<FarmerProfile, '_id'>>({
    name: '', state: '', district: '', landHolding: '' as any, cropType: '', socialCategory: SocialCategory.GENERAL,
  });
  const [language, setLanguage] = useState('en-IN');
  const [formError, setFormError] = useState('');

  const [isConversationalMode, setIsConversationalMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assistantStatus, setAssistantStatus] = useState('');
  const [processedTranscript, setProcessedTranscript] = useState('');
  
  const { isListening, transcript, startListening, stopListening, isSupported, error: speechError, resetTranscript } = useSpeechRecognition();
  const { isSpeaking, speak, cancel, isReady: isSpeechReady } = useSpeechSynthesis();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: name === 'landHolding' ? (value === '' ? '' : parseFloat(value)) : value 
    }));
  };
  
  const submitProfile = useCallback(async (profileData: Omit<FarmerProfile, '_id'>) => {
    if (!profileData.name || !profileData.state || !profileData.district || profileData.landHolding <= 0 || !profileData.cropType) {
        setFormError('Please fill all required fields.');
        setIsLoading(false);
        return;
    }
    setFormError('');
    setIsLoading(true);
    try {
      const profileToSubmit = {
        ...profileData,
        landHolding: typeof profileData.landHolding === 'string' ? parseFloat(profileData.landHolding) || 0 : profileData.landHolding
      };
      const newProfile = await createFarmerProfile(profileToSubmit);
      if (newProfile._id) {
        const results = await checkEligibility(newProfile);
        onSubmit(newProfile, results);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setFormError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }, [onSubmit, setIsLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProfile(profile);
  };

  const startConversation = () => {
    setProfile({ name: '', state: '', district: '', landHolding: '' as any, cropType: '', socialCategory: SocialCategory.GENERAL });
    setCurrentQuestionIndex(0);
    setIsConversationalMode(true);
    setProcessedTranscript('');
  };

  const stopConversation = useCallback(() => {
    setIsConversationalMode(false);
    stopListening();
    cancel();
    setAssistantStatus('');
  }, [cancel, stopListening]);
  
  // Effect to ASK a question
  useEffect(() => {
    if (!isConversationalMode || isSpeaking || isListening) return;

    if (currentQuestionIndex >= conversationFlow.length) {
      // This case should ideally not be hit with auto-submission, but as a fallback:
      stopConversation();
      setAssistantStatus('All details collected! Please review the form and click "Check Eligibility".');
      return;
    }

    const currentStep = conversationFlow[currentQuestionIndex];
    const questionText = currentStep.questions[language as keyof typeof currentStep.questions];
    
    setAssistantStatus(`Assistant: "${questionText}"`);

    speak({
      text: questionText,
      lang: language,
      onEnd: () => {
        if (isConversationalMode) {
          resetTranscript();
          startListening(language);
        }
      }
    });
  }, [isConversationalMode, currentQuestionIndex, language, isSpeaking, isListening, speak, startListening, resetTranscript, stopConversation]);

  // Effect to PROCESS the answer
  useEffect(() => {
    if (!isListening && isConversationalMode && transcript && transcript !== processedTranscript) {
      setProcessedTranscript(transcript);
      
      const currentStep = conversationFlow[currentQuestionIndex];
      if (currentStep) {
        const parsedValue = currentStep.parser(transcript);

        if (parsedValue !== null && parsedValue !== '') {
          // Update profile state with the new value
          const updatedProfile = { ...profile, [currentStep.key as keyof FarmerProfile]: parsedValue as any };
          setProfile(updatedProfile);
          
          if (currentQuestionIndex === conversationFlow.length - 1) {
            // This was the LAST question. Auto-submit.
            stopConversation();
            setAssistantStatus('All details collected. Submitting your profile now...');
            // A short delay allows the user to see the final status message
            setTimeout(() => submitProfile(updatedProfile), 500);
          } else {
             // More questions to go.
            setCurrentQuestionIndex(prev => prev + 1);
          }
        } else {
          // If parsing fails, ask the user to repeat.
          const tryAgainText = language === 'hi-IN'
            ? 'माफ़ कीजिए, मैं समझ नहीं पाया। क्या आप दोहरा सकते हैं?'
            : 'Sorry, I did not understand that. Could you please repeat?';
          
          speak({
            text: tryAgainText,
            lang: language,
            onEnd: () => {
              if (isConversationalMode) {
                resetTranscript();
                startListening(language);
              }
            }
          });
        }
      }
    }
  }, [isListening, transcript, processedTranscript, isConversationalMode, currentQuestionIndex, language, speak, startListening, resetTranscript, profile, stopConversation, submitProfile]);

  
  const getHighlightClass = (key: string) => {
    return isConversationalMode && conversationFlow[currentQuestionIndex]?.key === key 
      ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-green-500' 
      : '';
  };

  const inputStyles = "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500/50 focus:border-green-500 transition-all text-gray-200 placeholder-gray-400";

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-gray-100 mb-2">Farmer Profile</h2>
      <p className="text-gray-400 mb-6">Enter your details manually or use our voice assistant.</p>

      {isSupported && (
        <div className="bg-gray-900/50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-400">Fill form with Voice Assistant</p>
              <p className="text-sm text-gray-400">Let us guide you through the form, question by question.</p>
            </div>
            <div className="flex items-center space-x-4">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isConversationalMode} className={`${inputStyles} text-sm`}>
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
              </select>
              <button 
                onClick={isConversationalMode ? stopConversation : startConversation} 
                type="button" 
                disabled={!isSpeechReady}
                className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-all transform hover:scale-105 ${
                  isConversationalMode 
                    ? 'bg-red-600 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]' 
                    : 'bg-green-600 hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                } disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100`}
              >
                <BotIcon className="h-5 w-5 mr-2" />
                {isConversationalMode ? 'Stop Assistant' : (isSpeechReady ? 'Start Assistant' : 'Loading Voices...')}
              </button>
            </div>
          </div>
          {isConversationalMode && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 font-medium">{assistantStatus}</p>
              <div className="mt-2 text-sm text-gray-300 italic h-5">
                {isListening ? "Listening..." : (transcript ? `You said: "${transcript}"` : "")}
              </div>
              {speechError && <p className="text-red-400 text-sm mt-1">{speechError}</p>}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" name="name" id="name" value={profile.name} onChange={handleInputChange} required className={`${inputStyles} ${getHighlightClass('name')}`} />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">State</label>
            <select name="state" id="state" value={profile.state} onChange={handleInputChange} required className={`${inputStyles} ${getHighlightClass('state')}`}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-300 mb-1">District</label>
            <input type="text" name="district" id="district" value={profile.district} onChange={handleInputChange} required className={`${inputStyles} ${getHighlightClass('district')}`} />
          </div>
          <div>
            <label htmlFor="landHolding" className="block text-sm font-medium text-gray-300 mb-1">Land Holding (in acres)</label>
            <input type="number" name="landHolding" id="landHolding" value={profile.landHolding} onChange={handleInputChange} required min="0" step="0.1" className={`${inputStyles} ${getHighlightClass('landHolding')}`} />
          </div>
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-300 mb-1">Primary Crop</label>
            <select name="cropType" id="cropType" value={profile.cropType} onChange={handleInputChange} required className={`${inputStyles} ${getHighlightClass('cropType')}`}>
              <option value="">Select Crop</option>
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="socialCategory" className="block text-sm font-medium text-gray-300 mb-1">Social Category</label>
            <select name="socialCategory" id="socialCategory" value={profile.socialCategory} onChange={handleInputChange} required className={`${inputStyles} ${getHighlightClass('socialCategory')}`}>
              {SOCIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {formError && <p className="text-red-400 text-sm mt-2">{formError}</p>}
        <div className="text-right">
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-500 disabled:bg-gray-600 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] disabled:hover:shadow-none disabled:hover:scale-100">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </>
            ) : "Check Eligibility"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInput;