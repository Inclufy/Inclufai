// COMPLETE AI INTEGRATION FOR PROJEXTPAL ACADEMY
// ===============================================
// Based on sidebar: Inhoud, Quiz, Simulatie, Praktijk, Examen, Certificaat

import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { AIGenerateButton } from './AIGenerateButton';

/**
 * LOCATION 1: TRAINING/COURSE LEVEL
 * =================================
 * Add AI button to course header (Project Management Fundamentals)
 */

export const CourseHeaderWithAI = ({ course }) => {
  const [generatingAll, setGeneratingAll] = useState(false);

  const generateCompleteCourse = async () => {
    setGeneratingAll(true);
    
    // Generate all modules and lessons
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        // Generate content, quiz, simulation, etc.
        await generateLessonContent(lesson);
      }
    }
    
    setGeneratingAll(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600">
          {course.modules?.length || 0}/26 voltooid • {course.completionPercentage}%
        </p>
      </div>

      {/* ADD THIS - Generate Complete Training */}
      <button
        onClick={generateCompleteCourse}
        disabled={generatingAll}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        {generatingAll ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Wand2 className="w-5 h-5" />
        )}
        <span>🤖 Genereer Complete Training</span>
      </button>
    </div>
  );
};

/**
 * LOCATION 2: MODULE LEVEL
 * =========================
 * Add AI button to each module in the sidebar list
 */

export const ModuleListItemWithAI = ({ module, courseTitle }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50">
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          Module {module.number}: {module.title}
        </div>
        <div className="text-sm text-gray-600">
          {module.lessonsCompleted}/{module.totalLessons} lessen
        </div>
      </div>

      {/* ADD THIS - Generate Module Content */}
      <AIGenerateButton
        type="module"
        context={{
          courseTitle: courseTitle,
          moduleTitle: module.title
        }}
        onGenerated={(data) => {
          console.log('Module generated:', data);
          // Save module content
        }}
        variant="inline"
        size="sm"
      />
    </div>
  );
};

/**
 * LOCATION 3: LESSON CONTENT MODAL - ALL TABS
 * ============================================
 * Your modal has tabs: Tekst, Video, Bestanden, Quiz, AI Coach, Simulatie
 */

export const LessonContentModal = ({ lesson, course, module }) => {
  const [activeTab, setActiveTab] = useState('tekst');
  const [content, setContent] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [simulation, setSimulation] = useState(null);

  const lessonContext = {
    courseTitle: course.title,
    moduleTitle: module.title,
    lessonTitle: lesson.title,
    existingContent: content,
    duration: lesson.duration || 15
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Les Content: {lesson.title}</h2>
            <p className="text-sm text-gray-600">
              {course.title} → {module.title}
            </p>
          </div>
          <button className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <Tab active={activeTab === 'tekst'} onClick={() => setActiveTab('tekst')}>
            📄 Tekst
          </Tab>
          <Tab active={activeTab === 'video'} onClick={() => setActiveTab('video')}>
            🎥 Video
          </Tab>
          <Tab active={activeTab === 'bestanden'} onClick={() => setActiveTab('bestanden')}>
            📎 Bestanden
          </Tab>
          <Tab active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
            ❓ Quiz
          </Tab>
          <Tab active={activeTab === 'ai-coach'} onClick={() => setActiveTab('ai-coach')}>
            🤖 AI Coach
          </Tab>
          <Tab active={activeTab === 'simulatie'} onClick={() => setActiveTab('simulatie')}>
            🎯 Simulatie
          </Tab>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* TEKST TAB */}
          {activeTab === 'tekst' && (
            <div className="space-y-4">
              {/* Toolbar with AI Button */}
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">B</button>
                  <button className="p-2 hover:bg-gray-100 rounded">I</button>
                  <button className="p-2 hover:bg-gray-100 rounded">H1</button>
                  <button className="p-2 hover:bg-gray-100 rounded">H2</button>
                </div>

                {/* ADD THIS */}
                <AIGenerateButton
                  type="content"
                  context={lessonContext}
                  onGenerated={(data) => setContent(data.content)}
                  variant="primary"
                  size="sm"
                />
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-4 border rounded-lg"
                placeholder="Les inhoud..."
              />
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quiz Vragen</h3>
                
                {/* ADD THIS */}
                <AIGenerateButton
                  type="quiz"
                  context={lessonContext}
                  onGenerated={(data) => setQuiz(data.questions)}
                  variant="primary"
                  size="md"
                />
              </div>

              {quiz.map((q, idx) => (
                <QuizQuestionCard key={idx} question={q} index={idx} />
              ))}
            </div>
          )}

          {/* SIMULATIE TAB */}
          {activeTab === 'simulatie' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Simulatie Scenario</h3>
                
                {/* ADD THIS */}
                <AIGenerateButton
                  type="simulation"
                  context={lessonContext}
                  onGenerated={(data) => setSimulation(data.simulation)}
                  variant="primary"
                  size="md"
                />
              </div>

              {simulation && <SimulationScenario scenario={simulation} />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Sluiten
          </button>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            💾 Content Opslaan
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * LOCATION 4: SIDEBAR ITEMS WITH AI
 * ==================================
 * Add AI to each sidebar section
 */

// INHOUD (Content)
export const InhoudSectionWithAI = ({ course, module }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📄 Inhoud</h3>
        <AIGenerateButton
          type="content"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => console.log('Content:', data)}
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Content list */}
    </div>
  );
};

// QUIZ
export const QuizSectionWithAI = ({ course, module }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">❓ Quiz</h3>
        <AIGenerateButton
          type="quiz"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => console.log('Quiz:', data)}
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Quiz questions */}
    </div>
  );
};

// SIMULATIE
export const SimulatieSectionWithAI = ({ course, module }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🎯 Simulatie</h3>
        <AIGenerateButton
          type="simulation"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => console.log('Simulation:', data)}
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Simulation scenarios */}
    </div>
  );
};

// PRAKTIJK (Practical Case)
export const PraktijkSectionWithAI = ({ course, module }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📝 Praktijk</h3>
        <AIGenerateButton
          type="assignment"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => console.log('Assignment:', data)}
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Practical assignments */}
    </div>
  );
};

// EXAMEN
export const ExamenSectionWithAI = ({ course, module }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📊 Examen</h3>
        <AIGenerateButton
          type="exam"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => console.log('Exam:', data)}
          variant="secondary"
          size="sm"
        />
      </div>
      {/* Exam configuration */}
    </div>
  );
};

// CERTIFICAAT
export const CertificaatSectionWithAI = ({ course }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🎓 Certificaat</h3>
        <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
          Genereer Certificaat
        </button>
      </div>
      {/* Certificate preview */}
    </div>
  );
};

/**
 * LOCATION 5: MODULE EXAMEN SECTION
 * ==================================
 * Bottom section showing "Module Examen" with AI generation
 */

export const ModuleExamenWithAI = ({ course, module }) => {
  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-purple-900">Module Examen</h3>
          <p className="text-sm text-purple-700">
            Test je kennis van {module.title}
          </p>
        </div>
        
        {/* ADD THIS */}
        <AIGenerateButton
          type="exam"
          context={{
            courseTitle: course.title,
            moduleTitle: module.title
          }}
          onGenerated={(data) => {
            console.log('Module exam generated:', data.questions);
          }}
          variant="primary"
          size="md"
        />
      </div>

      {/* Exam info */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-3 rounded">
          <div className="text-sm text-gray-600">Vragen</div>
          <div className="text-2xl font-bold text-purple-600">20</div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="text-sm text-gray-600">Tijd</div>
          <div className="text-2xl font-bold text-purple-600">45min</div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="text-sm text-gray-600">Slagen</div>
          <div className="text-2xl font-bold text-purple-600">70%</div>
        </div>
      </div>
    </div>
  );
};

/**
 * LOCATION 6: AI COACH INTEGRATION
 * =================================
 * Your existing AI Coach with generation capabilities
 */

export const AICoachWithGeneration = ({ lesson }) => {
  const [messages, setMessages] = useState([]);

  return (
    <div className="h-full flex flex-col">
      {/* AI Coach Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold">AI Coach</h3>
            <p className="text-xs text-purple-100">Jouw persoonlijke lesbegeleider</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b bg-purple-50">
        <div className="text-sm font-medium text-gray-700 mb-2">Genereer:</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-white border border-purple-200 rounded hover:bg-purple-100 text-sm">
            ✍️ Uitleg
          </button>
          <button className="px-3 py-2 bg-white border border-purple-200 rounded hover:bg-purple-100 text-sm">
            🎯 Toepassen
          </button>
          <button className="px-3 py-2 bg-white border border-purple-200 rounded hover:bg-purple-100 text-sm">
            💭 Reflectie
          </button>
          <button className="px-3 py-2 bg-white border border-purple-200 rounded hover:bg-purple-100 text-sm">
            📝 Oefenen
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.isUser ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Stel een vraag aan je AI Coach..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

/**
 * HELPER COMPONENTS
 * =================
 */

const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border-b-2 border-purple-600 text-purple-600'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
);

const QuizQuestionCard = ({ question, index }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-start justify-between mb-2">
      <p className="font-medium">
        {index + 1}. {question.question}
      </p>
      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
        {question.difficulty}
      </span>
    </div>
    <div className="space-y-1 mt-2">
      {question.options.map((option, optIdx) => (
        <div
          key={optIdx}
          className={`p-2 rounded ${
            question.correctAnswer === optIdx
              ? 'bg-green-50 border border-green-200'
              : 'bg-gray-50'
          }`}
        >
          {option}
        </div>
      ))}
    </div>
    {question.explanation && (
      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
        <strong>Uitleg:</strong> {question.explanation}
      </div>
    )}
  </div>
);

const SimulationScenario = ({ scenario }) => (
  <div className="space-y-4">
    <div className="p-4 bg-blue-50 rounded-lg">
      <h4 className="font-bold text-lg mb-2">{scenario.title}</h4>
      <p className="text-gray-700">{scenario.scenario}</p>
    </div>

    <div>
      <h5 className="font-semibold mb-2">Keuzes:</h5>
      <div className="space-y-2">
        {scenario.options.map((option, idx) => (
          <div key={idx} className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <p className="font-medium">{option.text}</p>
            <p className="text-sm text-gray-600 mt-1">
              Resultaat: {option.outcome} ({option.points} punten)
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="p-4 bg-green-50 rounded-lg">
      <h5 className="font-semibold mb-2">Leerpunten:</h5>
      <ul className="list-disc list-inside space-y-1">
        {scenario.learningPoints.map((point, idx) => (
          <li key={idx} className="text-gray-700">{point}</li>
        ))}
      </ul>
    </div>
  </div>
);

/**
 * SUMMARY - WHERE TO ADD AI BUTTONS
 * ==================================
 * 
 * ✅ 1. Course Header - "Genereer Complete Training"
 * ✅ 2. Module List Items - Small AI button per module
 * ✅ 3. Lesson Content Modal:
 *      - Tekst tab (toolbar)
 *      - Quiz tab (header)
 *      - Simulatie tab (header)
 * ✅ 4. Sidebar Sections:
 *      - Inhoud
 *      - Quiz
 *      - Simulatie
 *      - Praktijk
 *      - Examen
 * ✅ 5. Module Examen section (bottom area)
 * ✅ 6. AI Coach (quick actions)
 */

export default {
  CourseHeaderWithAI,
  ModuleListItemWithAI,
  LessonContentModal,
  InhoudSectionWithAI,
  QuizSectionWithAI,
  SimulatieSectionWithAI,
  PraktijkSectionWithAI,
  ExamenSectionWithAI,
  CertificaatSectionWithAI,
  ModuleExamenWithAI,
  AICoachWithGeneration
};
