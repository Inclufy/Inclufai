// ============================================
// ExamPrep.tsx — Examen Voorbereiding & Kennissamenvatting
// ============================================

import { useState } from "react";
import {
  GraduationCap, CheckCircle2, XCircle, AlertTriangle, Clock,
  Award, Target, TrendingUp, ChevronRight, BookOpen, Brain,
  Sparkles, ShieldCheck, BarChart3, Zap, FileText,
} from "lucide-react";

interface ModuleResult {
  moduleTitle: string;
  quizScore: number | null;      // percentage, null = not taken
  quizPassed: boolean;
  assignmentDone: boolean;
  lessonsCompleted: number;
  totalLessons: number;
}

interface ExamPrepProps {
  courseTitle: string;
  modules: ModuleResult[];
  examInfo: {
    questions: number;
    duration: string;
    passScore: number;
    attempts: number;
  };
  isNL: boolean;
  onStartExam: () => void;
}

export default function ExamPrep({ courseTitle, modules, examInfo, isNL, onStartExam }: ExamPrepProps) {
  const [showDetails, setShowDetails] = useState(false);

  const totalModules = modules.length;
  const quizzesPassed = modules.filter(m => m.quizPassed).length;
  const quizzesWithScores = modules.filter(m => m.quizScore !== null);
  const avgQuizScore = quizzesWithScores.length > 0
    ? Math.round(quizzesWithScores.reduce((s, m) => s + (m.quizScore || 0), 0) / quizzesWithScores.length)
    : 0;
  const assignmentsDone = modules.filter(m => m.assignmentDone).length;
  const totalAssignments = modules.filter(m => m.totalLessons > 0).length; // rough
  const totalLessons = modules.reduce((s, m) => s + m.totalLessons, 0);
  const completedLessons = modules.reduce((s, m) => s + m.lessonsCompleted, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Readiness calculation
  const readinessScore = Math.round(
    (avgQuizScore * 0.4) + (overallProgress * 0.3) + ((assignmentsDone / Math.max(totalAssignments, 1)) * 100 * 0.3)
  );
  const isReady = readinessScore >= 60;

  const getReadinessColor = () => {
    if (readinessScore >= 80) return { bg: 'from-green-400 to-emerald-600', text: 'text-green-700 dark:text-green-300', label: isNL ? 'Uitstekend voorbereid' : 'Excellently prepared' };
    if (readinessScore >= 60) return { bg: 'from-blue-400 to-cyan-600', text: 'text-blue-700 dark:text-blue-300', label: isNL ? 'Klaar voor het examen' : 'Ready for the exam' };
    if (readinessScore >= 40) return { bg: 'from-amber-400 to-orange-600', text: 'text-amber-700 dark:text-amber-300', label: isNL ? 'Meer voorbereiding aanbevolen' : 'More preparation recommended' };
    return { bg: 'from-red-400 to-rose-600', text: 'text-red-700 dark:text-red-300', label: isNL ? 'Nog niet klaar' : 'Not ready yet' };
  };

  const readiness = getReadinessColor();

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-pink-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-purple-500/20">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isNL ? 'Examen Voorbereiding' : 'Exam Preparation'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {courseTitle}
        </p>
      </div>

      {/* Readiness Score */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              {isNL ? 'Examenvaardigheid' : 'Readiness Score'}
            </h3>
          </div>
          <span className={`text-sm font-bold ${readiness.text}`}>{readiness.label}</span>
        </div>

        {/* Score circle */}
        <div className="flex items-center gap-8">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" className="stroke-gray-100 dark:stroke-gray-800" />
              <circle cx="60" cy="60" r="50" fill="none" strokeWidth="10"
                strokeDasharray={`${readinessScore * 3.14} ${314 - readinessScore * 3.14}`}
                strokeLinecap="round"
                className={`stroke-purple-500 transition-all duration-1000`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{readinessScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-sm">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Quiz Gemiddeld' : 'Avg Quiz'}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{avgQuizScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Lessen' : 'Lessons'}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{completedLessons}/{totalLessons}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Quizzen' : 'Quizzes'}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{quizzesPassed}/{quizzesWithScores.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Opdrachten' : 'Assignments'}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{assignmentsDone}/{totalAssignments}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Overview */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 px-6 py-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {isNL ? 'Module Overzicht' : 'Module Overview'}
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {modules.map((mod, idx) => {
            const lessonPct = mod.totalLessons > 0 ? Math.round((mod.lessonsCompleted / mod.totalLessons) * 100) : 0;
            return (
              <div key={idx} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  lessonPct === 100 ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'
                }`}>
                  {lessonPct === 100
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{mod.moduleTitle}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {mod.lessonsCompleted}/{mod.totalLessons} {isNL ? 'lessen' : 'lessons'}
                    </span>
                    {mod.quizScore !== null && (
                      <span className={`text-xs font-semibold ${mod.quizPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Quiz: {mod.quizScore}%
                      </span>
                    )}
                    {mod.assignmentDone && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {isNL ? 'Opdracht' : 'Assignment'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-16">
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      lessonPct === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-purple-400 to-pink-500'
                    }`} style={{ width: `${lessonPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Info */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-amber-900 dark:text-amber-200">
            {isNL ? 'Examen Informatie' : 'Exam Information'}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/40">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{examInfo.questions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Vragen' : 'Questions'}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/40">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{examInfo.duration}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Minuten' : 'Minutes'}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/40">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{examInfo.passScore}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Slaaggrens' : 'Pass score'}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/40">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{examInfo.attempts}x</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isNL ? 'Pogingen' : 'Attempts'}</p>
          </div>
        </div>
      </div>

      {/* Start Exam Button */}
      <div className="text-center pt-4">
        <button onClick={onStartExam}
          className={`px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto ${
            isReady
              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
          disabled={!isReady}>
          <Zap className="w-5 h-5" />
          {isNL ? 'Start Examen' : 'Start Exam'}
          <ChevronRight className="w-5 h-5" />
        </button>
        {!isReady && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {isNL
              ? 'Voltooi meer lessen en quizzen om het examen te ontgrendelen'
              : 'Complete more lessons and quizzes to unlock the exam'}
          </p>
        )}
      </div>
    </div>
  );
}
