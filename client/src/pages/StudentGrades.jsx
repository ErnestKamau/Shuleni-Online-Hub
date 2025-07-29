import React, { useEffect, useState } from 'react';
import { FaChartBar, FaFileDownload } from 'react-icons/fa';
import StudentSidebar from '../components/common/StudentSidebar';
import api from '../api/axios';

const typeLabels = {
  assignment: 'Assignment',
  quiz: 'Quiz',
  exam: 'Exam',
  cats: 'CATS',
};

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(',')];
  for (const row of rows) {
    csv.push(headers.map(h => escape(row[h] ?? '')).join(','));
  }
  return csv.join('\n');
}

const StudentGrades = () => {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/dashboard');
        setAssessments(res.data.assessments || []);
        setSubmissions(res.data.submissions || []);
        setClasses(res.data.classes || []);
        setSchool(res.data.school || null);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
  const submissionMap = Object.fromEntries(submissions.map(s => [s.assessment_id, s]));

  const typeScores = {};
  assessments.forEach(a => {
    const submission = submissionMap[a.id];
    if (submission && submission.score !== undefined && submission.score !== null) {
      if (!typeScores[a.type]) typeScores[a.type] = [];
      typeScores[a.type].push(submission.score);
    }
  });
  const typeAverages = Object.fromEntries(
    Object.entries(typeScores).map(([type, scores]) => [type, (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)])
  );

  // Download CSV handler
  const handleDownloadCSV = () => {
    const headers = ['Title', 'Type', 'Class', 'Score', 'Feedback'];
    const rows = assessments.map(a => {
      const submission = submissionMap[a.id];
      if (!submission || submission.score === undefined || submission.score === null) return null;
      return {
        Title: a.title,
        Type: typeLabels[a.type] || a.type,
        Class: classMap[a.class_id] || '-',
        Score: submission.score,
        Feedback: submission.remarks || '-',
      };
    }).filter(Boolean);
    const csv = toCSV(rows, headers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <StudentSidebar schoolName={school?.name} schoolLogo={"/logo.png"} />
      <main className="flex-1 p-8 z-10">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaChartBar className="text-yellow-600" /> My Grades
        </h1>
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Average Score by Assessment Type</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600 mb-4"></div>
              <span className="text-gray-600">Loading grades...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : Object.keys(typeAverages).length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaChartBar className="text-5xl mb-2 text-gray-300" />
              <span>No grades available yet.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {Object.entries(typeAverages).map(([type, avg]) => (
                <div key={type} className="flex-1 min-w-[120px] text-center">
                  <p className="text-lg font-semibold capitalize text-gray-700">{typeLabels[type] || type}</p>
                  <p className="text-2xl font-bold text-gray-800">{avg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded shadow p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Graded Assessments</h2>
            <button onClick={handleDownloadCSV} title="Download as CSV" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
              <FaFileDownload /> Download CSV
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600 mb-4"></div>
              <span className="text-gray-600">Loading grades...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : assessments.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <FaChartBar className="text-5xl mb-2 text-gray-300" />
              <span>No assessments found.</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map(a => {
                  const submission = submissionMap[a.id];
                  if (!submission || submission.score === undefined || submission.score === null) return null;
                  return (
                    <tr key={a.id} className="border-b">
                      <td className="px-4 py-2 font-medium text-gray-800">{a.title}</td>
                      <td className="px-4 py-2">{typeLabels[a.type] || a.type}</td>
                      <td className="px-4 py-2">{classMap[a.class_id] || '-'}</td>
                      <td className="px-4 py-2">{submission.score}</td>
                      <td className="px-4 py-2">{submission.remarks || '-'}</td>
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

export default StudentGrades; 