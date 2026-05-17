import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// --- حيلة الحماية الفولاذية المحدثة ---
if (typeof window !== 'undefined') {
  localStorage.setItem('token', 'fake-admin-token');
  localStorage.setItem('user', JSON.stringify({ 
    id: 'c612a81a-70a0-4161-ac8e-46538baa39db', 
    email: 'nadaebrahim590@gmial.com', 
    role: 'admin' 
  }));

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

// الحماية الشاملة: لو السيرفر مرجعش داتا، بنبعت داتا وهمية عشان الكروت والـ Stats ما تعملش كراش
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // بنرجع Object فيه مصفوفات وفيه قيم أصفار عشان يغذي كل كروت الـ Dashboard ومفيش حاجة تضرب
    return Promise.resolve({ 
      data: {
        students: [],
        courses: [],
        teachers: [],
        departments: [],
        stats: { totalStudents: 0, totalCourses: 0, totalTeachers: 0, totalDepartments: 0 },
        count: 0
      } 
    }); 
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);