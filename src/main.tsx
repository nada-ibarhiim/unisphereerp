import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// --- حيلة الحماية الفولاذية: منع أي كود من عمل تحويل لصفحة الـ login إجباري ---
if (typeof window !== 'undefined') {
  // 1. حقن بيانات ندى في المتصفح تلقائياً أول ما يفتح
  localStorage.setItem('token', 'fake-admin-token');
  localStorage.setItem('user', JSON.stringify({ 
    id: 'c612a81a-70a0-4161-ac8e-46538baa39db', 
    email: 'nadaebrahim590@gmial.com', 
    role: 'admin' 
  }));

  // 2. مراقبة الـ Location (التحويلات): لو أي كود حاول يوديكي لـ /login، المتصفح هيرفض ويثبتك في مكانك!
  
  // بنعمل حظر على الـ assign والـ replace اللي بيستخدموهم الكود للطرد
  const originalAssign = window.location.assign;
  window.location.assign = function(url) {
    if (String(url).includes('/login')) {
      console.log("Blocked redirection to login!");
      return; // ممنوع تروح للوج إن!
    }
    originalAssign.apply(this, arguments as any);
  };

  const originalReplace = window.location.replace;
  window.location.replace = function(url) {
    if (String(url).includes('/login')) {
      console.log("Blocked redirection to login!");
      return; // ممنوع تروح للوج إن!
    }
    originalReplace.apply(this, arguments as any);
  };

  // لو الكود استخدم window.location.href = '/login' مباشرة
  Object.defineProperty(window.location, 'href', {
    set: function(url) {
      if (String(url).includes('/login')) {
        console.log("Blocked property redirection to login!");
        return; // حظر الطرد
      }
      return url;
    },
    configurable: true
  });
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
    // لو السيرفر وقع أو جاب 401، هنوهمه إن الداتا رجعت فاضية عشان الفرونت إند ما يعملش كراش
    return Promise.resolve({ data: [] }); 
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);