import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function ProtectedLayout({ allowedRole }) {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Not authenticated
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Authenticated but wrong role
  if (role !== allowedRole) {
    const redirectPath = role === 'PATIENT' ? '/patient' : '/caretaker';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
