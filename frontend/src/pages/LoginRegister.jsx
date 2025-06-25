import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginOrRegister } from '../features/auth/authSlice';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT', // Default role
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const resultAction = await dispatch(loginOrRegister({ isLogin, form }));

      if (loginOrRegister.fulfilled.match(resultAction)) {
        const userRole = resultAction.payload.role;
        if (userRole === 'PATIENT') {
          navigate('/patient');
        } else if (userRole === 'CARETAKER') {
          navigate('/caretaker');
        }
      }
    } catch (err) {
      console.error('Login/Register error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-400">MediCare Companion</h2>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login to Account' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-2 mb-3 border rounded"
              value={form.name}
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full p-2 mb-3 border rounded"
              value={form.role}
              onChange={handleChange}
            >
              <option value="PATIENT">Patient</option>
              <option value="CARETAKER">Caretaker</option>
            </select>
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded mb-3"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 cursor-pointer font-medium"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
