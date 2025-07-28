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
import StudentDashboard from './components/dashboards/StudentDashboard';
import EducatorDashboard from './components/dashboards/EducatorDashboard';
import useAuth from './hooks/useAuth';


export const AppRoutes = () => {
  const { user, loading } = useAuth();

  // 🔁 Determine dashboard route based on role
  // const getDashboardPath = () => {
  //   if (!user) return '/login';
  //   switch (user.role) {
  //     case 'owner':
  //       return '/admin-dashboard';
  //     case 'educator':
  //       return '/user-profile'; // 🔁 Update if educator dashboard is added
  //     case 'student':
  //       return '/user-profile'; // 🔁 Update if student dashboard is added
  //     default:
  //       return '/unauthorized';
  //   }
  // };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>; // ⏳ Optional: add spinner
  }

  return (
    <Routes>
      {/* 🔁 Default route */}
      <Route
        path="/"
        element={
          <LandingPage />
        }
      />

      {/* 🌐 Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/school-owner-registration" element={<SchoolOwnerRegistration />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        

        


      </Route>

      {/* 🔐 Owner-only routes */}
      
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerPage />
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
       
     

      {/* 🔐 Shared routes: owner, educator, student */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={['owner', 'educator', 'student']}>
            <ChangePassword />
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
    </Routes>
  );
};

