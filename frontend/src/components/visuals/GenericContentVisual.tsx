import React from 'react';
import type { VisualTemplateProps } from './types';

const colorSets = [
  { from: 'from-blue-500', to: 'to-cyan-500', border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { from: 'from-purple-500', to: 'to-pink-500', border: 'border-purple-200 dark:border-purple-800', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  { from: 'from-green-500', to: 'to-emerald-500', border: 'border-green-200 dark:border-green-800', bg: 'bg-green-50 dark:bg-green-950/30' },
  { from: 'from-orange-500', to: 'to-red-500', border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-50 dark:bg-orange-950/30' },
];

const GenericContentVisual: React.FC<VisualTemplateProps> = ({ content, index = 0 }) => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 4).map(s => s.trim());
  const color = colorSets[index % colorSets.length];

  return (
    <div className="space-y-6">
      {/* Content Card */}
      <div className={`bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 ${color.border} shadow-lg`}>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {content.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i} className="leading-relaxed mb-4">{para.trim()}</p>
          ))}
        </div>
      </div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyPoints.map((point, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 ${color.bg} rounded-xl border ${color.border}`}>
              <div className={`w-6 h-6 bg-gradient-to-br ${color.from} ${color.to} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericContentVisual;