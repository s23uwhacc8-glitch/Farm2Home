import React from 'react';
import axios from 'axios';

export default function DeliveryDashboard(){
  const [orders,setOrders]=React.useState([]);

  React.useEffect(()=>{ fetchOrders(); },[]);

  async function fetchOrders(){
    try{ const token = localStorage.getItem('token'); const res = await axios.get((process.env.REACT_APP_API || '') + '/api/orders/delivery', {headers:{Authorization:'Bearer '+token}}); setOrders(res.data); }catch(err){ console.error(err); }
  }

  async function updateStatus(id, status){
    try{ const token = localStorage.getItem('token'); await axios.put((process.env.REACT_APP_API || '') + '/api/orders/' + id + '/status', {status}, {headers:{Authorization:'Bearer '+token}}); fetchOrders(); }catch(err){ console.error(err); }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-green-700 mb-3">Delivery Orders</h3>
      <ul className="space-y-2">
        {orders.map(o=> <li key={o._id} className="border p-2 rounded flex justify-between items-center">
          <div><strong>{o.product?.name}</strong> | Qty: {o.qty} <div className="text-sm">Customer: {o.customer?.name}</div></div>
          <div className="flex gap-2">
            <button onClick={()=>updateStatus(o._id,'Dispatched')} className="bg-yellow-500 text-white px-2 py-1 rounded">Dispatch</button>
            <button onClick={()=>updateStatus(o._id,'Delivered')} className="bg-green-600 text-white px-2 py-1 rounded">Delivered</button>
          </div>
        </li>)}
      </ul>
    </div>
  );
}
