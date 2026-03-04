import { FarmerProfile, EligibilityResult } from '../types';
import { SCHEMES_TO_CHECK } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const createFarmerProfile = async (profileData: Omit<FarmerProfile, '_id'>): Promise<FarmerProfile> => {
  console.log("API: Creating farmer profile...", profileData);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const newProfile: FarmerProfile = {
    _id: `farmer_${new Date().getTime()}`,
    ...profileData,
  };
  console.log("API: Profile created.", newProfile);
  return newProfile;
};

export const checkEligibility = async (profile: FarmerProfile): Promise<EligibilityResult[]> => {
  console.log(`API: Checking eligibility for farmer ${profile.name}...`);
  
  const prompt = `
    Analyze the eligibility of the following farmer for various Indian government agricultural schemes. 
    You are an expert in Indian agricultural policy. Use the most recent and accurate criteria for each scheme.
    
    Farmer Profile:
    - Name: ${profile.name}
    - State: ${profile.state}
    - District: ${profile.district}
    - Land Holding: ${profile.landHolding} acres
    - Primary Crop: ${profile.cropType}
    - Social Category: ${profile.socialCategory}
    
    Schemes to check:
    ${SCHEMES_TO_CHECK.join(', ')}
    
    CRITICAL INSTRUCTIONS:
    1. Accuracy: Be extremely precise. For example, PM-KISAN has specific exclusion criteria (e.g., institutional landholders, income tax payers, etc. - assume the farmer is not an income tax payer unless the name suggests a high-profile entity).
    2. Land Size: Many schemes differentiate between Small/Marginal farmers (up to 2 hectares / ~5 acres) and others.
    3. Customization: The "reasoning" MUST be personalized. Mention the farmer's specific land size, crop, or state if it's a deciding factor.
    4. Negative Results: If not eligible, explain EXACTLY which criteria was not met.
    5. Documents: List actual required documents like "Aadhaar", "Land ROR (7/12)", "Bank Passbook", etc.
    
    For each scheme, provide:
    - schemeName: string
    - isEligible: boolean
    - confidence: number (0-100)
    - proofText: A short excerpt from official guidelines justifying the decision.
    - citation: { page: number | string, section: string }
    - requiredDocuments: string[]
    - reasoning: A clear, personalized explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              schemeName: { type: Type.STRING },
              isEligible: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              proofText: { type: Type.STRING },
              citation: {
                type: Type.OBJECT,
                properties: {
                  page: { type: Type.STRING },
                  section: { type: Type.STRING }
                },
                required: ["page", "section"]
              },
              requiredDocuments: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reasoning: { type: Type.STRING }
            },
            required: ["schemeName", "isEligible", "confidence", "proofText", "citation", "requiredDocuments", "reasoning"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || '[]');
    console.log("API: Eligibility results ready.", results);
    return results;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to a basic response if API fails
    return SCHEMES_TO_CHECK.map(scheme => ({
      schemeName: scheme,
      isEligible: false,
      confidence: 0,
      proofText: "Error connecting to the analysis engine.",
      citation: { page: "N/A", section: "N/A" },
      requiredDocuments: [],
      reasoning: "We encountered an error while processing your request. Please try again later."
    }));
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string, language: string): Promise<string> => {
  console.log(`API: Transcribing audio in ${language}...`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: `Transcribe the following audio accurately. The language is ${language}. Only return the transcription text, nothing else.`
          }
        ]
      }
    });

    const transcription = response.text || "";
    console.log("API: Transcription complete.", transcription);
    return transcription.trim();
  } catch (error) {
    console.error("Transcription Error:", error);
    throw error;
  }
};

export const translateEligibilityResults = async (results: EligibilityResult[], targetLanguage: string): Promise<EligibilityResult[]> => {
  if (targetLanguage === 'en-IN') return results;
  
  console.log(`API: Translating results to ${targetLanguage}...`);
  
  const prompt = `
    Translate the following agricultural eligibility results into ${targetLanguage === 'hi-IN' ? 'Hindi' : 'the target language'}.
    Maintain the JSON structure exactly. Translate only the text values, not the keys or boolean/number values.
    
    Results to translate:
    ${JSON.stringify(results)}
    
    CRITICAL: Return ONLY the translated JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const translated = JSON.parse(response.text || '[]');
    console.log("API: Translation complete.");
    return translated;
  } catch (error) {
    console.error("Translation Error:", error);
    return results; // Fallback to original
  }
};
