import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Shield, User } from 'lucide-react';
import useAuth  from '../hooks/useAuth';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('/login', formData);
      login(res.data, res.data.token);
      
      
      if (res.data.first_login === true) {
        navigate('/change-password?first_login=true');
        return;
      }
      
      const userRole = res.data.role;

      if (userRole === 'owner') {
        navigate('/owner-dashboard');
      } else if (userRole === 'educator') {
        navigate('/educator-dashboard');
      } else if (userRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      alert('Login failed: Invalid credentials');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <Shield className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Shuleni</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Email, admission number, or school email"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Students: Use admission number • Educators: Use school email • Owners: Use email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/school-owner-registration" className="text-green-600 hover:underline">
            Register for School Owners ONLY!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
