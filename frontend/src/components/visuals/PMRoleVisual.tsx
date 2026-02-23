import React from 'react';
import type { VisualTemplateProps } from './types';

const PMRoleVisual: React.FC<VisualTemplateProps> = ({ isNL, visualData }) => {
  const roles = visualData?.cards || [
    {
      title: isNL ? 'Plannen' : 'Planning',
      description: isNL ? 'Scope, tijdlijn, budget en resources definiëren en bewaken.' : 'Define and monitor scope, timeline, budget and resources.',
      icon: '📋', color: 'blue',
    },
    {
      title: isNL ? 'Leiden' : 'Leading',
      description: isNL ? 'Team motiveren, conflicten oplossen en richting geven.' : 'Motivate team, resolve conflicts and provide direction.',
      icon: '👥', color: 'purple',
    },
    {
      title: isNL ? 'Communiceren' : 'Communicating',
      description: isNL ? 'Stakeholders informeren, rapporteren en verwachtingen managen.' : 'Inform stakeholders, report and manage expectations.',
      icon: '💬', color: 'green',
    },
    {
      title: isNL ? 'Bewaken' : 'Monitoring',
      description: isNL ? 'Voortgang, risico\'s en kwaliteit continu monitoren.' : 'Continuously monitor progress, risks and quality.',
      icon: '📊', color: 'orange',
    },
  ];

  const colorMap: Record<string, { gradient: string; border: string; text: string }> = {
    blue: { gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-200 dark:border-blue-800 hover:border-blue-500', text: 'text-blue-600' },
    purple: { gradient: 'from-purple-500 to-pink-500', border: 'border-purple-200 dark:border-purple-800 hover:border-purple-500', text: 'text-purple-600' },
    green: { gradient: 'from-green-500 to-emerald-500', border: 'border-green-200 dark:border-green-800 hover:border-green-500', text: 'text-green-600' },
    orange: { gradient: 'from-orange-500 to-red-500', border: 'border-orange-200 dark:border-orange-800 hover:border-orange-500', text: 'text-orange-600' },
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold mb-2">{isNL ? '👔 De 4 Kernrollen van een Projectmanager' : '👔 The 4 Core Roles of a Project Manager'}</h3>
        <p className="opacity-90">{isNL ? 'Een PM is planner, leider, communicator én bewaker.' : 'A PM is planner, leader, communicator and monitor.'}</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, i) => {
          const c = colorMap[role.color || 'blue'] || colorMap.blue;
          return (
            <div key={i} className={`group bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 ${c.border} hover:shadow-xl transition-all`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{role.icon}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold">{isNL && role.titleNL ? role.titleNL : role.title}</h4>
                  <span className={`text-sm ${c.text} font-semibold`}>{isNL ? `Rol ${i + 1}` : `Role ${i + 1}`}</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isNL && role.descriptionNL ? role.descriptionNL : role.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💡</span>
          <h5 className="font-bold text-lg">{isNL ? 'Onthoud' : 'Remember'}</h5>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {isNL
            ? 'Een goede PM combineert alle 4 rollen. Geen enkele rol is belangrijker dan de andere — ze werken samen als een systeem.'
            : 'A good PM combines all 4 roles. No single role is more important — they work together as a system.'}
        </p>
      </div>
    </div>
  );
};

export default PMRoleVisual;