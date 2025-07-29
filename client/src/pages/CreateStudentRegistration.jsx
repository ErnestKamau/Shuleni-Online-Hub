import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Hash, BookOpen, School } from 'lucide-react';
import axios from '../api/axios';
import Sidebar from '../components/common/Sidebar';
import downloadOnboardingDoc from '../components/common/ downloadOnboardingDoc';


const CreateStudentRegistration = ({ onSuccess }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const schoolIdFromQuery = queryParams.get('schoolId');
  
  const [formData, setFormData] = useState({
    full_name: '',
    admission_number: '',
    grade: '',
    class_id: '',
    school_id: schoolIdFromQuery || '',
  });

  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const cleanFormData = {
    ...formData,
    class_id: formData.class_id === '' ? null : parseInt(formData.class_id, 10),
    grade: formData.grade === '' ? null : formData.grade,
  };



    try {
      const response = await axios.post('/admin/create-student', cleanFormData, {
        withCredentials: true, 
      });

      
      const { message, admission_number, temporary_password, student_id } = response.data;
      
      downloadOnboardingDoc({
        title: "Student Onboarding",
        welcomeMessage:"Welcome to Shuleni! We are excited to have you join our school community. Here you will find all the resources, support, and opportunities you need to succeed. Please review your login details below and reach out if you need any assistance.",
        info: [
          `Full Name: ${formData.full_name}`,
          `Admission Number: ${admission_number}`,
          `Temporary Password: ${temporary_password}`,
          `Student ID: ${student_id}`,
        ]
      });
      
      
      console.log('Student created:', {
        message,
        admission_number,
        temporary_password,
        student_id
      });


      setFormData({
        full_name: '',
        admission_number: '',
        grade: '', 
        class_id: null,
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Student creation failed');
    } finally {
      navigate('/owner-dashboard');  
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen">
  
        <Sidebar />

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <User className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Student</h2>
            <p className="text-gray-600">Add a student to your school system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                label: 'Full Name',
                name: 'full_name',
                icon: <User />,
                type: 'text',
                placeholder: 'Enter full name',
              },
              {
                label: 'Admission Number',
                name: 'admission_number',
                icon: <Hash />,
                type: 'text',
                placeholder: 'Enter admission number',
              },
              {
                label: 'Grade (Optional)',
                name: 'grade',
                icon: <BookOpen />,
                type: 'text',
                placeholder: 'Enter grade or class level',
              },
              {
                label: 'Class ID (Optional)',
                name: 'class_id',
                icon: <School />,
                type: 'text',
                placeholder: 'Enter class ID',
              },
              
              ...(!schoolIdFromQuery ? [{
                label: 'School ID (Required when adding from sidebar/dashboard)',
                name: 'school_id',
                icon: <School />,
                type: 'number',
                placeholder: 'Enter school ID',
              }] : []),
            ].map(({ label, name, icon, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="relative">
                  {icon && (
                    <span className="absolute left-3 top-3 h-4 w-4 text-gray-400">
                      {icon}
                    </span>
                  )}
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={placeholder}
                    required={name === 'full_name' || name === 'admission_number'}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating Student...' : 'Create Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudentRegistration;
