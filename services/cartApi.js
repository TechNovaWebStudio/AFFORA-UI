import { api } from '../lib/api';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity, weight) => api.post('/cart/add', { productId, quantity, weight }),
  updateQuantity: (productId, weight, quantity) => api.put('/cart/update', { productId, weight, quantity }),
  removeItem: (productId, weight) => api.delete(`/cart/remove/${productId}?weight=${weight}`),
  clearCart: () => api.delete('/cart/clear'),
};
