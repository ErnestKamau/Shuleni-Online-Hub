import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaPlusCircle, FaChartBar, FaCalendarAlt, FaBuilding, FaEdit, FaTrash } from "react-icons/fa";
import api from '../../api/axios';
import Sidebar from '../common/Sidebar';


const OwnerDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    owner: { full_name: '', email: '' },
    schools: [],
    stats: {
      total_schools: 0,
      total_students: 0,
      total_teachers: 0,
      recent_students: 0,
      recent_teachers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/owner/dashboard');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        // If token is invalid, redirect to login
        if (err.message.includes('token') || err.message.includes('Unauthorized')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  function handleRedirect(){
    navigate('/create-student-registration')
  }

  function CreateEducatorRedirect(){
    navigate('/create-educator-registration')
  }

  function CreateSchoolRedirect(){
    navigate('/create-school')
  }

  const backgroundImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1950&q=80";

  const handleEditSchool = (schoolId, schoolName) => {
    console.log(`Edit school with ID: ${schoolId}, Name: ${schoolName}`);
    alert(`(Future Functionality) Navigating to edit page for ${schoolName}`);
  };

  const handleDeleteSchool = (schoolId, schoolName) => {
    if (window.confirm(`Are you sure you want to delete ${schoolName}? This action cannot be undone.`)) {
      console.log(`Delete school with ID: ${schoolId}, Name: ${schoolName}`);
      alert(`(Future Functionality) Deleting ${schoolName}...`);
    }
  };

  const handleViewSchool = (schoolId) => {
    navigate(`/school/${schoolId}/details`);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <Sidebar />

      <main className="flex-1 p-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
        <>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-3">
              <p className="text-gray-600 hidden sm:block">Welcome, {dashboardData.owner.full_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
              <FaBuilding className="text-purple-500 text-3xl" />
              <div>
                <p className="text-gray-500">Total Schools</p>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.stats.total_schools}</h3>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
              <FaUserGraduate className="text-blue-500 text-3xl" />
              <div>
                <p className="text-gray-500">Total Students</p>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.stats.total_students}</h3>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
              <FaChalkboardTeacher className="text-green-500 text-3xl" />
              <div>
                <p className="text-gray-500">Total Teachers</p>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.stats.total_teachers}</h3>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
              <FaChartBar className="text-yellow-500 text-3xl" />
              <div>
                <p className="text-gray-500">Recent Activity</p>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.stats.recent_students + dashboardData.stats.recent_teachers}</h3>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button onClick={handleRedirect} className="bg-blue-700 text-white p-4 rounded-lg shadow-md hover:bg-blue-800 flex items-center justify-center space-x-2">
                    <FaPlusCircle className="text-2xl" />
                    <span>Add New Student</span>
                </button>
                <button onClick={CreateEducatorRedirect} className="bg-green-700 text-white p-4 rounded-lg shadow-md hover:bg-green-800 flex items-center justify-center space-x-2">
                    <FaChalkboardTeacher className="text-2xl" />
                    <span>Add New Teacher</span>
                </button>
                <button className="bg-indigo-700 text-white p-4 rounded-lg shadow-md hover:bg-indigo-800 flex items-center justify-center space-x-2">
                    <FaClipboardList className="text-2xl" />
                    <span>Generate Report</span>
                </button>
                 <button className="bg-amber-700 text-white p-4 rounded-lg shadow-md hover:bg-amber-800 flex items-center justify-center space-x-2">
                    <FaCalendarAlt className="text-2xl" />
                    <span>View Calendar</span>
                </button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaBuilding className="text-purple-500" />
                <span>My Schools ({dashboardData.schools.length})</span>
            </h2>
            <div className="bg-white shadow rounded-lg p-6">
              {dashboardData.schools.length === 0 ? (
                <div className="text-center py-8">
                  <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No schools found. Click 'Add New School' to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.schools.map(school => (
                    <div key={school.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group">
                      <div onClick={() => handleViewSchool(school.id)} className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{school.name}</h3>
                        {school.description && (
                          <p className="text-gray-600 text-sm mb-2">{school.description}</p>
                        )}
                        <p className="text-gray-600 text-sm">Location: {school.location || 'Not specified'}</p>
                        <p className="text-gray-600 text-sm mb-3">Est.: {school.established}</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-3">
                          <span>Students: {school.student_count}</span>
                          <span>Teachers: {school.teacher_count}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSchool(school.id);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center space-x-1 flex-1"
                        >
                          <FaBuilding className="text-xs" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSchool(school.id, school.name);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
                        >
                          <FaEdit className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSchool(school.id, school.name);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <FaTrash className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
               <div className="mt-6 text-center">
                    <button 
                      onClick={CreateSchoolRedirect}
                      className="bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 flex items-center justify-center space-x-2 mx-auto transition-colors"
                    >
                        <FaPlusCircle className="text-xl" />
                        <span>Add New School</span>
                    </button>
                </div>
            </div>
          </section>
        </>
        )}

      

      </main>
    </div>
  );
};

export default OwnerDashboard;