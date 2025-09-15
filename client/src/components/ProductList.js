import React from 'react';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = React.useState([]);
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sort, setSort] = React.useState('createdAt_desc');
  const [msg, setMsg] = React.useState('');

  // ✅ New state for categories
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('');

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [page, sort, selectedCategory]);

  async function fetchProducts() {
    try {
      const res = await axios.get(
        (process.env.REACT_APP_API || '') +
          `/api/products?q=${q}&page=${page}&sort=${sort}${
            selectedCategory ? `&category=${selectedCategory}` : ''
          }`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setMsg('Failed to load products');
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get((process.env.REACT_APP_API || '') + '/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
          placeholder="Search products..."
          className="border p-2 rounded flex-1"
        />

        {/* ✅ Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Sort dropdown */}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded">
          <option value="createdAt_desc">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button onClick={fetchProducts} className="bg-green-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {msg && <p className="text-red-500">{msg}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-4 shadow hover:shadow-lg transition">
            <img src={p.imageUrl || '/placeholder.jpg'} alt={p.name} className="h-40 w-full object-cover rounded mb-2" />
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.category?.name || 'Uncategorized'}</p>
            <p className="text-green-700 font-semibold">₹{p.price}</p>
            <button className="mt-2 w-full bg-green-600 text-white py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
