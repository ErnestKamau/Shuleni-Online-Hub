import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { FaUserGraduate, FaChalkboardTeacher, FaPlusCircle, FaTrash, FaUsers, FaCheck, FaTimes, FaFileUpload, FaClipboardList, FaDownload } from "react-icons/fa";
import EducatorSidebar from "../common/EducatorSidebar";



const EducatorClassManagement = () => {
  
  const [schoolId , setSchoolId]= useState(null)
  const navigate = useNavigate();
  const [classId , setClassId]= useState([])

  const [classData, setClassData] = useState(null);
  const [schoolData, setSchoolData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceFile, setResourceFile] = useState(null);
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assessmentType, setAssessmentType] = useState('assignment');
  const [assessmentQuestions, setAssessmentQuestions] = useState('');
  const [resources, setResources] = useState([]);
  const [assessments, setAssessments] = useState([]);



  useEffect(() => {
  console.log("Fetching educator dashboard...");
  api.get("/educator/dashboard")
    .then((res) => {
      console.log("Fetched educator dashboard:", res.data);
      setSchoolId(res.data.schoolId);
      setClassId(res?.data?.classIds)
      setError(null);
    })
    .catch((err) => {
      console.error("Dashboard fetch error:", err);
      setError(err);
      if (err.response?.status === 401 || err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        handleLogout();
      }
    });
}, []);

useEffect(() => {
  console.log("schoob:", schoolId)
  if (schoolId) {
    fetchClassData();
  }
}, [schoolId, classId]);




  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  };


  const fetchClassData = async () => {
    setLoading(true);
    try {
      const schoolRes = await api.get(`/schools/${schoolId}/details`);
      setSchoolData(schoolRes.data);

      
      const currentClass = schoolRes.data.classes.find(c => c.id === parseInt(classId));
      setClassData(currentClass);

      
      const resRes = await api.get(`/classes/${classId}/resources`);
      setResources(resRes.data.resources || []);

      
      const assRes = await api.get(`/classes/${classId}/assessments`);
      setAssessments(assRes.data.assessments || []);

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  
  const handleAssignUsers = async (userIds, role) => {
    if (!classData || userIds.length === 0) return;
    try {
      await api.post(`/schools/${schoolId}/classes/${classId}/assignments`, {
        user_ids: Array.from(userIds),
        role
      });
      setSuccessMessage(`Assigned ${userIds.size} ${role}s`);
      setSelectedStudents(new Set());
      await fetchClassData();
    } catch (err) {
      setError(err.message || 'Failed to assign users');
    }
  };

  
  const handleRemoveUser = async (userId) => {
    try {
      await api.delete(`/schools/${schoolId}/classes/${classId}/assignments`, {
        data: { user_ids: [userId] }
      });
      setSuccessMessage('User removed from class');
      await fetchClassData();
    } catch (err) {
      setError(err.message || 'Failed to remove user');
    }
  };

  
  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!resourceTitle || !resourceFile) {
      setError('Resource title and file required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', resourceTitle);
      formData.append('file', resourceFile);
      formData.append('class_id', classId);
      await api.post(`/classes/${classId}/resources`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMessage('Resource uploaded');
      setResourceTitle('');
      setResourceFile(null);
      await fetchClassData();
    } catch (err) {
      setError(err.message || 'Failed to upload resource');
    }
  };

  
  const handleAddAssessment = async (e) => {
    e.preventDefault();
    if (!assessmentTitle || !assessmentQuestions) {
      setError('Assessment title and questions required');
      return;
    }
    try {
      await api.post(`/classes/${classId}/assessments`, {
        title: assessmentTitle,
        type: assessmentType,
        questions: assessmentQuestions,
        class_id: classId
      });
      setSuccessMessage('Assessment created');
      setAssessmentTitle('');
      setAssessmentQuestions('');
      await fetchClassData();
    } catch (err) {
      setError(err.message || 'Failed to create assessment');
    }
  };

  
  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    newSelected.has(studentId) ? newSelected.delete(studentId) : newSelected.add(studentId);
    setSelectedStudents(newSelected);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading class management...</span>
      </div>
    );
  }

  const backgroundImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1950&q=80";

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
      <EducatorSidebar/>

      

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Manage {classData?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Students: {classData?.total_students} | Teachers: {classData?.total_teachers}
              </p>
            </div>
            <button 
              onClick={() => navigate(`/school/${schoolId}/details`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Class
            </button>
            <button 
              onClick={() => navigate(`/educator/class/${classId}/chat`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors ml-4"
            >
              Open Class Chat
            </button>

          </header>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
              <button 
                onClick={() => setSuccessMessage('')}
                className="float-right text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={() => setError('')}
                className="float-right text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Class Members */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Students */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUserGraduate className="text-blue-500 mr-2" />
                Students in {classData?.name} ({classData?.students?.length || 0})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {classData?.students?.map(student => (
                  <div key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{student.full_name}</p>
                      <p className="text-sm text-gray-500">{student.admission_number}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(student.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Assignment Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Unassigned Students */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaUserGraduate className="text-blue-500 mr-2" />
                  Unassigned Students ({schoolData.unassigned_students.length})
                </h3>
                {selectedStudents.size > 0 && (
                  <button
                    onClick={() => handleAssignUsers(selectedStudents, 'student')}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Assign Selected ({selectedStudents.size})
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {schoolData.unassigned_students.map(student => (
                  <div key={student.id} className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{student.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {student.admission_number} • Grade: {student.grade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Resources Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileUpload className="text-purple-500 mr-2" />
              Class Resources
            </h3>
            <form onSubmit={handleAddResource} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Resource Title"
                value={resourceTitle}
                onChange={e => setResourceTitle(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <input
                type="file"
                onChange={e => setResourceFile(e.target.files[0])}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Upload
              </button>
            </form>
            <ul>
              {resources.map(r => (
                <li key={r.id} className="flex justify-between items-center py-2 border-b">
                  <span>{r.title}</span>
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    <FaDownload className="inline mr-1" /> Download
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Assessments Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="text-pink-500 mr-2" />
              Class Assessments
            </h3>
            <form onSubmit={handleAddAssessment} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Assessment Title"
                value={assessmentTitle}
                onChange={e => setAssessmentTitle(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <select
                value={assessmentType}
                onChange={e => setAssessmentType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="cats">CATS</option>
              </select>
              <input
                type="text"
                placeholder="Questions (JSON or text)"
                value={assessmentQuestions}
                onChange={e => setAssessmentQuestions(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
                Add
              </button>
            </form>
            <ul>
              {assessments.map(a => (
                <li key={a.id} className="flex justify-between items-center py-2 border-b">
                  <span>{a.title} ({a.type})</span>
                  <span className="text-xs text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</span>
                  <a href={`/classes/${classId}/assessments/${a.id}/submissions`} className="text-blue-600 hover:underline">
                    <FaUsers className="inline mr-1" /> View Submissions
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Export Class Roster */}
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="text-green-500 mr-2" />
              Export Class Roster
            </h3>
            <button
              onClick={() => {
                
                const headers = ['Full Name', 'Admission/TSC', 'Role'];
                const rows = [
                  ...(classData?.students || []).map(s => [s.full_name, s.admission_number, 'Student']),
                  ...(classData?.teachers || []).map(t => [t.full_name, t.tsc_number, 'Educator'])
                ];
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${classData?.name || 'class'}_roster.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FaDownload className="inline mr-1" /> Download CSV
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EducatorClassManagement;
