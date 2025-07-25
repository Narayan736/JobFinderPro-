import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api'; // Your Axios instance
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            // Adjust endpoint based on your Django backend's registration URL (e.g., 'users/' for djoser, or 'auth/users/' for djoser-rest)
            const response = await API.post('auth/users/', { // <-- CORRECTED URL for Djoser registration
            username,
            email,
            password,
            });

            setSuccessMessage('Registration successful! You can now log in.');
            // Clear form fields
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // Optionally redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            // Handle specific backend errors (e.g., email already exists)
            let errorMessage = 'Registration failed. Please try again.';
            if (err.response?.data) {
                if (err.response.data.email) {
                    errorMessage = err.response.data.email[0];
                } else if (err.response.data.username) {
                    errorMessage = err.response.data.username[0];
                } else if (err.response.data.password) {
                    errorMessage = err.response.data.password[0];
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Navbar (reused for consistency) */}
            <nav className="bg-gradient-to-r from-purple-700 to-blue-700 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white text-3xl font-extrabold tracking-tight">
                        JobFinder <span className="text-blue-300">Pro</span>
                    </Link>
                    <div className="space-x-6">
                        <Link to="/upload" className="text-white font-medium hover:text-blue-200 transition duration-300">Upload Resume</Link>
                        <Link to="/post-job" className="text-white font-medium hover:text-blue-200 transition duration-300">Post Job</Link>
                        <Link to="/resumes" className="text-white font-medium hover:text-blue-200 transition duration-300">Resumes</Link>
                        {/* Add conditional rendering for Login/Register vs. Logout here later */}
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Register Form */}
            <main className="container mx-auto px-4 py-12 flex justify-center items-center">
                <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 max-w-lg w-full border border-gray-100 animate-fadeInUp">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                        <span className="text-purple-600">Create</span> Your Account
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Join our community to discover new opportunities.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaUser className="mr-2 text-blue-500" /> Username:
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaEnvelope className="mr-2 text-purple-500" /> Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaLock className="mr-2 text-green-500" /> Password:
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaLock className="mr-2 text-red-500" /> Confirm Password:
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
                                required
                            />
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative w-full flex items-center justify-center">
                                <FaExclamationCircle className="mr-2 text-xl" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative w-full flex items-center justify-center">
                                <FaCheckCircle className="mr-2 text-xl" />
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-xl transition duration-300 ease-in-out shadow-lg flex items-center justify-center
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-3" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="mr-3" />
                                    Register
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-lg">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login Here</Link>
                    </p>
                </div>
            </main>

            {/* Footer (reused for consistency) */}
            <footer className="bg-gray-800 text-white text-center p-6 mt-12">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} JobFinder Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default RegisterPage;