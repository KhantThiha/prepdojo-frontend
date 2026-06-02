// JLPT Exam Types

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type SectionType = 'vocabulary' | 'grammar' | 'reading' | 'listening';

export type FilterType = 'all' | 'answered' | 'unanswered' | 'flagged';
export type QuestionCountMode = 'standard' | 'quick' | 'balanced' | 'custom';
export type TimerMode = 'total' | 'per-section';

export interface Question {
  id: string;
  section: SectionType;
  text: string;
  passage?: string;
  passageTitle?: string;
  audioUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Section {
  type: SectionType;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  questions: Question[];
}

// Accessibility options
export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  extendedTime: boolean; // 1.5x time
  pauseAllowed: boolean;
}

// Exam configuration
export interface ExamConfig {
  selectedSections: SectionType[];
  questionCountMode: QuestionCountMode;
  timerMode: TimerMode;
  accessibility: AccessibilitySettings;
}

export interface ExamState {
  selectedLevel: JLPTLevel | null;
  currentSection: SectionType;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  flagged: Set<string>;
  timeRemaining: number;
  isSubmitted: boolean;
  score: number | null;
  examStartTime: number | null;
  lastTickTime: number | null; // Last time the timer ticked (for sync)
  config: ExamConfig;
  questions: Question[]; // The active set of questions for this exam
  isLoadingQuestions?: boolean;
  error?: string | null;
}

export type AnswerMap = Record<string, number>;

export interface ExamResult {
  totalScore: number; // Raw total
  totalQuestions: number;
  percentage: number;
  scaledScore: number; // 0-180
  passed: boolean; // Must pass both total and per-section minimums
  groupResults: {
    name: string;
    sections: SectionType[];
    correct: number;
    total: number;
    scaledScore: number;
    maxScaled: number;
    passed: boolean;
    passMark: number;
    sectionDetails: {
      section: SectionType;
      correct: number;
      total: number;
    }[];
  }[];
  sectionResults: {
    section: SectionType;
    correct: number;
    total: number;
    percentage: number;
    scaledScore: number; // 0-60
    passed: boolean; // Sectional minimum reached
  }[];
}

// Constants
export const SECTION_CONFIG: Record<SectionType, { title: string; description: string; timeLimit: number; icon: string }> = {
  vocabulary: {
    title: 'Vocabulary',
    description: 'Test your knowledge of Japanese vocabulary',
    timeLimit: 1800, // 30 minutes
    icon: '📚',
  },
  grammar: {
    title: 'Grammar',
    description: 'Test your understanding of Japanese grammar patterns',
    timeLimit: 1800, // 30 minutes
    icon: '✏️',
  },
  reading: {
    title: 'Reading',
    description: 'Test your reading comprehension skills',
    timeLimit: 2700, // 45 minutes
    icon: '📖',
  },
  listening: {
    title: 'Listening',
    description: 'Test your listening comprehension skills',
    timeLimit: 2400, // 40 minutes
    icon: '🎧',
  },
};

export const JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  extendedTime: false,
  pauseAllowed: false,
};

export const DEFAULT_CONFIG: ExamConfig = {
  selectedSections: ['vocabulary', 'grammar', 'reading', 'listening'],
  questionCountMode: 'standard',
  timerMode: 'per-section',
  accessibility: DEFAULT_ACCESSIBILITY,
};
