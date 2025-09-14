import React from 'react';
import axios from 'axios';

export default function FarmerDashboard(){
  const [products,setProducts]=React.useState([]);
  const [form,setForm]=React.useState({name:'',price:'',qty:'',description:'',image:null});

  React.useEffect(()=>{ fetchMyProducts(); },[]);

  async function fetchMyProducts(){
    try{
      const res = await axios.get((process.env.REACT_APP_API || '') + '/api/products');
      const user = JSON.parse(localStorage.getItem('user')||'null');
      const my = res.data.products ? res.data.products.filter(p=> p.farmer && p.farmer._id===user.id) : res.data.filter(p=> p.farmer && p.farmer._id===user.id);
      setProducts(my);
    }catch(err){ console.error(err); }
  }

  async function addProduct(e){
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', form.name); data.append('price', form.price); data.append('qty', form.qty); data.append('description', form.description);
      if(form.image) data.append('image', form.image);
      await axios.post((process.env.REACT_APP_API || '') + '/api/products', data, {headers:{Authorization:'Bearer '+token, 'Content-Type':'multipart/form-data'}});
      setForm({name:'',price:'',qty:'',description:'',image:null});
      fetchMyProducts();
    }catch(err){ alert('Failed to add'); }
  }

  async function deleteProduct(id){
    try{
      const token = localStorage.getItem('token');
      await axios.delete((process.env.REACT_APP_API || '') + '/api/products/' + id, {headers:{Authorization:'Bearer '+token}});
      fetchMyProducts();
    }catch(err){ alert('Delete failed'); }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Add Product</h3>
        <form onSubmit={addProduct} className="space-y-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-2 rounded" placeholder="Name" required />
          <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border p-2 rounded" placeholder="Price" required />
          <input value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})} className="w-full border p-2 rounded" placeholder="Quantity" required />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border p-2 rounded" placeholder="Description" />
          <input type="file" onChange={e=>setForm({...form,image:e.target.files[0]})} className="w-full" />
          <button type="submit" className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded">Add Product</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">My Products</h3>
        <div className="space-y-3">
          {products.map(p=> <div key={p._id} className="border p-3 rounded flex justify-between items-center">
            <div><strong>{p.name}</strong><div className="text-sm">₹{p.price} | Stock: {p.qty}</div></div>
            <div className="flex gap-2">
              <button onClick={()=>deleteProduct(p._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>)}
          {products.length===0 && <div className="text-gray-500">No products yet.</div>}
        </div>
      </div>
    </div>
  );
}
