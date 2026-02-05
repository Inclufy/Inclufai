import api from './api';

// Definition of Done
export const definitionOfDoneApi = {
  getAll: (projectId: string | number) =>
    api.get(`/projects/${projectId}/agile/definition-of-done/`),
  create: (projectId: string | number, data: any) =>
    api.post(`/projects/${projectId}/agile/definition-of-done/`, data),
  update: (projectId: string | number, id: number, data: any) =>
    api.patch(`/projects/${projectId}/agile/definition-of-done/${id}/`, data),
  delete: (projectId: string | number, id: number) =>
    api.delete(`/projects/${projectId}/agile/definition-of-done/${id}/`),
};
