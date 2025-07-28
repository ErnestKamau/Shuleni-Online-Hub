import React from "react";
import {
  FaChalkboardTeacher,
  FaUpload,
  FaUsers,
  FaBook,
  FaCalendarCheck,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const EducatorDashboard = () => {
  const educatorName = "Mr. Kiprono";
  const schoolName = "Shuleni Academy";
  const schoolLogo = "/logo.png";

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
          <img src={schoolLogo} alt="School Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-gray-800">{schoolName}</span>
        </div>
        <nav className="space-y-4">
          {[
            { label: "Dashboard", icon: <FaChalkboardTeacher />, active: true },
            { label: "My Classes", icon: <FaBook /> },
            { label: "Attendance", icon: <FaCalendarCheck /> },
            { label: "Upload Materials", icon: <FaUpload /> },
            { label: "Messages", icon: <FaEnvelope /> },
            { label: "Profile", icon: <FaUser /> },
            { label: "Logout", icon: <FaSignOutAlt /> },
          ].map(({ label, icon, active }) => (
            <button
              key={label}
              className={`flex items-center w-full px-4 py-2 text-left rounded-lg transition ${
                active
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
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
            Welcome, <span className="font-medium">{educatorName}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaBook className="text-blue-600 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Active Classes</p>
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
            </div>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex items-center space-x-5">
            <FaUpload className="text-green-500 text-4xl" />
            <div>
              <p className="text-sm text-gray-500">Resources Uploaded</p>
              <h3 className="text-2xl font-bold text-gray-800">20</h3>
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
            {[
              {
                title: "Class 7 Math Test",
                due: "Scheduled: July 25, 2025",
                color: "blue",
              },
              {
                title: "Review Student Submissions",
                due: "Due: July 26, 2025",
                color: "yellow",
              },
              {
                title: "Upload Science Notes",
                due: "Deadline: July 28, 2025",
                color: "green",
              },
            ].map(({ title, due, color }) => (
              <div
                key={title}
                className={`border-l-4 pl-4 border-${color}-500`}
              >
                <p className="font-medium text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{due}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EducatorDashboard;
