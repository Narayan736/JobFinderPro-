import React, { useState } from 'react';
// Assuming 'API' is your Axios instance from '../api/api' for consistency
// If you are only using Axios directly here, make sure it's configured for your base URL
import API from '../api/api'; // Or use Axios directly as you did: import Axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBriefcase, FaAlignLeft, FaCode, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa'; // Importing icons

function JobPostForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills_required, setSkillsRequired] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // State for success message styling
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setIsLoading(true); // Start loading
        setMessage(''); // Clear previous messages
        setIsSuccess(false); // Reset success state

        try {
            // Using your 'API' instance for consistency with other components
            // Ensure API.post base URL is correctly configured, or use full URL if not
            const response = await API.post('jobs/', { // Assuming 'jobs/' is the correct relative endpoint
                title,
                description,
                skills_required
            });

            setMessage('Job posted successfully! Your listing is now live.');
            setIsSuccess(true);
            setTitle(''); // Clear form fields on success
            setDescription('');
            setSkillsRequired('');
        } catch (error) {
            console.error('Job post error:', error.response?.data || error.message);
            setMessage(error.response?.data?.detail || 'Failed to post job. Please check your inputs and try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Navbar (Copied for consistency) */}
            <Navbar />

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12 flex justify-center items-center">
                <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 max-w-3xl w-full border border-gray-100 animate-fadeInUp">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                        <span className="text-blue-600">Post</span> a New Job Opportunity
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Help talented individuals find their next career step by posting your job here.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space */}
                        {/* Job Title */}
                        <div>
                            <label htmlFor="job-title" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaBriefcase className="mr-2 text-purple-500" /> Job Title:
                            </label>
                            <input
                                id="job-title"
                                type="text"
                                placeholder="e.g., Senior Full Stack Developer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Job Description */}
                        <div>
                            <label htmlFor="job-description" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaAlignLeft className="mr-2 text-green-500" /> Job Description:
                            </label>
                            <textarea
                                id="job-description"
                                placeholder="Describe the role, responsibilities, and company culture."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200 resize-y" // Allow vertical resize
                                rows={6} // Increased rows
                                required
                            />
                        </div>

                        {/* Skills Required */}
                        <div>
                            <label htmlFor="skills-required" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaCode className="mr-2 text-orange-500" /> Skills Required (comma separated):
                            </label>
                            <input
                                id="skills-required"
                                type="text"
                                placeholder="e.g., Python, Django, React, SQL, AWS"
                                value={skills_required}
                                onChange={(e) => setSkillsRequired(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading} // Disable button when loading
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-xl transition duration-300 ease-in-out shadow-lg flex items-center justify-center
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-3" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="mr-3" />
                                    Submit Job Post
                                </>
                            )}
                        </button>

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-4 p-4 rounded-lg flex items-center justify-center text-lg font-medium ${
                                isSuccess
                                    ? 'bg-green-100 text-green-700 border border-green-400'
                                    : 'bg-red-100 text-red-700 border border-red-400'
                            }`}>
                                {isSuccess ? (
                                    <FaCheckCircle className="mr-2 text-xl" />
                                ) : (
                                    <FaExclamationCircle className="mr-2 text-xl" />
                                )}
                                {message}
                            </div>
                        )}
                    </form>
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

export default JobPostForm;