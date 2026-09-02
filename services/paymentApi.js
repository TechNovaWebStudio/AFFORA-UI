import { api } from '../lib/api';

export const paymentApi = {
  createPaymentOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};
