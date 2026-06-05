"use client";
import React from "react";  
import { LucideCalculator, LucideCalendarClock, LucideCalendarCheck2, LucideCalendarX2  } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import InvoicePieChart from "@/components/InvoicePieChart";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const invoices = [
    { id: 'INV-001', client: 'Acme Corp', amount: "$500", due: '2026-03-01', status: 'Paid' },
    { id: 'INV-002', client: 'Beta LLC', amount: "$1200", due: '2026-03-05', status: 'Pending' },
    { id: 'INV-003', client: 'Gamma Inc', amount: "$800", due: '2026-03-02', status: 'Overdue' },
    { id: 'INV-004', client: 'Delta Co', amount: "$300", due: '2026-03-10', status: 'Paid' },
    { id: 'INV-005', client: 'Epsilon Ltd', amount: "$1500", due: '2026-03-15', status: 'Pending' },
];

  const clients = [
    { id: 'CLI-001', logo: '/logos/github.png', name: 'GitHub', amount: '$100,000' },
    { id: 'CLI-002', logo: '/logos/stripe.png', name: 'Stripe', amount: '$50,000' },
    { id: 'CLI-003', logo: '/logos/slack.png', name: 'Slack', amount: '$25,000' },
  ]
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push("/dashboard/invoices/new");
  }

  return (
    <div>
      <div className="text-3xl font-bold text-black justify-between items-center flex flex-row gap-2">
        <p>Dashboard</p>
        <div className="bg-teal-700 text-white mt-2 border rounded-full px-2 py-1">N</div>
      </div>
       {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-row justify-between items-center">
          <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Total Invoices</span>
          <span className="text-2xl font-bold">25</span>
          <span className=" text-sm mt-1"><span className="text-green-500">+5% </span>from last month</span>
          </div>
          <LucideCalculator className="text-gray-400 mt-2 text-teal-700" size={40} />
        </div>
        <div className="p-4 rounded-lg shadow flex flex-row justify-between items-center">
          <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Paid Invoices</span>
          <span className="text-2xl font-bold text-green-700">10</span>
          <span className="text-sm mt-1"><span className="text-green-500">+10% </span>from last month</span>
          </div>
          <LucideCalendarCheck2 className="text-gray-400 mt-2 text-green-700" size={40} />
        </div>
        <div className="p-4 rounded-lg shadow flex flex-row justify-between items-center">
          <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Unpaid Invoices</span>
          <span className="text-2xl font-bold text-yellow-700">8</span>
          <span className="text-sm mt-1"><span className="text-yellow-500">+2% </span>from last month</span>
          </div>
          <LucideCalendarClock className="text-gray-400 mt-2 text-yellow-700" size={40} />
        </div>
        <div className="p-4 rounded-lg shadow flex flex-row justify-between items-center">
          <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Overdue Invoices</span>
          <span className="text-2xl font-bold text-red-700">7</span>
          <span className="text-sm mt-1"><span className="text-red-500">+5% </span>from last month</span>
          </div>
          <LucideCalendarX2 className="text-gray-400 mt-2 text-red-700" size={40} />
        </div>
      </div>
      <div className="p-6 flex flex-col md:flex-row gap-6 justify-center items-center">
        <button className="bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-teal-800 transition text-nowrap" onClick={handleCreateInvoice}>Create New Invoice</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition text-nowrap">Setup Company Profile</button>
      </div>
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
{/* 
  <div className="xl:col-span-2 bg-white p-5 rounded-2xl shadow-sm">
    <RevenueChart />
  </div>

  <div className="bg-white p-5 rounded-2xl shadow-sm">
    <InvoicePieChart />
  </div> */}

</div>
    <main className="flex flex-col fkex-col md:flex-row gap-6 mt-6">
      {/* Recent Invoices */}
      <div className="flex-1 flex flex-col bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex flex-row justify-between items-center">
          <p className="font-bold">Recent Invoices</p>
          <a href="#" className="text-sm text-teal-700 hover:underline">View All</a>
        </div>
        <table className="w-full mt-4">
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-200">
                <td className="py-2 font-bold">{invoice.id}</td>
                <td className="py-2">{invoice.client}</td>
                <td className="py-2">{invoice.amount}</td>
                <td className="py-2 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full text-center ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>  
      {/* Top Clients */}
      <div className="flex-1 flex flex-col bg-white p-5 rounded-2xl shadow-sm"> 
        <div className="flex flex-row justify-between items-center">
          <p className="font-bold">Top Clients</p>
          <a href="#" className="text-sm text-teal-700 hover:underline">View all</a>
        </div>
        <table className="w-full mt-4">
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="flex flex-row justify-between border-b border-gray-200">
                <td className="py-2"><Image src={client.logo} alt={client.name} width={30} height={30} /></td>
                <td className="py-2 font-bold">{client.name}</td>
                <td className="py-2">{client.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
    </div>
  )
};