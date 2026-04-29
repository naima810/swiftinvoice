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
    <div className="flex min-w-full bg-gray-50">
      
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 p-6 w-full">
        {children}
      </main>
    </div>
  );
}
