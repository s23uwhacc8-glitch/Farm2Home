import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=React.useState('customer@example.com');
  const [password,setPassword]=React.useState('password123');
  const [msg,setMsg]=React.useState('');
  const navigate = useNavigate();

  async function handleLogin(){
    try{
      const res = await axios.post((process.env.REACT_APP_API || '') + '/api/auth/login', {email,password});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if(role==='farmer') navigate('/farmer');
      else if(role==='admin') navigate('/admin');
      else if(role==='delivery') navigate('/delivery');
      else navigate('/products');
    }catch(err){ setMsg(err.response?.data?.message || 'Login failed'); }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-green-700 mb-4">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-6">Login to manage your account</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-3 mb-3 rounded" placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-3 mb-3 rounded" placeholder="Password" />
      <button onClick={handleLogin} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg font-semibold shadow">Login</button>
      {msg && <div className="text-red-500 mt-3">{msg}</div>}
    </div>
  );
}
