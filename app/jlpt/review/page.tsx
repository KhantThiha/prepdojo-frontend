'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, useAllQuestions } from '@/app/store/exam-store';
import { ReviewNavigator } from '@/components/exam/ReviewNavigator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  Circle,
  Flag,
  Timer,
  LayoutGrid,
  AlertTriangle,
  ChevronRight,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { FilterType } from '@/app/types/exam';
import { Navbar } from '@/components/layout/Navbar';

export default function ReviewPage() {
  const router = useRouter();
  const {
    selectedLevel,
    answers,
    flagged,
    jumpToQuestion,
    submitExam,
    timeRemaining,
  } = useExamStore();

  const allQuestions = useAllQuestions();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (!selectedLevel) {
      router.push('/jlpt');
    } else if (allQuestions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(allQuestions[0].id);
    }
  }, [selectedLevel, router, allQuestions, selectedQuestionId]);

  const stats = useMemo(() => ({
    total: allQuestions.length,
    answered: Object.keys(answers).length,
    unanswered: allQuestions.length - Object.keys(answers).length,
    flagged: flagged.size,
  }), [allQuestions.length, answers, flagged.size]);

  const selectedQuestion = useMemo(() =>
    allQuestions.find(q => q.id === selectedQuestionId),
    [allQuestions, selectedQuestionId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgress = (timeRemaining / (stats.total * 60)) * 100; // Rough estimate of progress
  const isLowTime = timeRemaining < 300;

  const handleJumpToQuestion = (index: number) => {
    jumpToQuestion(index);
    router.push('/jlpt/exam');
  };

  const handleSubmit = () => {
    submitExam();
    router.push('/jlpt/results');
  };

  if (!selectedLevel) return null;

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <Navbar>
        <Button
          variant="ghost"
          className="text-slate-700 dark:text-slate-300 font-bold h-9 px-3"
          onClick={() => router.push('/jlpt')}
        >
          <LogOut className="size-4 mr-2" />
          Save & Exit
        </Button>
      </Navbar>

      <main className="flex-1 flex flex-col items-center px-6 lg:px-40 py-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight">Exam Review: {selectedLevel} Practice Test</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-normal">Review your progress. Ensure all questions are answered before the final submission.</p>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 uppercase tracking-wider text-[10px] font-black">
                <CheckCircle2 className="size-4" />
                <span>Answered</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">{stats.answered}</p>
            </div>
            <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <Circle className="size-4" />
                <span>Unanswered</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">{stats.unanswered}</p>
            </div>
            <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500 uppercase tracking-wider text-[10px] font-black">
                <Flag className="size-4" />
                <span>Flagged</span>
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">{stats.flagged}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            {/* Main Content Area */}
            <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
                {(['all', 'answered', 'unanswered', 'flagged'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "flex items-center gap-2 border-b-2 py-4 px-4 text-sm font-bold transition-all capitalize",
                      filter === f
                        ? "border-[#3182ed] text-[#3182ed]"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {f === 'all' && <LayoutGrid className="size-4" />}
                    {f === 'answered' && <CheckCircle2 className="size-4" />}
                    {f === 'unanswered' && <Circle className="size-4" />}
                    {f === 'flagged' && <Flag className="size-4" />}
                    {f} Questions
                  </button>
                ))}
              </div>
              <div className="p-8 min-h-[400px]">
                <ReviewNavigator
                  filter={filter}
                  onQuestionClick={(id) => setSelectedQuestionId(id)}
                  selectedQuestionId={selectedQuestionId}
                />
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/80 p-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="size-4 rounded-sm bg-emerald-50 border border-emerald-500"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="size-4 rounded-sm bg-white border border-slate-200"></div>
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="size-4 rounded-sm bg-amber-50 border border-amber-500"></div>
                    <span>Flagged</span>
                  </div>
                </div>

                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <DialogTrigger asChild>
                    <button className="bg-[#3182ed] text-white font-black px-12 py-4 rounded-xl hover:bg-[#3182ed]/90 transition-all shadow-xl shadow-[#3182ed]/25 text-xl">
                      Submit Final Exam
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="p-8 text-center space-y-6">
                      <div className="mx-auto size-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center">
                        <AlertTriangle className="size-10" />
                      </div>
                      <div className="space-y-3">
                        <DialogTitle className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Ready to Submit?</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                          You still have <span className="text-amber-600 font-bold">{stats.unanswered} unanswered</span> and <span className="text-amber-600 font-bold">{stats.flagged} flagged</span> questions. Once submitted, you cannot change your answers.
                        </DialogDescription>
                      </div>
                    </div>
                    <div className="flex p-6 gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                      <Button
                        variant="ghost"
                        className="flex-1 h-14 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={() => setShowConfirmDialog(false)}
                      >
                        Back to Review
                      </Button>
                      <Button
                        className="flex-1 h-14 bg-[#3182ed] hover:bg-[#3182ed]/90 text-white font-bold rounded-xl shadow-lg shadow-[#3182ed]/20"
                        onClick={handleSubmit}
                      >
                        Submit Anyway
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 sticky top-24">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="bg-[#3182ed]/10 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-[#3182ed] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle className="size-4" />
                    Question Preview: {selectedQuestionId ? `#${allQuestions.findIndex(q => q.id === selectedQuestionId) + 1}` : 'N/A'}
                  </h3>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedQuestion?.section || 'Select a question'}</span>
                    <p className="text-slate-900 dark:text-slate-100 font-bold leading-relaxed line-clamp-3">
                      {selectedQuestion?.text || 'Select a question in the grid to see a quick preview here.'}
                    </p>
                  </div>
                  <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</p>
                    <div className={cn(
                      "p-4 rounded-xl border font-bold text-sm text-center",
                      selectedQuestionId ? (
                        selectedQuestionId in answers
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-slate-50 border-slate-100 text-slate-400 italic"
                      ) : "bg-slate-50 border-slate-100 text-slate-400"
                    )}>
                      {selectedQuestionId
                        ? (selectedQuestionId in answers ? 'Question Answered' : 'Not answered yet')
                        : 'No question selected'}
                    </div>
                  </div>
                  {selectedQuestionId && (
                    <Button
                      className="w-full h-12 rounded-xl border-2 border-[#3182ed] text-[#3182ed] bg-white hover:bg-[#3182ed]/5 font-black text-sm uppercase tracking-wide"
                      onClick={() => handleJumpToQuestion(allQuestions.findIndex(q => q.id === selectedQuestionId))}
                    >
                      Go to Question
                    </Button>
                  )}
                </div>
              </div>

              {/* Timer Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Remaining Time</h4>
                  <Timer className={cn("size-5", isLowTime ? "text-red-500 animate-pulse" : "text-[#3182ed]")} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn(
                    "text-4xl font-black tabular-nums tracking-tight",
                    isLowTime ? "text-red-500" : "text-slate-900 dark:text-white"
                  )}>
                    {formatTime(timeRemaining)}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                    <div
                      className={cn("h-full transition-all duration-300", isLowTime ? "bg-red-500" : "bg-[#3182ed]")}
                      style={{ width: `${timerProgress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 text-center uppercase font-black tracking-[0.2em]">Please finish before time expires</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}