"use client"

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/app/store/exam-store';
import { SECTION_CONFIG, SectionType, QuestionCountMode } from '@/app/types/exam';
import { JLPT_LEVEL_CONFIGS } from '@/app/data/jlpt-levels';
import {
  History,
  Clock,
  BookOpen,
  Timer,
  Info,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Play,
  Gavel,
  ChartColumnIncreasing,
  Keyboard,
  Settings,
  Wifi,
  Headphones,
  GlobeCheck,
  BatteryFull,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Circle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function InstructionsPage() {
  const router = useRouter();
  const { selectedLevel, config, applyConfigAndStart, isLoadingQuestions, error } = useExamStore();

  useEffect(() => {
    if (!selectedLevel) {
      router.push('/jlpt');
    }
  }, [selectedLevel, router]);

  const stats = useMemo(() => {
    if (!selectedLevel) return { duration: 0, questionCount: 0 };

    const timeMultiplier = config.accessibility.extendedTime ? 1.5 : 1;
    const levelConfig = JLPT_LEVEL_CONFIGS[selectedLevel];

    let totalQuestions = 0;
    let totalTimeLimit = 0;

    config.selectedSections.forEach(section => {
      const sectionType = section as SectionType;
      totalTimeLimit += SECTION_CONFIG[sectionType].timeLimit * timeMultiplier;

      let count = 0;
      if (config.questionCountMode === 'quick') count = 5;
      else if (config.questionCountMode === 'balanced') count = 10;
      else if (config.questionCountMode === 'custom') count = 15;
      else {
        count = levelConfig.sections[sectionType]?.questionCount || 20;
      }
      totalQuestions += count;
    });

    return {
      duration: Math.floor(totalTimeLimit / 60),
      questionCount: totalQuestions
    };
  }, [config.selectedSections, config.accessibility.extendedTime, selectedLevel]);

  const handleStartExam = async () => {
    await applyConfigAndStart();
    if (!useExamStore.getState().error) {
      router.push('/jlpt/exam');
    }
  };

  const handleBack = () => {
    router.push('/jlpt/config');
  };

  if (!selectedLevel) return null;

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Navbar />

          <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-8 lg:px-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
              <button onClick={handleBack} className="hover:text-[#3182ed] transition-colors">Home</button>
              <ChevronRight className="size-3" />
              <button onClick={handleBack} className="hover:text-[#3182ed] transition-colors">Exam Selection</button>
              <ChevronRight className="size-3" />
              <button onClick={handleBack} className="hover:text-[#3182ed] transition-colors">{selectedLevel} Setup</button>
              <ChevronRight className="size-3" />
              <span className="text-slate-900 dark:text-slate-100 font-semibold">Instructions</span>
            </nav>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Header Section */}
              <div className="border-b border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#3182ed]/10 p-3 rounded-lg">
                    <AlertTriangle className="text-[#3182ed] size-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">Exam Instructions</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Please review the following rules and requirements before starting the {selectedLevel} examination.</p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Rules & Policy */}
                <div className="space-y-10">
                  <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Gavel className="text-[#3182ed] size-6" />
                      Exam Rules
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-x-4 items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <CheckCircle className="mt-1 h-5 w-5 text-[#3182ed] shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">Do not refresh or close the browser tab during the exam. Progress is saved, but time will continue.</span>
                      </div>
                      <div className="flex gap-x-4 items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <CheckCircle className="mt-1 h-5 w-5 text-[#3182ed] shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">Ensure you are in a quiet environment without distractions. Audio playback is restricted to one play.</span>
                      </div>
                      <div className="flex gap-x-4 items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <CheckCircle className="mt-1 h-5 w-5 text-[#3182ed] shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">No external resources, dictionaries, or AI assistants are permitted. Detection may lead to disqualification.</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <ChartColumnIncreasing className="text-[#3182ed] size-6" />
                      Scoring Policy
                    </h2>
                    <div className="bg-[#3182ed]/5 border border-[#3182ed]/20 p-6 rounded-xl">
                      <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <li className="flex items-center gap-3">
                          <Circle className="size-2 fill-[#3182ed] text-[#3182ed]" />
                          Scaled scores based on item response theory.
                        </li>
                        <li className="flex items-center gap-3">
                          <Circle className="size-2 fill-[#3182ed] text-[#3182ed]" />
                          Minimum threshold required for each section to pass.
                        </li>
                        <li className="flex items-center gap-3">
                          <Circle className="size-2 fill-[#3182ed] text-[#3182ed]" />
                          No negative marking for incorrect answers.
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>

                {/* Right Column: Shortcuts & Technical */}
                <div className="space-y-10">
                  <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Keyboard className="text-[#3182ed] size-6" />
                      Keyboard Shortcuts
                    </h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Navigate Questions</p>
                        <div className="flex gap-2">
                          <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">Left</kbd>
                          <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">Right</kbd>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Select Option</p>
                        <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">1 - 4</kbd>
                      </div>
                      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Submit Section</p>
                        <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">Enter</kbd>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Settings className="text-[#3182ed] size-6" />
                      Technical Requirements
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Wifi className="text-slate-400 size-5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internet</p>
                          <p className="text-sm font-bold">Stable 2Mbps+</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Headphones className="text-slate-400 size-5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audio</p>
                          <p className="text-sm font-bold">Working Output</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <GlobeCheck className="text-slate-400 size-5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Browser</p>
                          <p className="text-sm font-bold">Chrome/Edge</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <BatteryFull className="text-slate-400 size-5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Power</p>
                          <p className="text-sm font-bold">Stable Charge</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer / Action Area */}
              <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Timer className="text-[#3182ed] size-5" />
                    <span>Exam Duration: <strong>{stats.duration} Minutes</strong></span>
                  </div>
                  <span className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden md:block"></span>
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-[#3182ed] size-5" />
                    <span>Total Questions: <strong>{stats.questionCount} Items</strong></span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  {error && (
                    <div className="text-red-500 text-sm font-medium">{error}</div>
                  )}
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={handleBack}
                      disabled={isLoadingQuestions}
                      className="px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all w-full md:w-auto shadow-sm disabled:opacity-50"
                    >
                      Back to Setup
                    </button>
                    <button
                      onClick={handleStartExam}
                      disabled={isLoadingQuestions}
                      className="px-8 py-3.5 rounded-xl bg-[#3182ed] text-white font-black text-sm hover:bg-[#3182ed]/90 transition-all flex items-center justify-center gap-3 w-full md:w-auto shadow-lg shadow-[#3182ed]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span>{isLoadingQuestions ? 'Preparing Exam...' : 'I Understand, Start Exam'}</span>
                      {!isLoadingQuestions && <Play className="size-5 fill-current" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto py-6 text-center text-slate-500 text-xs">
            © 2024 JLPT Online Platform. All rights reserved. Professional preparation for international success.
          </footer>
        </div>
      </div>
    </div>
  );
}