import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from '../api/axios';
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { School } from 'lucide-react'; 
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const ClassSection = () => {
    const { schoolId } = useParams();
    const { currentUser } = useAuth();
    const selectedSchoolId = parseInt(schoolId, 10);

    const navigate = useNavigate()

    const formSchema = yup.object().shape({
        name: yup.string().required("Must enter a name/Tafathali hujawekaa jina").max(100),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: formSchema,
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                name: values.name,
                school_id: selectedSchoolId,
            };
            try {
                const res = await axios.post("/classes", payload);
                console.log("Class created:", res.data);
                resetForm();
                navigate(`/school/${schoolId}/details`);
            } catch (err) {
                alert(err)
                console.error("Error creating class:", err);
            }
        },
    });

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10 flex min-h-screen">

                
                <Sidebar />
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="text-center mb-6">
                        <School className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                        <h2 className="text-2xl font-bold text-gray-900">Create New Class</h2>
                        <p className="text-gray-600">Add a new class to your school system</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Class Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 h-4 w-4 text-gray-400">
                                    <School />
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Grade 1A"
                                    required
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-sm">{formik.errors.name}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            + Create Class
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClassSection;