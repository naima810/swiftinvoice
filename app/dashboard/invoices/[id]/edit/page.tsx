"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvoiceForm from "@/components/InvoiceForm";

export default function EditInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchInvoice();
  }, [id]);

  async function fetchInvoice() {
    if (!id) {
        console.error("No invoice ID provided");
        return;
    }   
    const res = await fetch(`/api/invoices/${id}`);
    const data = await res.json();

    if (!data) return;

    const reminder = data.invoice_reminders?.[0];

    const mapped = {
      clientName: data.clients?.name || "",
      clientEmail: data.clients?.email || "",
      companyName: data.clients?.company_name || "",
      id: data.id,

      dueDate: data.due_date || "",

      items:
        data.invoice_items?.map((i:any) => ({
          itemName: i.item,
          quantity: i.qty,
          price: i.unit_price,
        })) || [],

      reminders: {
        enabled: reminder?.enabled || false,
        mode: reminder?.config?.mode || "standard",
      },
    };

    setInvoice(mapped);
  }

  if (!invoice) return <p>Loading...</p>;

  return (
    <InvoiceForm
      mode="edit"
      initialData={invoice}
    />
  );
}