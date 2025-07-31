import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationCircle,
} from 'react-icons/fa';

const statusOptions = ['present', 'absent', 'late', 'excused'];


export default function EducatorAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendances');
        setStudents(res.data.data || []);
      } catch (err) {
        setError('Failed to load attendance.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Handle status cycle
  const handleStatusChange = async (studentId, newStatus) => {
  try {
    const response = await api.patch(`/attendances/${studentId}`, {
      status: newStatus,
    });

    if (response.status === 200) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );
    } else {
      alert("Failed to update attendance");
    }
  } catch (err) {
    console.error("PATCH failed:", err.response?.data || err.message);
    alert(
      err?.response?.data?.error ||
      err?.response?.data?.detail ||
      err?.response?.data?.msg ||
      err?.message || "Update failed"
    );
  }
};


  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Educator Attendance</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-xl shadow text-center">
          <p className="text-gray-700">Present</p>
          <h2 className="text-2xl font-semibold text-green-800">{presentCount}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow text-center">
          <p className="text-gray-700">Absent</p>
          <h2 className="text-2xl font-semibold text-red-800">{absentCount}</h2>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
          <p className="text-gray-700">Total</p>
          <h2 className="text-2xl font-semibold text-blue-800">{students.length}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Students</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {students.map(student => (
              <li key={student.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    {student.student_name || 'Unnamed Student'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.class_name} – {student.date}
                  </p>
                </div>
                <button
                  onClick={() => handleStatusChange(student.id, student.status)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition
                    ${
                      student.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : student.status === 'Absent'
                        ? 'bg-red-100 text-red-700'
                        : student.status === 'Late'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  {student.status === 'Present' && <FaCheckCircle />}
                  {student.status === 'Absent' && <FaTimesCircle />}
                  {student.status === 'Late' && <FaClock />}
                  {student.status === 'Excused' && <FaExclamationCircle />}
                  {student.status}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
