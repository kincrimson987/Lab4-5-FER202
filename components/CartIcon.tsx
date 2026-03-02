"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative">
      <div className="flex items-center gap-2">
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}
