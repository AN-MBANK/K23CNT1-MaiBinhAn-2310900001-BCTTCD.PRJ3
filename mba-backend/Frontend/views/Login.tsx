
import React, { useState } from 'react';
import { User } from '../types';
import { loginUser } from '../services/authService';
import { LogIn, User as UserIcon, Lock, Info } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = await loginUser({ username, password });
    
    if (user) {
      onLoginSuccess(user);
    } else {
      showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Đăng Nhập</h2>
          <p className="text-gray-500 mt-2">Chào mừng trở lại với MbaEvolutionAI</p>
        </div>

        {/* Developer Hint
        <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
          <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-bold mb-1">Tài khoản Test (Dev Mode):</p>
            <p>Admin: <span className="font-mono bg-blue-100 px-1 rounded">admin</span> / <span className="font-mono bg-blue-100 px-1 rounded">123</span></p>
            <p>User: <span className="font-mono bg-blue-100 px-1 rounded">user</span> / <span className="font-mono bg-blue-100 px-1 rounded">123</span> (Tự tạo)</p>
          </div>
        </div>
 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Chưa có tài khoản? </span>
          <button 
            onClick={() => onNavigate('register')}
            className="font-medium text-brand-600 hover:text-brand-500 hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
