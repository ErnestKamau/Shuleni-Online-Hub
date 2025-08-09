import React, { useEffect, useState } from 'react';
import axios from "../api/axios";


const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
const RoleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75c-.276 0-.5-.447-.5-.999v-1.25m0 1.25H9.75V18c0-.447-.224-.999-.5-.999H5.25c-.276 0-.5.447-.5.999v1.25h13.5zm-5-3.75h2.25m-1.5-4.5h3.75" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);
const StudentIDIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15A2.25 2.25 0 0 0 21.75 17.25V5.25A2.25 2.25 0 0 0 19.5 3H4.5A2.25 2.25 0 0 0 2.25 5.25v12A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0ZM12.75 12.75a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 .75.75v3ZM12.75 18a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 .75.75v3Z" />
    </svg>
);
const TeacherIDIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.997 48.997 0 0 1 12 21c2.357 0 4.683-.178 6.918-.582c.18-.03.358-.06.538-.092m-4.877-8.179A6.702 6.702 0 0 0 12 9.25a6.702 6.702 0 0 0-3.877 1.293M12 12.75l-1.657 1.657a.75.75 0 0 0 1.06 1.06l.75-.75L12 15.75m0-6V7.5m0 6v1.5m0-7.5l-1.5 1.5M12 10.5l1.5-1.5m0-1.5V7.5m0 6v1.5m0-7.5l-1.5 1.5" />
  </svg>
);
const ClassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.997 48.997 0 0 1 12 21c2.357 0 4.683-.178 6.918-.582c.18-.03.358-.06.538-.092m-4.877-8.179A6.702 6.702 0 0 0 12 9.25a6.702 6.702 0 0 0-3.877 1.293M12 12.75l-1.657 1.657a.75.75 0 0 0 1.06 1.06l.75-.75L12 15.75m0-6V7.5m0 6v1.5m0-7.5l-1.5 1.5M12 10.5l1.5-1.5m0-1.5V7.5m0 6v1.5m0-7.5l-1.5 1.5" />
  </svg>
);


const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/profile');
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-red-600 text-xl font-medium text-center border border-red-200 animate-fade-in">
          <p className="mb-4">Oops! Something went wrong.</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 mb-6 animate-spin-slow"></div>
          <p className="text-xl font-medium text-gray-700 animate-pulse">Loading Shuleni profile...</p>
          <style jsx>{`
            .loader {
              border-top-color: #3b82f6; /* Tailwind blue-500 */
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-3xl overflow-hidden w-full max-w-3xl transform hover:scale-[1.01] transition-transform duration-500 ease-out animate-fade-in">

       
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <h2 className="text-4xl font-extrabold mb-2 tracking-wide drop-shadow-lg">
            Shuleni Profile
          </h2>
          <p className="text-xl opacity-90 font-light italic">
            Your gateway to educational excellence
          </p>
          
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}&backgroundColor=aec9ff,b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc,ffe0b3,fff3bf&radius=50&width=150&height=150`}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover p-2"
                />
            </div>
          </div>
        </div>

        <div className="pt-24 pb-10 px-8 lg:px-12">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {profile.full_name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <UserIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-800">{profile.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <MailIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <RoleIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-semibold text-blue-700 capitalize">{profile.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <CalendarIcon />
              <div>
                <p className="text-sm font-medium text-gray-500">Joined Shuleni</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {profile.role === 'student' && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-inner-md transition duration-300 hover:shadow-md">
              <h4 className="text-2xl font-bold text-blue-800 mb-5 text-center">Student Information</h4>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-md shadow-sm">
                <StudentIDIcon />
                <div>
                  <p className="text-sm font-medium text-gray-500">Admission Number</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.admission_number}</p>
                </div>
              </div>
            </div>
          )}

          {profile.role === 'educator' && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-inner-md transition duration-300 hover:shadow-md">
              <h4 className="text-2xl font-bold text-green-800 mb-5 text-center">Educator Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-md shadow-sm">
                  <TeacherIDIcon />
                  <div>
                    <p className="text-sm font-medium text-gray-500">TSC Number</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.tsc_number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-md shadow-sm">
                  <ClassIcon />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Class ID</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.class_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

      

        </div>
      </div>
    </div>
  );
};

export default UserProfile;