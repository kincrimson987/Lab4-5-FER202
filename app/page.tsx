"use client";

import products from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="p-6">
      <Header />

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
