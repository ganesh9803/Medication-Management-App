import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import API from '../services/authAPI';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else {
      const fetchProfile = async () => {
        try {
          const endpoint =
            role === 'PATIENT' ? '/patient/profile' : '/caretaker/profile';
          const res = await API.get(endpoint);
          setProfile(res.data);
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      };

      fetchProfile();
    }
  }, [token, role, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const currentPage =
    role === 'PATIENT'
      ? 'Patient Dashboard'
      : role === 'CARETAKER'
      ? 'Caretaker Dashboard'
      : '';

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-zinc-900 shadow px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-0">
      {/* Left section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-center sm:text-left w-full sm:w-auto">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <div className="bg-gradient-to-r from-blue-400 to-green-400 p-2 rounded-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-2.2 0-4 1.8-4 4v1H8c-.6 0-1 .4-1 1v1h10v-1c0-.6-.4-1-1-1h-1v-1c0-2.2-1.8-4-4-4z"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            MediCare Companion
          </span>
        </div>
        {currentPage && (
          <span className="text-sm text-gray-500 dark:text-gray-300 mt-1 sm:mt-0">
            {currentPage}
          </span>
        )}
      </div>

      {/* Right section */}
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
        {profile && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold">
              {getInitials(profile.user.name)}
            </div>
            <div className="text-center sm:text-right">
              <p className="font-semibold text-gray-800 dark:text-white">
                {profile.user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 hidden sm:block">
                {profile.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
