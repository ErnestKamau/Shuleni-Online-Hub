import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const parseQuestions = (questions) =>
  Array.isArray(questions) ? questions : [];

const getInitialAnswers = (questions) => {
  const ans = {};
  questions.forEach((q, idx) => {
    ans[idx] = q.type === "mcq" ? [] : "";
  });
  return ans;
};

const AttemptAssessmentPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/assessments/${assessmentId}`);
        setAssessment(res.data);
        const qs = parseQuestions(res.data.questions);
        setAnswers(getInitialAnswers(qs));
        setTimer(res.data.duration_minutes ? res.data.duration_minutes * 60 : 1800);
        setTimeLeft(res.data.duration_minutes ? res.data.duration_minutes * 60 : 1800);
        setStartedAt(Date.now());
      } catch (err) {
        alert("Failed to load assessment");
        navigate("/student/assessments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId, navigate]);

 
  useEffect(() => {
    if (!timer) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timer]);

  useEffect(() => {
    if (assessment) {
      localStorage.setItem(
        `assessment_${assessmentId}_answers`,
        JSON.stringify(answers)
      );
    }
  }, [answers, assessmentId, assessment]);

  
  useEffect(() => {
    const saved = localStorage.getItem(`assessment_${assessmentId}_answers`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [assessmentId]);

  const handleChange = (idx, value) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleMCQChange = (idx, option) => {
    setAnswers((prev) => {
      const arr = prev[idx] || [];
      if (arr.includes(option)) {
        return { ...prev, [idx]: arr.filter((o) => o !== option) };
      } else {
        return { ...prev, [idx]: [...arr, option] };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/assessments/${assessmentId}`, {
        answers,
        started_at: startedAt,
      });
      localStorage.removeItem(`assessment_${assessmentId}_answers`);
      alert("Assessment submitted!");
      navigate("/student/assessments");
    } catch (err) {
      alert("Failed to submit answers");
    }
  };

  if (loading || !assessment)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading assessment...</div>
      </div>
    );

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
        <p className="mb-4 text-gray-600">{assessment.description}</p>
        <div className="mb-6 text-lg font-semibold text-blue-600">
          Time Left: {mins}:{secs.toString().padStart(2, "0")}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ul>
            {parseQuestions(assessment.questions).map((q, idx) => (
              <li key={idx} className="mb-6">
                <div className="font-semibold mb-2">
                  Q{idx + 1}: {q.question}
                </div>
                {q.type === "mcq" ? (
                  <div>
                    {q.options.map((opt, i) => (
                      <label key={i} className="block mb-1">
                        <input
                          type="checkbox"
                          checked={answers[idx]?.includes(opt)}
                          onChange={() => handleMCQChange(idx, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : q.type === "code" ? (
                  <textarea
                    rows={6}
                    className="border border-gray-300 rounded px-3 py-2 w-full font-mono"
                    value={answers[idx] || ""}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    placeholder="Write your code here..."
                  />
                ) : (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    value={answers[idx] || ""}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    placeholder="Type your answer..."
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate("/student/assessments")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttemptAssessmentPage;