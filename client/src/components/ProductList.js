import React from 'react';
import axios from 'axios';

export default function ProductList(){
  const [products,setProducts]=React.useState([]);
  const [q,setQ]=React.useState('');
  const [page,setPage]=React.useState(1);
  const [totalPages,setTotalPages]=React.useState(1);
  const [sort,setSort]=React.useState('createdAt_desc');
  const [msg,setMsg]=React.useState('');

  React.useEffect(()=>{ fetchProducts(); },[page,sort]);

  async function fetchProducts(){
    try{
      const res = await axios.get((process.env.REACT_APP_API || '') + `/api/products?q=${q}&page=${page}&sort=${sort}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    }catch(err){ setMsg('Failed to load products'); }
  }

  function search(){ setPage(1); fetchProducts(); }

  async function placeOrder(productId){
    try{
      const token = localStorage.getItem('token');
      if(!token){ alert('Please login'); return; }
      const res = await axios.post((process.env.REACT_APP_API || '') + '/api/orders', {productId, qty:1}, {headers:{Authorization:'Bearer '+token}});
      alert('Order placed: ' + res.data._id);
      fetchProducts();
    }catch(err){ alert(err.response?.data?.message || 'Order failed'); }
  }

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border p-2 rounded flex-1" placeholder="Search products..." />
        <select value={sort} onChange={e=>{ setSort(e.target.value); setPage(1); }} className="border p-2 rounded">
          <option value="createdAt_desc">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button onClick={search} className="bg-green-600 text-white px-4 py-2 rounded">Search</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p=> (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            {p.imageUrl ? <img src={(process.env.REACT_APP_API || '') + p.imageUrl} className="h-40 w-full object-cover rounded" alt={p.name} /> : <div className="h-40 w-full bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">No Image</div>}
            <h3 className="font-bold mt-3">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-lg font-semibold">₹{p.price}</div>
              <button disabled={p.qty<=0} onClick={()=>placeOrder(p._id)} className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded">Order</button>
            </div>
            <div className="text-sm text-gray-500 mt-1">Stock: {p.qty} | Farmer: {p.farmer?.name}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 bg-white rounded shadow">Prev</button>
        <div className="px-3 py-1 bg-white rounded shadow">Page {page} / {totalPages}</div>
        <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 bg-white rounded shadow">Next</button>
      </div>
    </div>
  );
}
