'use client';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { FaHome, FaFileInvoice, FaChartPie, FaUserCircle, FaPlus, FaClock } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock data (replace with Supabase queries later)
const metrics = {
  totalHours: 120,
  totalRevenue: 3500,
  outstandingInvoices: 4,
  paidInvoices: 10
};

const revenueData = [
  { day: 'Mon', revenue: 200 },
  { day: 'Tue', revenue: 300 },
  { day: 'Wed', revenue: 250 },
  { day: 'Thu', revenue: 400 },
  { day: 'Fri', revenue: 500 },
  { day: 'Sat', revenue: 350 },
  { day: 'Sun', revenue: 450 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 10 },
  { name: 'Outstanding', value: 4 },
  { name: 'Overdue', value: 2 },
];

const recentInvoices = [
  { project: 'Website Redesign', client: 'Acme Corp', hours: 15, amount: 1500, status: 'Paid' },
  { project: 'SEO Optimization', client: 'Beta LLC', hours: 8, amount: 800, status: 'Outstanding' },
  { project: 'Logo Design', client: 'Gamma Inc', hours: 5, amount: 500, status: 'Paid' },
  { project: 'Landing Page', client: 'Delta Ltd', hours: 10, amount: 1000, status: 'Overdue' },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // green, yellow, red

export default function Dashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome, User</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
              USER
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold">{metrics.totalHours}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-500">Outstanding Invoices</p>
              <p className="text-2xl font-bold">{metrics.outstandingInvoices}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-500">Paid Invoices</p>
              <p className="text-2xl font-bold">{metrics.paidInvoices}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-2">Revenue Over Time</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-2">Invoice Status</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
              <FaPlus /> Create Invoice
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FaClock /> Start Timer
            </button>
          </div>

          {/* Recent Invoices Table */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Recent Invoices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">Client</th>
                    <th className="px-4 py-2">Hours</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentInvoices.map((inv, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{inv.project}</td>
                      <td className="px-4 py-2">{inv.client}</td>
                      <td className="px-4 py-2">{inv.hours}</td>
                      <td className="px-4 py-2">${inv.amount}</td>
                      <td className={`px-4 py-2 font-semibold ${
                        inv.status === 'Paid' ? 'text-green-600' :
                        inv.status === 'Outstanding' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {inv.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
