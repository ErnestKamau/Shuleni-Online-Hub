import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleRedirect() {
    navigate('/create-student-registration');
  }

  function CreateEducatorRedirect() {
    navigate('/create-educator-registration');
  }

  function CreateSchoolRedirect() {
    navigate('/create-school');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function handleDashboard() {
    navigate('/owner-dashboard');
  }

  const schoolLogo = "/logo.png";

  const isActive = (path) => location.pathname === path;
  const isActivePattern = (pattern) => location.pathname.includes(pattern);

  return (
    <aside className="w-64 bg-white shadow-md p-4 z-10">
      <div className="flex items-center space-x-2 mb-8">
        <img src={schoolLogo} alt="School Logo" className="w-12 h-12" />
        <span className="text-lg font-semibold">Shuleni</span>
      </div>
      <nav className="space-y-4">
        <button 
          onClick={handleDashboard}
          className={`block w-full text-left px-3 py-2 rounded font-medium ${
            isActive('/owner-dashboard') 
              ? 'text-blue-700 bg-blue-100' 
              : 'hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={handleRedirect} 
          className={`block w-full text-left px-3 py-2 rounded ${
            isActive('/create-student-registration') 
              ? 'text-blue-700 bg-blue-100 font-medium' 
              : 'hover:bg-gray-100'
          }`}
        >
          Manage students
        </button>
        <button 
          onClick={CreateEducatorRedirect} 
          className={`block w-full text-left px-3 py-2 rounded ${
            isActive('/create-educator-registration') 
              ? 'text-blue-700 bg-blue-100 font-medium' 
              : 'hover:bg-gray-100'
          }`}
        >
          Manage teachers
        </button>
        <button 
          onClick={CreateSchoolRedirect} 
          className={`block w-full text-left px-3 py-2 rounded ${
            isActive('/create-school') || isActivePattern('/school') 
              ? 'text-blue-700 bg-blue-100 font-medium' 
              : 'hover:bg-gray-100'
          }`}
        >
         Manage schools
        </button>
        <button className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100">
          Reports
        </button>
        <button className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100">
          Profile
        </button>
        <button 
          onClick={handleLogout} 
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Log out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
