import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface SkillCategory {
  id: string;
  name: string;
  name_nl: string;
  icon: string;
  color: string;
  skills: Skill[];
  user_progress: UserSkill[];
}

export interface Skill {
  id: string;
  name: string;
  name_nl: string;
  category: string;
}

export interface UserSkill {
  id: number;
  skill: Skill;
  points: number;
  level: number;
  progress_to_next_level: number;
  points_to_next_level: number;
  level_name: { en: string; nl: string };
}

export interface SkillGoal {
  id: number;
  skill: Skill;
  target_level: number;
  deadline?: string;
  current_level: number;
  points_needed: number;
  estimated_lessons: number;
}

export const useSkills = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [goals, setGoals] = useState<SkillGoal[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_BASE = 'http://localhost:8090/api/v1/academy/skills';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchSkillsData = async () => {
    try {
      const [categoriesRes, userSkillsRes, goalsRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/categories/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/user-skills/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/goals/active/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/user-skills/summary/`, { headers: getAuthHeaders() }),
      ]);

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (userSkillsRes.ok) setUserSkills(await userSkillsRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch (error) {
      console.error('Failed to fetch skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardSkillPoints = async (
    lessonId: string,
    activityType: string = 'lesson_complete',
    bonusMultiplier: number = 1.0
  ) => {
    try {
      const res = await fetch(`${API_BASE}/user-skills/award_points/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ lesson_id: lessonId, activity_type: activityType, bonus_multiplier: bonusMultiplier }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Show level up toasts
        data.level_ups?.forEach((levelUp: any) => {
          toast({
            title: `🎉 Level Up!`,
            description: `${levelUp.skill_name}: Level ${levelUp.old_level} → ${levelUp.new_level}`,
          });
        });

        await fetchSkillsData();
        return data;
      }
    } catch (error) {
      console.error('Failed to award skill points:', error);
    }
  };

  const createGoal = async (skillId: string, targetLevel: number, deadline?: string, reason?: string) => {
    try {
      const res = await fetch(`${API_BASE}/goals/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ skill_id: skillId, target_level: targetLevel, deadline, reason }),
      });

      if (res.ok) {
        await fetchSkillsData();
        toast({ title: '🎯 Goal created!', description: 'Your skill goal has been set.' });
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      const res = await fetch(`${API_BASE}/goals/${goalId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        await fetchSkillsData();
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, []);

  return {
    categories,
    userSkills,
    goals,
    summary,
    loading,
    awardSkillPoints,
    createGoal,
    deleteGoal,
    refreshSkillsData: fetchSkillsData,
  };
};
