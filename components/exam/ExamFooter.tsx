'use client';

import { useExamStore, useCurrentQuestion, useQuestionsInSection } from '@/app/store/exam-store';
import { ChevronLeft, ChevronRight, Flag, RotateCcw } from 'lucide-react';

export function ExamFooter() {
    const {
        currentQuestionIndex,
        currentSection,
        config,
        flagged,
        toggleFlag,
        nextQuestion,
        prevQuestion,
        selectAnswer
    } = useExamStore();

    const currentQuestion = useCurrentQuestion();
    const questions = useQuestionsInSection(currentSection);

    const isFirstQuestion = currentQuestionIndex === 0 && config.selectedSections[0] === currentSection;
    const isLastQuestion = currentQuestionIndex === questions.length - 1 && config.selectedSections[config.selectedSections.length - 1] === currentSection;

    const handleToggleFlag = () => {
        if (currentQuestion) toggleFlag(currentQuestion.id);
    };

    const handleClearResponse = () => {
        if (currentQuestion) selectAnswer(currentQuestion.id, -1);
    };

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 z-40">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                <div className="flex gap-3">
                    <button
                        onClick={handleToggleFlag}
                        className={`px-6 py-2.5 rounded-lg border font-bold transition-colors flex items-center gap-2 ${currentQuestion && flagged.has(currentQuestion.id)
                                ? 'bg-amber-500 border-amber-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Flag className="size-4" />
                        {currentQuestion && flagged.has(currentQuestion.id) ? 'Flagged' : 'Mark for Review'}
                    </button>
                    <button
                        onClick={handleClearResponse}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="size-4" />
                        Clear Response
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={prevQuestion}
                        disabled={isFirstQuestion}
                        className="px-8 py-2.5 rounded-lg border border-[#3182ed] text-[#3182ed] font-bold hover:bg-[#3182ed]/5 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="size-5" />
                        Previous
                    </button>
                    <button
                        onClick={nextQuestion}
                        className="px-10 py-2.5 rounded-lg bg-[#3182ed] text-white font-bold hover:bg-[#3182ed]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#3182ed]/20"
                    >
                        <span>{isLastQuestion ? 'Review Exam' : 'Save & Next'}</span>
                        {!isLastQuestion && <ChevronRight className="size-5" />}
                    </button>
                </div>
            </div>
        </footer>
    );
}
