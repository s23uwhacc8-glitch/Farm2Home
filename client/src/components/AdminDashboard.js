import React from 'react';
import axios from 'axios';

export default function AdminDashboard(){
  const [users,setUsers]=React.useState([]);
  const [orders,setOrders]=React.useState([]);

  React.useEffect(()=>{ fetchUsers(); fetchOrders(); },[]);

  async function fetchUsers(){
    try{ const token = localStorage.getItem('token'); const res = await axios.get((process.env.REACT_APP_API || '') + '/api/users', {headers:{Authorization:'Bearer '+token}}); setUsers(res.data); }catch(err){ console.error(err); }
  }
  async function fetchOrders(){
    try{ const token = localStorage.getItem('token'); const res = await axios.get((process.env.REACT_APP_API || '') + '/api/orders', {headers:{Authorization:'Bearer '+token}}); setOrders(res.data); }catch(err){ console.error(err); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Users</h3>
        <ul className="space-y-2">{users.map(u=> <li key={u._id} className="border p-2 rounded">{u.name} ({u.email}) - {u.role}</li>)}</ul>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">All Orders</h3>
        <ul className="space-y-2">{orders.map(o=> <li key={o._id} className="border p-2 rounded">{o.product?.name} | Qty: {o.qty} | Status: {o.status}</li>)}</ul>
      </div>
    </div>
  );
}
