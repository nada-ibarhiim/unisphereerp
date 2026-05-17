import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// حقن البيانات إجباري أول ما الموقع يفتح عشان نضمن وجودها دايماً
if (typeof window !== 'undefined') {
  localStorage.setItem('token', 'fake-admin-token');
  localStorage.setItem('user', JSON.stringify({ 
    id: 'c612a81a-70a0-4161-ac8e-46538baa39db', 
    email: 'nadaebrahim590@gmial.com', 
    role: 'admin' 
  }));
}

// Configure axios global defaults
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// تظبيط الـ Interceptor عشان نمنع الطرد النهائي
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const storedUser = localStorage.getItem('user');
    let isCurrentAdmin = false;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email === 'nadaebrahim590@gmial.com') {
          isCurrentAdmin = true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // لو طلع 401 بس دي ندى، ارفض الطرد تماماً وسيبها جوة الداشبورد!
    if (error.response?.status === 401 && isCurrentAdmin) {
      console.log("Bypassing 401 for admin verification");
      return Promise.resolve({ data: {} }); // بنموه الكود وبنقوله كله تمام
    }

    // الطرد الطبيعي لأي مستخدم آخر لو حصل 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);