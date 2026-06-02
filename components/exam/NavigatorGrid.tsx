"use client"
import { useExamStore, useAllQuestions } from '@/app/store/exam-store';
import { SectionType, SECTION_CONFIG } from '@/app/types/exam';
import { cn } from '@/lib/utils';
import { Grid3X3, BookOpen, PenTool, MessageSquare, Headset } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavigatorGridProps {
  currentSection?: SectionType;
  currentIndex?: number;
  onJumpToQuestion: (index: number) => void;
  showAllSections?: boolean;
}

export function NavigatorGrid({
  currentSection,
  currentIndex,
  onJumpToQuestion,
  showAllSections = false, //only show current section by default
}: NavigatorGridProps) {
  const { answers, flagged, jumpToSection, config} = useExamStore();
  const router = useRouter();
  // Get all questions
  const allQuestions = useAllQuestions();
  const selectedSections = config.selectedSections;

  const sectionIcons: Record<SectionType, any> = {
    vocabulary: BookOpen,
    grammar: PenTool,
    reading: MessageSquare,
    listening: Headset,
  };

  // Helper to attach the global index to each question object before filtering
  const questionsWithIndex = allQuestions.map((question, index) => ({
    ...question,
    originalIndex: index,
  }));

  // Filter questions: show all if prop is true, otherwise only show current section
  // We assume 'question.section' exists on the question object based on your types
  const visibleQuestions = questionsWithIndex.filter((question) => {
    if (showAllSections) return true;
    if (!currentSection) return true; // Fallback if no section selected
    return question.section === currentSection;
  });

  function handleReviewExam() {
    router.push('/jlpt/review');
  }

  const getButtonClasses = (questionId: string, index: number) => {
    const isAnswered = questionId in answers;
    const isFlagged = flagged.has(questionId);
    const isCurrent = currentIndex === index;

    return cn(
      "aspect-square flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-all",
      isCurrent && "bg-[#3182ed] text-white ring-2 ring-[#3182ed]/20 ring-offset-2 dark:ring-offset-slate-900",
      !isCurrent && isAnswered && !isFlagged && "bg-emerald-500 text-white",
      !isCurrent && isFlagged && "bg-amber-500 text-white",
      !isCurrent && !isAnswered && !isFlagged && "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Grid3X3 className="text-[#3182ed] size-4" />
          Navigator
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {allQuestions.filter(id => id.id in answers).length} / {allQuestions.length} Done
        </span>
      </div>

      {/* Section Navigator */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
        {selectedSections.map((section) => {
          const Icon = sectionIcons[section];
          const isActive = currentSection === section;
          return (
            <button
              key={section}
              onClick={() => jumpToSection(section)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all",
                isActive
                  ? "bg-white dark:bg-slate-800 shadow-sm text-[#3182ed]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
              title={SECTION_CONFIG[section].title}
            >
              <Icon className="size-4" />
              <span className="text-[9px] font-bold uppercase truncate w-full text-center">
                {SECTION_CONFIG[section].title.substring(0, 3)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#3182ed]"></span>
          <span className="text-[10px] font-semibold text-slate-500">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-semibold text-slate-500">Solved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500"></span>
          <span className="text-[10px] font-semibold text-slate-500">Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
          <span className="text-[10px] font-semibold text-slate-500">Unseen</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-5 gap-2">
          {visibleQuestions.map((question) => (
            <div
              key={question.id}
              onClick={() => onJumpToQuestion(question.originalIndex)}
              // Pass originalIndex to keep highlighting logic correct relative to the whole exam
              className={getButtonClasses(question.id, question.originalIndex)}
            >
              {/* Displays the global question number (e.g., 45) */}
              {question.originalIndex + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => handleReviewExam()}
          className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Review Exam</span>
        </button>
      </div>
    </div>
  );
}