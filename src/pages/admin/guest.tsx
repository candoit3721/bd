import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function GuestRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if no specific guest ID is provided
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="sr-only">Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
