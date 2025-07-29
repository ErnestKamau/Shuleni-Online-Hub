
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsFirstLogin(searchParams.get('first_login') === 'true');
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.old_password) {
      newErrors.old_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'New password must be at least 6 characters';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (formData.old_password === formData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/change-password', {
        old_password: formData.old_password,
        new_password: formData.new_password
      });

      // Show success message
      alert('Password changed successfully!');
      
      // Clear form
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
      
      if (user?.role === 'owner') {
        navigate('/owner-dashboard');
      } else if (user?.role === 'educator') {
        navigate('/educator-dashboard');
      } else if (user?.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/user-profile');
      }
      
    } catch (err) {
      console.error('Password change error:', err);
      
      if (err.response?.data?.error) {
        if (err.response.data.error.includes('Invalid old password')) {
          setErrors({ old_password: 'Current password is incorrect' });
        } else {
          alert(`Error: ${err.response.data.error}`);
        }
      } else {
        alert('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isFirstLogin) {
      // For first login, user must change password - offer logout option
      if (confirm('You must change your password before accessing the system. Do you want to logout?')) {
        logout();
        navigate('/login');
      }
    } else {
      navigate('/user-profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          {isFirstLogin ? (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">First Login - Change Password</h2>
              <p className="text-gray-600 mt-2">
                For security reasons, you must change your temporary password before accessing the system.
              </p>
            </>
          ) : (
            <>
              <Lock className="mx-auto h-12 w-12 text-blue-500 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              <p className="text-gray-600">Update your account password</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isFirstLogin ? 'Temporary Password' : 'Current Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPasswords.old ? 'text' : 'password'}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.old_password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={isFirstLogin ? 'Enter your temporary password' : 'Enter current password'}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('old')}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.old_password && (
              <p className="text-red-500 text-xs mt-1">{errors.old_password}</p>
            )}
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.new_password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter new password (min. 6 characters)"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirm_password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
            )}
          </div>

                  <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600 font-medium mb-1">Password Requirements:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Different from your current password</li>
              <li>• Should be unique and secure</li>
            </ul>
          </div>

          \
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Change Password
                </span>
              )}
            </button>
            
            {!isFirstLogin && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {/* First login notice */}
          {isFirstLogin && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">Security Notice</p>
                  <p className="text-xs text-orange-700 mt-1">
                    You cannot access the system until you change your temporary password. 
                    If you need help, contact your school administrator.
                  </p>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs text-orange-600 underline hover:text-orange-800 mt-2"
                  >
                    Logout instead
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;