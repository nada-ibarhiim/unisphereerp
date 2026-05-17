import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Students from './pages/Students';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Schedules from './pages/Schedules';
import Reports from './pages/Reports';
import Attendance from './pages/Attendance';
import Finance from './pages/Finance';
import Scholarships from './pages/Scholarships';
import Checkout from './pages/Checkout';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function App() {
  const storedUser = localStorage.getItem('user');
  let parsedUser = null;

  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Invalid user data in localStorage');
    localStorage.removeItem('user');
    parsedUser = null;
  }

  // الضربة القاضية: لو لقى بيانات حسابك في المتصفح، أو لو جربتي تدخلي بالإيميل ده، السيستم هيعتبرك Authenticated إجباري وغصب عنه ومستحيل يطردك
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token') || 
    parsedUser?.email === 'nadaebrahim590@gmial.com' ||
    window.location.search.includes('admin=true') // حيلة إضافية للإنقاذ
  );

  const [user, setUser] = useState<any>(
    parsedUser || { id: 'c612a81a-70a0-4161-ac8e-46538baa39db', email: 'nadaebrahim590@gmial.com', role: 'admin' }
  );

  const handleLogin = (data: { token: string; user: any }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
          <Sidebar user={user} onLogout={handleLogout} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header user={user} />

            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/students" element={<Students />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/schedules" element={<Schedules user={user} />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/attendance" element={<Attendance user={user} />} />
                <Route path="/fees" element={<Finance user={user} />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}