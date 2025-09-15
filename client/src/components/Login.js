import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async () => {
    if (!email || !password) return setMsg('Email and password are required');
    setLoading(true);
    try {
      const res = await axios.post((process.env.REACT_APP_API || '') + '/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'farmer') navigate('/farmer');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'delivery') navigate('/delivery');
      else navigate('/products');

    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async () => {
    const { name, email, password, role } = signupData;
    if (!name || !email || !password) return setMsg('All signup fields are required');
    setLoading(true);
    try {
      const res = await axios.post((process.env.REACT_APP_API || '') + '/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect after signup
      switch (res.data.user.role) {
        case 'farmer': navigate('/farmer'); break;
        case 'delivery': navigate('/delivery'); break;
        case 'admin': navigate('/admin'); break;
        default: navigate('/products');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      {!showSignup ? (
        <>
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Login to manage your account</p>

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-3 mb-3 rounded"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-3 mb-3 rounded"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg font-semibold shadow"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-4 text-center text-gray-500">
            Don't have an account?{' '}
            <span
              onClick={() => { setShowSignup(true); setMsg(''); }}
              className="text-green-600 font-semibold cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">Sign Up</h2>

          <input
            value={signupData.name}
            onChange={e => setSignupData({ ...signupData, name: e.target.value })}
            className="w-full border p-3 mb-3 rounded"
            placeholder="Full Name"
          />
          <input
            value={signupData.email}
            onChange={e => setSignupData({ ...signupData, email: e.target.value })}
            className="w-full border p-3 mb-3 rounded"
            placeholder="Email"
          />
          <input
            type="password"
            value={signupData.password}
            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
            className="w-full border p-3 mb-3 rounded"
            placeholder="Password"
          />
          <select
            value={signupData.role}
            onChange={e => setSignupData({ ...signupData, role: e.target.value })}
            className="w-full border p-3 mb-3 rounded"
          >
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
            <option value="delivery">Delivery</option>
          </select>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg font-semibold shadow"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p className="mt-4 text-center text-gray-500">
            Already have an account?{' '}
            <span
              onClick={() => { setShowSignup(false); setMsg(''); }}
              className="text-green-600 font-semibold cursor-pointer"
            >
              Login
            </span>
          </p>
        </>
      )}

      {msg && <div className="text-red-500 mt-3">{msg}</div>}
    </div>
  );
}
