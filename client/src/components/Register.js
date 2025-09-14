import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=React.useState('');
  const [email,setEmail]=React.useState('');
  const [password,setPassword]=React.useState('');
  const [role,setRole]=React.useState('customer');
  const [msg,setMsg]=React.useState('');
  const navigate = useNavigate();

  async function handleRegister(){
    try{
      const res = await axios.post((process.env.REACT_APP_API || '') + '/api/auth/register', {name,email,password,role});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/products');
    }catch(err){ setMsg(err.response?.data?.message || 'Registration failed'); }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-green-700 mb-4">Create account</h2>
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-3 mb-3 rounded" placeholder="Full name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-3 mb-3 rounded" placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-3 mb-3 rounded" placeholder="Password" />
      <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-3 mb-3 rounded">
        <option value="customer">Customer</option>
        <option value="farmer">Farmer</option>
        <option value="delivery">Delivery</option>
      </select>
      <button onClick={handleRegister} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white p-3 rounded-lg font-semibold shadow">Register</button>
      {msg && <div className="text-red-500 mt-3">{msg}</div>}
    </div>
  );
}
