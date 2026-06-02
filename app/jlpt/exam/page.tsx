"use client"

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, useCurrentQuestion, useQuestionsInSection } from '@/app/store/exam-store';
import { ExamHeader } from '@/components/exam/ExamHeader';
import { ExamFooter } from '@/components/exam/ExamFooter';
import { NavigatorGrid } from '@/components/exam/NavigatorGrid';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { ReadingPassage } from '@/components/exam/ReadingPassage';
import { AudioPlayer } from '@/components/exam/AudioPlayer';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { AudioPlayerProvider } from 'wavesurf';

export default function ExamPage() {
  const router = useRouter();
  const {
    selectedLevel,
    currentSection,
    currentQuestionIndex,
    answers,
    flagged,
    isSubmitted,
    config,
    examStartTime,
    selectAnswer,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    startTimer,
  } = useExamStore();

  const currentQuestion = useCurrentQuestion();
  const sectionQuestions = useQuestionsInSection(currentSection);

  useEffect(() => {
    if (!selectedLevel || !examStartTime) {
      router.push('/jlpt');
      return;
    }
    startTimer();
  }, [selectedLevel, examStartTime, router, startTimer]);

  useEffect(() => {
    if (isSubmitted) {
      router.push('/jlpt/results');
    }
  }, [isSubmitted, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return;
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (currentQuestion) selectAnswer(currentQuestion.id, index);
      }
      if (e.key === 'ArrowLeft') prevQuestion();
      if (e.key === 'ArrowRight') nextQuestion();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, selectAnswer, prevQuestion, nextQuestion, isSubmitted]);

  const handleJumpToQuestion = (index: number) => {
    jumpToQuestion(index);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3182ed]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden">
      <ExamHeader />

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-144px)] max-w-[1920px] mx-auto w-full">
        {/* Reading Passage Area */}
        {currentSection === 'reading' && (
          <ReadingPassage
            title={currentQuestion.passageTitle || "Passage Practice"}
            content={currentQuestion.passage || ""}
          />
        )}

        {/* Main Question Area */}
        <section
          className={`flex flex-col bg-[#f6f7f8] dark:bg-[#101822] overflow-y-auto custom-scrollbar p-6 ${currentSection === 'reading'
            ? 'flex-1 border-r border-slate-200 dark:border-slate-800'
            : 'flex-1'
            }`}
        >
          <div
            className={`w-full flex flex-col gap-4 ${currentSection !== 'reading' ? 'max-w-[1000px] mx-auto' : ''
              }`}
          >
            <div className="flex justify-between items-start">
              <span className={`flex font-bold shrink-0 px-3 py-1 bg-[#3182ed]/10 text-[#3182ed] text-sm rounded-full`}>
                {`Question ${currentQuestionIndex + 1}`}
              </span>
            </div>

            {/* Listening Audio Player */}
            <AudioPlayerProvider>
              {currentSection === 'listening' && (
              <AudioPlayer src={currentQuestion.audioUrl || ""} />
            )}
            </AudioPlayerProvider>
            

            {/* Common Question Card Box */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswerSelect={(index) => selectAnswer(currentQuestion.id, index)}
                disabled={isSubmitted}
              />
            </div>
          </div>
        </section>

        {/* Sidebar Navigation */}
        <aside className="w-80 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
          <NavigatorGrid
            currentSection={currentSection}
            currentIndex={currentQuestionIndex}
            onJumpToQuestion={handleJumpToQuestion}
          />
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <HelpCircle className="size-5" />
              Help Center
            </button>
          </div>
        </aside>
      </main>

      <ExamFooter />
      <div className="h-20 shrink-0"></div> {/* Spacer for fixed footer */}
    </div>
  );
}