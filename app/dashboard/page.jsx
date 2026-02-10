"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data } = await supabase.from("invoices").select("*");
      setInvoices(data || []);
    };
    fetchInvoices();
  }, []);

  // Prepare chart data
  const monthlyRevenue = invoices.reduce((acc, inv) => {
    const month = new Date(inv.created_at).getMonth();
    acc[month] = (acc[month] || 0) + (inv.subtotal || 0);
    return acc;
  }, {});

  const revenueLabels = [...Array(12).keys()].map((m) => `Month ${m + 1}`);
  const revenueData = revenueLabels.map((_, i) => monthlyRevenue[i] || 0);

  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const unpaidInvoices = invoices.length - paidInvoices;

  const barData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        backgroundColor: "#3b82f6", // indigo
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        label: "Invoices Status",
        data: [paidInvoices, unpaidInvoices],
        backgroundColor: ["#10b981", "#ef4444"], // green & red
      },
    ],
  };

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
          <span className="text-gray-500 mb-2">Total Invoices</span>
          <span className="text-2xl font-bold text-indigo-600">{invoices.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
          <span className="text-gray-500 mb-2">Paid</span>
          <span className="text-2xl font-bold text-green-600">{paidInvoices}</span>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
          <span className="text-gray-500 mb-2">Unpaid</span>
          <span className="text-2xl font-bold text-red-600">{unpaidInvoices}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
  <h2 className="text-lg font-semibold mb-4 text-gray-700">Revenue by Month</h2>
  <div className="h-64 md:h-80">
    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
  </div>
</div>

<div className="bg-white rounded-xl shadow-lg p-6">
  <h2 className="text-lg font-semibold mb-4 text-gray-700">Invoices Status</h2>
  <div className="h-64 md:h-80">
    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
</div>

      </div>

      {/* Actions */}
      <div>
        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
          Create New Invoice
        </button>
        <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition ml-4">
          Go to Invoices List
        </button>
      </div>
    </main>
  );
}
