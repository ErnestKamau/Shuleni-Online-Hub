import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

import SchoolOwnerRegistration from './pages/SchoolOwnerRegistration';
import Login from './pages/Login';
import UserProfilePage from './pages/UserProfilePage';
import LandingPage from './pages/LandingPage';
import CreateStudentRegistration from './pages/CreateStudentRegistration';
import CreateEducatorRegistration from './pages/CreateEducatorRegistration';
import ChangePassword from './pages/ChangePassword';
import SchoolStats from './pages/SchoolStats';
import Unauthorized from './pages/Unauthorized';
import OwnerPage from './pages/OwnerPage';
import CreateSchool from './pages/CreateSchool';
import SchoolDetails from './components/schools/SchoolDetails';
import StudentDashboard from './components/dashboards/StudentDashboard';
import EducatorDashboard from './components/dashboards/EducatorDashboard';
import ClassSection from './pages/ClassSection';
import useAuth from './hooks/useAuth';
import StudentClasses from './pages/StudentClasses';
import EducatorClassManagement from './components/classes/EducatorClassManagement';
import StudentAssessments from './pages/StudentAssessments';
import StudentAttendance from './pages/StudentAttendance';
import StudentGrades from './pages/StudentGrades';
import ClassManagement from './components/classes/ClassManagement';
import AttemptAssessmentPage from './pages/AttemptAssessmentPage';
import StudentResources from './pages/StudentResources';
import Attendances from './pages/Attendance';
import ChatPageWrapper from './pages/ChatPageWrapper';
import ClassAssessmentSubmissions from './pages/ClassAssessmentSubmissions';


export const AppRoutes = () => {
  const { loading } = useAuth();




  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <Routes>
  
      <Route
        path="/"
        element={
          <LandingPage />
        }
      />

      <Route element={<PublicLayout />}>
        <Route path="/attendances" element={<Attendances />} />
        <Route path="/login" element={<Login />} />
        <Route path="/school-owner-registration" element={<SchoolOwnerRegistration />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
      </Route>
      {/*mwalimu routes*/}
      <Route path="/educator-dashboard" element={
        <ProtectedRoute allowedRoles={['educator']}>
          <EducatorDashboard />
        </ProtectedRoute>    
        }
      />

       <Route path="/educator-dashboard/class" element={
        <ProtectedRoute allowedRoles={['educator']}>
          <EducatorClassManagement />
        </ProtectedRoute>    
        }
      />

      <Route path="/attendances" element={
        <ProtectedRoute>
          <Attendances />
        </ProtectedRoute>
        
      } 
      />

      <Route
        path="/classes/:classId/assessments/:assessmentId/submissions"
        element={
          <ProtectedRoute allowedRoles={['educator']}>
            <ClassAssessmentSubmissions />
          </ProtectedRoute>
        }
      />

      {/* Owner-only routes */}
      
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-school"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <CreateSchool />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/create-student-registration"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <CreateStudentRegistration />
          </ProtectedRoute>
        }
        
      />

      <Route
        path="/create-educator-registration"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <CreateEducatorRegistration />
          </ProtectedRoute>
        }
      />

      <Route
        path="/school-stats"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <SchoolStats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/school/:schoolId/details"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <SchoolDetails />
          </ProtectedRoute>
        }
      />
      



      {/* Student-only routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/classes"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assessments"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAssessments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentGrades />
          </ProtectedRoute>
        }
      />

      <Route
      path="/student/assessments/:assessmentId/attempt"
      element={
      <ProtectedRoute allowedRoles={['student']}>
        <AttemptAssessmentPage />
      </ProtectedRoute>
      }
      />

      <Route
        path="/student/classes/:classId/resources"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentResources />
          </ProtectedRoute>
        }
      />



      {/* Shared routes: owner, educator, student */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={['owner', 'educator', 'student']}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route path="/owner/schools/:schoolId/classes" 
      element={
        <ProtectedRoute allowedRoles={['owner', 'educator']}>
            <ClassSection/>
        </ProtectedRoute>
            
       
      } 
       />

       <Route
          path="/educator/class/:classId/chat"
          element={
            <ProtectedRoute allowedRoles={['student', 'educator']}>
              <ChatPageWrapper />
            </ProtectedRoute>
          }
        />


      <Route
        path="/user-profile"
        element={
          <ProtectedRoute allowedRoles={['owner', 'educator', 'student']}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/school/:schoolId/class/:classId/manage"
        element={
          <ProtectedRoute allowedRoles={['owner', 'educator']}>
            <ClassManagement />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
};



