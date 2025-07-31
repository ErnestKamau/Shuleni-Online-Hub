import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentSidebar from '../components/common/StudentSidebar';
import api from '../api/axios';

const StudentResources = () => {
    const { classId } = useParams();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/classes/${classId}/resources`);
                setResources(response.data.resources || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load resources');
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    } , [classId]);

        let content;
        if (loading) {
            content = (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <span className="text-gray-600">Loading resources...</span>
                </div>
            );
        } else if (error) {
            content = (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            );
        } else if (resources.length === 0) {
            content = (
                <div className="flex flex-col items-center py-12 text-gray-500">
                    <span>No resources available for this class.</span>
                </div>
            );
        } else {
            const backendBaseUrl = "http://127.0.0.1:5000";
            content = (
              <div className="space-y-6 p-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                        📘
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-blue-900">
                          {resource.title}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {resource.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploaded on:{" "}
                          {new Date(resource.created_at).toLocaleDateString()}
                        </p>
                        <a
                          href={`${backendBaseUrl}${resource.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-blue-700 font-medium hover:underline"
                        >
                          View Resource →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
        }
   
        return (
          <div className="min-h-screen flex bg-gray-100 relative">
            <StudentSidebar />
            <main className="flex-1 p-8 z-10 bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-800">
                  My Resources
                </h1>
                <div className="space-x-3">
                  <select className="px-3 py-2 bg-white border rounded-md text-sm text-gray-600">
                    <option>Time</option>
                  </select>
                  <select className="px-3 py-2 bg-white border rounded-md text-sm text-gray-600">
                    <option>Type</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded shadow p-6">{content}</div>
            </main>
          </div>
        );
    }

    export default StudentResources;