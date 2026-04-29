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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Invoices</h1>
        <button
          onClick={() => router.push("/invoices/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Invoice
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search invoice or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto w-full bg-white shadow rounded">
        <table className="text-left border border-grey">
          <thead className="border border-black">
            <tr>
              <th className="p-3">Invoice</th>
              <th className="p-3">Client</th>
              <th className="p-3">Date</th>
              <th className="p-3">Due</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Reminder</th>
              <th className="p-3">Actions</th>
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
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium cursor-pointer" onClick={() => router.push(`/invoices/${inv.id}`)}>
                    {inv.invoice_number}
                  </td>
                  <td className="p-3">{inv.clients.name}</td>
                  <td className="p-3">{inv.issue_date}</td>
                  <td className="p-3">{inv.due_date}</td>
                  <td className="p-3">${inv.total}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        inv.payment_status === "paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {inv.next_reminder || "—"}
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 mr-2">View</button>
                    <button className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}