import React from 'react';
import type { VisualTemplateProps } from './types';

const RiskVisual: React.FC<VisualTemplateProps> = ({ isNL, visualData }) => {
  const risks = visualData?.risks || [
    { title: isNL ? 'Identificeren' : 'Identify', description: isNL ? 'Welke risico\'s kunnen optreden?' : 'What risks could occur?', icon: '🔍', color: 'blue' },
    { title: isNL ? 'Analyseren' : 'Analyze', description: isNL ? 'Wat is de kans en impact?' : 'What is the probability and impact?', icon: '📊', color: 'purple' },
    { title: isNL ? 'Reageren' : 'Respond', description: isNL ? 'Vermijden, verminderen, overdragen of accepteren' : 'Avoid, mitigate, transfer or accept', icon: '🛡️', color: 'green' },
    { title: isNL ? 'Monitoren' : 'Monitor', description: isNL ? 'Continu bewaken en bijsturen' : 'Continuously monitor and adjust', icon: '👁️', color: 'orange' },
  ];

  const colorMap: Record<string, { gradient: string; border: string }> = {
    blue: { gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-200 dark:border-blue-800' },
    purple: { gradient: 'from-purple-500 to-pink-500', border: 'border-purple-200 dark:border-purple-800' },
    green: { gradient: 'from-green-500 to-emerald-500', border: 'border-green-200 dark:border-green-800' },
    orange: { gradient: 'from-orange-500 to-red-500', border: 'border-orange-200 dark:border-orange-800' },
  };

  // 5x5 Risk Matrix
  const matrixLabels = {
    impact: isNL ? ['Zeer Laag', 'Laag', 'Gemiddeld', 'Hoog', 'Zeer Hoog'] : ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    probability: isNL ? ['Zeer Laag', 'Laag', 'Gemiddeld', 'Hoog', 'Zeer Hoog'] : ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
  };

  const getCellColor = (row: number, col: number) => {
    const score = (4 - row) + col;
    if (score >= 6) return 'bg-red-500 text-white';
    if (score >= 4) return 'bg-orange-400 text-white';
    if (score >= 2) return 'bg-yellow-300 text-gray-800';
    return 'bg-green-300 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-2">{isNL ? '⚠️ Risicomanagement' : '⚠️ Risk Management'}</h3>
        <p className="opacity-90">{isNL ? 'Identificeer, analyseer en beheers projectrisico\'s' : 'Identify, analyze and manage project risks'}</p>
      </div>

      {/* Risk Process Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {risks.map((risk, i) => {
          const c = colorMap[risk.color || 'blue'] || colorMap.blue;
          return (
            <div key={i} className={`group bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 ${c.border} hover:shadow-lg transition-all text-center`}>
              <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3`}>
                <span className="text-2xl">{risk.icon}</span>
              </div>
              <h4 className="font-bold mb-1">{isNL && risk.titleNL ? risk.titleNL : risk.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{isNL && risk.descriptionNL ? risk.descriptionNL : risk.description}</p>
              {i < risks.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-400">→</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Risk Matrix */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-lg mb-4 text-center">{isNL ? '📊 Risicomatrix (Kans x Impact)' : '📊 Risk Matrix (Probability x Impact)'}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-gray-500">{isNL ? 'Kans ↓ / Impact →' : 'Prob ↓ / Impact →'}</th>
                {matrixLabels.impact.map((label, i) => (
                  <th key={i} className="p-2 text-center text-gray-600 dark:text-gray-400 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixLabels.probability.slice().reverse().map((prob, row) => (
                <tr key={row}>
                  <td className="p-2 font-semibold text-gray-600 dark:text-gray-400">{prob}</td>
                  {matrixLabels.impact.map((_, col) => (
                    <td key={col} className="p-1">
                      <div className={`w-full h-8 rounded ${getCellColor(row, col)} flex items-center justify-center font-bold`}>
                        {(4 - row + 1) * (col + 1)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-300 rounded" />{isNL ? 'Laag' : 'Low'}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-300 rounded" />{isNL ? 'Gemiddeld' : 'Medium'}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-400 rounded" />{isNL ? 'Hoog' : 'High'}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" />{isNL ? 'Kritiek' : 'Critical'}</span>
        </div>
      </div>
    </div>
  );
};

export default RiskVisual;