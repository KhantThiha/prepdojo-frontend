'use client';

import { useExamStore, useQuestionsInSection } from '@/app/store/exam-store';
import { SECTION_CONFIG } from '@/app/types/exam';
import { School, Timer as TimerIcon } from 'lucide-react';
import { useMemo } from 'react';

export function ExamHeader() {
  const { currentSection, currentQuestionIndex, config, timeRemaining } = useExamStore();
  const questions = useQuestionsInSection(currentSection);
  const sectionConfig = SECTION_CONFIG[currentSection];

  const progress = useMemo(() => {
    if (questions.length === 0) return 0;

    if (config.timerMode === 'total') {
      // Global progress across all questions in the exam
      const allQuestionsInExam = useExamStore.getState().questions;
      return Math.round(((currentQuestionIndex + 1) / allQuestionsInExam.length) * 100);
    } else {
      // Per-section progress
      const sectionQuestions = questions;
      const firstIndexInSection = useExamStore.getState().questions.findIndex(q => q.section === currentSection);
      const relativeIndex = currentQuestionIndex - firstIndexInSection;
      return Math.round(((relativeIndex + 1) / sectionQuestions.length) * 100);
    }
  }, [currentQuestionIndex, questions.length, config.timerMode, currentSection]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-[#3182ed] text-white">
            <School className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">JLPT {useExamStore.getState().selectedLevel} Practice Exam</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{currentSection} Section</p>
          </div>
        </div>

        {/* Progress and Timer */}
        <div className="flex items-center gap-8 flex-1 max-w-2xl px-12">
          <div className="flex-1 hidden sm:block">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-slate-500">Progress</span>
              <span className="text-xs font-bold text-[#3182ed]">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3182ed] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <TimerIcon className={`text-[#3182ed] text-xl ${isLowTime ? 'text-red-500 animate-pulse' : ''}`} size={20} />
            <span className={`font-mono text-lg font-bold tracking-wider ${isLowTime ? 'text-red-500' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="size-10 rounded-full border-2 border-[#3182ed]/20 overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC0yi9d72RcEfq0Wx13Uf1Qf8IB937G3eCjw9HuRuuSYp5pLXxlRMXax0EI-nSgjl5XWbX_Z8JAU0tGRilim2Pt4Tcx66YTLlgvFFYhTeIjdM62xp2wXG39qO1ZW4rU2bHjUSj1M4OaWvzkHZOLr1QlDoNoc9d1XdYEmovDmQ8_HvqYKyHhxub3Mbzb-g-ps98Y1oai_X7FTHdMAfXbdHPY6WROCYVFYX4Kvjy6wWwU00FVLFheO5qCpBIeYWRhyNRaRJ3uS2m6wA"
              alt="User"
            />
          </div>
        </div>
      </div>
    </header>
  );
}