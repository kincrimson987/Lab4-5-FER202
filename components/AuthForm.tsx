'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = mode === 'login' 
        ? await login(email, password)
        : await register(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect after successful auth
        router.push(mode === 'login' ? '/cart' : '/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
          <p className="text-sm text-gray-600">
            {mode === 'login' ? (
              <>Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a></>
            ) : (
              <>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign in</a></>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
