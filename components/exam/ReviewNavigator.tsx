'use client';

import { useExamStore, useAllQuestions } from '@/app/store/exam-store';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { FilterType } from '@/app/types/exam';

interface ReviewNavigatorProps {
    filter: FilterType;
    onQuestionClick: (questionId: string) => void;
    selectedQuestionId: string | null;
}

export function ReviewNavigator({
    filter,
    onQuestionClick,
    selectedQuestionId,
}: ReviewNavigatorProps) {
    const { answers, flagged } = useExamStore();
    const allQuestions = useAllQuestions();

    const filteredQuestions = allQuestions.map((q, index) => ({ ...q, originalIndex: index })).filter((q) => {
        const isAnswered = q.id in answers;
        const isFlagged = flagged.has(q.id);
        switch (filter) {
            case 'answered':
                return isAnswered;
            case 'unanswered':
                return !isAnswered;
            case 'flagged':
                return isFlagged;
            default:
                return true;
        }
    });

    const getButtonClasses = (questionId: string) => {
        const isAnswered = questionId in answers;
        const isFlagged = flagged.has(questionId);
        const isSelected = selectedQuestionId === questionId;

        return cn(
            "aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all relative cursor-pointer",
            isAnswered && !isFlagged && "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:shadow-md",
            isFlagged && "border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:shadow-md",
            !isAnswered && !isFlagged && "border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary/50",
            isSelected && "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 border-primary"
        );
    };

    return (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {filteredQuestions.map((question) => (
                <button
                    key={question.id}
                    onClick={() => onQuestionClick(question.id)}
                    className={getButtonClasses(question.id)}
                >
                    {question.originalIndex + 1}
                    {flagged.has(question.id) && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-amber-500 text-white rounded-full p-0.5">
                            <Flag className="size-2.5 fill-current" />
                        </span>
                    )}
                </button>
            ))}
            {filteredQuestions.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500 italic">
                    No questions match this filter.
                </div>
            )}
        </div>
    );
}
