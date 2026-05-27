export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type SpecialMode =
  | 'voice'
  | 'content'
  | 'campaign'
  | 'social'
  | 'analytics'
  | 'report'
  | 'search'
  | 'government';

export type CommandMode = 'short' | 'detail';

export type SelectedLanguage = 'english' | 'hindi' | 'mixed';

export interface CampaignData {
  campaignName: string;
  targetAudience: string;
  campaignTheme: string;
  location: string;
}

export interface ImpactData {
  population: number;
  days: number;
  totalCollected: number;
  allocations: {
    education: number;
    healthcare: number;
    communityWelfare: number;
    emergencyAid: number;
  };
  impactMetrics: {
    mealsProvided: number;
    scholarshipsSupported: number;
    medicalCampsSupported: number;
    drinkingWaterWellsRecon: number;
  };
}

export interface PresetFAQ {
  id: string;
  question: string;
  category: string;
  hindiQuestion: string;
}
