"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation"; // app router way
import jsPDF from "jspdf";

export default function InvoicePage() {
  const params = useParams();
  const { id } = params;

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setInvoice(data);
    }
  };

  const generatePDF = () => {
    if (!invoice) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SwiftInvoice", 14, 20);
    doc.setFontSize(12);
    doc.text("Invoice", 14, 30);

    let y = 40;
    invoice.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.description} - ${item.qty} x $${item.rate}`,
        14,
        y
      );
      y += 8;
    });

    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 14, y + 10);
    doc.save(`invoice-${id}.pdf`);
  };
const sendReminder = async () => {
  const email = prompt("Enter client email");
  if (!email) return;

  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      subject: `Reminder: Invoice ${invoice.id}`,
      text: `Hi, this is a reminder for your invoice totaling $${invoice.subtotal.toFixed(2)}.`,
    }),
  });

  const data = await res.json();
  if (data.success) alert("Reminder sent!");
  else alert("Failed to send email");
};

  if (!invoice) return <p className="p-10">Loading...</p>;

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>

      <ul className="mb-4">
        {invoice.items.map((item, index) => (
          <li key={index}>
            {item.description} — {item.qty} x ${item.rate}
          </li>
        ))}
      </ul>

      <p className="mb-4 font-bold">Subtotal: ${invoice.subtotal.toFixed(2)}</p>

      <button
        onClick={generatePDF}
        className="px-6 py-2 bg-blue-600 text-white"
      >
        Download PDF
      </button>
      <button
  onClick={sendReminder}
  className="ml-4 px-6 py-2 bg-purple-600 text-white"
>
  Send Reminder
</button>

    </main>
  );
}
