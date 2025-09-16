import React from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductList() {
  const [products, setProducts] = React.useState([]);
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sort, setSort] = React.useState('createdAt_desc');
  const [msg, setMsg] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('');

  const { addToCart } = useCart();

  const [expandedId, setExpandedId] = React.useState(null);
  const [qty, setQty] = React.useState(1);
  const [feedback, setFeedback] = React.useState('');

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

  async function fetchFeedbackForProduct(productId) {
    try {
      const res = await axios.get((process.env.REACT_APP_API || '') + `/api/feedback?product=${productId}`);
      return res.data; // Array of feedback
    } catch (err) {
      console.error('Failed to fetch feedback for product', productId);
      return [];
    }
  }

  async function handleExpand(productId) {
    if (expandedId === productId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(productId);

    // Fetch feedback dynamically only when expanded
    const updatedProducts = [...products];
    const index = updatedProducts.findIndex((p) => p._id === productId);
    if (index !== -1 && !updatedProducts[index].feedbackLoaded) {
      updatedProducts[index].feedback = await fetchFeedbackForProduct(productId);
      updatedProducts[index].feedbackLoaded = true;
      setProducts(updatedProducts);
    }
  }

  function handleAdd(product) {
    addToCart(product, qty, feedback);
    setExpandedId(null);
    setQty(1);
    setFeedback('');
  }

  return (
    <div className="space-y-4">
      {/* 🔍 Search + Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
          placeholder="Search products..."
          className="border p-2 rounded flex-1"
        />

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

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="createdAt_desc">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button
          onClick={fetchProducts}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {msg && <p className="text-red-500">{msg}</p>}

      {/* 🛒 Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const isExpanded = expandedId === p._id;
          return (
            <div
              key={p._id}
              className={`border rounded p-4 shadow hover:shadow-lg transform transition-all duration-300 ${
                isExpanded ? 'bg-green-50 scale-[1.02]' : 'bg-white'
              }`}
            >
              <img
                src={p.imageUrl || '/placeholder.jpg'}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-sm text-gray-600">
                {p.category?.name || 'Uncategorized'}
              </p>
              <p className="text-green-700 font-semibold">₹{p.price}</p>

              {!isExpanded && (
                <button
                  onClick={() => handleExpand(p._id)}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              )}

              {/* Expanded Controls */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
              >
                {/* Quantity + Feedback Input */}
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border p-2 w-full rounded mb-2"
                  placeholder="Quantity"
                />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="border p-2 w-full rounded mb-3"
                  placeholder="Leave feedback (optional)"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(p);
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Confirm Add
                </button>

                {/* Show Existing Feedback */}
                {p.feedback && p.feedback.length > 0 && (
                  <div className="mt-4 border-t pt-2 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Customer Reviews:
                    </h4>
                    {p.feedback.map((f) => (
                      <div key={f._id} className="text-sm text-gray-600 border-b pb-1">
                        <strong>{f.customer?.name || 'Anonymous'}:</strong> {f.message}
                      </div>
                    ))}
                  </div>
                )}
                {p.feedbackLoaded && (!p.feedback || p.feedback.length === 0) && (
                  <p className="text-gray-400 text-sm mt-2">
                    No feedback for this product yet.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 📄 Pagination */}
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
