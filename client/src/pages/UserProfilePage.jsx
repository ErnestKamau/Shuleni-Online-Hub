import React, { useEffect, useState } from 'react';


const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
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
    <div className="p-4 border rounded shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <p><strong>Name:</strong> {profile.full_name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Created At:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
      {profile.role === 'student' && (
        <>
          <p><strong>Admission No:</strong> {profile.admission_number}</p>
          <p><strong>Grade:</strong> {profile.grade}</p>
          <p><strong>Class ID:</strong> {profile.class_id}</p>
        </>
      )}
      {profile.role === 'educator' && (
        <>
          <p><strong>TSC Number:</strong> {profile.tsc_number}</p>
          <p><strong>Class ID:</strong> {profile.class_id}</p>
        </>
      )}
    </div>
  );
};

export default UserProfile;