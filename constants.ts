
import { SocialCategory } from './types';

export const INDIAN_STATES: string[] = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const CROP_TYPES: string[] = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Pulses", 
  "Groundnut", "Mustard", "Jute", "Tea", "Coffee", "Vegetables", "Fruits"
];

export const SOCIAL_CATEGORIES: SocialCategory[] = [
  SocialCategory.GENERAL,
  SocialCategory.OBC,
  SocialCategory.SC,
  SocialCategory.ST,
];

export const SCHEMES_TO_CHECK = [
  "PM-KISAN",
  "PM-KUSUM",
  "Kisan Credit Card (KCC)",
  "PMFBY",
  "Agri-Infrastructure Fund"
];
