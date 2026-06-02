import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamState, JLPTLevel, SectionType, ExamResult, SECTION_CONFIG, ExamConfig, DEFAULT_CONFIG, Question, QuestionCountMode } from '@/app/types/exam';
import { fetchAndFilterExamQuestions } from '@/app/data/fetch-exam';
import { JLPT_LEVEL_CONFIGS } from '@/app/data/jlpt-levels';

interface ExamStore extends ExamState {
  // Actions
  selectLevel: (level: JLPTLevel) => void;
  updateConfig: (config: Partial<ExamConfig>) => void;
  applyConfigAndStart: () => Promise<void>;
  selectAnswer: (questionId: string, index: number) => void;
  toggleFlag: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  jumpToSection: (section: SectionType) => void;
  calculateScore: () => ExamResult;
  submitExam: () => void;
  startTimer: () => void;
  tick: () => void;
  resetExam: () => void;

  // Timer interval reference
  _timerInterval: NodeJS.Timeout | null;
  _setTimerInterval: (interval: NodeJS.Timeout | null) => void;
}

const initialState: ExamState = {
  selectedLevel: null,
  currentSection: 'vocabulary',
  currentQuestionIndex: 0,
  answers: {},
  flagged: new Set<string>(),
  timeRemaining: SECTION_CONFIG.vocabulary.timeLimit,
  isSubmitted: false,
  score: null,
  examStartTime: null,
  lastTickTime: null,
  config: DEFAULT_CONFIG,
  questions: [],
  isLoadingQuestions: false,
  error: null,
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      _timerInterval: null,

      _setTimerInterval: (interval) => set({ _timerInterval: interval }),

      selectLevel: (level) => {
        set({
          selectedLevel: level,
          config: DEFAULT_CONFIG,
        });
      },

      updateConfig: (configUpdate) => {
        set((state) => ({
          config: { ...state.config, ...configUpdate },
        }));
      },

      applyConfigAndStart: async () => {
        const state = get();
        if (!state.selectedLevel) return;

        set({ isLoadingQuestions: true, error: null });

        try {
          const questions = await fetchAndFilterExamQuestions(state.selectedLevel, state.config);

          if (questions.length === 0) {
            set({ error: 'No questions found for the selected configuration.', isLoadingQuestions: false });
            return;
          }

          const firstSection = questions[0].section;
          const timeMultiplier = state.config.accessibility.extendedTime ? 1.5 : 1;

          let initialTimeRemaining = 0;
          if (state.config.timerMode === 'total') {
            initialTimeRemaining = state.config.selectedSections.reduce((acc, section) => {
              return acc + (SECTION_CONFIG[section].timeLimit * timeMultiplier);
            }, 0);
          } else {
            initialTimeRemaining = Math.floor(SECTION_CONFIG[firstSection].timeLimit * timeMultiplier);
          }

          const now = Date.now();
          set({
            questions,
            currentSection: firstSection,
            currentQuestionIndex: 0,
            timeRemaining: Math.floor(initialTimeRemaining),
            answers: {},
            flagged: new Set<string>(),
            isSubmitted: false,
            score: null,
            examStartTime: now,
            lastTickTime: now,
            isLoadingQuestions: false,
          });
        } catch (error) {
          console.error('Error fetching questions:', error);
          set({ error: 'Failed to load questions. Please check if the backend API is running.', isLoadingQuestions: false });
        }
      },

      selectAnswer: (questionId, index) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: index },
        }));
      },

      toggleFlag: (questionId) => {
        set((state) => {
          const newFlagged = new Set(state.flagged);
          if (newFlagged.has(questionId)) {
            newFlagged.delete(questionId);
          } else {
            newFlagged.add(questionId);
          }
          return { flagged: newFlagged };
        });
      },

      nextQuestion: () => {
        const state = get();
        const timeMultiplier = state.config.accessibility.extendedTime ? 1.5 : 1;

        if (state.currentQuestionIndex < state.questions.length - 1) {
          const nextIndex = state.currentQuestionIndex + 1;
          const nextQuestion = state.questions[nextIndex];

          const updates: Partial<ExamStore> = {
            currentQuestionIndex: nextIndex,
            lastTickTime: Date.now(), // Sync point
          };

          if (nextQuestion.section !== state.currentSection) {
            updates.currentSection = nextQuestion.section;
            if (state.config.timerMode === 'per-section') {
              updates.timeRemaining = Math.floor(SECTION_CONFIG[nextQuestion.section].timeLimit * timeMultiplier);
            }
          }

          set(updates);
        }
      },

      prevQuestion: () => {
        const state = get();
        const timeMultiplier = state.config.accessibility.extendedTime ? 1.5 : 1;

        if (state.currentQuestionIndex > 0) {
          const prevIndex = state.currentQuestionIndex - 1;
          const prevQuestion = state.questions[prevIndex];

          const updates: Partial<ExamStore> = {
            currentQuestionIndex: prevIndex,
            lastTickTime: Date.now(), // Sync point
          };

          if (prevQuestion.section !== state.currentSection) {
            updates.currentSection = prevQuestion.section;
            if (state.config.timerMode === 'per-section') {
              updates.timeRemaining = Math.floor(SECTION_CONFIG[prevQuestion.section].timeLimit * timeMultiplier);
            }
          }

          set(updates);
        }
      },

      jumpToQuestion: (index) => {
        const state = get();
        const targetQuestion = state.questions[index];
        if (!targetQuestion) return;

        const updates: Partial<ExamStore> = {
          currentQuestionIndex: index,
          lastTickTime: Date.now(), // Sync point
        };

        if (targetQuestion.section !== state.currentSection) {
          const timeMultiplier = state.config.accessibility.extendedTime ? 1.5 : 1;
          updates.currentSection = targetQuestion.section;
          if (state.config.timerMode === 'per-section') {
            updates.timeRemaining = Math.floor(SECTION_CONFIG[targetQuestion.section].timeLimit * timeMultiplier);
          }
        }

        set(updates);
      },

      jumpToSection: (section) => {
        const state = get();
        const timeMultiplier = state.config.accessibility.extendedTime ? 1.5 : 1;

        const firstQuestionIndexOfSection = state.questions.findIndex(q => q.section === section);

        if (firstQuestionIndexOfSection !== -1) {
          const updates: Partial<ExamStore> = {
            currentSection: section,
            currentQuestionIndex: firstQuestionIndexOfSection,
            lastTickTime: Date.now(), // Sync point
          };

          if (state.config.timerMode === 'per-section') {
            updates.timeRemaining = Math.floor(SECTION_CONFIG[section].timeLimit * timeMultiplier);
          }

          set(updates);
        }
      },

      calculateScore: () => {
        const state = get();
        if (!state.selectedLevel) return { totalScore: 0, totalQuestions: 0, percentage: 0, scaledScore: 0, passed: false, sectionResults: [], groupResults: [] };

        const levelConfig = JLPT_LEVEL_CONFIGS[state.selectedLevel];
        const selectedSections = state.config.selectedSections;

        const isN4N5 = state.selectedLevel === 'N4' || state.selectedLevel === 'N5';

        const sectionGroups: Record<string, { sections: SectionType[]; maxScaled: number; passMark: number }> = isN4N5
          ? {
            'Language Knowledge & Reading': { sections: ['vocabulary', 'grammar', 'reading'], maxScaled: 120, passMark: 38 },
            'Listening': { sections: ['listening'], maxScaled: 60, passMark: 19 }
          }
          : {
            'Language Knowledge': { sections: ['vocabulary', 'grammar'], maxScaled: 60, passMark: 19 },
            'Reading': { sections: ['reading'], maxScaled: 60, passMark: 19 },
            'Listening': { sections: ['listening'], maxScaled: 60, passMark: 19 }
          };

        let totalCorrect = 0;
        let totalQuestionsCount = 0;
        const sectionResults: ExamResult['sectionResults'] = [];
        const groupResults: ExamResult['groupResults'] = [];

        for (const [groupName, groupDef] of Object.entries(sectionGroups)) {
          let groupCorrect = 0;
          let groupTotal = 0;
          const sectionDetails: { section: SectionType; correct: number; total: number }[] = [];

          for (const section of groupDef.sections) {
            if (!selectedSections.includes(section)) continue;

            const sectionQuestions = state.questions.filter(q => q.section === section);
            let sectionCorrect = 0;
            for (const q of sectionQuestions) {
              if (state.answers[q.id] === q.correctIndex) sectionCorrect++;
            }

            groupCorrect += sectionCorrect;
            groupTotal += sectionQuestions.length;

            sectionDetails.push({
              section,
              correct: sectionCorrect,
              total: sectionQuestions.length
            });

            sectionResults.push({
              section,
              correct: sectionCorrect,
              total: sectionQuestions.length,
              percentage: sectionQuestions.length > 0 ? Math.round((sectionCorrect / sectionQuestions.length) * 100) : 0,
              scaledScore: 0,
              passed: false
            });
          }

          const scaled = groupTotal > 0 ? Math.round((groupCorrect / groupTotal) * groupDef.maxScaled) : 0;
          const passed = scaled >= groupDef.passMark;

          groupResults.push({
            name: groupName,
            sections: groupDef.sections,
            correct: groupCorrect,
            total: groupTotal,
            scaledScore: scaled,
            maxScaled: groupDef.maxScaled,
            passed,
            passMark: groupDef.passMark,
            sectionDetails
          });

          totalCorrect += groupCorrect;
          totalQuestionsCount += groupTotal;
        }

        const totalScaledScore = groupResults.reduce((acc, g) => acc + g.scaledScore, 0);
        const allSectionsPassed = groupResults.every(g => g.passed);
        const passedTotal = totalScaledScore >= levelConfig.passMark;
        const finalPassed = allSectionsPassed && passedTotal;

        sectionResults.forEach(res => {
          const group = Object.values(sectionGroups).find(g => g.sections.includes(res.section));
          const groupName = Object.keys(sectionGroups).find(key => sectionGroups[key] === group);
          const groupRes = groupResults.find(g => g.name === groupName);
          if (groupRes) {
            res.passed = groupRes.passed;
            res.scaledScore = res.total > 0 ? Math.round((res.correct / res.total) * (groupRes.scaledScore * (res.total / groupRes.total))) : 0;
          }
        });

        return {
          totalScore: totalCorrect,
          totalQuestions: totalQuestionsCount,
          percentage: totalQuestionsCount > 0 ? Math.round((totalCorrect / totalQuestionsCount) * 100) : 0,
          scaledScore: totalScaledScore,
          passed: finalPassed,
          sectionResults,
          groupResults
        };
      },

      submitExam: () => {
        const state = get();
        const result = state.calculateScore();

        if (state._timerInterval) {
          clearInterval(state._timerInterval);
        }

        set({
          isSubmitted: true,
          score: result.totalScore,
          _timerInterval: null,
          lastTickTime: null,
        });
      },

      startTimer: () => {
        const state = get();

        if (state._timerInterval) {
          clearInterval(state._timerInterval);
        }

        // Sync timer first
        if (state.lastTickTime && !state.isSubmitted) {
          const elapsedSeconds = Math.floor((Date.now() - state.lastTickTime) / 1000);
          if (elapsedSeconds > 0) {
            const newTime = Math.max(0, state.timeRemaining - elapsedSeconds);
            set({ timeRemaining: newTime });

            if (newTime === 0) {
              state.submitExam();
              return;
            }
          }
        }

        const interval = setInterval(() => {
          get().tick();
        }, 1000);

        set({
          _timerInterval: interval,
          lastTickTime: Date.now()
        });
      },

      tick: () => {
        const state = get();
        const now = Date.now();

        if (state.timeRemaining <= 0) {
          if (state._timerInterval) {
            clearInterval(state._timerInterval);
          }
          state.submitExam();
          return;
        }

        set({
          timeRemaining: state.timeRemaining - 1,
          lastTickTime: now
        });
      },

      resetExam: () => {
        const state = get();
        if (state._timerInterval) {
          clearInterval(state._timerInterval);
        }

        set({
          ...initialState,
          _timerInterval: null,
        });
      },
    }),
    {
      name: 'jlpt-exam-storage',
      partialize: (state) => ({
        selectedLevel: state.selectedLevel,
        currentSection: state.currentSection,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        flagged: Array.from(state.flagged),
        timeRemaining: state.timeRemaining,
        isSubmitted: state.isSubmitted,
        score: state.score,
        examStartTime: state.examStartTime,
        lastTickTime: state.lastTickTime,
        config: state.config,
        questions: state.questions,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.flagged = new Set(state.flagged as unknown as string[]);
        }
      },
    }
  )
);

// Selector hooks for optimized re-renders
export const useCurrentQuestion = () => {
  const currentIndex = useExamStore((state) => state.currentQuestionIndex);
  const questions = useExamStore((state) => state.questions);
  return questions[currentIndex];
};

export const useQuestionsInSection = (section: SectionType) => {
  const questions = useExamStore((state) => state.questions);
  return questions.filter(q => q.section === section);
};

export const useAllQuestions = () => {
  return useExamStore((state) => state.questions);
};