
export enum SocialCategory {
  GENERAL = 'General',
  SC = 'SC',
  ST = 'ST',
  OBC = 'OBC',
}

export interface FarmerProfile {
  _id?: string;
  name: string;
  state: string;
  district: string;
  landHolding: number; // in acres
  cropType: string;
  socialCategory: SocialCategory;
}

export interface EligibilityResult {
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  proofText: string;
  citation: {
    page: number | string;
    section: string;
  };
  requiredDocuments: string[];
  reasoning: string;
}
