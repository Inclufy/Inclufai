import api from './api';

// Risk API
export const riskApi = {
  getAll: (projectId: string | number) =>
    api.get(`/projects/${projectId}/waterfall/risks/`),
  create: (projectId: string | number, data: any) =>
    api.post(`/projects/${projectId}/waterfall/risks/`, data),
  update: (projectId: string | number, id: number, data: any) =>
    api.patch(`/projects/${projectId}/waterfall/risks/${id}/`, data),
  delete: (projectId: string | number, id: number) =>
    api.delete(`/projects/${projectId}/waterfall/risks/${id}/`),
};

// Issue API
export const issueApi = {
  getAll: (projectId: string | number) =>
    api.get(`/projects/${projectId}/waterfall/issues/`),
  create: (projectId: string | number, data: any) =>
    api.post(`/projects/${projectId}/waterfall/issues/`, data),
  update: (projectId: string | number, id: number, data: any) =>
    api.patch(`/projects/${projectId}/waterfall/issues/${id}/`, data),
  delete: (projectId: string | number, id: number) =>
    api.delete(`/projects/${projectId}/waterfall/issues/${id}/`),
};

// Deliverable API
export const deliverableApi = {
  getAll: (projectId: string | number) =>
    api.get(`/projects/${projectId}/waterfall/deliverables/`),
  create: (projectId: string | number, data: any) =>
    api.post(`/projects/${projectId}/waterfall/deliverables/`, data),
  update: (projectId: string | number, id: number, data: any) =>
    api.patch(`/projects/${projectId}/waterfall/deliverables/${id}/`, data),
  delete: (projectId: string | number, id: number) =>
    api.delete(`/projects/${projectId}/waterfall/deliverables/${id}/`),
};

// Baseline API
export const baselineApi = {
  getAll: (projectId: string | number) =>
    api.get(`/projects/${projectId}/waterfall/baselines/`),
  create: (projectId: string | number, data: any) =>
    api.post(`/projects/${projectId}/waterfall/baselines/`, data),
  update: (projectId: string | number, id: number, data: any) =>
    api.patch(`/projects/${projectId}/waterfall/baselines/${id}/`, data),
  delete: (projectId: string | number, id: number) =>
    api.delete(`/projects/${projectId}/waterfall/baselines/${id}/`),
};
