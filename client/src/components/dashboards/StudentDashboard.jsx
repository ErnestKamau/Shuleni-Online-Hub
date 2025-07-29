import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  FaBook,
  FaClipboardCheck,
  FaChalkboard,
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setDashboard(res.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const backgroundImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1950&q=80";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }
  if (!dashboard) return null;

  const { student, school, classes, assessments, submissions, attendance_summary, class_attendance } = dashboard;

  
  const submittedIds = new Set(submissions.map(s => s.assessment_id));
  const pendingAssessments = assessments.filter(a => !submittedIds.has(a.id));


  const upcoming = pendingAssessments
    .filter(a => a.start_time)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 z-10 sticky top-0 h-screen hidden lg:block">
        <div className="flex items-center space-x-3 mb-10">
          <img src={"/logo.png"} alt="School Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-gray-800">{school?.name || 'School'}</span>
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

      {/* Main Content */}
      <main className="flex-1 p-8 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome, <span className="font-medium">{student.full_name}</span></p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaBook className="text-purple-600 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Classes Enrolled</p>
              <h3 className="text-2xl font-bold text-gray-800">{classes.length}</h3>
            </div>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaClipboardCheck className="text-pink-500 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Pending Assignments</p>
              <h3 className="text-2xl font-bold text-gray-800">{pendingAssessments.length}</h3>
            </div>
          </div>
        </div>

        {/* Upcoming Activities */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Activities</h2>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {upcoming.length === 0 ? (
              <p className="text-gray-500">No upcoming activities.</p>
            ) : (
              upcoming.map((a) => (
                <div
                  key={a.id}
                  className={`border-l-4 border-blue-500 pl-4`}
                >
                  <p className="font-medium text-gray-800">{a.title} <span className="text-xs text-gray-500 ml-2">[{a.type}]</span></p>
                  <p className="text-sm text-gray-500">
                    {a.start_time ? `Due: ${new Date(a.start_time).toLocaleString()}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Attendance Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Summary</h2>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-wrap gap-6">
            {['present', 'absent', 'late', 'excused'].map((status) => (
              <div key={status} className="flex-1 min-w-[120px] text-center">
                <p className="text-lg font-semibold capitalize text-gray-700">{status}</p>
                <p className="text-2xl font-bold text-gray-800">{attendance_summary[status]}</p>
              </div>
            ))}
            <div className="flex-1 min-w-[120px] text-center">
              <p className="text-lg font-semibold text-gray-700">Total</p>
              <p className="text-2xl font-bold text-gray-800">{attendance_summary.total}</p>
            </div>
          </div>
        </section>

        {/* Class-level Attendance */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Class Attendance</h2>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            {classes.length === 0 ? (
              <p className="text-gray-500">No classes enrolled.</p>
            ) : (
              classes.map((c) => (
                <div key={c.id} className="mb-2">
                  <p className="font-medium text-gray-800">{c.name}</p>
                  <div className="flex gap-4 mt-1 text-sm">
                    {['present', 'absent', 'late', 'excused'].map((status) => (
                      <span key={status} className="capitalize">
                        {status}: {class_attendance[c.id]?.[status] || 0}
                      </span>
                    ))}
                    <span>Total: {class_attendance[c.id]?.total || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
