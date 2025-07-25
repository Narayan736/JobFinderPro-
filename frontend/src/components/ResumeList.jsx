import React, { useState, useEffect } from 'react';
import API from '../api/api'; // Your API client
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaFileAlt, FaCalendarAlt, FaUser, FaLink, FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons for resume details

function ResumeList() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Assuming your API endpoint for fetching resumes is '/api/resumes/' or similar
            const res = await API.get('resumes/'); // Using 'resumes/' as a relative path based on your previous API calls
            setResumes(res.data);
        } catch (err) {
            console.error("Error fetching resumes:", err);
            setError("Failed to load resumes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Helper function to render parsed text more gracefully
    // This is a basic attempt to break down the "Parsed Text" visually.
    // For a real-world app, your backend should ideally return structured JSON data
    // (e.g., { name: "...", email: "...", phone: "...", skills: [], projects: [] })
    const renderParsedText = (text) => {
        // Basic pattern matching for common elements
        const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        const phoneMatch = text.match(/(\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/);
        const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/);
        const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/);

        let cleanedText = text;
        if (emailMatch) cleanedText = cleanedText.replace(emailMatch[0], '');
        if (phoneMatch) cleanedText = cleanedText.replace(phoneMatch[0], '');
        if (linkedinMatch) cleanedText = cleanedText.replace(linkedinMatch[0], '');
        if (githubMatch) cleanedText = cleanedText.replace(githubMatch[0], '');

        // Use line-clamp for the remaining general parsed text
        return (
            <div className="text-sm text-gray-700 mt-2">
                {emailMatch && <p className="flex items-center text-blue-600 mb-1 truncate"><FaEnvelope className="mr-2 text-base" />{emailMatch[0]}</p>}
                {phoneMatch && <p className="flex items-center text-blue-600 mb-1"><FaPhone className="mr-2 text-base" />{phoneMatch[0]}</p>}
                {linkedinMatch && <p className="flex items-center text-blue-600 mb-1 truncate"><FaLink className="mr-2 text-base" /><a href={`https://${linkedinMatch[0]}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{linkedinMatch[0]}</a></p>}
                {githubMatch && <p className="flex items-center text-blue-600 mb-1 truncate"><FaLink className="mr-2 text-base" /><a href={`https://${githubMatch[0]}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{githubMatch[0]}</a></p>}
                {cleanedText.trim().length > 0 && (
                    <p className="mt-2 text-gray-600 line-clamp-3"> {/* line-clamp to truncate long parsed text */}
                        <span className="font-semibold text-gray-700">Raw Data:</span> {cleanedText.trim()}
                    </p>
                )}
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Navbar (Copied for consistency) */}
            <Navbar />

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center animate-fadeIn pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-purple-500 after:rounded-full">
                    Uploaded Resumes
                </h2>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading resumes...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-600 text-lg font-semibold">
                        <p>{error}</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md p-8">
                        <p className="text-gray-600 text-xl mb-4">
                            No resumes have been uploaded yet.
                        </p>
                        <Link to="/upload" className="text-blue-600 hover:underline font-medium">
                            Upload one now!
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 animate-fadeInUp"> {/* Using 2 columns for wider content */}
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                                        <FaFileAlt className="text-blue-500 mr-3 text-xl" /> Resume ID: {resume.id}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-purple-400" /> Uploaded At: {new Date(resume.uploaded_at).toLocaleDateString()}
                                    </p>
                                    
                                    {/* Structured display of parsed text elements */}
                                    {renderParsedText(resume.parsed_text)}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                                    {/* Assuming 'resume.file_url' or similar exists for viewing the original file */}
                                    {/* Replace '#' with actual file URL from your backend */}
                                    <a 
                                        href={resume.file_url || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center"
                                    >
                                        View File
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default ResumeList;