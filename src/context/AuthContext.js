import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api'; // Your Axios instance, for potential token refresh or user data fetch

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Could store user object: { id, username, email }
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState(true); // To indicate if initial auth check is done

    // Function to check and update user status from token
    const checkAuthStatus = async () => {
        if (accessToken) {
            // In a real app, you'd verify the token or fetch user details
            // For simplicity, we'll just assume token presence means logged in for now
            // or you could make an API call to a /me endpoint if your backend provides one
            try {
                // Example: Fetch user info using the access token
                // const response = await API.get('auth/users/me/'); // Example djoser endpoint
                // setUser(response.data);
                setUser({ username: 'LoggedInUser', email: 'user@example.com' }); // Placeholder user
            } catch (error) {
                console.error("Failed to fetch user data or token invalid:", error);
                logout(); // Logout if token is invalid
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
    }, [accessToken]); // Re-check if access token changes

    const login = (newAccessToken, newRefreshToken) => {
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        // Immediately try to set user or fetch user data
        // checkAuthStatus(); // Call this to update user immediately
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    // You might also need a token refresh mechanism here
    // e.g., using useEffect to check token expiration and call API.post('auth/jwt/refresh/')

    const authContextValue = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user, // User is authenticated if both token and user object exist
        login,
        logout,
        loading, // Expose loading state
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading ? children : <div>Loading authentication...</div>} {/* Show loading until auth state is checked */}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};