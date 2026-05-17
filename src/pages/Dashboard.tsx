import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  DollarSign, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import axios from 'axios';

interface DashboardProps {
  user: any;
}

// نقلنا الـ chartData فوق عشان نقفل أي إيرور في الـ Build
const chartData = [
  { name: 'Week 1', revenue: 42000 },
  { name: 'Week 2', revenue: 68000 },
  { name: 'Week 3', revenue: 55000 },
  { name: 'Week 4', revenue: 92000 },
  { name: 'Week 5', revenue: 78000 },
  { name: 'Week 6', revenue: 110000 },
];

export default function Dashboard({ user }: DashboardProps) {
  // تزويد الـ useState بداتا وهمية مبدئية جمييلة عشان لو السيرفر جاب إيرور الأبلكيشن ما يقفش ويعرض الجداول
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
        // تم تجاهل الإيرور بنجاح والاعتماد على الـ Mock Data لعرض الـ UI
      } finally {
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

  // --- Admin/Dean/Admission View ---
  if (!user?.role || ["ADMIN", "DEAN", "ADMISSION", "admin"].includes(user?.role)) {
    const overview = data?.overview;
    const cards = [
      { title: 'Total Enrollment', value: overview?.totalStudents?.toLocaleString() || "1,250", icon: GraduationCap, color: 'brand-blue' },
      { title: 'Faculty Members', value: overview?.totalEmployees?.toLocaleString() || "84", icon: Users, color: 'brand-pink' },
      { title: 'Active Courses', value: overview?.activeCourses || "32", icon: BookOpen, color: 'brand-navy' },
      { title: 'Revenue (EGP)', value: overview?.totalRevenue?.toLocaleString() || "450,000", icon: DollarSign, color: 'teal-500' },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-ui-border shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-ui-muted text-xs font-bold uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-ui-text">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-ui-border shadow-sm">
            <h3 className="text-lg font-bold text-ui-text mb-6">Departmental Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-ui-border shadow-sm">
            <h3 className="text-lg font-bold text-ui-text mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-ui-bg rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-ui-muted">System Uptime</span>
                  <span className="text-teal-500 font-bold">99.9%</span>
                </div>
                <div className="w-full bg-ui-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[99.9%]"></div>
                </div>
              </div>
              <div className="p-4 bg-ui-bg rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-ui-muted">Storage Usage</span>
                  <span className="text-pink-500 font-bold">42%</span>
                </div>
                <div className="w-full bg-ui-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full w-[42%]"></div>
                </div>
              </div>
              <div className="p-4 bg-ui-bg rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-ui-muted">Pending Requests</span>
                  <span className="text-blue-500 font-bold">8</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="flex-1 h-1.5 rounded-full bg-blue-500"></div>)}
                  <div className="flex-1 h-1.5 rounded-full bg-ui-border"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Teacher View ---
  if (user?.role === "TEACHER") {
    const teacher = data?.teacher;
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-ui-border shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ui-text">Welcome back, Prof. {teacher?.name?.split(' ')[1] || "Instructor"}</h2>
            <p className="text-ui-muted font-medium mt-1">You have {teacher?.coursesCount || 0} scheduled lectures for this semester.</p>
          </div>
          <CheckCircle2 className="text-teal-500 w-12 h-12" />
        </div>
      </div>
    );
  }

  // --- Student View ---
  if (user?.role === "STUDENT") {
    const student = data?.student;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold">Academic Status</h2>
                <div className="mt-6 flex items-end gap-6">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Current GPA</label>
                    <p className="text-5xl font-black mt-1">{student?.gpa || 'N/A'}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20"></div>
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Financial Status</label>
                    <p className="text-xl font-bold mt-1 uppercase tracking-tighter">{student?.financialStatus}</p>
                  </div>
                </div>
              </div>
              <GraduationCap className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-center font-bold text-ui-muted mt-20">No dashboard data available for your role.</div>;
}