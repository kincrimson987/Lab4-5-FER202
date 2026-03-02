"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems } =
    useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const calculateSubtotal = (price: string, quantity: number) => {
    const numPrice = parseFloat(price.replace("$", ""));
    return (numPrice * quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const numPrice = parseFloat(item.price.replace("$", ""));
        return sum + numPrice * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    // If not authenticated, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);
    setError("");

    try {
      // Create order in Supabase
      const orderData = {
        user_id: user.id,
        total_price: parseFloat(calculateTotal()),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        status: "pending"
      };

      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([orderData])
        .select();

      if (insertError) throw insertError;

      // Clear cart on successful order
      clearCart();

      // Redirect to orders page
      router.push("/orders");
    } catch (err) {
      // Log full error for debugging and surface JSON to UI
      console.error('Checkout error:', err);
      try {
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      } catch (e) {
        setError('Checkout failed');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Header />
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                      <p className="text-blue-600 font-semibold">Price: {item.price}</p>
                      <p className="text-gray-600 mt-1">
                        Subtotal: ${calculateSubtotal(item.price, item.quantity)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-12 text-center border-none outline-none"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                </div>

                <div className="text-lg font-bold mb-4">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="text-blue-600">${calculateTotal()}</span>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {!user && (
                  <p className="text-sm text-gray-600 mb-4 p-2 bg-blue-50 rounded">
                    Sign in to complete your purchase
                  </p>
                )}

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cartItems.length === 0}
                  >
                    {isCheckingOut ? "Processing..." : !user ? "Sign in to Checkout" : "Proceed to Checkout"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => clearCart()}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
