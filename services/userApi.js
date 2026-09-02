import { api } from '../lib/api';

export const userApi = {
  createReview: (data) => api.post('/users/reviews', data),
  getWishlist: () => api.get('/users/wishlist'),
  toggleWishlist: (data) => api.post('/users/wishlist', data),
  addAddress: (data) => api.post('/users/address', data),
  updateAddress: (id, data) => api.put(`/users/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/address/${id}`),
};
