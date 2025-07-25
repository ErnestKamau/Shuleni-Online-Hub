import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setClasses(res.data.classes || []);
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>
      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <div className="text-gray-600">Loading classes...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : classes.length === 0 ? (
          <div className="text-gray-500">You are not enrolled in any classes yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {classes.map((c) => (
              <li key={c.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-lg text-gray-800">{c.name}</span>
                  {/* TODO: Add class details, teachers, classmates, and link to class page/resources */}
                </div>
                {/* Placeholder for future details */}
                <div className="mt-2 md:mt-0 text-sm text-gray-500">
                  Teachers: <span className="italic">Coming soon</span> | Classmates: <span className="italic">Coming soon</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentClasses; 