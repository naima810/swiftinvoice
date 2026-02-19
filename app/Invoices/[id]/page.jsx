'use client';

import InvoiceLayout from "@/components/invoice/InvoiceLayout";

export default function InvoicePage() {
  const invoice = {
    id: "INV001",
    date: "2026-02-20",
    dueDate: "2026-03-05",
    status: "Pending",
    business: {
      name: "SwiftInvoice Ltd",
      address: "123 Startup St, Karachi, Pakistan",
      email: "contact@swiftinvoice.com",
    },
    client: {
      name: "Ali Khan",
      address: "456 Client Rd, Karachi, Pakistan",
      email: "ali.khan@gmail.com",
    },
    items: [
      { name: "Website Design", qty: 1, price: 50000 },
      { name: "Monthly Maintenance", qty: 2, price: 15000 },
    ],
    totals: {
      subtotal: 80000,
      tax: 8000,
      total: 88000,
    },
    notes: "Payment due within 15 days.",
  };

  return <InvoiceLayout invoice={invoice} />;
}
