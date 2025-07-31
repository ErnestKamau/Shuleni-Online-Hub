import React, { useState, useEffect } from 'react';

export default function Attendance() {

  const initialStudents = [
    { id: 's1', name: 'Alice Johnson', email: 'alice@school.com', status: 'Present' },
    { id: 's2', name: 'Bob Smith', email: 'bob@school.com', status: 'Absent' },
    { id: 's3', name: 'Carol Davis', email: 'carol@school.com', status: 'Late' },
    { id: 's4', name: 'David Wilson', email: 'david@school.com', status: 'Excused' },
    { id: 's5', name: 'Emma Brown', email: 'emma@school.com', status: 'Present' },
    { id: 's6', name: 'Frank Miller', email: 'frank@school.com', status: 'Present' },
    { id: 's7', name: 'Grace Taylor', email: 'grace@school.com', status: 'Absent' },
    { id: 's8', name: 'Henry Clark', email: 'henry@school.com', status: 'Late' },
    { id: 's9', name: 'Ivy Martinez', email: 'ivy@school.com', status: 'Present' },
    { id: 's10', name: 'Jack Thompson', email: 'jack@school.com', status: 'Excused' },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showBulkActionMessage, setShowBulkActionMessage] = useState(false);
  const [bulkActionMessage, setBulkActionMessage] = useState('');
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const lateCount = students.filter(s => s.status === 'Late').length;
  const excusedCount = students.filter(s => s.status === 'Excused').length;
  const totalStudents = students.length;
  const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) : 0;
  const pendingCount = totalStudents - (presentCount + absentCount + lateCount + excusedCount);

 
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleAttendance = (id) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === id) {
          let newStatus;
          switch (student.status) {
            case 'Present':
              newStatus = 'Absent';
              break;
            case 'Absent':
              newStatus = 'Late';
              break;
            case 'Late':
              newStatus = 'Excused';
              break;
            case 'Excused':
              newStatus = 'Present';
              break;
            default:
              newStatus = 'Present'; 
          }
          return { ...student, status: newStatus };
        }
        return student;
      })
    );
    setUnsavedChanges(true); 
  };

  const handleBulkAction = (status) => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({ ...student, status }))
    );
    setUnsavedChanges(true); 
    setBulkActionMessage(`All students marked as ${status.toLowerCase()}`);
    setShowBulkActionMessage(true);
    setTimeout(() => setShowBulkActionMessage(false), 3000); 
  };

  const handleReset = () => {
    setStudents(initialStudents);
    setUnsavedChanges(false); 
  };

  const handleSaveAttendance = () => {
    console.log("Saving attendance:", students);
    setUnsavedChanges(false); 
    
  };

 
  const getStatusButtonProps = (status) => {
    switch (status) {
      case 'Present':
        return {
          className: 'bg-green-100 text-green-700 hover:bg-green-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: 'Present',
        };
      case 'Absent':
        return {
          className: 'bg-red-100 text-red-700 hover:bg-red-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          text: 'Absent',
        };
      case 'Late':
        return {
          className: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: 'Late',
        };
      case 'Excused':
        return {
          className: 'bg-blue-100 text-blue-700 hover:bg-blue-200', 
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: 'Excused',
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          text: 'Unknown',
        };
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-inter">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <span className="mr-3 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </span>
              Computer Science 101
            </h1>
          </div>
          <div className="flex flex-wrap items-center space-x-4 text-md text-gray-600">
            <span className="flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-700 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.185-.015-.367-.043-.545L14 9l-2 2v2m-6 2H2v-2a3 3 0 015.356-1.857m3.442 0A1.996 1.996 0 0110 16c0-1.105.895-2 2-2s2 .895 2 2c0 .212-.036.417-.104.615M17 14c.615.104.819.31.923.545L20 17l-1 1" />
              </svg>
              {totalStudents} Students
            </span>
            <span className="flex items-center px-3 py-1 bg-purple-50 rounded-full text-purple-700 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              09:00 AM - 10:30 AM
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-base">Introduction to Programming</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="attendance-date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Attendance Date
            </label>
            <input
              type="date"
              id="attendance-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5 text-gray-700"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="search-students" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Students
            </label>
            <input
              type="text"
              id="search-students"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5 text-gray-700"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
            <p className="text-3xl font-bold text-green-700">{presentCount}</p>
            <p className="text-sm text-green-600">Present</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
            <p className="text-3xl font-bold text-red-700">{absentCount}</p>
            <p className="text-sm text-red-600">Absent</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
            <p className="text-3xl font-bold text-orange-700">{lateCount}</p>
            <p className="text-sm text-orange-600">Late</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
            <p className="text-3xl font-bold text-blue-700">{excusedCount}</p>
            <p className="text-sm text-blue-600">Excused</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-md font-semibold text-gray-800 mb-3">Overall Statistics</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.185-.015-.367-.043-.545L14 9l-2 2v2m-6 2H2v-2a3 3 0 015.356-1.857m3.442 0A1.996 1.996 0 0110 16c0-1.105.895-2 2-2s2 .895 2 2c0 .212-.036.417-.104.615M17 14c.615.104.819.31.923.545L20 17l-1 1" />
                </svg>
                Total Students
              </span>
              <span className="text-xl font-bold text-gray-900">{totalStudents}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Attendance Rate</span>
              <span className="text-xl font-bold text-green-600">{attendanceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-600 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending
              </span>
              <span className="text-xl font-bold text-orange-600">{pendingCount}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{pendingCount} Students not marked</p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </p>
            <p className="text-sm text-gray-500 mb-4">Bulk mark attendance for all {totalStudents} students</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleBulkAction('Present')}
                className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Present
              </button>
              <button
                onClick={() => handleBulkAction('Absent')}
                className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Absent
              </button>
              <button
                onClick={() => handleBulkAction('Late')}
                className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Late
              </button>
              <button
                onClick={() => handleBulkAction('Excused')}
                className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Excused
              </button>
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-white rounded-xl shadow-lg p-6 relative border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-0">Student List</h2>
          <div className="flex items-center space-x-3">
            {unsavedChanges && (
              <span className="text-orange-600 text-sm font-semibold flex items-center px-3 py-1 bg-orange-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleReset}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150 ease-in-out"
              title="Reset"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 13a8 8 0 00-15.356-2m0 0v5h-.581m0-9.582a8.001 8.001 0 0115.356-2" />
              </svg>
            </button>
            <button
              onClick={handleSaveAttendance}
              className="flex items-center px-5 py-2.5 border border-transparent text-md font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Attendance
            </button>
          </div>
        </div>

    
        {showBulkActionMessage && (
          <div className="absolute top-4 right-4 bg-gray-800 text-white text-sm px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ease-in-out opacity-100 z-10">
            {bulkActionMessage}
          </div>
        )}

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map(student => {
            
            const { className, icon, text } = getStatusButtonProps(student.status);
            return (
              <div
                key={student.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-3">
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out flex items-center ${className}`}
                >
                  {icon}
                  {text}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}