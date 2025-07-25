import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding, FaCodeBranch } from 'react-icons/fa'; // Importing icons

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get('http://127.0.0.1:8000/api/jobs/');
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Failed to load jobs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills_required.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) || // Added location to search
        (job.job_type && job.job_type.toLowerCase().includes(searchQuery.toLowerCase())) // Added job_type to search
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Navbar - Minor text & hover improvements */}
            <Navbar />

            {/* Hero Section - Refined subtitle and search placeholder */}
            <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-6 text-center shadow-inner"> {/* Slightly darker gradient */}
                <div className="container mx-auto">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fadeInDown">
                        Your Next <span className="text-yellow-300">Big Opportunity</span> Awaits.
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fadeInUp delay-200">
                        Intelligent matching for faster, smarter career moves.
                    </p>

                    {/* Search Bar - Refined placeholder and button hover */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Find jobs by title, skills, location, or company..." // More descriptive placeholder
                            className="w-full py-4 pl-6 pr-16 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 text-lg text-gray-800 placeholder-gray-500 transition duration-300 transform hover:scale-105"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md transition duration-300 transform hover:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12">
                {/* Heading - Increased bottom margin, subtle shadow */}
                <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center animate-fadeIn pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-blue-500 after:rounded-full">
                    Available Jobs
                </h2>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading jobs...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-600 text-lg font-semibold">
                        <p>{error}</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md p-8">
                        <p className="text-gray-600 text-xl mb-4">
                            No jobs found matching your criteria.
                        </p>
                        {searchQuery && (
                            <p className="text-gray-500">Try adjusting your search: <span className="font-semibold italic">"{searchQuery}"</span></p>
                        )}
                        {!searchQuery && (
                            <p className="text-gray-500">Check back soon, new opportunities are posted daily!</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeInUp"> {/* Increased gap */}
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 flex flex-col justify-between cursor-pointer" // Added cursor-pointer
                                // Consider adding onClick={() => navigate(`/jobs/${job.id}`)} for detail page
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight flex items-center">
                                        <FaBriefcase className="text-purple-500 mr-3 text-xl" /> {/* Job Title Icon */}
                                        {job.title}
                                    </h3>
                                    {/* Company Name - styled to be less stark when not provided */}
                                    <p className="text-gray-600 text-base mb-3 flex items-center">
                                        <FaBuilding className="text-gray-400 mr-2" />
                                        {job.company_name ? (
                                            <span className="font-medium">{job.company_name}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">Company Not Provided</span>
                                        )}
                                    </p>

                                    {/* Placeholder for Location, Salary, Job Type (assuming you might get these from Adzuna API later) */}
                                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                                        {job.location && ( // Render only if location exists
                                            <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-400" /> {job.location}</p>
                                        )}
                                        {job.salary_range && ( // Render only if salary_range exists
                                            <p className="flex items-center"><FaMoneyBillWave className="mr-2 text-green-500" /> {job.salary_range}</p>
                                        )}
                                        {job.job_type && ( // Render only if job_type exists (e.g., 'Full-time', 'Remote')
                                            <p className="flex items-center"><FaCodeBranch className="mr-2 text-orange-400" /> {job.job_type}</p>
                                        )}
                                    </div>

                                    {/* Description - Use line-clamp for neat truncation */}
                                    <p className="text-gray-700 text-base line-clamp-3 mb-4">
                                        {job.description}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        <span className="font-semibold text-gray-700">Skills:</span> {job.skills_required || 'N/A'}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center">
                                        View Details
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Optional Footer */}
            <footer className="bg-gray-800 text-white text-center p-6 mt-12">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} JobFinder Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default JobList;