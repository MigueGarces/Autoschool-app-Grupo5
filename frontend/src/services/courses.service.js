import { api } from '@/lib/api';

export const coursesService = {
  getCourses: async () => {
    const response = await api.get('/courses/');
    return response.data.results || response.data;
  },

  createCourse: async (data) => {
    const response = await api.post('/courses/', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}/`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}/`);
  },
};