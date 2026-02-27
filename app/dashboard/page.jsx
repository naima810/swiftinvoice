import React from "react";  

export default function DashboardPage() {
  const invoices = [
    { id: 'INV-001', client: 'Acme Corp', amount: 500, due: '2026-03-01', status: 'Paid' },
    { id: 'INV-002', client: 'Beta LLC', amount: 1200, due: '2026-03-05', status: 'Pending' },
    { id: 'INV-003', client: 'Gamma Inc', amount: 800, due: '2026-03-02', status: 'Overdue' },
];
  return (
    <div>
      <div className="text-3xl font-bold text-teal-700">Dashboard</div>
      <p className="mt-2 text-gray-600">Welcom back! Ready to create invoices?</p>
       {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500 text-sm">Total Invoices</span>
          <span className="text-2xl font-bold">25</span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500 text-sm">Paid</span>
          <span className="text-2xl font-bold text-green-700">10</span>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500 text-sm">Pending</span>
          <span className="text-2xl font-bold text-yellow-700">8</span>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow flex flex-col">
          <span className="text-gray-500 text-sm">Overdue</span>
          <span className="text-2xl font-bold text-red-700">7</span>
        </div>
      </div>
      {/*Quick Actions */}
      <div className="flex gap-3 mb-6">
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
          Create Invoice
        </button>
        <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">
          Add Company Info
        </button>
      </div>
      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-lg font-bold mb-4">Recent Invoices</div>
        <table className="w-full table-auto">
        <tbody>
            <tr>
              <th className="px-4 py-2 text-left">Invoice ID</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          {invoices.map(invoice => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{invoice.id}</td>
              <td className="px-4 py-2">{invoice.client}</td>
              <td className="px-4 py-2">${invoice.amount}</td>
              <td className="px-4 py-2">{invoice.due}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button className="text-blue-600 bg-blue-50 text-sm px-2 py-1 rounded">View</button>
                <button className="text-gray-600 bg-gray-50 text-sm px-2 py-1 rounded">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )};