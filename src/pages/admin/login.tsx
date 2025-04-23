import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check against environment variables
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // Set the session cookie
      document.cookie = 'admin-session=true; path=/';
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-party-cream flex items-center justify-center p-4">
      <Head>
        <title>Admin Login - Sophia's Birthday</title>
      </Head>

      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-party-purple"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-party-purple"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-party-purple text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}