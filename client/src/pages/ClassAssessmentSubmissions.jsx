import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { FaCheckCircle } from "react-icons/fa";
import EducatorSidebar from "../components/common/EducatorSidebar";
import { useNavigate } from "react-router-dom";

const ClassAssessmentSubmissions = () => {
  const { classId, assessmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/classes/${classId}/assessments/${assessmentId}/submissions`);
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error("Error grading submission:", err);
        setError("Failed to grade submission");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [classId, assessmentId]);

  const handleGradeChange = (id, field, value) => {
    setGrading((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleGradeSubmit = async (id) => {
    try {
      await api.patch(`/submissions/${id}`, {
        score: grading[id]?.score,
        remarks: grading[id]?.remarks
      });
      setSuccess("Submission graded!");
      setTimeout(() => setSuccess(""), 2000);
      setGrading((prev) => ({ ...prev, [id]: {} }));

      const res = await api.get(`/classes/${classId}/assessments/${assessmentId}/submissions`);
      setSubmissions(res.data.submissions || []);
      navigate('/educator-dashboard/class')
    } catch {
      setError("Failed to grade submission");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-blue-100 to-green-100 p-6">
        
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6"> Assessment Submissions</h1>

        {success && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
            <FaCheckCircle className="inline mr-2" />
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center text-indigo-600 text-lg">Loading submissions...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : submissions.length === 0 ? (
          <div className="text-gray-500 text-center">No submissions yet.</div>
        ) : (
          <div className="space-y-6">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-semibold text-lg text-green-700">{s.student?.full_name || s.student_id}</h2>
                    <p className="text-sm text-gray-500">{new Date(s.submitted_at).toLocaleString()}</p>
                  </div>
                  <div className="text-sm text-gray-400">#{s.id}</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-semibold mb-1 text-gray-600">Questions:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {s.assessment.questions.map((q, idx) => (
                        <li key={idx}><strong>Q{idx + 1}:</strong> {q.question}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold mb-1 text-gray-600">Answers:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {Array.isArray(s.answers)
                        ? s.answers.map((ans, idx) => (
                            <li key={idx}><strong>Q{idx + 1}:</strong> {typeof ans === "string" ? ans : JSON.stringify(ans)}</li>
                          ))
                        : Object.entries(s.answers || {}).map(([q, ans]) => (
                            <li key={q}><strong>{q}:</strong> {typeof ans === "string" ? ans : JSON.stringify(ans)}</li>
                          ))}
                    </ul>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div>
                      <label className="block font-semibold text-gray-600">Score</label>
                      {s.score !== null ? (
                        <span className="text-green-600 font-bold">{s.score}</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grading[s.id]?.score || ""}
                          onChange={(e) => handleGradeChange(s.id, "score", e.target.value)}
                          className="mt-1 w-full px-3 py-1 border rounded focus:ring-2 focus:ring-purple-400"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-600">Remarks</label>
                      {s.remarks ? (
                        <span>{s.remarks}</span>
                      ) : (
                        <input
                          type="text"
                          value={grading[s.id]?.remarks || ""}
                          onChange={(e) => handleGradeChange(s.id, "remarks", e.target.value)}
                          className="mt-1 w-full px-3 py-1 border rounded focus:ring-2 focus:ring-purple-400"
                        />
                      )}
                    </div>

                    {s.score === null && (
                      <button
                        onClick={() => handleGradeSubmit(s.id)}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
                      >
                        Submit Grade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassAssessmentSubmissions;
