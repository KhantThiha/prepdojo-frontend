'use client';

import { useExamStore } from '@/app/store/exam-store';
import { JLPTLevel } from '@/app/types/exam';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  History,
  CircleCheck,
  Clock,
  FileText,
  Play,
  Info,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { JLPT_LEVEL_CONFIGS } from '@/app/data/jlpt-levels';

export default function JLPTLandingPage() {
  const router = useRouter();
  const { selectedLevel, selectLevel, isSubmitted, questions, answers, examStartTime } = useExamStore();

  const hasActiveSession = examStartTime && !isSubmitted;

  const handleStartExam = (level: JLPTLevel) => {
    if (hasActiveSession && selectedLevel !== level) {
      if (!confirm("You have an active session for another level. Starting a new exam will reset your progress. Continue?")) {
        return;
      }
    }
    selectLevel(level);
    router.push('/jlpt/config');
  };

  const handleResume = () => {
    router.push('/jlpt/exam');
  };

  const levels = Object.values(JLPT_LEVEL_CONFIGS).sort((a, b) => b.level.localeCompare(a.level));

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Navbar />

          <main className="flex flex-1 justify-center py-12 px-6 lg:px-40">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              {/* Hero Header */}
              <div className="flex flex-col gap-4 mb-10 text-center lg:text-left">
                <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-[#3182ed]/10 text-[#3182ed] text-xs font-bold uppercase tracking-wider">
                  Choose Your Path
                </div>
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl lg:text-5xl font-black leading-tight tracking-tight">Select Your JLPT Level</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-2xl">
                  Ready to challenge yourself? Select a level to begin your practice exams. Each level is designed to match the official JLPT standards.
                </p>
              </div>

              {/* Level Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => (
                  <div
                    key={level.level}
                    className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3182ed]/20 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl font-black text-[#3182ed]/10 select-none">{level.level}</span>
                      </div>
                      <img
                        className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                        src={`https://lh3.googleusercontent.com/aida-public/${level.level === 'N1' ? 'AB6AXuBoLgq2E7LKKCEN0JSm32U5x2QQDaSkH-2D7j6K9KAfMzmjrIASaDQXuFTfFkDzdglqJ7Y7ybrJ_RJ_HY8aApqs-fPrZiMMFpUOE9gl-gENGYWQBxLaYQe8xVml4hIl4h_aY4hYLpltVxBzE53SN_xxExXIjainIMcKDTyTHKa7FsAK5LEa3QYDLV09dbaJH9OGZw3_OWJvYm6oaVro5sDubyq2sNW94fLMg_s0T9mYf7SJsBCxJy2moKiU31tRflZB7EsmVnHE-Xk' : level.level === 'N2' ? 'AB6AXuACsFA6XUsAiDmD-QwXYsJ5tJmV8yu1iBkuRAolyVSz4XC_mGd7emK-OO2QiE9kp29bw5tKnCfwhFic8KPjEiTiQCIo_3fMcGUyan_UqfY4buVLZgyXcR1K2y17rs6eShvrPhPclXpFIP3Jb_eDlQnwH66Zz9GffkFTq3HhUfrVBTZKSXMaH-qsP7lTlO_4KcXtm_Do_BToHqu8cACVzwJOC_hJkvUy75jvlt2SCho35jt4FByRKWaBnMspWLQ0M-BJCv2FcFjxhi4' : level.level === 'N3' ? 'AB6AXuA5ZFwIpYijW5IP2V8ytunHps616bDS4nGaqO7zj552n8bc3l-uetw7Vxg8LTfmiWAGuHHLmpwaJ0mdY69n6lC3254rwnQDBOST5UN5fg8JBWUuamtvQ3QchdXitvUh77YnSYRt4OpbEQZYAnWRZZPfHieUKm6Qq8lqIp_KMhr6K1QSjZ8k8DRaORbP0iCEw9b9eajkXwGZRroWgn5ueUi6PZltz2F9ycKYSCB6hIAi071peC0AF9UclZqBFK4aMdrqmhHEOS5VLI0' : level.level === 'N4' ? 'AB6AXuDOHlU3oSZ6Mw-1ZDDauZrWD1Cft4Dhr-7SbF_pskLx6uUUbZLK80vwfPEi9d0NVWkwdYwG88kU0Kjhfu_FinbmHvQBkBNp28rZn5EcVSJ_W_0QXdanpOxX-M3xF8kIDs4DL9_uiegh6oOm8cGUf0rmb9L7AIYcn4833QWpH_T74vg2s81DUhl7xTb4sVEDEFBKc36O8VcAIjM5WaeQE9LMqebc79ureDO0tBzndei5V6yh3YPL5mfUNpSItkrau74kBvGQmI5m-yA' : 'AB6AXuDXW6A56Pips2gwa5fbViog-mn3h1WCY0Crv986C3mxZP4YfMqOEMMibaqwMv4Ea8N5G07fmfTp7OUOl2qPu7z_6a732APfKOioVVFwLLEIU4i3v7RFm8gl84D0jzpTgtkIGYicQfb6dgTPZiT9jaaa_x9z6UhrtgwkmDFuSYYEFXHsvIR5mjZoJIP7qrFRvASV5U4JOkwwIrr09I7aPUn_kUWb1eClZRl0woEFGvALptg8eeaXlRR7NWMFS7Vypgy7g5gZVyR8LLI'}`}
                        alt={level.level}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Level {level.level}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${level.level === 'N1' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          level.level === 'N2' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                            level.level === 'N3' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                              level.level === 'N4' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                          {level.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        {level.shortDescription}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <FileText className="size-4" />
                          <span>{level.examCount} Exams</span>
                        </div>
                        <button
                          onClick={() => handleStartExam(level.level as JLPTLevel)}
                          className="bg-[#3182ed] hover:bg-[#3182ed]/90 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                          Start <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Info/Guide Card */}
                <div className="flex flex-col bg-[#3182ed]/5 dark:bg-[#3182ed]/10 rounded-xl border-2 border-dashed border-[#3182ed]/30 items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-[#3182ed]/20 rounded-full flex items-center justify-center mb-4 text-[#3182ed]">
                    <Info className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Not sure which level?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    Take our quick assessment test to find the level that best matches your current Japanese proficiency.
                  </p>
                  <button className="w-full bg-white dark:bg-slate-900 border border-[#3182ed] text-[#3182ed] hover:bg-[#3182ed] hover:text-white font-bold py-3 px-6 rounded-lg transition-all">
                    Take Placement Test
                  </button>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <History className="text-[#3182ed] size-6" />
                    Your Recent Activity
                  </h2>
                  <a className="text-[#3182ed] text-sm font-bold hover:underline" href="#">View All Activity</a>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {hasActiveSession && (
                      <div className="p-4 flex items-center gap-4 bg-blue-50/50 dark:bg-[#3182ed]/5 hover:bg-blue-50 dark:hover:bg-[#3182ed]/10 transition-colors">
                        <div className="size-10 rounded-lg bg-[#3182ed] flex items-center justify-center text-white animate-pulse">
                          <Clock className="size-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 dark:text-slate-100 font-bold text-sm">Active Session: JLPT {selectedLevel}</p>
                            <span className="px-1.5 py-0.5 rounded-full bg-[#3182ed] text-[10px] text-white font-black uppercase tracking-tighter">In Progress</span>
                          </div>
                          <p className="text-slate-500 text-xs">
                            {Object.keys(answers).length} of {questions.length} questions answered • Started {new Date(examStartTime!).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={handleResume}
                          className="bg-[#3182ed] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#3182ed]/90 transition-all flex items-center gap-2"
                        >
                          Resume Exam <Play className="size-3 fill-current" />
                        </button>
                      </div>
                    )}
                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CircleCheck className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">N3 Mock Exam - Vocabulary & Grammar</p>
                        <p className="text-slate-500 text-xs">Completed yesterday • Score: 85%</p>
                      </div>
                      <button className="text-slate-400 hover:text-[#3182ed] transition-colors">
                        <LayoutDashboard className="size-5" />
                      </button>
                    </div>
                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Clock className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">N2 Listening Practice Set 4</p>
                        <p className="text-slate-500 text-xs">In progress • 15/40 questions</p>
                      </div>
                      <button className="text-[#3182ed] hover:text-[#3182ed]/80 transition-colors">
                        <Play className="size-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Help */}
              <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-slate-500 text-sm">
                  © 2024 JLPT Academy. Official-style practice for your success.
                </div>
                <div className="flex gap-6">
                  <a className="text-slate-500 hover:text-[#3182ed] text-sm transition-colors" href="#">Help Center</a>
                  <a className="text-slate-500 hover:text-[#3182ed] text-sm transition-colors" href="#">Terms of Service</a>
                  <a className="text-slate-500 hover:text-[#3182ed] text-sm transition-colors" href="#">Privacy Policy</a>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}