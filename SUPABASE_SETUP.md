# Supabase Setup Guide

This document explains how to set up Supabase for the Shopping Cart application with user authentication and order persistence.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click "New Project" and fill in the form:
   - **Project name**: Choose any name (e.g., "shopping-cart")
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose a region closest to you
3. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Credentials

1. Go to your project's **Settings** → **API**
2. Copy these two values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Update Environment Variables

Open `.env.local` in your project and update:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholders with your actual credentials from Step 2.

## Step 4: Create the Orders Table

In your Supabase project:

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and run this SQL:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_price DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
```

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. (Optional) Configure email templates under **Email Templates** if desired

## Step 6: Test the Application

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Test the flow:
   - Browse products (no login required)
   - Add items to cart
   - Click "Proceed to Checkout"
   - You should be redirected to login
   - Create a new account with an email and password
   - You'll be logged in and can try checkout again
   - Your order should appear in the Order History page

## Troubleshooting

### "Module not found: 'supabase'" 
Make sure you've run `npm install @supabase/supabase-js`

### "Missing environment variables"
Ensure `.env.local` is in your project root with both variables set correctly.

### Orders not showing up
1. Check that the `orders` table was created successfully in Supabase
2. Verify RLS policies are enabled
3. Check the Supabase logs under **Logs** → **Auth** or **Database**

### Authentication not working
1. Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
2. Check Supabase **Auth** → **Users** to see if accounts are being created
3. Look at browser console for detailed error messages

## API Reference: Key Functions

### AuthContext (`useAuth()`)
```tsx
const { user, session, loading, login, register, logout } = useAuth();

// Login with email and password
const result = await login(email, password);
if (result.error) console.error(result.error);

// Register new account
const result = await register(email, password);

// Logout
await logout();
```

### Creating Orders
Orders are automatically created when users checkout. The order data structure:

```typescript
interface Order {
  user_id: string;        // From authenticated user
  total_price: number;    // Total amount
  items: OrderItem[];     // Array of items in order
  status: string;         // 'pending', 'completed', etc.
  created_at: string;     // Timestamp
}

interface OrderItem {
  name: string;          // Product name
  quantity: number;      // Quantity ordered
  price: string;         // Price (as string with $ symbol)
}
```

## Next Steps (Optional Enhancements)

1. **Email Verification**: Configure email confirmation before users can login
2. **Order Status Updates**: Add a dashboard to manage order statuses
3. **Payment Integration**: Add Stripe/PayPal for real transactions
4. **User Profiles**: Store additional user information (name, address, etc.)
5. **Order Notifications**: Send email confirmations when orders are placed

## Security Notes

- `.env.local` contains sensitive data—never commit it to git
- The `NEXT_PUBLIC_` prefix means these variables are visible to the client
- For secret keys, use environment variables without the `NEXT_PUBLIC_` prefix
- RLS policies ensure users can only access their own orders
