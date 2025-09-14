import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Nav(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }
  return (
    <nav className="bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-green-700 font-extrabold text-2xl">Farm2Home</div>
          <div className="text-sm text-gray-600">Fresh from farms</div>
        </div>
        <div className="space-x-3 flex items-center">
          <Link to="/products" className="text-gray-700 hover:text-green-700">Products</Link>
          {user?.role==='farmer' && <Link to="/farmer" className="text-gray-700 hover:text-green-700">Farmer</Link>}
          {user?.role==='admin' && <Link to="/admin" className="text-gray-700 hover:text-green-700">Admin</Link>}
          {user?.role==='delivery' && <Link to="/delivery" className="text-gray-700 hover:text-green-700">Delivery</Link>}
          {token ? <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button> : <Link to="/" className="bg-green-600 text-white px-3 py-1 rounded">Login</Link>}
        </div>
      </div>
    </nav>
  );
}
