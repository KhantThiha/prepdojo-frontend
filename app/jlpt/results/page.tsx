'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore, useAllQuestions } from '@/app/store/exam-store';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Trophy,
  ArrowRight,
  Download,
  History,
  Share,
  Lightbulb,
  TrendingUp,
  Timer,
  Languages,
  BookOpen,
  Headset,
  LogOut,
  ListCheck,
  BookOpenText
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import jsPDF from 'jspdf';

export default function ResultsPage() {
  const router = useRouter();
  const {
    selectedLevel,
    isSubmitted,
    answers,
    calculateScore,
    resetExam,
    examStartTime,
    config,
  } = useExamStore();
  const certRef = useRef<HTMLDivElement>(null);

  const allQuestions = useAllQuestions();

  useEffect(() => {
    if (!selectedLevel || !isSubmitted) {
      router.push('/jlpt');
    }
  }, [selectedLevel, isSubmitted, router]);

  const result = useMemo(() => calculateScore(), [calculateScore]);

  const timeTaken = useMemo(() => {
    if (!examStartTime) return "N/A";
    const durationMs = Date.now() - examStartTime;
    const hours = Math.floor(durationMs / 3600000);
    const mins = Math.floor((durationMs % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;
  }, [examStartTime]);

  const percentile = useMemo(() => {
    if (result.percentage >= 95) return "Top 2%";
    if (result.percentage >= 90) return "Top 5%";
    if (result.percentage >= 80) return "Top 12%";
    if (result.percentage >= 70) return "Top 25%";
    return "Top 50%";
  }, [result.percentage]);

  const recommendation = useMemo(() => {
    const sortedGroups = [...result.groupResults].sort((a, b) => (a.scaledScore / a.maxScaled) - (b.scaledScore / b.maxScaled));
    const weakest = sortedGroups[0];

    if (result.passed && result.percentage > 90) {
      return "Fantastic performance! Your grasp of the material is exceptional. To stay sharp, we recommend tackling advanced literature and high-level audio materials.";
    }

    return `Great effort! Your ${weakest.name} skills could use some reinforcement. We recommend focusing on targeted practice in this area to improve your overall balance and score in future attempts.`;
  }, [result]);

  const handleRetake = () => {
    resetExam();
    router.push('/jlpt');
  };

  const handleDownloadCertificate = () => {
    try {
      const pdf = new jsPDF('l', 'px', [800, 600]);
      const pageWidth = 800;
      const pageHeight = 600;
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // 1. Background and Border
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Double Outer Border
      pdf.setDrawColor(49, 130, 237); // #3182ed
      pdf.setLineWidth(5);
      pdf.rect(20, 20, pageWidth - 40, pageHeight - 40, 'D');
      pdf.setLineWidth(2);
      pdf.rect(30, 30, pageWidth - 60, pageHeight - 60, 'D');

      // 2. Header
      // Trophy Icon Symbol (Simple drawn trophy)
      pdf.setFillColor(49, 130, 237);
      pdf.roundedRect(pageWidth / 2 - 25, 60, 50, 50, 8, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🏆', pageWidth / 2, 95, { align: 'center' });

      pdf.setTextColor(15, 23, 42); // #0f172a
      pdf.setFontSize(32);
      pdf.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 160, { align: 'center' });

      pdf.setTextColor(100, 116, 139); // #64748b
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OFFICIAL MOCK EXAMINATION', pageWidth / 2, 185, { align: 'center', charSpace: 2 });

      // 3. Main Content
      pdf.setTextColor(51, 65, 85); // #334155
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This is to certify that the candidate has successfully completed', pageWidth / 2, 240, { align: 'center' });

      pdf.setTextColor(49, 130, 237); // #3182ed
      pdf.setFontSize(48);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`JLPT ${selectedLevel} Simulation`, pageWidth / 2, 300, { align: 'center' });

      // 4. Score Section
      pdf.setDrawColor(241, 245, 249); // #f1f5f9
      pdf.line(200, 330, 600, 330);

      pdf.setTextColor(148, 163, 184); // #94a3b8
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FINAL SCALED SCORE', pageWidth / 2, 355, { align: 'center', charSpace: 1 });

      pdf.setTextColor(15, 23, 42); // #0f172a
      pdf.setFontSize(54);
      pdf.setFont('helvetica', 'bold');
      const scoreText = `${result.scaledScore}`;
      const totalText = '/180';
      const scoreWidth = pdf.getTextWidth(scoreText);
      pdf.text(scoreText, pageWidth / 2 - 20, 410, { align: 'center' });
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(24);
      pdf.text(totalText, pageWidth / 2 + scoreWidth / 2 + 10, 410, { align: 'left' });

      pdf.line(200, 430, 600, 430);

      pdf.setTextColor(49, 130, 237); // #3182ed
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`RESULT: ${result.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}`, pageWidth / 2, 460, { align: 'center' });

      // 5. Footer
      pdf.setTextColor(148, 163, 184); // #94a3b8
      pdf.setFontSize(10);
      pdf.text('DATE OF ISSUE', 80, 520);
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(12);
      pdf.text(date, 80, 540);

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(10);
      pdf.text('PROVIDER', pageWidth - 80, 520, { align: 'right' });
      pdf.setTextColor(49, 130, 237);
      pdf.setFontSize(12);
      pdf.text('PrepDojo Exam Platform', pageWidth - 80, 540, { align: 'right' });

      pdf.save(`prepdojo-jlpt-${selectedLevel}-certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!selectedLevel || !isSubmitted) return null;

  const circleProgress = result.percentage;
  const strokeDasharray = `${circleProgress} ${100 - circleProgress}`;

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-6">
          {/* Header Actions */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight">Exam Results</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">JLPT {selectedLevel} Mock Examination - Session #{examStartTime ? examStartTime.toString().slice(-6) : 'N/A'}</p>
            </div>
            <Button
              onClick={handleDownloadCertificate}
              disabled={!result.passed}
              className="h-11 px-6 bg-[#3182ed] text-white font-bold shadow-lg shadow-[#3182ed]/20 hover:bg-[#3182ed]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 size-5" />
              Download PDF Certificate
            </Button>
          </div>

          {/* Summary Score Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Main Score Circular */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-8 rounded-xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative flex items-center justify-center">
                <svg className="size-40" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="#3182ed"
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{result.percentage}%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Accuracy</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold w-fit",
                  result.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                  <CheckCircle className="size-4 mr-1" />
                  {result.passed ? 'PASSED (QUALIFIED)' : 'FAILED (RETAKE RECOMMENDED)'}
                </div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {result.scaledScore}<span className="text-2xl text-slate-400 font-medium">/180</span>
                </h2>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                  <span>Raw: {result.totalScore}/{result.totalQuestions}</span>
                  <span className="size-1 rounded-full bg-slate-300"></span>
                  <span>Scaled Score Model</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                  {result.passed
                    ? `Congratulations! You've exceeded the passing threshold for JLPT ${selectedLevel}.`
                    : `Keep practicing! You were close to the passing threshold for JLPT ${selectedLevel}.`}
                </p>
              </div>
            </div>

            {/* Side Stats */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-[#3182ed]/10 border border-[#3182ed]/20">
                <p className="text-[#3182ed] text-[10px] font-black uppercase tracking-wider">Percentile</p>
                <p className="text-slate-900 dark:text-white text-3xl font-black">{percentile}</p>
                <p className="text-emerald-500 text-xs font-bold flex items-center">
                  <TrendingUp className="size-3 mr-1" />
                  +5% from last attempt
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">Time Taken</p>
                <p className="text-slate-900 dark:text-white text-3xl font-black">{timeTaken}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center">
                  <Timer className="size-3 mr-1" />
                  Efficiency High
                </p>
              </div>
            </div>
          </div>

          {/* Sectional Breakdown */}
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-6">Sectional Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {result.groupResults.map((group) => {
              const Icon = group.name.includes('Listening') ? Headset :
                group.name.includes('Reading') && !group.name.includes('Knowledge') ? BookOpenText :
                  Languages;
              const colorClass = group.name.includes('Listening') ? 'text-amber-500' :
                group.name.includes('Reading') && !group.name.includes('Knowledge') ? 'text-emerald-500' :
                  'text-blue-500';
              const bgClass = group.name.includes('Listening') ? 'bg-amber-50 dark:bg-amber-900/20' :
                group.name.includes('Reading') && !group.name.includes('Knowledge') ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                  'bg-blue-50 dark:bg-blue-900/20';

              return (
                <div key={group.name} className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn("size-10 rounded-lg flex items-center justify-center", bgClass, colorClass)}>
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold">{group.name}</p>
                        <div className="flex gap-2 mt-1">
                          {group.sectionDetails.map(sd => (
                            <span key={sd.section} className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                              {sd.section}: {sd.correct}/{sd.total}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-900 dark:text-white font-black">{group.correct}/{group.total}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className={cn(group.passed ? "text-emerald-500" : "text-red-500")}>
                        {group.scaledScore} pts {group.passed ? '(PASS)' : '(FAIL)'}
                      </span>
                      <span>Min: {group.passMark}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", colorClass.replace('text', 'bg'))}
                        style={{ width: `${(group.scaledScore / group.maxScaled) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendation Box */}
          <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-10">
            <div className="flex gap-4">
              <div className="text-[#3182ed]">
                <Lightbulb className="size-8" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1">Study Recommendation</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-8 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" onClick={handleRetake} className="flex-1 min-w-[180px] h-12 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-white dark:hover:bg-slate-800">
              <History className="mr-2 size-5" />
              Retake Exam
            </Button>
            <Link href="/jlpt/results/1" className="flex-1 min-w-[220px]">
              <Button className="w-full h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                <CheckCircle className="mr-2 size-5" />
                Review Explanations
              </Button>
            </Link>
            <Button variant="ghost" className="flex-1 min-w-[180px] h-12 bg-[#3182ed]/10 text-[#3182ed] font-bold rounded-xl hover:bg-[#3182ed]/20 border-none">
              <Share className="mr-2 size-5" />
              Share Results
            </Button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-10 text-center text-slate-500 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2024 JLPT Online Examination Platform. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</button>
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</button>
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Support</button>
        </div>
      </footer>
    </div>
  );
}