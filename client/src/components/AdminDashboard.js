import React from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [feedback, setFeedback] = React.useState([]);
  const [filterRole, setFilterRole] = React.useState("all");
  const [profile, setProfile] = React.useState({ name: "", email: "" });

  const [editingProduct, setEditingProduct] = React.useState(null);
  const [categoryName, setCategoryName] = React.useState("");

  React.useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchFeedback();
    fetchProfile();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get((process.env.REACT_APP_API || "") + "/api/users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get((process.env.REACT_APP_API || "") + "/api/orders", {
        headers: { Authorization: "Bearer " + token },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProducts() {
    try {
      const res = await axios.get((process.env.REACT_APP_API || "") + "/api/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get((process.env.REACT_APP_API || "") + "/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchFeedback() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get((process.env.REACT_APP_API || "") + "/api/feedback", {
        headers: { Authorization: "Bearer " + token },
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setProfile({ name: user.name || "", email: user.email || "" });
  }

  async function updateProfile(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put((process.env.REACT_APP_API || "") + "/api/admin/profile", profile, {
        headers: { Authorization: "Bearer " + token },
      });
      alert("Profile updated");
    } catch (err) {
      alert("Failed to update profile");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete((process.env.REACT_APP_API || "") + "/api/users/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete");
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete((process.env.REACT_APP_API || "") + "/api/products/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  }

  async function saveEditedProduct() {
    try {
      const token = localStorage.getItem("token");
      await axios.put((process.env.REACT_APP_API || "") + "/api/products/" + editingProduct._id, editingProduct, {
        headers: { Authorization: "Bearer " + token },
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to update product");
    }
  }

  async function addCategory() {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        (process.env.REACT_APP_API || "") + "/api/categories",
        { name: categoryName },
        { headers: { Authorization: "Bearer " + token } }
      );
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      alert("Failed to add category");
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete((process.env.REACT_APP_API || "") + "/api/categories/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  }

  const filteredUsers = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.price || 0), 0);

  const chartData = {
    labels: orders.map((o) => o.product?.name),
    datasets: [
      {
        label: "Sales",
        data: orders.map((o) => o.qty),
        backgroundColor: "rgba(34,197,94,0.6)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Admin Profile</h3>
        <form onSubmit={updateProfile} className="space-y-3">
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Name"
          />
          <input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Update Profile</button>
        </form>
      </div>

      {/* Users Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-green-700">Manage Users</h3>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-1 rounded">
            <option value="all">All</option>
            <option value="customer">Customers</option>
            <option value="farmer">Farmers</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <button onClick={() => deleteUser(u._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Management */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Manage Categories</h3>
        <div className="flex gap-2 mb-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="New Category"
          />
          <button onClick={addCategory} className="bg-green-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c._id} className="border p-2 rounded flex justify-between items-center">
              {c.name}
              <button onClick={() => deleteCategory(c._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Products Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Manage Products</h3>
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p._id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <strong>{p.name}</strong> - ₹{p.price}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingProduct(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => deleteProduct(p._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-3">Edit Product</h3>
              <input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="border p-2 mb-2 w-full rounded"
                placeholder="Name"
              />
              <input
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                className="border p-2 mb-2 w-full rounded"
                placeholder="Price"
              />
              <button onClick={saveEditedProduct} className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setEditingProduct(null)} className="ml-2 px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sales Report with Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Sales Report</h3>
        <p>Total Orders: {orders.length}</p>
        <p>Total Revenue: ₹{totalRevenue}</p>
        <div className="h-64">
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-green-700 mb-3">Customer Feedback</h3>
        {feedback.length === 0 && <p className="text-gray-500">No feedback yet.</p>}
        <ul className="space-y-2">
          {feedback.map((f) => (
            <li key={f._id} className="border p-2 rounded">
              <strong>{f.customer?.name}</strong>: {f.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
