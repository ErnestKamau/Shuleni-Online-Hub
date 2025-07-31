import React,{useState, useEffect} from "react";
import EducatorSidebar from "../common/EducatorSidebar";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {FaChalkboardTeacher,FaUpload,FaUsers,FaBook,FaCalendarCheck, FaEnvelope,FaUser,FaSignOutAlt,} from "react-icons/fa";

const EducatorDashboard = () => {
  const [educatorDashboardData, setEducatorDashboardData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading]= useState(true);
  const navigate = useNavigate()
  const [refreshPage, setRefreshPage]= useState(false)


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
      <EducatorSidebar />
    

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
