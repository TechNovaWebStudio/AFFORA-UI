import { api } from '../lib/api';

export const adminApi = {
  // Dashboard
  getStats: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/dashboard${queryString ? `?${queryString}` : ''}`);
  },
  
  // Products
  getProducts: () => api.get('/products'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImages: (formData) => api.upload('/upload', formData),

  // Orders
  getOrders: () => api.get('/orders/all'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { orderStatus: status }),

  // Customers
  getCustomers: () => api.get('/admin/customers'),
  toggleCustomerStatus: (id) => api.put(`/admin/customers/${id}/toggle`),

  // Categories
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Reviews
  getReviews: () => api.get('/admin/reviews'),
  approveReview: (id, approved) => api.put(`/admin/reviews/${id}`, { approved }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),

  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  // Offers
  getOffers: () => api.get('/offers'),
  createOffer: (data) => api.post('/offers', data),
  updateOffer: (id, data) => api.put(`/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/offers/${id}`),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  // Messages & Enquiries
  getContactMessages: () => api.get('/contact'),
  deleteContactMessage: (id) => api.delete(`/contact/${id}`),
  getWholesaleEnquiries: () => api.get('/wholesale'),
  deleteWholesaleEnquiry: (id) => api.delete(`/wholesale/${id}`)
};
