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
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

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

