import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaClipboardCheck,
  FaChalkboard,
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
} from 'react-icons/fa';

const StudentSidebar = ({ schoolName = 'School', schoolLogo = '/logo.png' }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6 z-10 sticky top-0 h-screen hidden lg:block">
      <div className="flex items-center space-x-3 mb-10">
        <img src={schoolLogo} alt="School Logo" className="w-12 h-12" />
        <span className="text-xl font-bold text-gray-800">{schoolName}</span>
      </div>
      <nav className="space-y-2">
        <NavLink to="/student-dashboard" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} end>
          <FaChalkboard className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/student/classes" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}> 
          <FaBook className="mr-3" /> My Classes
        </NavLink>
        <NavLink to="/student/assessments" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-pink-100 text-pink-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}> 
          <FaClipboardCheck className="mr-3" /> Assessments
        </NavLink>
        <NavLink to="/student/attendance" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}> 
          <FaCheckCircle className="mr-3" /> Attendance
        </NavLink>
        <NavLink to="/student/grades" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-yellow-100 text-yellow-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}> 
          <FaChartBar className="mr-3" /> Grades
        </NavLink>
        <NavLink to="/user-profile" className={({isActive}) => `flex items-center w-full px-4 py-2 text-left rounded-lg transition ${isActive ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}> 
          <FaUser className="mr-3" /> Profile
        </NavLink>
        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-left rounded-lg transition text-gray-700 hover:bg-red-100 hover:text-red-700 mt-4">
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default StudentSidebar; 