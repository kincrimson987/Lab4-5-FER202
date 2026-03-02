"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col h-full">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg mb-3 h-40 object-cover"
        />
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2 flex-grow">{product.description}</p>
        <p className="text-blue-600 font-semibold mt-2">
          {product.price}
        </p>

        {/* Quantity Selector and Add to Cart */}
        <div className="flex gap-2 mt-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 px-2 py-2 border border-gray-300 rounded-md text-center"
          />
          <Button
            onClick={handleAddToCart}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}