// INTEGRATION GUIDE: Add AI Generate Buttons to Your Existing Tabs
// ==================================================================

import React, { useState } from 'react';
import { AIGenerateButton } from './AIGenerateButton';

/**
 * 1. TEKST TAB (Content Tab) - Add AI Generate Button
 * ====================================================
 */

export const TekstTabWithAI = () => {
  const [content, setContent] = useState('');
  const [lessonData, setLessonData] = useState({
    courseTitle: 'PRINCE2 Foundation & Practitioner',
    moduleTitle: 'PRINCE2 Overview',
    lessonTitle: 'What is PRINCE2?'
  });

  return (
    <div className="space-y-4">
      {/* Existing toolbar with B, I, H buttons */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <button className="p-2">B</button>
          <button className="p-2">I</button>
          <button className="p-2">H1</button>
          <button className="p-2">H2</button>
          {/* ... existing buttons ... */}
        </div>

        {/* ADD THIS - AI Generate Button */}
        <AIGenerateButton
          type="content"
          context={{
            courseTitle: lessonData.courseTitle,
            moduleTitle: lessonData.moduleTitle,
            lessonTitle: lessonData.lessonTitle,
            duration: 15
          }}
          onGenerated={(data) => {
            setContent(data.content);
            // Your existing save logic
          }}
          variant="secondary"
          size="sm"
        />
      </div>

      {/* Existing text editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-4 border rounded"
        placeholder="Les inhoud..."
      />
    </div>
  );
};

/**
 * 2. QUIZ TAB - Add AI Generate Quiz Button
 * ==========================================
 */

export const QuizTabWithAI = () => {
  const [questions, setQuestions] = useState([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Quiz Vragen</h3>
        
        {/* ADD THIS - AI Generate Quiz */}
        <AIGenerateButton
          type="quiz"
          context={{
            courseTitle: 'PRINCE2 Foundation & Practitioner',
            moduleTitle: 'PRINCE2 Overview',
            lessonTitle: 'What is PRINCE2?',
            existingContent: 'PRINCE2 is a project management methodology...'
          }}
          onGenerated={(data) => {
            setQuestions(data.questions);
            // Save to your database
          }}
          variant="primary"
          size="md"
        />
      </div>

      {/* Existing quiz questions display */}
      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="p-4 border rounded">
            <p className="font-medium">{index + 1}. {q.question}</p>
            <div className="mt-2 space-y-1">
              {q.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`p-2 rounded ${
                    q.correctAnswer === optIndex ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. SIMULATIE TAB - Add AI Generate Simulation Button
 * ====================================================
 */

export const SimulatieTabWithAI = () => {
  const [scenario, setScenario] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Simulatie Scenario</h3>
        
        {/* ADD THIS - AI Generate Simulation */}
        <AIGenerateButton
          type="simulation"
          context={{
            courseTitle: 'Agile & Scrum Master',
            moduleTitle: 'Sprint Retrospective',
            lessonTitle: 'Facilitating Retros'
          }}
          onGenerated={(data) => {
            setScenario(data.simulation);
            // Save to database
          }}
          variant="primary"
          size="md"
        />
      </div>

      {/* Display scenario */}
      {scenario && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">{scenario.title}</h4>
            <p className="text-gray-700">{scenario.scenario}</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold">Opties:</h5>
            {scenario.options.map((option, index) => (
              <div key={index} className="p-3 border rounded hover:bg-gray-50">
                <p className="font-medium">{option.text}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Resultaat: {option.outcome} ({option.points} punten)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 4. MODULE LEVEL - Generate All Lessons in Module
 * ================================================
 */

export const ModuleHeaderWithAI = ({ module }) => {
  const [generating, setGenerating] = useState(false);

  const generateAllLessons = async () => {
    setGenerating(true);
    
    // Generate content for each lesson in module
    for (const lesson of module.lessons) {
      const button = (
        <AIGenerateButton
          type="content"
          context={{
            courseTitle: module.courseTitle,
            moduleTitle: module.title,
            lessonTitle: lesson.title,
            duration: lesson.duration || 15
          }}
          onGenerated={async (data) => {
            // Save lesson content
            await saveLessonContent(lesson.id, data.content);
          }}
        />
      );
    }
    
    setGenerating(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div>
        <h2 className="text-xl font-bold">{module.title}</h2>
        <p className="text-gray-600">{module.lessons.length} lessen</p>
      </div>

      {/* ADD THIS - Generate All Module Content */}
      <button
        onClick={generateAllLessons}
        disabled={generating}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
      >
        {generating ? 'Bezig...' : '🤖 Genereer Module Inhoud'}
      </button>
    </div>
  );
};

/**
 * 5. COURSE/TRAINING LEVEL - Generate Complete Training
 * =====================================================
 */

export const CourseHeaderWithAI = ({ course }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-purple-100">
            {course.modules.length} modules • {course.totalLessons} lessen
          </p>
        </div>

        {/* ADD THIS - Generate Complete Training */}
        <AIGenerateButton
          type="course"
          context={{
            courseTitle: course.title,
            moduleTitle: 'All Modules'
          }}
          onGenerated={async (data) => {
            // Generate all modules and lessons
            console.log('Complete training generated:', data);
          }}
          variant="secondary"
          size="lg"
        />
      </div>
    </div>
  );
};

/**
 * 6. EXAM TAB - Generate Certification Exam
 * =========================================
 */

export const ExamTabWithAI = ({ course, module }) => {
  const [examQuestions, setExamQuestions] = useState([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Certificering Examen</h3>
          <p className="text-sm text-gray-600">
            {module ? `${module.title} Examen` : `${course.title} Eindexamen`}
          </p>
        </div>
        
        {/* ADD THIS - Generate Exam */}
        <div className="flex gap-2">
          <AIGenerateButton
            type="exam"
            context={{
              courseTitle: course.title,
              moduleTitle: module?.title || 'Complete Course',
            }}
            onGenerated={(data) => {
              setExamQuestions(data.questions);
            }}
            variant="primary"
            size="md"
          />
        </div>
      </div>

      {/* Exam configuration */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="text-sm text-gray-600">Tijdslimiet</label>
          <input type="number" className="w-full mt-1 px-3 py-2 border rounded" defaultValue={60} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Aantal Vragen</label>
          <input type="number" className="w-full mt-1 px-3 py-2 border rounded" defaultValue={20} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Slagingspercentage</label>
          <input type="number" className="w-full mt-1 px-3 py-2 border rounded" defaultValue={70} />
        </div>
      </div>

      {/* Display exam questions */}
      <div className="space-y-3">
        {examQuestions.map((q, index) => (
          <div key={index} className="p-4 border rounded">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium">
                {index + 1}. {q.question}
              </p>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {q.points} ptn
              </span>
            </div>
            
            {q.options && (
              <div className="mt-2 space-y-1">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      q.correctAnswer === optIndex ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 7. PRACTICAL CASE/ASSIGNMENT TAB
 * =================================
 */

export const PracticalCaseTabWithAI = () => {
  const [assignment, setAssignment] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Praktijkopdracht</h3>
        
        {/* ADD THIS - Generate Assignment */}
        <AIGenerateButton
          type="assignment"
          context={{
            courseTitle: 'Project Management Fundamentals',
            moduleTitle: 'Planning',
            lessonTitle: 'Create Project Charter'
          }}
          onGenerated={(data) => {
            setAssignment(data.assignment);
          }}
          variant="primary"
          size="md"
        />
      </div>

      {/* Display assignment */}
      {assignment && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-lg mb-2">{assignment.title}</h4>
            <p className="text-gray-700">{assignment.description}</p>
            <div className="mt-2 text-sm text-gray-600">
              ⏱️ Geschatte tijd: {assignment.estimatedTime} minuten
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Instructies:</h5>
            <ol className="list-decimal list-inside space-y-1">
              {assignment.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700">{instruction}</li>
              ))}
            </ol>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Deliverables:</h5>
            <ul className="list-disc list-inside space-y-1">
              {assignment.deliverables.map((deliverable, index) => (
                <li key={index} className="text-gray-700">{deliverable}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Beoordelingscriteria:</h5>
            <div className="space-y-2">
              {assignment.rubric.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{item.criteria}</span>
                    <span className="text-sm text-blue-600">{item.points} punten</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SUMMARY OF WHERE TO ADD AI BUTTONS
 * ===================================
 * 
 * ✅ Content Tab (Tekst) - Top right of toolbar
 * ✅ Quiz Tab - Next to "Quiz Vragen" header
 * ✅ Simulation Tab - Next to "Simulatie Scenario" header
 * ✅ Exam Tab - Next to exam configuration
 * ✅ Practical Case Tab - Next to "Praktijkopdracht" header
 * ✅ Module Level - In module header
 * ✅ Course Level - In course header
 */
