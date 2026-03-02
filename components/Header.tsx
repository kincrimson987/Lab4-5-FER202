'use client';

import { useAuth } from '@/context/AuthContext';
import CartIcon from '@/components/CartIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex justify-between items-center mb-6 border-b pb-4">
      <h1 className="text-2xl font-bold">Shop</h1>
      <div className="flex items-center gap-4">
        <CartIcon />
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-gray-600">Logged in as:</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <Link href="/orders">
              <Button variant="outline" size="sm">
                Orders
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
