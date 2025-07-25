import React, { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import StudentSidebar from '../components/common/StudentSidebar';
import api from '../api/axios';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setClasses(res.data.classes || []);
        setSchool(res.data.school || null);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <StudentSidebar schoolName={school?.name} schoolLogo={"/logo.png"} />
      <main className="flex-1 p-8 z-10">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HiOutlineAcademicCap className="text-blue-600" /> My Classes
        </h1>
        <div className="bg-white rounded shadow p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-gray-600">Loading classes...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaChalkboardTeacher className="text-5xl mb-2 text-gray-300" />
              <span>You are not enrolled in any classes yet.</span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {classes.map((c) => (
                <li key={c.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mr-2">{c.name}</span>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><FaChalkboardTeacher className="text-gray-400" /> Teachers: <span className="italic">Coming soon</span></span>
                    <span className="flex items-center gap-1"><FaUsers className="text-gray-400" /> Classmates: <span className="italic">Coming soon</span></span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentClasses; 