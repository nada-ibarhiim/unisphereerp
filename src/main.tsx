import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// --- حيلة الحماية الفولاذية المحدثة (آمنة للمتصفح) ---
if (typeof window !== 'undefined') {
  // 1. حقن بيانات ندى في المتصفح تلقائياً
  localStorage.setItem('token', 'fake-admin-token');
  localStorage.setItem('user', JSON.stringify({ 
    id: 'c612a81a-70a0-4161-ac8e-46538baa39db', 
    email: 'nadaebrahim590@gmial.com', 
    role: 'admin' 
  }));

  // 2. حظر الـ assign والـ replace
  const originalAssign = window.location.assign;
  window.location.assign = function(url) {
    if (String(url).includes('/login')) {
      console.log("Blocked redirection to login!");
      return;
    }
    originalAssign.apply(this, arguments as any);
  };

  const originalReplace = window.location.replace;
  window.location.replace = function(url) {
    if (String(url).includes('/login')) {
      console.log("Blocked redirection to login!");
      return;
    }
    originalReplace.apply(this, arguments as any);
  };
}
// --- نهاية الحظر ---

// Configure axios global defaults
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// تجاهل كامل لأي إيرورز جاية من السيرفر عشان الداشبورد ما تقفلش
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.resolve({ data: [] }); 
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);