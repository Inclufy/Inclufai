import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001/api/v1';

export interface UserFeatures {
  tier: 'trial' | 'starter' | 'professional' | 'team' | 'enterprise';
  features: {
    web_access?: boolean;
    mobile_access?: boolean;
    time_tracking?: boolean;
    teams?: boolean;
    post_project?: boolean;
    program_management?: boolean;
    ai_assistant?: boolean;
    methodology_templates?: boolean;
    gantt_charts?: boolean;
    resource_management?: boolean;
    admin_permissions?: boolean;
    team_dashboards?: boolean;
    sso_saml?: boolean;
    api_access?: boolean;
    custom_workflows?: boolean;
    dedicated_support?: boolean;
    white_label?: boolean;
  };
  limits: {
    max_users: number;
    max_programs: number;
    max_projects: number;
  };
  usage: {
    users: number;
    programs: number;
    projects: number;
  };
  can_create: {
    user: boolean;
    program: boolean;
    project: boolean;
  };
}

// SuperAdmin gets ALL features
const SUPERADMIN_FEATURES: UserFeatures = {
  tier: 'enterprise',
  features: {
    web_access: true,
    mobile_access: true,
    time_tracking: true,
    teams: true,
    post_project: true,
    program_management: true,
    ai_assistant: true,
    methodology_templates: true,
    gantt_charts: true,
    resource_management: true,
    admin_permissions: true,
    team_dashboards: true,
    sso_saml: true,
    api_access: true,
    custom_workflows: true,
    dedicated_support: true,
    white_label: true,
  },
  limits: {
    max_users: -1, // Unlimited
    max_programs: -1,
    max_projects: -1,
  },
  usage: {
    users: 0,
    programs: 0,
    projects: 0,
  },
  can_create: {
    user: true,
    program: true,
    project: true,
  },
};

const fetchUserFeatures = async (): Promise<UserFeatures> => {
  const token = localStorage.getItem("access_token");
  
  // Check if user is superadmin
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.is_superuser || user.isSuperAdmin || user.role === 'superadmin') {
        console.log('✅ SuperAdmin detected - granting ALL features');
        return SUPERADMIN_FEATURES;
      }
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/user-features/`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch user features");
  }
  
  return response.json();
};

export const useUserFeatures = () => {
  return useQuery({
    queryKey: ['user-features'],
    queryFn: fetchUserFeatures,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Helper function to check if user is superadmin
const isSuperAdmin = (): boolean => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.is_superuser || user.isSuperAdmin || user.role === 'superadmin';
    } catch (e) {
      return false;
    }
  }
  return false;
};

// Helper functions
export const hasFeature = (features: UserFeatures | undefined, featureName: string): boolean => {
  // SuperAdmin always has ALL features
  if (isSuperAdmin()) return true;
  
  if (!features) return false;
  return features.features[featureName as keyof typeof features.features] || false;
};

export const canCreate = (features: UserFeatures | undefined, resourceType: 'user' | 'program' | 'project'): boolean => {
  // SuperAdmin can always create
  if (isSuperAdmin()) return true;
  
  if (!features) return false;
  return features.can_create[resourceType] || false;
};

export const getLimit = (features: UserFeatures | undefined, resourceType: 'users' | 'programs' | 'projects'): number => {
  // SuperAdmin has unlimited
  if (isSuperAdmin()) return -1;
  
  if (!features) return 0;
  return features.limits[`max_${resourceType}` as keyof typeof features.limits] || 0;
};

export const getUsage = (features: UserFeatures | undefined, resourceType: 'users' | 'programs' | 'projects'): number => {
  if (!features) return 0;
  return features.usage[resourceType] || 0;
};

export const isAtLimit = (features: UserFeatures | undefined, resourceType: 'users' | 'programs' | 'projects'): boolean => {
  // SuperAdmin never at limit
  if (isSuperAdmin()) return false;
  
  if (!features) return true;
  
  const limit = getLimit(features, resourceType);
  if (limit === -1) return false; // Unlimited
  
  const usage = getUsage(features, resourceType);
  return usage >= limit;
};

export const getTierName = (tier: string): string => {
  const names: Record<string, string> = {
    trial: 'Trial',
    starter: 'Starter',
    professional: 'Professional',
    team: 'Team',
    enterprise: 'Enterprise'
  };
  return names[tier] || tier;
};

export const getTierColor = (tier: string): string => {
  const colors: Record<string, string> = {
    trial: 'bg-yellow-100 text-yellow-800',
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    team: 'bg-green-100 text-green-800',
    enterprise: 'bg-gray-100 text-gray-800'
  };
  return colors[tier] || 'bg-gray-100 text-gray-800';
};
