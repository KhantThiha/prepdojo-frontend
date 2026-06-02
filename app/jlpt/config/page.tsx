"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/app/store/exam-store';
import { SECTION_CONFIG, SectionType, QuestionCountMode, TimerMode } from '@/app/types/exam';
import {
  History,
  Clock,
  BookOpen,
  Ear,
  Timer,
  Info,
  Play,
  ChevronRight,
  CheckCircle,
  Languages,
  LayoutList,
  Hourglass
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Navbar } from '@/components/layout/Navbar';
import { JLPT_LEVEL_CONFIGS } from '@/app/data/jlpt-levels';


const SECTION_ICONS: Record<SectionType, any> = {
  vocabulary: Languages,
  grammar: LayoutList,
  reading: BookOpen,
  listening: Ear,
};

const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  vocabulary: 'Kanji & Word Knowledge',
  grammar: 'Sentence Structure',
  reading: 'Comprehension',
  listening: 'Audio Tasks',
};

export default function ConfigPage() {
  const router = useRouter();
  const { selectedLevel, config, updateConfig } = useExamStore();

  useEffect(() => {
    if (!selectedLevel) {
      router.push('/jlpt');
    }
  }, [selectedLevel, router]);

  const handleSectionToggle = (section: SectionType, checked: boolean) => {
    const newSections = checked
      ? [...config.selectedSections, section]
      : config.selectedSections.filter(s => s !== section);

    if (newSections.length > 0) {
      updateConfig({ selectedSections: newSections });
    }
  };

  const handleToggleExtendedTime = (checked: boolean) => {
    updateConfig({
      accessibility: { ...config.accessibility, extendedTime: checked },
    });
  };

  const handleQuestionCountChange = (mode: QuestionCountMode) => {
    updateConfig({ questionCountMode: mode });
  };

  const handleTimerModeChange = (mode: TimerMode) => {
    updateConfig({ timerMode: mode });
  };

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push('/jlpt/instructions');
  };

  const handleBack = () => {
    router.push('/jlpt');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getTotalTime = () => {
    const timeMultiplier = config.accessibility.extendedTime ? 1.5 : 1;
    return config.selectedSections.reduce((acc, section) => {
      return acc + Math.floor(SECTION_CONFIG[section].timeLimit * timeMultiplier);
    }, 0);
  };

  const metadata = selectedLevel ? JLPT_LEVEL_CONFIGS[selectedLevel] : null;

  if (!selectedLevel || !metadata) {
    return null;
  }

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
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedLevel} Exam Setup</span>
            </nav>

            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Exam Configuration</h1>
              <p className="text-slate-600 dark:text-slate-400">Customize your {selectedLevel} practice session settings before starting.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Summary & Details */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="h-48 bg-[#3182ed]/10 relative overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Level Cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXW6A56Pips2gwa5fbViog-mn3h1WCY0Crv986C3mxZP4YfMqOEMMibaqwMv4Ea8N5G07fmfTp7OUOl2qPu7z_6a732APfKOioVVFwLLEIU4i3v7RFm8gl84D0jzpTgtkIGYicQfb6dgTPZiT9jaaa_x9z6UhrtgwkmDFuSYYEFXHsvIR5mjZoJIP7qrFRvASV5U4JOkwwIrr09I7aPUn_kUWb1eClZRl0woEFGvALptg8eeaXlRR7NWMFS7Vypgy7g5gZVyR8LLI" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <span className="bg-[#3182ed] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Level {selectedLevel}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">JLPT {selectedLevel} Summary</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {metadata.fullDescription}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <History className="text-[#3182ed] size-5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{metadata.difficulty}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="text-[#3182ed] size-5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Duration</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{metadata.totalDuration} minutes (Full Exam)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookOpen className="text-[#3182ed] size-5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vocabulary Required</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">~{metadata.vocabularySize} words</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#3182ed]/5 dark:bg-[#3182ed]/10 rounded-xl p-6 border border-[#3182ed]/20">
                  <div className="flex items-center gap-2 text-[#3182ed] mb-3">
                    <Info className="size-5" />
                    <h4 className="font-bold text-sm">Exam Tip</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    &quot;For {selectedLevel}, timing is critical. Practice with the &apos;Per-section&apos; timer to master pacing for the Reading section specifically.&quot;
                  </p>
                </div>
              </div>

              {/* Right Side: Configuration Form */}
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                  <form onSubmit={handleContinue} className="space-y-10">
                    {/* Sections to Include */}
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <CheckCircle className="text-[#3182ed] size-5" />
                        Sections to Include
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(Object.entries(SECTION_CONFIG) as [SectionType, any][]).map(([key, section]) => {
                          const Icon = SECTION_ICONS[key];
                          const isChecked = config.selectedSections.includes(key);
                          return (
                            <label
                              key={key}
                              className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-[#3182ed]/50 transition-all bg-slate-50/50 dark:bg-slate-800/30"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[#3182ed] border border-slate-100 dark:border-slate-700">
                                  <Icon className="size-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{section.title}</p>
                                  <p className="text-xs text-slate-500 tracking-tight">{SECTION_DESCRIPTIONS[key]}</p>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleSectionToggle(key, e.target.checked)}
                                className="w-5 h-5 rounded text-[#3182ed] border-slate-300 focus:ring-[#3182ed] cursor-pointer"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </section>

                    {/* Question & Logic Settings */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Question Count (Per Section)</label>
                        <select
                          className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#3182ed] focus:border-[#3182ed] py-2.5 px-3"
                          value={config.questionCountMode}
                          onChange={(e) => handleQuestionCountChange(e.target.value as any)}
                        >
                          <option value="standard">Standard JLPT Distribution</option>
                          <option value="quick">Quick Practice (5 Questions)</option>
                          <option value="balanced">Balanced (10 Questions)</option>
                          <option value="custom">Custom Set (15 Questions)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Interface Language</label>
                        <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          <button className="flex-1 py-1.5 px-4 text-xs font-bold rounded bg-white dark:bg-slate-700 shadow-sm text-[#3182ed]" type="button">English</button>
                          <button className="flex-1 py-1.5 px-4 text-xs font-bold text-slate-500 dark:text-slate-400" type="button">Japanese</button>
                        </div>
                      </div>
                    </section>

                    {/* Timer Settings */}
                    <section>
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Timer Configuration</h3>
                      <div className="flex flex-wrap gap-4">
                        <label className="relative flex-1 min-w-[200px] group cursor-pointer">
                          <input
                            type="radio"
                            name="timerMode"
                            checked={config.timerMode === 'total'}
                            onChange={() => handleTimerModeChange('total')}
                            className="peer sr-only"
                          />
                          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg peer-checked:border-[#3182ed] peer-checked:bg-[#3182ed]/5 transition-all">
                            <div className="flex items-center gap-2 mb-1">
                              <Timer className="size-4" />
                              <p className="font-bold text-sm">Total Exam Timer</p>
                            </div>
                            <p className="text-xs text-slate-500">Single countdown for all sections</p>
                          </div>
                        </label>
                        <label className="relative flex-1 min-w-[200px] group cursor-pointer">
                          <input
                            type="radio"
                            name="timerMode"
                            checked={config.timerMode === 'per-section'}
                            onChange={() => handleTimerModeChange('per-section')}
                            className="peer sr-only"
                          />
                          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg peer-checked:border-[#3182ed] peer-checked:bg-[#3182ed]/5 transition-all">
                            <div className="flex items-center gap-2 mb-1">
                              <Hourglass className="size-4" />
                              <p className="font-bold text-sm">Per-section Timer</p>
                            </div>
                            <p className="text-xs text-slate-500">Individual time limits per area</p>
                          </div>
                        </label>
                      </div>
                    </section>

                    {/* Toggles */}
                    <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Extended Practice Time</p>
                          <p className="text-xs text-slate-500">Increase duration by 1.5x for relaxed practice.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <Switch
                            id="extended_time"
                            size='default'
                            checked={config.accessibility.extendedTime}
                            onCheckedChange={handleToggleExtendedTime}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Enable Question Review</p>
                          <p className="text-xs text-slate-500">Allows flagging and returning to questions later.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <Switch id="review_question" size='default' defaultChecked className="data-[state=checked]:bg-blue-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Auto-save Progress</p>
                          <p className="text-xs text-slate-500">Saves your answers every 30 seconds.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <Switch id="auto_save" size='default' className="data-[state=checked]:bg-blue-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Show Transcript (Listening)</p>
                          <p className="text-xs text-slate-500">Displays audio text after the first playback.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <Switch id="show_transcript" size='default' className="data-[state=checked]:bg-blue-600" />
                        </div>
                      </div>
                    </section>

                    {/* Action Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full bg-[#3182ed] hover:bg-[#3182ed]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#3182ed]/20 transition-all flex items-center justify-center gap-3"
                      >
                        <span>Begin {selectedLevel} Exam Simulation</span>
                        <Play className="size-5 fill-current text-white" />
                      </button>
                      <p className="text-center text-slate-400 text-[10px] mt-4 uppercase tracking-[0.2em]">Ready to test your skills? Good luck!</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-slate-500 text-xs">
            © 2024 JLPT Online Platform. All rights reserved. Professional preparation for international success.
          </footer>
        </div>
      </div>
    </div>
  );
}