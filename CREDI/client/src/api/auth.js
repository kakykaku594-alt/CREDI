import client from './client';

export const register = (data) => client.post('/auth/register', data).then(r => r.data);
export const verifyOtp = (data) => client.post('/auth/verify-otp', data).then(r => r.data);
export const resendOtp = (data) => client.post('/auth/resend-otp', data).then(r => r.data);
export const login = (data) => client.post('/auth/login', data).then(r => r.data);
export const logout = () => client.post('/auth/logout').then(r => r.data);
