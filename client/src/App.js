import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import FarmerDashboard from './components/FarmerDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import Nav from './components/Nav';
import { CartProvider } from './context/CartContext'; // ✅ NEW
import CartPage from './components/CartPage'; // ✅ We'll create this next

function Protected({children}){
  const token = localStorage.getItem('token');
  if(!token) return <Navigate to='/' />;
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider> {/* ✅ Wrap everything so cart is global */}
        <Nav />
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Protected><ProductList /></Protected>} />
            <Route path="/cart" element={<Protected><CartPage /></Protected>} /> {/* ✅ New Route */}
            <Route path="/farmer" element={<Protected><FarmerDashboard /></Protected>} />
            <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
            <Route path="/delivery" element={<Protected><DeliveryDashboard /></Protected>} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
