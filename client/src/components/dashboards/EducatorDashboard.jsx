import React,{useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";


import {FaChalkboardTeacher,FaUpload,FaUsers,FaBook,FaCalendarCheck, FaEnvelope,FaUser,FaSignOutAlt,} from "react-icons/fa";

const EducatorDashboard = () => {
  const [educatorDashboardData, setEducatorDashboardData] = useState([]);
  const [educatorName, setEducatorName] = useState([]);
  const [schoolName,setSchoolName] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading]= useState(true);
  const navigate = useNavigate()
  const [refreshPage, setRefreshPage]= useState(false)
  const schoolLogo = "/logo.png";


  useEffect(()=>{
    console.log("fetching educatordashboard")
    axios.get("/educator/dashboard")
      .then((res)=>{
        console.log("fetched educatordashboard:", res.data);
        setEducatorDashboardData(res.data);
        setError(null);  
      })
      .catch((err)=>{
        console.error("Dashboard fetch error:", err);
        setError(err);

        if (err.response?.status===401 || err.message.includes("Unauthorized")){
          localStorage.removeItem("token");
          handleLogout()

        }
      })
      
      .finally(()=>setLoading(false));
  },[refreshPage, navigate]);


  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  };



  const { educator, stats, recent_resources } = educatorDashboardData || {};




  const backgroundImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1950&q=80";

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 z-10 sticky top-0 h-screen hidden lg:block">
        <div className="flex items-center space-x-3 mb-10">
          <img src={educator?.school?.logo} alt="School Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-gray-800">{educator?.school?.name}</span>
        </div>
        <nav className="space-y-4">
          {[
            { label: "Dashboard", icon: <FaChalkboardTeacher />, route: "/educator-dashboard" },
            { label: "My Classes", icon: <FaBook /> , route: "/educator-dashboard/classes"},
            { label: "Attendance", icon: <FaCalendarCheck /> , route: "/educator-dashboard/attendance"},
            { label: "Upload Materials", icon: <FaUpload /> , route: "/educator-dashboard/upload" },
            { label: "Messages", icon: <FaEnvelope /> , route: "/educator-dashboard/messages"},
            { label: "Profile", icon: <FaUser />, route: "/educator-dashboard/profile" },
            { label: "Logout", icon: <FaSignOutAlt /> , onClick: handleLogout},
          ].map(({ label, icon, route , onClick}) => (
            <button
              key={label}
              onClick={()=>( onClick ?onClick():navigate(route))}
              className="flex items-center w-full px-4 py-2 text-left rounded-lg transition -700 hover:bg-gray-100"
              
            >
              <span className="mr-3">{icon}</span> {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Educator Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Welcome, <span className="font-medium">{educator?.full_name}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaBook className="text-blue-600 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Active Classes</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.classes}</h3>
            </div>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaUpload className="text-green-500 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Resources Uploaded</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats?.uploads}</h3>
            </div>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaCalendarCheck className="text-purple-600 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Attendance Logged</p>
              <h3 className="text-2xl font-bold text-gray-800">95%</h3>
            </div>
          </div>
        </div>

        {/* Upcoming Activities */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Teaching Tasks</h2>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {recent_resources && recent_resources.length > 0 ? (
              recent_resources.map((resource, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4"
                >
                  <p className="font-medium text-gray-800">{resource.title || "Untitled Resource"}</p>
                  <p className="text-sm text-gray-500">
                    {resource.subject || "Unknown Subject"} •{" "}
                    {new Date(resource.uploaded_at).toLocaleDateString() || "Unknown Date"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent uploads yet.</p>
            )}
          
          </div>
        </section>
      </main>
    </div>
  );
};

export default EducatorDashboard;
