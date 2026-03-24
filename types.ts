
export enum TurnaroundPhase {
  SURGERY = 'Phase 1: Surgery',
  RESUSCITATION = 'Phase 2: Resuscitation',
  THERAPY = 'Phase 3: Therapy'
}

// The 12 Specific Styles defined by Dr. Teng's framework
export type SurgeryStyle = 'Benevolent Autocratic' | 'Paternalistic' | 'Task-Oriented' | 'Transactional';
export type ResuscitationStyle = 'Democratic' | 'Collaborative' | 'Participative' | 'Coaching';
export type TherapyStyle = 'Spiritual' | 'Servant Leadership' | 'Values-Driven' | 'Inspirational';

export type LeadershipStyle = SurgeryStyle | ResuscitationStyle | TherapyStyle | 'Unknown';

export interface ScenarioOption {
  id: string;
  text: string;
  mappedStyle: LeadershipStyle;
}

export interface Scenario {
  id: string;
  phase: TurnaroundPhase;
  title: string;
  description: string;
  context: string;
  options: ScenarioOption[];
}

export interface Feedback {
  score: number; // 0-100
  analysis: string;
  coachingTips: string[];
  recommendedAction: string;
  leadershipTrait: LeadershipStyle; 
  scriptureCitation?: string; // For Faith-Based mode
}

export interface AssessmentState {
  email: string;
  industry: string; // Added for benchmarking
  country: string;  // Added for benchmarking
  isFaithBased: boolean;
  isDemo?: boolean; // Added to track if this is a demo run
  currentScenarioIndex: number; // 0 to 17
  history: {
    phase: TurnaroundPhase;
    scenario: Scenario;
    userChoiceId: string;
    feedback: Feedback;
  }[];
  totalScore: number;
  finalReport?: {
    executiveSummary: string;
    detailedAnalysis: string; // ~2000 words
    prayerContent?: string; // ~750 words (Faith only)
    prayerGuidance?: string;
  };
}

export interface ChartDataPoint {
  name: string;
  score: number;
  fullMark: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
