import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const closeDropdown = () => setIsOpen(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between flex-wrap">
      {/* Left: Logo + Dropdown */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-blue-600">JobFinder</Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
          >
            <span>Menu</span>
            <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={18} />
          </button>

          {/* Dropdown content */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 animate-fade-in-down">
              <Link to="/" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Home</Link>
              <Link to="/upload-resume" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Upload Resume</Link>
              <Link to="/post-job" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Post Job</Link>
              <Link to="/resumes" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Resume List</Link>
              <Link to="/match-resumes" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Match Resumes</Link>
              <Link to="/job-match" onClick={closeDropdown} className="block px-4 py-2 hover:bg-gray-100">Job Match</Link>
            </div>
          )}
        </div>
      </div>

      {/* Right: Admin/User Panel */}
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">Admin Panel</Link>
        <Link to="/user" className="text-gray-700 hover:text-blue-600 transition">User Panel</Link>
      </div>
    </nav>
  );
}
