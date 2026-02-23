import React from 'react';
import type { VisualTemplateProps } from './types';

const ProjectDefinitionVisual: React.FC<VisualTemplateProps> = ({ isNL, visualData }) => {
  const cards = visualData?.cards || [
    {
      title: isNL ? 'Tijdelijk' : 'Temporary',
      description: isNL
        ? 'Heeft een <strong class="text-blue-600">duidelijk begin en einde</strong>. Niet doorlopend zoals operationele taken.'
        : 'Has a <strong class="text-blue-600">clear start and end</strong>. Not ongoing like operational tasks.',
      example: isNL ? 'Website redesign (3 maanden)' : 'Website redesign (3 months)',
      icon: 'clock',
      color: 'blue',
    },
    {
      title: isNL ? 'Uniek' : 'Unique',
      description: isNL
        ? 'Levert een <strong class="text-purple-600">uniek product of resultaat</strong>. Geen repetitief proces.'
        : 'Delivers a <strong class="text-purple-600">unique product or result</strong>. Not a repetitive process.',
      example: isNL ? 'Uniek CRM voor jouw bedrijf' : 'Custom CRM for your company',
      icon: 'sparkle',
      color: 'purple',
    },
    {
      title: isNL ? 'Resultaatgericht' : 'Goal-oriented',
      description: isNL
        ? 'Gericht op <strong class="text-green-600">specifieke, meetbare doelen</strong> en deliverables.'
        : 'Focused on <strong class="text-green-600">specific, measurable goals</strong> and deliverables.',
      example: isNL ? '+30% efficiëntie bereiken' : 'Achieve +30% efficiency',
      icon: 'target',
      color: 'green',
    },
  ];

  const colorMap: Record<string, { gradient: string; border: string; text: string; topBar: string }> = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-200 dark:border-blue-800 hover:border-blue-500',
      text: 'text-blue-900 dark:text-blue-100',
      topBar: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      border: 'border-purple-200 dark:border-purple-800 hover:border-purple-500',
      text: 'text-purple-900 dark:text-purple-100',
      topBar: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      border: 'border-green-200 dark:border-green-800 hover:border-green-500',
      text: 'text-green-900 dark:text-green-100',
      topBar: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
  };

  const iconMap: Record<string, string> = {
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    sparkle: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    target: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  const emojis = ['⏱️', '✨', '🎯'];

  return (
    <div className="space-y-6">
      {/* Hero Statement */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-2">
          {visualData?.heroTitle || (isNL ? '🎯 Een Project Heeft 3 DNA-eigenschappen' : '🎯 A Project Has 3 DNA Characteristics')}
        </h3>
        <p className="opacity-90">
          {visualData?.heroSubtitle || (isNL ? 'Zonder deze 3? Dan is het géén project!' : "Without these 3? Then it's not a project!")}
        </p>
      </div>

      {/* 3 Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const c = colorMap[card.color || 'blue'] || colorMap.blue;
          const svgPath = iconMap[card.icon || 'target'] || iconMap.target;
          return (
            <div
              key={i}
              className={`group relative bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 ${c.border} transition-all hover:shadow-2xl hover:scale-105 cursor-pointer`}
            >
              <div className={`absolute top-0 left-0 w-full h-2 ${c.topBar} rounded-t-2xl`} />
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svgPath} />
                  </svg>
                </div>
              </div>
              <h4 className={`text-2xl font-bold text-center mb-4 ${c.text}`}>
                {emojis[i] || '📌'} {isNL && card.titleNL ? card.titleNL : card.title}
              </h4>
              <p
                className="text-center text-gray-600 dark:text-gray-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: isNL && card.descriptionNL ? card.descriptionNL : card.description }}
              />
              {(card.example || card.exampleNL) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-sm font-semibold ${c.text} mb-2`}>
                    {isNL ? '📌 Voorbeeld:' : '📌 Example:'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isNL && card.exampleNL ? card.exampleNL : card.example}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-world Example Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-8 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h5 className="text-xl font-bold">{isNL ? '💼 Praktijk Voorbeeld' : '💼 Real-World Example'}</h5>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm font-semibold mb-2 opacity-90">{isNL ? '✅ DIT IS EEN PROJECT:' : '✅ THIS IS A PROJECT:'}</div>
              <p className="font-bold text-lg mb-2">{isNL ? 'Nieuw CRM Systeem Implementeren' : 'Implement New CRM System'}</p>
              <ul className="space-y-1 text-sm opacity-90">
                <li>⏱️ {isNL ? 'Duur: 6 maanden' : 'Duration: 6 months'}</li>
                <li>✨ {isNL ? 'Uniek voor jouw bedrijf' : 'Unique to your company'}</li>
                <li>🎯 {isNL ? 'Doel: +30% klanttevredenheid' : 'Goal: +30% customer satisfaction'}</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-sm font-semibold mb-2 opacity-90">{isNL ? '❌ DIT IS GÉÉN PROJECT:' : '❌ THIS IS NOT A PROJECT:'}</div>
              <p className="font-bold text-lg mb-2">{isNL ? 'Dagelijkse Klanten Helpen' : 'Daily Customer Support'}</p>
              <ul className="space-y-1 text-sm opacity-90">
                <li>🔄 {isNL ? 'Doorlopend proces' : 'Ongoing process'}</li>
                <li>📋 {isNL ? 'Repetitieve taken' : 'Repetitive tasks'}</li>
                <li>⚙️ {isNL ? 'Standaard procedures' : 'Standard procedures'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDefinitionVisual;