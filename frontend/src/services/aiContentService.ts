import axios from 'axios';

const API_BASE = '/api/v1';

// Create axios instance with auth
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LessonContext {
  courseTitle: string;
  courseMethodology?: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonType: 'video' | 'text' | 'quiz' | 'assignment' | 'simulation' | 'exam';
  duration?: number;
  existingContent?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  scenario: string;
  options: Array<{
    text: string;
    outcome: string;
    points: number;
  }>;
  learningPoints: string[];
}

export interface Assignment {
  title: string;
  description: string;
  instructions: string[];
  deliverables: string[];
  rubric: Array<{
    criteria: string;
    points: number;
    description: string;
  }>;
  estimatedTime: number;
}

export interface ExamQuestion {
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  explanation?: string;
}

export interface ExtractedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  methodologies: string[];
}

export const aiContentService = {
  /**
   * Generate lesson content (transcript)
   */
  async generateLessonContent(context: LessonContext): Promise<string> {
    const response = await axiosInstance.post('/ai/generate-content/', {
      type: 'lesson_content',
      context
    });
    return response.data.content;
  },

  /**
   * Generate quiz questions from content
   */
  async generateQuiz(context: LessonContext, numQuestions: number = 5): Promise<QuizQuestion[]> {
    const response = await axiosInstance.post('/ai/generate-quiz/', {
      context,
      num_questions: numQuestions
    });
    return response.data.questions;
  },

  /**
   * Generate simulation scenario
   */
  async generateSimulation(context: LessonContext): Promise<SimulationScenario> {
    const response = await axiosInstance.post('/ai/generate-simulation/', {
      context
    });
    return response.data.simulation;
  },

  /**
   * Generate assignment/praktijkopdracht
   */
  async generateAssignment(context: LessonContext): Promise<Assignment> {
    const response = await axiosInstance.post('/ai/generate-assignment/', {
      context
    });
    return response.data.assignment;
  },

  /**
   * Generate exam questions
   */
  async generateExam(
    courseTitle: string,
    moduleTitle: string,
    numQuestions: number = 20
  ): Promise<ExamQuestion[]> {
    const response = await axiosInstance.post('/ai/generate-exam/', {
      course_title: courseTitle,
      module_title: moduleTitle,
      num_questions: numQuestions
    });
    return response.data.questions;
  },

  /**
   * Extract skills from content
   */
  async extractSkills(content: string, courseTitle: string): Promise<ExtractedSkills> {
    const response = await axiosInstance.post('/ai/extract-skills/', {
      content,
      course_title: courseTitle
    });
    return response.data.skills;
  },

  /**
   * Generate all content for a lesson
   */
  async generateAllContent(context: LessonContext) {
    const [content, quiz, skills] = await Promise.all([
      this.generateLessonContent(context),
      context.lessonType === 'quiz' ? this.generateQuiz(context) : Promise.resolve([]),
      this.extractSkills(context.existingContent || '', context.courseTitle)
    ]);

    return {
      content,
      quiz,
      skills
    };
  }
};
