"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setInvoices(data);
    }
  };

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Subtotal</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="border p-2">{inv.id}</td>
                <td className="border p-2">
                  {JSON.stringify(inv.items)}
                </td>
                <td className="border p-2">${inv.subtotal}</td>
                <td className="border p-2">
                  {new Date(inv.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
