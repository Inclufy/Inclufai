// ============================================
// AssignmentView.tsx — Luxe Praktijkopdracht Component
// ============================================

import { useState } from "react";
import {
  FileText, Upload, CheckCircle2, Clock, Award, Target,
  ChevronDown, ChevronUp, Sparkles, BookOpen, ListChecks,
} from "lucide-react";
import { renderMarkdownBlock } from "@/utils/markdownRenderer";

interface RubricItem {
  criterion: string;
  points: number;
}

interface AssignmentData {
  title: string;
  description: string;
  deliverables?: string[];
  rubric?: RubricItem[];
}

interface AssignmentViewProps {
  assignment: AssignmentData;
  lessonTitle: string;
  isNL: boolean;
  onComplete?: () => void;
}

export default function AssignmentView({ assignment, lessonTitle, isNL, onComplete }: AssignmentViewProps) {
  const [showRubric, setShowRubric] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalPoints = assignment.rubric?.reduce((sum, r) => sum + r.points, 0) || 100;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalDeliverables = assignment.deliverables?.length || 0;

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.();
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isNL ? 'Opdracht Ingediend!' : 'Assignment Submitted!'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isNL
            ? 'Je opdracht is succesvol ingediend. Je ontvangt feedback zodra deze is beoordeeld.'
            : 'Your assignment has been submitted successfully. You will receive feedback once it has been reviewed.'}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium">
          <Clock className="w-4 h-4" />
          {isNL ? 'Beoordeling duurt 2-3 werkdagen' : 'Review takes 2-3 business days'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0 shadow-xl shadow-purple-500/20">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
              {isNL ? 'Praktijkopdracht' : 'Assignment'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h2>
        </div>
      </div>

      {/* Description - rendered with markdown */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            {isNL ? 'Opdrachtbeschrijving' : 'Assignment Description'}
          </h3>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {renderMarkdownBlock(assignment.description)}
        </div>
      </div>

      {/* Deliverables Checklist */}
      {assignment.deliverables && assignment.deliverables.length > 0 && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-blue-900 dark:text-blue-200">
              {isNL ? 'Op te leveren' : 'Deliverables'} ({checkedCount}/{totalDeliverables})
            </h3>
          </div>
          <div className="space-y-3">
            {assignment.deliverables.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  checkedItems[idx]
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-green-500 shadow-sm shadow-green-500/30'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                }`}>
                  {checkedItems[idx] && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <input type="checkbox" className="sr-only"
                  checked={!!checkedItems[idx]}
                  onChange={(e) => setCheckedItems({ ...checkedItems, [idx]: e.target.checked })} />
                <span className={`text-sm leading-relaxed ${checkedItems[idx] ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rubric */}
      {assignment.rubric && assignment.rubric.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <button onClick={() => setShowRubric(!showRubric)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                {isNL ? 'Beoordelingsrubric' : 'Grading Rubric'} — {totalPoints} {isNL ? 'punten' : 'points'}
              </h3>
            </div>
            {showRubric ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {showRubric && (
            <div className="border-t border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <th className="px-6 py-3 text-left font-bold text-white text-xs tracking-wide uppercase">{isNL ? 'Criterium' : 'Criterion'}</th>
                    <th className="px-6 py-3 text-right font-bold text-white text-xs tracking-wide uppercase">{isNL ? 'Punten' : 'Points'}</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.rubric.map((item, idx) => (
                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'}`}>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.criterion}</td>
                      <td className="px-6 py-3 text-right">
                        <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs">
                          {item.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload & Submit */}
      <div className="rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/5 p-8 text-center">
        <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          {isNL ? 'Upload je opdracht' : 'Upload your assignment'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          PDF, DOCX, PPTX (max 25MB)
        </p>
        <div className="flex items-center justify-center gap-3">
          <label className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" className="sr-only" accept=".pdf,.docx,.pptx" />
            {isNL ? 'Bestand kiezen' : 'Choose file'}
          </label>
          <button onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isNL ? 'Opdracht indienen' : 'Submit assignment'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
