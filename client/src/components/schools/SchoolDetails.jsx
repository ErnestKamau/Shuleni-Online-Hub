import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { FaUserGraduate, FaChalkboardTeacher, FaPlusCircle, FaBuilding, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from '../common/Sidebar';
import ClassSection from "../../pages/ClassSection";


const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const [schoolData, setSchoolData] = useState({
    school: {},
    classes: [],
    unassigned_students: [],
    unassigned_teachers: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignmentType, setAssignmentType] = useState('student'); // 'student' or 'teacher'
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/schools/${schoolId}/details`);
      setSchoolData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching school details:', err);
      setError(err.message || 'Failed to load school details');
      // Handling unauthorized access
      if (err.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, [schoolId, navigate]);

  const handleClassAssignment = (classId) => {
    navigate(`/school/${schoolId}/class/${classId}/assign`);
  };

  const openAssignModal = (classItem, type) => {
    setSelectedClass(classItem);
    setAssignmentType(type);
    setSelectedUsers(new Set());
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedClass(null);
    setSelectedUsers(new Set());
    setSuccessMessage('');
    setError('');
  };

  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAssignUsers = async () => {
    if (!selectedClass || selectedUsers.size === 0) {
      setError('Please select users to assign');
      return;
    }

    try {
      const role = assignmentType === 'student' ? 'student' : 'educator';
      const response = await api.post(`/schools/${schoolId}/classes/${selectedClass.id}/assignments`, {
        user_ids: Array.from(selectedUsers),
        role: role
      });

      setSuccessMessage(`Successfully assigned ${selectedUsers.size} ${assignmentType}s to ${selectedClass.name}`);
      await fetchSchoolData(); // Refresh data
      
      // Close modal after success
      setTimeout(() => {
        closeAssignModal();
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to assign users');
    }
  };

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

      <Sidebar />

      <main className="flex-1 p-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading school details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
        <>
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">{schoolData.school.name} - Details</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/create-student-registration?schoolId=${schoolId}`)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FaUserGraduate className="text-sm" />
                <span>Add Student</span>
              </button>
              <button 
                onClick={() => navigate(`/create-educator-registration?schoolId=${schoolId}`)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FaChalkboardTeacher className="text-sm" />
                <span>Add Educator</span>
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </header>

          {/* School Info Section */}
          <section className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{schoolData.stats.total_classes}</h3>
                <p className="text-gray-600">Classes</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{schoolData.stats.total_students}</h3>
                <p className="text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{schoolData.stats.total_teachers}</h3>
                <p className="text-gray-600">Teachers</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-600">
                  {schoolData.stats.unassigned_students + schoolData.stats.unassigned_teachers}
                </h3>
                <p className="text-gray-600">Unassigned</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Classes ({schoolData.classes.length})</h2>
              <button 
                onClick={() => navigate(`/owner/schools/${schoolData.school.id}/classes`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaPlusCircle />
                <span>Add a Class to {schoolData.school.name}</span>
              </button>
            </div>
           
            {schoolData.classes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Classes Yet</h3>
                <p className="text-gray-600 mb-4">Create your first class to start organizing students and teachers.</p>
                <button 
                  onClick={() => navigate(`/owner/schools/${schoolData.school.id}/classes`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <FaPlusCircle />
                  <span>Add your first Class to {schoolData.school.name}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schoolData.classes.map(classItem => (
                  <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{classItem.name}</h3>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Students: {classItem.total_students}</span>
                        <span>Teachers: {classItem.total_teachers}</span>
                      </div>
                      
                      {/* Assignment Buttons */}
                      <div className="space-y-2 mb-3">
                        {schoolData.unassigned_students.length > 0 && (
                          <button 
                            onClick={() => openAssignModal(classItem, 'student')}
                            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <FaUserGraduate className="text-xs" />
                            <span>Assign Students</span>
                          </button>
                        )}
                        
                        {schoolData.unassigned_teachers.length > 0 && (
                          <button 
                            onClick={() => openAssignModal(classItem, 'teacher')}
                            className="w-full bg-purple-500 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <FaChalkboardTeacher className="text-xs" />
                            <span>Assign Teachers</span>
                          </button>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/school/${schoolId}/class/${classItem.id}/manage`)}
                        className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <FaEdit className="text-xs" />
                        <span>Manage Class</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unassigned Students ({schoolData.unassigned_students.length})</h2>
            <ul>
              {schoolData.unassigned_students.map(student => (
                <li key={student.id} className="flex justify-between bg-white p-4 mb-2 shadow rounded-lg">
                  <div>
                    <p>{student.full_name} ({student.admission_number})</p>
                    <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                  </div>
                  <button 
                    onClick={() => handleClassAssignment(student.id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <FaPlusCircle className="text-xs" />
                    <span>Assign</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unassigned Teachers ({schoolData.unassigned_teachers.length})</h2>
            <ul>
              {schoolData.unassigned_teachers.map(teacher => (
                <li key={teacher.id} className="flex justify-between bg-white p-4 mb-2 shadow rounded-lg">
                  <div>
                    <p>{teacher.full_name} ({teacher.tsc_number})</p>
                  </div>
                  <button 
                    onClick={() => handleClassAssignment(null, teacher.id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <FaPlusCircle className="text-xs" />
                    <span>Assign</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {/* Assignment Modal */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Assign {assignmentType === 'student' ? 'Students' : 'Teachers'} to {selectedClass?.name}
                  </h3>
                  <button
                    onClick={closeAssignModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
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

                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    Select {assignmentType === 'student' ? 'students' : 'teachers'} to assign to this class:
                  </p>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-4">
                    {assignmentType === 'student' ? (
                      schoolData.unassigned_students.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No unassigned students available</p>
                      ) : (
                        schoolData.unassigned_students.map(student => (
                          <div key={student.id} className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={selectedUsers.has(student.id)}
                              onChange={() => toggleUserSelection(student.id)}
                              className="mr-3 h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor={`student-${student.id}`} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-800">{student.full_name}</p>
                                  <p className="text-sm text-gray-500">
                                    Admission: {student.admission_number} • Grade: {student.grade}
                                  </p>
                                </div>
                                <FaUserGraduate className="text-blue-500" />
                              </div>
                            </label>
                          </div>
                        ))
                      )
                    ) : (
                      schoolData.unassigned_teachers.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No unassigned teachers available</p>
                      ) : (
                        schoolData.unassigned_teachers.map(teacher => (
                          <div key={teacher.id} className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              id={`teacher-${teacher.id}`}
                              checked={selectedUsers.has(teacher.id)}
                              onChange={() => toggleUserSelection(teacher.id)}
                              className="mr-3 h-4 w-4 text-purple-600 rounded"
                            />
                            <label htmlFor={`teacher-${teacher.id}`} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-800">{teacher.full_name}</p>
                                  <p className="text-sm text-gray-500">
                                    TSC Number: {teacher.tsc_number}
                                  </p>
                                </div>
                                <FaChalkboardTeacher className="text-purple-500" />
                              </div>
                            </label>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedUsers.size > 0 ? (
                      <span className="font-medium">
                        {selectedUsers.size} {assignmentType}{selectedUsers.size !== 1 ? 's' : ''} selected
                      </span>
                    ) : (
                      <span>No {assignmentType}s selected</span>
                    )}
                  </div>
                  
                  <div className="space-x-3">
                    <button
                      onClick={closeAssignModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignUsers}
                      disabled={selectedUsers.size === 0}
                      className={`px-6 py-2 rounded-md text-white transition-colors ${
                        selectedUsers.size === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : assignmentType === 'student'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      Assign {assignmentType === 'student' ? 'Students' : 'Teachers'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
        )}
      </main>
    </div>
  );
};

export default SchoolDetails;

