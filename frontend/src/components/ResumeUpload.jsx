import React, { useState } from 'react';
import API from '../api/api'; // Your API client
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaFileUpload, FaCheckCircle, FaExclamationCircle, FaSpinner, FaFilePdf, FaFileWord } from 'react-icons/fa'; // Icons for file upload, status, and file types

function ResumeUpload() {
    // Renamed 'file' to 'selectedFile' for clarity and consistency
    const [selectedFile, setSelectedFile] = useState(null);
    // Renamed 'skills' to 'extractedSkills' for clarity and consistency
    const [extractedSkills, setExtractedSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
    const [uploadSuccess, setUploadSuccess] = useState(false); // New state for success message
    const [error, setError] = useState(''); // Unified error state

    // Event handler for when a file is chosen
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Basic file type validation
            if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setSelectedFile(file);
                setError(''); // Clear any previous errors
                setUploadSuccess(false); // Reset success state when a new file is chosen
                setExtractedSkills([]); // Clear previous skills
            } else {
                setSelectedFile(null);
                setError('Please upload a PDF or DOCX file.');
            }
        } else {
            setSelectedFile(null);
        }
    };

    // Event handler for the upload button click
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a resume file first.');
            return;
        }

        setIsLoading(true); // Start loading
        setError(''); // Clear previous errors
        setUploadSuccess(false); // Reset success
        setExtractedSkills([]); // Clear previous skills

        const formData = new FormData();
        // Ensure the field name 'file' matches what your Django backend expects in 'resumes/upload/'
        formData.append('file', selectedFile);

        try {
            // **ADJUSTED API ENDPOINT HERE to match your 'resumes/upload/'**
            const response = await API.post('resumes/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial for file uploads
                },
            });

            // Assuming your backend sends back a response like { skills: ["skill1", "skill2"] }
            if (response.data && response.data.skills) {
                setExtractedSkills(response.data.skills);
                setUploadSuccess(true); // Set success state
            } else {
                // If upload is successful but response structure is unexpected
                setError('Upload successful, but no skills were extracted or the response format was unexpected.');
            }
        } catch (err) {
            console.error('Error uploading resume:', err);
            // Provide a user-friendly error message
            // err.response.data might contain specific error messages from your backend
            setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
            setUploadSuccess(false);
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Navbar (Copied from JobList for consistency, ideally this would be a shared component) */}
            <Navbar />

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12 flex justify-center items-center">
                <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 max-w-2xl w-full border border-gray-100 animate-fadeInUp">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                        Upload Your Resume
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Let our intelligent system extract your skills and find the perfect job matches.
                    </p>

                    <div className="flex flex-col items-center space-y-6">
                        {/* Custom File Input Button */}
                        <label htmlFor="resume-upload" className="relative cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center text-lg">
                            <FaFileUpload className="mr-3 text-xl" />
                            <span>{selectedFile ? 'Change File' : 'Choose Resume'}</span>
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx" // Specify accepted file types
                                onChange={handleFileChange}
                                className="hidden" // Hide the default input
                            />
                        </label>

                        {/* File Name Display & Status */}
                        {selectedFile && (
                            <div className="flex items-center text-gray-700 text-base">
                                {selectedFile.type === 'application/pdf' ? (
                                    <FaFilePdf className="text-red-500 mr-2 text-xl" />
                                ) : (
                                    <FaFileWord className="text-blue-500 mr-2 text-xl" />
                                )}
                                <span className="font-medium truncate max-w-xs md:max-w-md">{selectedFile.name}</span>
                                {uploadSuccess && (
                                    <FaCheckCircle className="text-green-500 ml-3 text-xl" title="Resume uploaded successfully!" />
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative w-full flex items-center justify-center">
                                <FaExclamationCircle className="mr-2 text-xl" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || isLoading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-xl transition duration-300 ease-in-out shadow-md
                                ${!selectedFile || isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                                }
                                flex items-center justify-center`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-3" />
                                    Processing...
                                </>
                            ) : (
                                'Extract Skills & Find Matches'
                            )}
                        </button>
                    </div>

                    {/* Extracted Skills Display */}
                    {extractedSkills.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                <span className="text-blue-500">Extracted Skills:</span>
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {extractedSkills.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-blue-200 transition duration-200 cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer (Copied for consistency) */}
            <footer className="bg-gray-800 text-white text-center p-6 mt-12">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} JobFinder Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default ResumeUpload;