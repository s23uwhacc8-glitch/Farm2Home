import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function handleCheckout() {
    alert('Redirecting to payment gateway... (Stripe/Razorpay integration placeholder)');
    // ✅ Later you will integrate Stripe/Razorpay here
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="border p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={item.imageUrl || '/placeholder.jpg'}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">₹{item.price} per item</p>

                    {/* Editable Quantity */}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm font-medium">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                        className="border rounded p-1 w-16 text-center"
                      />
                      <span className="text-gray-700 text-sm">
                        Total: ₹{item.price * item.qty}
                      </span>
                    </div>

                    {/* Show Feedback if Provided */}
                    {item.feedback && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        “{item.feedback}”
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Total + Actions */}
          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-xl font-bold">
              Total: <span className="text-green-700">₹{total}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow transition"
              >
                Proceed to Payment
              </button>
              <button
                onClick={clearCart}
                className="border px-6 py-2 rounded hover:bg-gray-100"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
