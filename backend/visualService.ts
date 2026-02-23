import axios from 'axios';

const API_BASE = '/api/v1';  // Use /api/v1 to match nginx config

export interface LessonVisual {
  id: number;
  lesson: number;
  lesson_title: string;
  visual_id: string;
  ai_confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  custom_keywords?: string;
  ai_concepts?: string[];
  ai_intent?: string;
  ai_methodology?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: number;
}

export const visualService = {
  async getApprovedVisual(lessonId: string): Promise<LessonVisual | null> {
    try {
      const response = await axios.get(`${API_BASE}/academy/visuals/lesson-visuals/by_lesson/`, {
        params: { lesson_id: lessonId }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getVisualsByCourse(courseId: string, status?: string): Promise<LessonVisual[]> {
    const response = await axios.get(`${API_BASE}/academy/visuals/lesson-visuals/`, {
      params: { 
        course_id: courseId,
        ...(status && { status })
      }
    });
    return response.data.results || response.data;
  },

  async generateVisuals(courseId: string, regenerate = false) {
    const response = await axios.post(
      `${API_BASE}/academy/visuals/lesson-visuals/generate_visuals/`,
      { 
        course_id: courseId,
        regenerate 
      }
    );
    return response.data;
  },

  async approveVisual(visualId: number) {
    const response = await axios.post(
      `${API_BASE}/academy/visuals/lesson-visuals/${visualId}/approve/`
    );
    return response.data;
  },

  async rejectVisual(visualId: number, customKeywords?: string) {
    const response = await axios.post(
      `${API_BASE}/academy/visuals/lesson-visuals/${visualId}/reject/`,
      { custom_keywords: customKeywords }
    );
    return response.data;
  }
};
