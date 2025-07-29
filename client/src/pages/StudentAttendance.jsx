import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaFileDownload } from 'react-icons/fa';
import StudentSidebar from '../components/common/StudentSidebar';
import api from '../api/axios';

const statusColors = {
  present: 'text-green-700',
  absent: 'text-red-700',
  late: 'text-yellow-700',
  excused: 'text-blue-700',
};

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(',')];
  for (const row of rows) {
    csv.push(headers.map(h => escape(row[h] ?? '')).join(','));
  }
  return csv.join('\n');
}

const StudentAttendance = () => {
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [classAttendance, setClassAttendance] = useState({});
  const [classes, setClasses] = useState([]);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setAttendanceSummary(res.data.attendance_summary || null);
        setClassAttendance(res.data.class_attendance || {});
        setClasses(res.data.classes || []);
        setSchool(res.data.school || null);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleDownloadCSV = () => {
    const headers = ['Class', 'Present', 'Absent', 'Late', 'Excused', 'Total'];
    const rows = classes.map(c => ({
      Class: c.name,
      Present: classAttendance[c.id]?.present || 0,
      Absent: classAttendance[c.id]?.absent || 0,
      Late: classAttendance[c.id]?.late || 0,
      Excused: classAttendance[c.id]?.excused || 0,
      Total: classAttendance[c.id]?.total || 0,
    }));
    const csv = toCSV(rows, headers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <StudentSidebar schoolName={school?.name} schoolLogo={"/logo.png"} />
      <main className="flex-1 p-8 z-10">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaCalendarCheck className="text-green-600" /> My Attendance
        </h1>
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
              <span className="text-gray-600">Loading attendance...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : !attendanceSummary ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaCalendarCheck className="text-5xl mb-2 text-gray-300" />
              <span>No attendance data found.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {['present', 'absent', 'late', 'excused'].map((status) => (
                <div key={status} className="flex-1 min-w-[120px] text-center">
                  <p className={`text-lg font-semibold capitalize ${statusColors[status]}`}>{status}</p>
                  <p className="text-2xl font-bold text-gray-800">{attendanceSummary[status]}</p>
                </div>
              ))}
              <div className="flex-1 min-w-[120px] text-center">
                <p className="text-lg font-semibold text-gray-700">Total</p>
                <p className="text-2xl font-bold text-gray-800">{attendanceSummary.total}</p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Class Attendance</h2>
            <button onClick={handleDownloadCSV} title="Download as CSV" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
              <FaFileDownload /> Download CSV
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
              <span className="text-gray-600">Loading class attendance...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaCalendarCheck className="text-5xl mb-2 text-gray-300" />
              <span>No classes enrolled.</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Excused</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-4 py-2 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-2">{classAttendance[c.id]?.present || 0}</td>
                    <td className="px-4 py-2">{classAttendance[c.id]?.absent || 0}</td>
                    <td className="px-4 py-2">{classAttendance[c.id]?.late || 0}</td>
                    <td className="px-4 py-2">{classAttendance[c.id]?.excused || 0}</td>
                    <td className="px-4 py-2">{classAttendance[c.id]?.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance; 