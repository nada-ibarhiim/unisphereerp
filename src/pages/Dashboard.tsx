import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [data, setData] = useState<any>({
    overview: { totalStudents: 1250, totalEmployees: 84, activeCourses: 32, totalRevenue: 450000 },
    teacher: { name: "Prof. Nada Ebrahim", coursesCount: 4, upcomingClasses: [
      { dayOfWeek: "Monday", startTime: "09:00", endTime: "11:00", course: { name: "Computer Graphics" }, room: { roomNumber: "302" } },
      { dayOfWeek: "Wednesday", startTime: "12:00", endTime: "14:00", course: { name: "Database Systems" }, room: { roomNumber: "105" } }
    ]},
    student: { gpa: "3.85", financialStatus: "PAID", courses: [
      { name: "Introduction to Networks", teacher: "Dr. Abdullah Hossam", room: "201", grade: "A" },
      { name: "Machine Learning Fairness", teacher: "Dr. Menna Ahmed", room: "Lab 4", grade: "A-" }
    ]}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboard/summary');
        if (response.data && Object.keys(response.data).length > 0) {
          setData(response.data);
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
      } {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <Clock className="text-brand-blue" />
      </motion.div>
    </div>
  );

  // --- Admin View ---
  if (!user?.role || ["ADMIN", "DEAN", "ADMISSION", "admin"].includes(user?.role)) {
    const overview = data?.overview;
    const cards = [
      { title: 'Total Enrollment', value: overview?.totalStudents?.toLocaleString() || "1,250", icon: GraduationCap },
      { title: 'Faculty Members', value: overview?.totalEmployees?.toLocaleString() || "84", icon: Users },
      { title: 'Active Courses', value: overview?.activeCourses || "32", icon: BookOpen },
      { title: 'Revenue (EGP)', value: overview?.totalRevenue?.toLocaleString() || "450,000", icon: DollarSign },
    ];

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Data Grid (البديل الآمن للـ Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent System Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold">
                    <th className="pb-3">Activity</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700">
                  <tr className="border-b border-slate-50">
                    <td className="py-3">Database Backup</td>
                    <td className="py-3">System Admin</td>
                    <td className="py-3 text-teal-500">Success</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-3">Course Assignment</td>
                    <td className="py-3">Nada Ebrahim</td>
                    <td className="py-3 text-teal-500">Success</td>
                  </tr>
                  <tr>
                    <td className="py-3">New Student Registration</td>
                    <td className="py-3">Admission Office</td>
                    <td className="py-3 text-teal-500">Success</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4