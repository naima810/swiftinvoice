"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      console.log("API response:", data);
    setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function filteredInvoices() {
    return invoices.filter((inv) => {
        if (filter === "all") return true;
        return inv.payment_status === filter;
      })
      .filter((inv) => {
        const q = search.toLowerCase();
        return (
          inv.invoice_number?.toLowerCase().includes(q) ||
          inv.clients?.name?.toLowerCase().includes(q)
        );
      });
  }

  return (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col">
    
    {/* Header */}
    <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
      <h1 className="text-2xl font-bold">All Invoices</h1>
      <button
        onClick={() => router.push("/invoices/new")}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        + Create Invoice
      </button>
    </div>

    {/* Controls */}
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        className="border p-2 rounded w-full"
        placeholder="Search invoice or client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2 rounded w-full sm:w-auto"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>

    {/* Table Container */}
    <div className="flex-1 bg-white shadow rounded overflow-hidden">
      
      {/* Horizontal scroll wrapper */}
      <div className="w-full">
        
        {/* Vertical scroll wrapper */}
        <div className="max-h-[500px] overflow-y-auto">
          
          <table className="min-w-[900px] w-full text-left border-collapse">
            
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-sm font-semibold">Invoice</th>
                <th className="p-2 text-sm font-semibold">Client</th>
                <th className="p-2 text-sm font-semibold">Date</th>
                <th className="p-2 text-sm font-semibold">Due</th>
                <th className="p-2 text-sm font-semibold">Amount</th>
                <th className="p-2 text-sm font-semibold">Status</th>
                <th className="p-2 text-sm font-semibold">Next Reminder</th>
                <th className="p-2 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4" colSpan="8">Loading...</td>
                </tr>
              ) : filteredInvoices().length === 0 ? (
                <tr>
                  <td className="p-4" colSpan="8">No invoices found</td>
                </tr>
              ) : (
                filteredInvoices().map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    
                    <td
                      className="p-2 font-medium cursor-pointer text-blue-600"
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                    >
                      {inv.invoice_number}
                    </td>

                    <td className="p-2">{inv.clients.name}</td>
                    <td className="p-2 whitespace-nowrap">{inv.issue_date}</td>
                    <td className="p-2 whitespace-nowrap">{inv.due_date}</td>

                    <td className="p-2 font-medium whitespace-nowrap">
                      ${inv.total}
                    </td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          inv.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.payment_status}
                      </span>
                    </td>

                    <td className="p-2 text-sm text-gray-600 whitespace-nowrap">
                      {inv.next_reminder || "—"}
                    </td>

                    <td className="p-2 whitespace-nowrap">
                      <button className="text-blue-600 hover:underline mr-2">
                        View
                      </button>
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>
);
}