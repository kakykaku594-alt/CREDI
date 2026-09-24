import client from './client';

export const getScore = () => client.get('/credit/score').then(r => r.data);
export const refreshScore = () => client.post('/credit/score/refresh').then(r => r.data);
export const getScoreHistory = () => client.get('/credit/score/history').then(r => r.data);
export const getImprovementPlan = () => client.get('/credit/improvement-plan').then(r => r.data);

export const getUpcomingPayments = () => client.get('/payments/upcoming').then(r => r.data);
export const addCreditCard = (data) => client.post('/payments/credit-cards', data).then(r => r.data);
export const addLoan = (data) => client.post('/payments/loans', data).then(r => r.data);
export const markPaid = (id) => client.patch(`/payments/${id}/mark-paid`).then(r => r.data);

export const getNotifications = () => client.get('/notifications').then(r => r.data);
