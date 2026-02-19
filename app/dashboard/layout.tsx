// app/dashboard/layout.tsx
'use client';

import React from 'react';
import Sidebar from '@/Components/Sidebar'; // your existing sidebar
import { useUser } from '@/lib/UserContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useUser();
  const router = useRouter();

  // While loading session
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // If user is not logged in, redirect
  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} logout={logout} />

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
