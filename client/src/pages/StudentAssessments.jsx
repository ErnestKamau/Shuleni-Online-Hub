import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaFileDownload } from 'react-icons/fa';
import StudentSidebar from '../components/common/StudentSidebar';
import api from '../api/axios';

const typeColors = {
  assignment: 'bg-blue-100 text-blue-800',
  quiz: 'bg-green-100 text-green-800',
  exam: 'bg-red-100 text-red-800',
  cats: 'bg-yellow-100 text-yellow-800',
};

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(',')];
  for (const row of rows) {
    csv.push(headers.map(h => escape(row[h] ?? '')).join(','));
  }
  return csv.join('\n');
}

const StudentAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setAssessments(res.data.assessments || []);
        setSubmissions(res.data.submissions || []);
        setClasses(res.data.classes || []);
        setSchool(res.data.school || null);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load assessments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  // Helper: Map classId to class name
  const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
  // Helper: Map assessmentId to submission
  const submissionMap = Object.fromEntries(submissions.map(s => [s.assessment_id, s]));

  // Download CSV handler
  const handleDownloadCSV = () => {
    const headers = ['Title', 'Type', 'Class', 'Due Date', 'Status', 'Score', 'Feedback', 'Submission Date'];
    const rows = assessments.map(a => {
      const submission = submissionMap[a.id];
      const isSubmitted = !!submission;
      return {
        'Title': a.title,
        'Type': a.type,
        'Class': classMap[a.class_id] || '-',
        'Due Date': a.start_time ? new Date(a.start_time).toLocaleString() : '-',
        'Status': isSubmitted ? 'Submitted' : 'Pending',
        'Score': isSubmitted && submission.score !== undefined && submission.score !== null ? submission.score : '-',
        'Feedback': isSubmitted ? (submission.remarks || '-') : '-',
        'Submission Date': isSubmitted && submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '-',
      };
    });
    const csv = toCSV(rows, headers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <StudentSidebar schoolName={school?.name} schoolLogo={"/logo.png"} />
      <main className="flex-1 p-8 z-10">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaClipboardList className="text-pink-600" /> My Assessments & Assignments
        </h1>
        <div className="bg-white rounded shadow p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Assessments</h2>
            <button onClick={handleDownloadCSV} title="Download as CSV" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
              <FaFileDownload /> Download CSV
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mb-4"></div>
              <span className="text-gray-600">Loading assessments...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : assessments.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaClipboardList className="text-5xl mb-2 text-gray-300" />
              <span>No assessments or assignments found.</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {assessments.map(a => {
                  const submission = submissionMap[a.id];
                  const isSubmitted = !!submission;
                  return (
                    <tr key={a.id} className="border-b">
                      <td className="px-4 py-2 font-medium text-gray-800">{a.title}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${typeColors[a.type] || 'bg-gray-100 text-gray-800'}`}>{a.type}</span>
                      </td>
                      <td className="px-4 py-2">{classMap[a.class_id] || '-'}</td>
                      <td className="px-4 py-2">{a.start_time ? new Date(a.start_time).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2">
                        {isSubmitted ? (
                          <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Submitted</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{isSubmitted ? (submission.score !== undefined && submission.score !== null ? submission.score : '-') : '-'}</td>
                      <td className="px-4 py-2">{isSubmitted ? (submission.remarks || '-') : '-'}</td>
                      <td className="px-4 py-2">
                        {isSubmitted ? (
                          <span className="text-xs text-gray-500">{submission.submitted_at ? `on ${new Date(submission.submitted_at).toLocaleString()}` : ''}</span>
                        ) : (
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600" disabled>Submit</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAssessments; 