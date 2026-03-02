'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { OrderCard, OrderItem } from '@/components/OrderCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  items: OrderItem[];
  status: string;
}

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Link href="/cart">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              createdAt={order.created_at}
              totalPrice={order.total_price}
              items={order.items}
              status={order.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <OrdersContent />
    </ProtectedRoute>
  );
}
