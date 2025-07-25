import { useState, useEffect } from 'react';
import { Book, Users, Calendar, FileText } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const EducatorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Educator Dashboard - Manage your classes and students
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Classes</h2>
            <p className="text-gray-600">No upcoming classes scheduled.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;
