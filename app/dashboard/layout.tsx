// app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar'; // your existing sidebar
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/auth");
}
    
  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-64 bg-white shadow-md">
      <Sidebar />
    </div>
      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
