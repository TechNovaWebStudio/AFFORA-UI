import { api } from '../lib/api';

export const productApi = {
  getAll: (params = '') => {
    let query = params;
    if (typeof params === 'object' && params !== null) {
      // Remove empty strings, null, or undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      );
      const queryString = new URLSearchParams(cleanParams).toString();
      query = queryString ? `?${queryString}` : '';
    } else if (typeof params === 'string' && params && !params.startsWith('?')) {
      query = `?${params}`;
    }
    return api.get(`/products${query}`);
  },
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getCategories: () => api.get('/categories'),
};
