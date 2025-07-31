import React, {useState, useEffect} from "react"
import { useFormik } from "formik"
import * as yup from "yup";

import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Attendances(){
    const [attendances, setAttendances] = use([]);
    const [refreshPage,setRefreshPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [attendanceToDelete, setAttendanceToDelete] = useState(null);
    const [error, setError] = useState(null);
    const {currentUser} = useAuth();

    const creatorId = currentUser?.id;


    useEffect(()=>{
        console.log("Fetching attendances")
        axios.get("/attendances")
        .then((res)=>{
            console.log("Fetched attendances:", res.data);
            setAttendances(res.data);

        })
        .catch((error)=>setError(error))
        .finally(()=>setLoading(false));
    },[refreshPage]
    );


    
    // const [students, setStudents] = useState([
    //     { id: 1, name: 'Alice Johnson', email: 'alice@school.com', initials: 'AJ', status: 'pending' },
    //     { id: 2, name: 'Bob Smith', email: 'bob@school.com', initials: 'BS', status: 'pending' },
    //     { id: 3, name: 'Carol Davis', email: 'carol@school.com', initials: 'CD', status: 'pending' },
    //     { id: 4, name: 'David Wilson', email: 'david@school.com', initials: 'DW', status: 'pending' },
    //     { id: 5, name: 'Emma Brown', email: 'emma@school.com', initials: 'EB', status: 'pending' },
    //     { id: 6, name: 'Frank Miller', email: 'frank@school.com', initials: 'FM', status: 'pending' },
    //     { id: 7, name: 'Grace Taylor', email: 'grace@school.com', initials: 'GT', status: 'pending' },
    //     { id: 8, name: 'Henry Clark', email: 'henry@school.com', initials: 'HC', status: 'pending' },
    //     { id: 9, name: 'Ivy Martinez', email: 'ivy@school.com', initials: 'IM', status: 'pending' },
    //     { id: 10, name: 'Jack Thompson', email: 'jack@school.com', initials: 'JT', status: 'pending' },
    // ]);

    // // State for attendance counts
    // const [attendanceCounts, setAttendanceCounts] = useState({
    //     present: 0,
    //     absent: 0,
    //     late: 0,
    //     excused: 0,
    //     pending: students.length, // Initially all are pending
    // });

    // // State to track unsaved changes for the floating notification
    // const [unsavedChanges, setUnsavedChanges] = useState(false);

    // // State for the bulk action confirmation message
    // const [bulkActionMessage, setBulkActionMessage] = useState('');

    // // Effect to update attendance counts whenever student statuses change
    // useEffect(() => {
    //     const counts = { present: 0, absent: 0, late: 0, excused: 0, pending: 0 };
    //     students.forEach(student => {
    //         if (student.status && counts.hasOwnProperty(student.status)) {
    //             counts[student.status]++;
    //         } else {
    //             counts.pending++;
    //         }
    //     });
    //     setAttendanceCounts(counts);
    // }, [students]);

    // // Handler for individual student status change
    // const handleStudentStatusChange = (studentId, newStatus) => {
    //     setStudents(prevStudents =>
    //         prevStudents.map(student =>
    //             student.id === studentId ? { ...student, status: newStatus } : student
    //         )
    //     );
    //     setUnsavedChanges(true); // Mark as unsaved changes
    // };

    // // Handler for bulk marking attendance
    // const handleBulkMark = (status) => {
    //     setStudents(prevStudents =>
    //         prevStudents.map(student => ({ ...student, status: status }))
    //     );
    //     setUnsavedChanges(true); // Mark as unsaved changes
    //     setBulkActionMessage(`All students marked as ${status}`);
    //     setTimeout(() => setBulkActionMessage(''), 3000); // Clear message after 3 seconds
    // };

    // // Handler for resetting all attendance to pending
    // const handleReset = () => {
    //     setStudents(prevStudents =>
    //         prevStudents.map(student => ({ ...student, status: 'pending' }))
    //     );
    //     setUnsavedChanges(false); // No unsaved changes after reset
    //     setBulkActionMessage('Attendance reset');
    //     setTimeout(() => setBulkActionMessage(''), 3000);
    // };

    // // Handler for saving attendance (placeholder for API call)
    // const handleSaveAttendance = () => {
    //     console.log("Saving attendance data:", students.filter(s => s.status !== 'pending'));
    //     // In a real application, you would send this data to your backend API.
    //     // Example: fetch('/api/attendances', { method: 'POST', body: JSON.stringify(students) });
    //     setUnsavedChanges(false); // Clear unsaved changes after saving
    //     setBulkActionMessage('Attendance saved successfully!');
    //     setTimeout(() => setBulkActionMessage(''), 3000);
    // };

    // // Helper function to get initials for student avatar
    // const getInitials = (name) => {
    //     return name.split(' ').map(n => n[0]).join('').toUpperCase();
    // };

    // // Helper function to determine button styles based on current status
    // const getStatusButtonClasses = (currentStudentStatus, buttonStatus) => {
    //     let baseClasses = "p-2 rounded-full transition-colors duration-200";
    //     if (currentStudentStatus === buttonStatus) {
    //         switch (buttonStatus) {
    //             case 'present': return `${baseClasses} bg-green-200 text-green-700`;
    //             case 'absent': return `${baseClasses} bg-red-200 text-red-700`;
    //             case 'late': return `${baseClasses} bg-orange-200 text-orange-700`;
    //             case 'excused': return `${baseClasses} bg-purple-200 text-purple-700`;
    //             default: return `${baseClasses} bg-gray-200 text-gray-700`;
    //         }
    //     } else {
    //         return `${baseClasses} text-gray-500 hover:bg-gray-100`;
    //     }
    // };

    // // Helper function to determine display status tag classes
    // const getDisplayStatusClasses = (currentStatus) => {
    //     let baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    //     switch (currentStatus) {
    //         case 'present': return `${baseClasses} bg-green-100 text-green-700`;
    //         case 'absent': return `${baseClasses} bg-red-100 text-red-700`;
    //         case 'late': return `${baseClasses} bg-orange-100 text-orange-700`;
    //         case 'excused': return `${baseClasses} bg-purple-100 text-purple-700`;
    //         default: return `${baseClasses} bg-gray-100 text-gray-700`;
    //     }
    // };

    // // Helper function to get display text for status
    // const getStatusText = (currentStatus) => {
    //     if (currentStatus === 'pending') return 'Not marked';
    //     return currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
    // };

    // // Calculate attendance rate
    // const totalStudents = students.length;
    // const markedStudents = totalStudents - attendanceCounts.pending;
    // const attendanceRate = totalStudents > 0 ? ((attendanceCounts.present + attendanceCounts.late) / totalStudents) * 100 : 0;


    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">

                {/* Header: Course Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4">
                    <div className="flex items-center mb-4 sm:mb-0">
                        {/* Icon for Computer Science */}
                        <svg className="h-8 w-8 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ClassName :{/* input class name */}</h1>
                            <p className="text-gray-600">Teacher :{/*from attendance u class_id we get educators name also he/she is the current user */}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-700">
                        {/* Students Icon */}
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m0 0l4 4m-4-4v-2m4 2v-2m4-2a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m0 0l4 4"></path>
                            </svg>
                            <span>Total Students:{/*totalStudents*/}</span>
                        </div>
                        {/* Time Icon */}
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>date :{/*date from attendances*/}</span>
                        </div>
                    </div>
                </div>

                {/* Attendance Controls and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Attendance Date */}
                    <div className="flex flex-col">
                        <label htmlFor="attendance-date" className="text-gray-700 text-sm font-medium mb-1">Attendance Date</label>
                        <div className="relative">
                            <input type="text" id="attendance-date" className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="07/26/2025" readOnly />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M15 11h.01M7 15h.01M11 15h.01M15 15h.01M17 19H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Search Students */}
                    <div className="flex flex-col">
                        <label htmlFor="search-students" className="text-gray-700 text-sm font-medium mb-1">Search Students</label>
                        <div className="relative">
                            <input type="text" id="search-students" className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search by name or email..." />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Status Counters */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Present</span>
                            </div>
                            <span>{attendanceCounts.present}</span>
                        </div>
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Absent</span>
                            </div>
                            <span>{attendanceCounts.absent}</span>
                        </div>
                        <div className="bg-orange-100 text-orange-700 p-3 rounded-lg flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Late</span>
                            </div>
                            <span>{attendanceCounts.late}</span>
                        </div>
                        <div className="bg-purple-100 text-purple-700 p-3 rounded-lg flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <span>Excused</span>
                            </div>
                            <span>{attendanceCounts.excused}</span>
                        </div>
                    </div>

                    {/* Quick Actions and Summary Stats */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50 flex flex-col justify-between">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Total Students</h3>
                            <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
                                <span>{totalStudents}</span>
                                {/* Icon for Total Students */}
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m0 0l4 4m-4-4v-2m4 2v-2m4-2a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m0 0l4 4"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 flex flex-col justify-between">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Attendance Rate</h3>
                            <div className="flex items-center justify-between text-2xl font-bold text-green-600">
                                <span>{attendanceRate.toFixed(0)}%</span>
                                {/* Icon for Attendance Rate */}
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 flex flex-col justify-between">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Pending</h3>
                            <div className="flex items-center justify-between text-2xl font-bold text-orange-600">
                                <span>{attendanceCounts.pending}</span>
                                {/* Icon for Pending */}
                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Students not marked</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 flex flex-col justify-between relative">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Quick Actions</h3>
                            <p className="text-sm text-gray-500 mb-2">Bulk mark attendance for all {totalStudents} students</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleBulkMark('present')}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Present
                                </button>
                                <button
                                    onClick={() => handleBulkMark('absent')}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Absent
                                </button>
                                <button
                                    onClick={() => handleBulkMark('late')}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                                >
                                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Late
                                </button>
                                <button
                                    onClick={() => handleBulkMark('excused')}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Excused
                                </button>
                            </div>
                            <div className="flex items-center justify-end mt-4 space-x-2">
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 13V9m7 0h-.582m-15.356 2A8.001 8.001 0 0120 13V9m-7 0a8.001 8.001 0 01-4.908-1.478M4 4h16V4h-16z"></path>
                                    </svg>
                                    Reset
                                </button>
                                <button
                                    onClick={handleSaveAttendance}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${unsavedChanges ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    disabled={!unsavedChanges}
                                >
                                    Save Attendance
                                </button>
                            </div>
                            {/* Bulk Action Message Notification */}
                            {bulkActionMessage && (
                                <div className="absolute top-0 right-0 mt-2 mr-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-lg transition-opacity duration-300 opacity-100">
                                    {bulkActionMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Student List Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Student List</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map(student => (
                            <div key={student.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm mr-4">
                                        {getInitials(student.name)}
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">{student.name}</p>
                                        <p className="text-gray-500 text-sm">{student.email}</p>
                                    </div>
                                </div>
                                {/* Conditional rendering for status buttons or display tag */}
                                {student.status === 'pending' ? (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleStudentStatusChange(student.id, 'present')}
                                            className={getStatusButtonClasses(student.status, 'present')}
                                            title="Mark Present"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleStudentStatusChange(student.id, 'absent')}
                                            className={getStatusButtonClasses(student.status, 'absent')}
                                            title="Mark Absent"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleStudentStatusChange(student.id, 'late')}
                                            className={getStatusButtonClasses(student.status, 'late')}
                                            title="Mark Late"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleStudentStatusChange(student.id, 'excused')}
                                            className={getStatusButtonClasses(student.status, 'excused')}
                                            title="Mark Excused"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className={getDisplayStatusClasses(student.status)}>
                                            {getStatusText(student.status)}
                                        </span>
                                        <button
                                            onClick={() => handleStudentStatusChange(student.id, 'pending')} // Allow changing back to pending to reset
                                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                                            title="Cancel/Reset"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Floating Unsaved Changes Notification */}
                    {unsavedChanges && (
                        <div className="fixed bottom-6 right-6 flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            Unsaved changes
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    );

}export default Attendances