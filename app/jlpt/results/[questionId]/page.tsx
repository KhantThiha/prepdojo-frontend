'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamStore, useAllQuestions } from '@/app/store/exam-store';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Book,
  Video,
  HelpCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function QuestionExplanationPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = parseInt(params.questionId as string, 10);

  const { selectedLevel, isSubmitted, answers } = useExamStore();
  const allQuestions = useAllQuestions();

  useEffect(() => {
    if (!selectedLevel || !isSubmitted) {
      router.push('/jlpt');
    }
  }, [selectedLevel, isSubmitted, router]);

  const question = useMemo(() =>
    (questionId >= 1 && questionId <= allQuestions.length)
      ? allQuestions[questionId - 1]
      : null
    , [allQuestions, questionId]);

  const sectionAccuracy = useMemo(() => {
    if (!question) return 0;
    const sectionQuestions = allQuestions.filter(q => q.section === question.section);
    const correctCount = sectionQuestions.filter(q => answers[q.id] === q.correctIndex).length;
    return Math.round((correctCount / sectionQuestions.length) * 100);
  }, [allQuestions, question, answers]);

  if (!selectedLevel || !isSubmitted || !question) {
    if (selectedLevel && isSubmitted && !question) {
      router.push('/jlpt/results');
    }
    return null;
  }

  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctIndex;
  const isAnswered = question.id in answers;

  const prevQuestionId = questionId > 1 ? questionId - 1 : null;
  const nextQuestionId = questionId < allQuestions.length ? questionId + 1 : null;

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 lg:px-20 py-8 flex-1">
        {/* Breadcrumbs & Actions */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <Link href="/jlpt" className="hover:text-[#3182ed]">Home</Link>
              <ChevronRight className="size-3" />
              <Link href="/jlpt/results" className="hover:text-[#3182ed]">Exam Results</Link>
              <ChevronRight className="size-3" />
              <span className="text-slate-900 dark:text-slate-200 font-medium">Detailed Explanation</span>
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight">Question {questionId} Review</h1>
            <p className="text-slate-500 mt-1 capitalize">{question.section}: {selectedLevel} Level</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold hover:bg-slate-200 transition-colors h-10"
              onClick={() => router.push('/jlpt/results')}
            >
              <ArrowLeft className="size-4" />
              Back to Results
            </Button>
          </div>
        </div>

        {/* Question & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* The Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                {isAnswered ? (
                  <span className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
                    isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  )}>
                    {isCorrect ? (
                      <><CheckCircle2 className="size-3 mr-1" /> Correct</>
                    ) : (
                      <><X className="size-3 mr-1" /> Incorrect</>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    Not Answered
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section: {question.section}</span>
              </div>

              <div className="space-y-6">
                {question.passage && (
                  <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-[#3182ed] text-slate-800 dark:text-slate-200 overflow-auto max-h-[400px]">
                    <p className="leading-relaxed whitespace-pre-wrap">{question.passage}</p>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">{question.text}</h3>

                <div className="space-y-4">
                  {question.options.map((option, index) => {
                    const isSelected = userAnswer === index;
                    const isCorrectOption = question.correctIndex === index;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border-2 transition-colors relative overflow-hidden",
                          isCorrectOption
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                            : (isSelected && !isCorrect
                              ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                              : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30")
                        )}
                      >
                        <span className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                          isCorrectOption
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : (isSelected && !isCorrect
                              ? "bg-red-500 border-red-500 text-white"
                              : "border-slate-300 dark:border-slate-700 text-slate-500")
                        )}>
                          {index + 1}
                        </span>
                        <p className={cn(
                          "pt-1 font-medium leading-relaxed",
                          isCorrectOption ? "text-emerald-700 dark:text-emerald-400" : (isSelected && !isCorrect ? "text-red-700 dark:text-red-400" : "text-slate-700 dark:text-slate-300")
                        )}>
                          {option}
                        </p>
                        {isCorrectOption && <CheckCircle2 className="absolute right-4 top-4 size-5 text-emerald-500" />}
                        {isSelected && !isCorrect && <XCircle className="absolute right-4 top-4 size-5 text-red-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Explanation Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="size-6 text-[#3182ed]" />
                <h3 className="text-xl font-bold">Detailed Explanation</h3>
              </div>
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Meaning & Usage</h4>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                    {question.explanation.split('\n\n')[0]}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Why Correct?</h4>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-lg text-sm leading-relaxed border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium">
                    {question.explanation.split('\n\n')[1] || "This represents the best contextual usage among the provided options."}
                  </div>
                </section>

                {!isCorrect && isAnswered && (
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identifying the Error</h4>
                    <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-lg text-sm leading-relaxed border-l-4 border-red-500 text-red-800 dark:text-red-300 font-medium">
                      Your answer choice did not quite fit the context or grammatical constraints required for this question.
                    </div>
                  </section>
                )}

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Grammar Points / Nuances</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {question.explanation.split('\n\n')[2] || "Pay close attention to the verb conjugation and particles used in the question stem."}
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Study Resources</h4>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between p-3 rounded-lg bg-[#3182ed]/5 hover:bg-[#3182ed]/10 text-[#3182ed] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Book className="size-5" />
                    <span className="text-sm font-semibold">Grammar Dictionary</span>
                  </div>
                  <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex w-full items-center justify-between p-3 rounded-lg bg-[#3182ed]/5 hover:bg-[#3182ed]/10 text-[#3182ed] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Video className="size-5" />
                    <span className="text-sm font-semibold">{selectedLevel} Video Lesson</span>
                  </div>
                  <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex w-full items-center justify-between p-3 rounded-lg bg-[#3182ed]/5 hover:bg-[#3182ed]/10 text-[#3182ed] transition-colors group">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="size-5" />
                    <span className="text-sm font-semibold">Practice Similar</span>
                  </div>
                  <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Progress / Stats */}
            <div className="bg-[#3182ed] text-white rounded-xl p-6 shadow-lg shadow-[#3182ed]/20">
              <h4 className="font-bold mb-2">Tag Performance</h4>
              <p className="text-xs text-white/80 mb-4 capitalize">{question.section} section</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black">{sectionAccuracy}%</span>
                <span className="text-sm text-white/80 pb-1">Accuracy</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${sectionAccuracy}%` }}></div>
              </div>
              <p className="text-[10px] mt-4 opacity-70 leading-tight">Focus on identifying recurring patterns in this section to boost your overall proficiency.</p>
            </div>

            {/* Navigation Buttons for Question */}
            <div className="flex flex-col gap-3">
              <Button
                className="w-full py-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg h-14"
                disabled={!nextQuestionId}
                onClick={() => router.push(`/jlpt/results/${nextQuestionId}`)}
              >
                {nextQuestionId ? 'Next Explanation' : 'Last Question'}
                {nextQuestionId && <ArrowRight className="size-5" />}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-12"
                  disabled={!prevQuestionId}
                  onClick={() => router.push(`/jlpt/results/${prevQuestionId}`)}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-12"
                >
                  Bookmark
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4 font-bold text-[10px] uppercase tracking-widest">
          <button className="hover:text-[#3182ed]">Help Center</button>
          <button className="hover:text-[#3182ed]">Contact Support</button>
          <button className="hover:text-[#3182ed]">Privacy Policy</button>
        </div>
        <p className="opacity-70">© 2024 JLPT Online Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}