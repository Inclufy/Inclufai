// 🎯 MULTI-LAYER CONTEXT SYSTEM - TypeScript Interfaces
// Location: src/types/visualContext.ts

/**
 * Layer 0: Visual Library
 * Canonical list of all available visuals with metadata
 */
export interface Visual {
  id: string;
  name: string;
  description: string;
  tags: string[];
  topics: string[];
  methodologies: Methodology[];
  conceptClass: ConceptClass[];
  learningIntent: LearningIntent[];
  priority: number; // Higher = more specific/preferred
}

/**
 * Methodologies supported by the system
 */
export type Methodology = 
  | 'generic_pm'
  | 'scrum'
  | 'kanban'
  | 'prince2'
  | 'lean_six_sigma'
  | 'safe'
  | 'agile'
  | 'waterfall'
  | 'leadership'
  | 'program_management'
  | 'ms_project';

/**
 * Concept classes for educational content
 */
export type ConceptClass =
  | 'metric_visualization'
  | 'diagram'
  | 'template'
  | 'framework'
  | 'process_flow'
  | 'role_matrix'
  | 'governance'
  | 'comparison'
  | 'definition'
  | 'tool_interface'
  | 'analysis'
  | 'planning';

/**
 * Learning intents - what the lesson aims to achieve
 */
export type LearningIntent =
  | 'explain_concept'
  | 'compare_options'
  | 'apply_template'
  | 'measure_metric'
  | 'analyze_data'
  | 'governance'
  | 'flow_visualization'
  | 'tooling'
  | 'role_definition'
  | 'process_overview'
  | 'decision_making';

/**
 * Layer 1: Course Context
 */
export interface CourseContext {
  id: string;
  title: string;
  domain: 'project_management' | 'leadership' | 'technical';
  courseType: 'methodology_specific' | 'generic_pm' | 'tool_specific' | 'soft_skills';
  primaryMethodology: Methodology;
}

/**
 * Layer 2: Module Context
 */
export interface ModuleContext {
  id: string;
  title: string;
  goal?: string;
  methodologyOverride?: Methodology; // Some modules can override course methodology
}

/**
 * Layer 3: Lesson Context
 */
export interface LessonContext {
  id: string;
  title: string;
  lessonType: 'video' | 'text' | 'quiz' | 'download' | 'interactive';
  learningIntent?: LearningIntent; // Auto-detected or manually set
  keywords: string[]; // Extracted from title + content
  position: {
    moduleIndex: number;
    lessonIndex: number;
    totalModules: number;
    totalLessons: number;
    isFirstLesson: boolean;
    isLastLesson: boolean;
  };
}

/**
 * Layer 4: Content Signals (from NLP/analysis)
 */
export interface ContentSignals {
  entities: string[]; // Named entities: "DMAIC", "WIP", "RACI"
  conceptClass: ConceptClass;
  methodologyConfidence: number; // 0-1, how confident are we about methodology
  topKeywords: string[]; // Most important keywords from content
  contentLength: number;
}

/**
 * Complete multi-layer context for visual selection
 */
export interface VisualContext {
  course: CourseContext;
  module: ModuleContext;
  lesson: LessonContext;
  contentSignals: ContentSignals;
  availableVisuals: Visual[];
}

/**
 * Visual selection result with confidence and reasoning
 */
export interface VisualSelection {
  visualId: string;
  visualName: string;
  confidence: number; // 0-1
  score: number;
  reasoning: SelectionReasoning;
  fallbackUsed: boolean;
  alternatives: Array<{
    visualId: string;
    score: number;
  }>;
}

/**
 * Detailed reasoning for selection
 */
export interface SelectionReasoning {
  methodologyMatch: boolean;
  conceptClassMatch: boolean;
  learningIntentMatch: boolean;
  keywordMatches: string[];
  penalties: string[];
  fallbackReason?: string;
}

/**
 * Scoring weights for the selection algorithm
 */
export interface ScoringWeights {
  methodologyMatch: number;     // default: 50
  conceptClassMatch: number;     // default: 30
  learningIntentMatch: number;   // default: 20
  keywordHit: number;            // default: 5 per hit (max 20)
  aiConceptMatch: number;        // default: 150 (AI concept bonus!)
  conflictPenalty: number;       // default: -30
  genericPenalty: number;        // default: -10
}
