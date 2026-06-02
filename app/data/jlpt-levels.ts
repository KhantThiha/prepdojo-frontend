import { JLPTLevel, SectionType } from '@/app/types/exam';

export interface LevelConfig {
    level: JLPTLevel;
    shortDescription: string;
    fullDescription: string;
    examCount: number;
    difficulty: "Beginner" | "Elementary" | "Intermediate" | "Upper-Intermediate" | "Advanced";
    totalDuration: number; // in minutes
    totalQuestions: number;
    vocabularySize: number;
    grammarPoints: number;
    sections: Record<SectionType, {
        duration: number; // in minutes
        questionCount: number;
    }>;
    passMark: number; // Scaled total pass mark (e.g. 100 for N1)
    sectionPassMark: number; // Scaled sectional pass mark (e.g. 19 for each section/group)
}

export const JLPT_LEVEL_CONFIGS: Record<JLPTLevel, LevelConfig> = {
    N1: {
        level: 'N1',
        shortDescription: "Advanced level - Ability to understand Japanese used in a variety of circumstances.",
        fullDescription: "The highest level of JLPT. Focuses on the ability to understand Japanese used in a variety of complex social situations, including abstract or logically complex materials such as newspaper editorials and critiques.",
        examCount: 108,
        difficulty: "Advanced",
        totalDuration: 170,
        totalQuestions: 105,
        vocabularySize: 10000,
        grammarPoints: 300,
        sections: {
            vocabulary: { duration: 30, questionCount: 20 },
            grammar: { duration: 40, questionCount: 25 },
            reading: { duration: 40, questionCount: 30 },
            listening: { duration: 60, questionCount: 30 },
        },
        passMark: 100,
        sectionPassMark: 19,
    },
    N2: {
        level: 'N2',
        shortDescription: "Upper-intermediate level - Ability to understand Japanese used in everyday situations plus social.",
        fullDescription: "Focuses on the ability to understand Japanese used in everyday situations and a variety of social situations, including newspaper articles and news reports on a wider range of topics.",
        examCount: 95,
        difficulty: "Upper-Intermediate",
        totalDuration: 155,
        totalQuestions: 95,
        vocabularySize: 6000,
        grammarPoints: 200,
        sections: {
            vocabulary: { duration: 30, questionCount: 20 },
            grammar: { duration: 35, questionCount: 20 },
            reading: { duration: 40, questionCount: 25 },
            listening: { duration: 50, questionCount: 30 },
        },
        passMark: 90,
        sectionPassMark: 19,
    },
    N3: {
        level: 'N3',
        shortDescription: "Intermediate level - Bridge between basic and advanced Japanese.",
        fullDescription: "The bridge between N4/N5 and N1/N2. Focuses on the ability to understand Japanese used in everyday situations to a certain degree, including news summaries and slightly difficult reading materials on specific daily topics.",
        examCount: 120,
        difficulty: "Intermediate",
        totalDuration: 140,
        totalQuestions: 90,
        vocabularySize: 3750,
        grammarPoints: 100,
        sections: {
            vocabulary: { duration: 35, questionCount: 25 },
            grammar: { duration: 35, questionCount: 20 },
            reading: { duration: 30, questionCount: 15 },
            listening: { duration: 40, questionCount: 30 },
        },
        passMark: 95,
        sectionPassMark: 19,
    },
    N4: {
        level: 'N4',
        shortDescription: "Elementary level - Ability to understand basic Japanese on daily topics.",
        fullDescription: "Ability to understand basic Japanese. Focuses on the ability to understand Japanese used in daily life situations, including short passages on familiar topics written with basic vocabulary and kanji.",
        examCount: 85,
        difficulty: "Elementary",
        totalDuration: 125,
        totalQuestions: 85,
        vocabularySize: 1500,
        grammarPoints: 100,
        sections: {
            vocabulary: { duration: 30, questionCount: 30 },
            grammar: { duration: 30, questionCount: 20 },
            reading: { duration: 30, questionCount: 10 },
            listening: { duration: 35, questionCount: 25 },
        },
        passMark: 90,
        sectionPassMark: 19, // In N4/N5, sections are grouped: (Vocab+Grammar+Reading) and (Listening)
    },
    N5: {
        level: 'N5',
        shortDescription: "Beginner level - Ability to understand some basic Japanese phrases and sentences.",
        fullDescription: "The introductory level. Focuses on the ability to understand some basic Japanese, including standard expressions, basic kanji, and very short, simple passages on everyday topics.",
        examCount: 72,
        difficulty: "Beginner",
        totalDuration: 105,
        totalQuestions: 75,
        vocabularySize: 800,
        grammarPoints: 100,
        sections: {
            vocabulary: { duration: 25, questionCount: 25 },
            grammar: { duration: 25, questionCount: 20 },
            reading: { duration: 25, questionCount: 10 },
            listening: { duration: 30, questionCount: 20 },
        },
        passMark: 80,
        sectionPassMark: 19,
    }
};
