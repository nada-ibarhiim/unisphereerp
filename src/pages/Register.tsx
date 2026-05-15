import { useState } from 'react';
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface RegisterProps {
  onLogin: (data: { token: string; user: any }) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', { email, password });
      onLogin(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ui-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-xl shadow-brand-blue/5 overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-ui-border"
      >
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-brand-pink p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 shadow-xl shadow-brand-blue/30">
              U
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">Join the Academic Revolution.</h1>
            <p className="text-white/70 text-base font-medium leading-relaxed">Create your account and explore a world of limitless learning and management possibilities.</p>
          </div>
          
          <div className="relative z-10 pt-10">
            <p className="text-[11px] text-white/50 font-bold tracking-widest uppercase mb-4">Start your journey today</p>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Mail size={12} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Lock size={12} />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ui-text mb-1">Create Account</h2>
            <p className="text-ui-muted text-sm font-medium">Join UniSphere Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ui-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ui-muted group-focus-within:text-brand-pink transition-colors" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-ui-bg border border-transparent border-b-ui-border rounded-xl focus:ring-2 focus:ring-brand-pink/5 focus:bg-white outline-none transition-all font-semibold text-ui-text"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ui-muted uppercase tracking-wider ml-1">Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-ui-bg border border-transparent border-b-ui-border rounded-xl focus:ring-2 focus:ring-brand-pink/5 focus:bg-white outline-none transition-all font-semibold text-ui-text"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ui-muted uppercase tracking-wider ml-1">Confirm</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-ui-bg border border-transparent border-b-ui-border rounded-xl focus:ring-2 focus:ring-brand-pink/5 focus:bg-white outline-none transition-all font-semibold text-ui-text"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{error}</div>}

            <div className="flex items-center gap-2 px-1 mb-2">
               <input 
                type="checkbox" 
                id="show-pass"
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 accent-brand-pink"
               />
               <label htmlFor="show-pass" className="text-xs font-bold text-ui-muted cursor-pointer">Show Passwords</label>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-brand-pink text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-brand-pink/10 hover:bg-brand-pink/90 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="mt-8 text-center text-ui-muted text-sm font-medium">
            Already have an account? <Link to="/login" className="text-brand-blue font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
