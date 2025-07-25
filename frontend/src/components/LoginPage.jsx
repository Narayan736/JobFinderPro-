import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api'; // Your Axios instance
import { FaSignInAlt, FaEnvelope, FaLock, FaSpinner, FaExclamationCircle } from 'react-icons/fa'; // Icons

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For programmatic navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Adjust endpoint based on your Django backend's login URL (e.g., 'auth/jwt/create/' for djoser-jwt)
            const response = await API.post('auth/jwt/create/', { // <-- This should be correct
            email, // Or 'username'
            password,
            });

            const { access, refresh } = response.data; // Assuming your backend returns access and refresh tokens

            // Store tokens (localStorage is common for JWT)
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // You might want to fetch user data or update a global auth state here
            // (We'll discuss global auth state with Context API later)

            navigate('/'); // Redirect to home page or dashboard on successful login

        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
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

            {/* Main Content Area - Login Form */}
            <main className="container mx-auto px-4 py-12 flex justify-center items-center">
                <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 max-w-lg w-full border border-gray-100 animate-fadeInUp">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                        <span className="text-blue-600">Login</span> to Your Account
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Access your personalized job matches and dashboard.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email/Username */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
                                <FaEnvelope className="mr-2 text-purple-500" /> Email:
                            </label>
                            <input
                                id="email"
                                type="email" // Or "text" if using username
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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative w-full flex items-center justify-center">
                                <FaExclamationCircle className="mr-2 text-xl" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-xl transition duration-300 ease-in-out shadow-lg flex items-center justify-center
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-3" />
                                    Logging In...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className="mr-3" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-lg">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register Here</Link>
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

export default LoginPage;