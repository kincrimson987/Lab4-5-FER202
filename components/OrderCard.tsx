'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderCardProps {
  id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
  status: string;
}

export const OrderCard = ({ id, createdAt, totalPrice, items, status }: OrderCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Order #{id.slice(0, 8)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">
              Date: {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Status: {status}</p>
          </div>
          <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Items:</h4>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-sm flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
