"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuSearch
} from "react-icons/lu";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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
  return invoices
    .filter((inv) => {
      if (filter === "all") return true;
      return inv.payment_status === filter;
    })
    .filter((inv) => {
      if (clientFilter === "all") return true;
      return inv.clients?.name === clientFilter;
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
    

    {/* Table Container */}
    <div className="flex-1 bg-white shadow rounded overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-2 p-2">
      <div className="flex flex-1 items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl w-full">
      <LuSearch size={18} className="text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent outline-none w-full flex-1"
      />
    </div>

      <select
        className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Pending</option>
        <option value="overdue">Overdue</option>
        <option value="draft">Draft</option>
        
      </select>
      <select className="border border-gray-300 p-2 rounded w-full sm:w-auto" value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
        <option value="all">All Clients</option>
        {/* Add client options dynamically */}
        {Array.from(new Set(invoices.map(inv => inv.clients?.name))).map(client => (
          <option key={client} value={client}>{client}</option>
        ))}
      </select>
    </div>
      
      {/* Horizontal scroll wrapper */}
      <div className="w-full p-2">
        
        {/* Vertical scroll wrapper */}
        <div className="max-h-[500px] overflow-y-auto">
          {/* Mobile View */}
<div className="md:hidden space-y-3">
  {filteredInvoices().map((inv) => (
    <div key={inv.id} className="bg-white shadow rounded p-3">
      
      {/* Summary */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setExpandedId(expandedId === inv.id ? null : inv.id)
        }
      >
        <div>
          <p className="font-semibold">{inv.invoice_number}</p>
          <p className="text-sm text-gray-500">{inv.clients?.name}</p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            inv.payment_status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {inv.payment_status}
        </span>
      </div>

      {/* Expanded */}
      {expandedId === inv.id && (
        <div className="mt-3 border-t pt-3 text-sm space-y-1">
          <p><b>Due:</b> {inv.due_date}</p>
          <p><b>Amount:</b> ${inv.total}</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => router.push(`/invoices/${inv.id}`)}
              className="text-blue-600"
            >
              View
            </button>

            <button className="text-gray-600">
              Edit
            </button>

            <button className="text-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>
          
          <table className="hidden md:table min-w-[900px] w-full text-left border-collapse">
            
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-sm font-semibold">Invoice #</th>
                <th className="p-2 text-sm font-semibold">Client</th>
                <th className="p-2 text-sm font-semibold">Due</th>
                <th className="p-2 text-sm font-semibold">Amount</th>
                <th className="p-2 text-sm font-semibold">Status</th>
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
                  <tr key={inv.id} className="hover:bg-gray-50">
                    
                    <td
                      className="p-2 font-medium cursor-pointer text-bold"
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                    >
                      {inv.invoice_number}
                    </td>

                    <td className="p-2">{inv.clients?.name}</td>
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


                    <td className="p-2 relative group whitespace-nowrap">
  <button className="px-2 py-1">⋮</button>

  <div className="absolute right-0 mt-2 w-32 bg-white border shadow rounded hidden group-hover:block z-20">
    <button
      onClick={() => router.push(`/invoices/${inv.id}`)}
      className="block w-full text-left px-3 py-2 hover:bg-gray-100"
    >
      View
    </button>

    <button
  onClick={() => router.push(`/dashboard/invoices/${inv.id}/edit`)}
  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
>
  Edit
</button>

    <button
      onClick={() => handleDeleteInvoice(inv.id)}
      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
    >
      Delete
    </button>
  </div>
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