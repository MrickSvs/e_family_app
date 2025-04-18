export interface FamilyMember {
  id: string;
  name: string;
  age: string;
  role: string;
  dietaryRestrictions: string[];
  adultPreferences?: {
    travelExperience: string[];
    interests: string[];
    comfortLevel: string;
    pacePreference: string;
    accommodationStyle: string[];
  };
  childPreferences?: {
    interests: string[];
    energyLevel: string;
    attentionSpan: string;
    comfortItems: string[];
    specialNeeds: string[];
  };
} 