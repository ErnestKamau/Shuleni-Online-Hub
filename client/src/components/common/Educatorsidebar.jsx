// src/components/common/EducatorSidebar.jsx
import React from "react";
import EducatorSidebar from "../common/EducatorSidebar"; 

import { useNavigate } from "react-router-dom";
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

const EducatorSidebar = ({ educator, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-lg p-6 z-10 sticky top-0 h-screen hidden lg:block">
      <div className="flex items-center space-x-3 mb-10">
        <img src={educator?.school?.logo || "/logo.png"} alt="School Logo" className="w-12 h-12" />
        <span className="text-xl font-bold text-gray-800">{educator?.school?.name || "School"}</span>
      </div>

      <nav className="space-y-4">
        {[
          { label: "Dashboard", icon: <FaChalkboardTeacher />, route: "/educator-dashboard" },
          { label: "My Classes", icon: <FaBook />, route: "/educator-dashboard/class" },
          { label: "Attendance", icon: <FaCalendarCheck />, route: "/educator-dashboard/attendance" },
          { label: "Upload Materials", icon: <FaUpload />, route: "/educator-dashboard/upload" },
          { label: "Messages", icon: <FaEnvelope />, route: "/educator-dashboard/messages" },
          { label: "Profile", icon: <FaUser />, route: "/educator-dashboard/profile" },
          { label: "Logout", icon: <FaSignOutAlt />, onClick: handleLogout },
        ].map(({ label, icon, route, onClick }) => (
          <button
            key={label}
            onClick={() => (onClick ? onClick() : navigate(route))}
            className="flex items-center w-full px-4 py-2 text-left rounded-lg transition hover:bg-gray-100"
          >
            <span className="mr-3">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default EducatorSidebar;
