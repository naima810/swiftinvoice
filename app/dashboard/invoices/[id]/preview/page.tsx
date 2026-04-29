"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type BusinessProfile = {
  company_name: string;
  company_email: string;
  phone: string;
  address: string;
  website: string;
  logo_url: string | null;
  invoice_primary_color: string;
};

type Client = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type LineItem = {
  id: string;
  item: string;
  description: string;
  qty: number;
  unit_price: number;
};

type Invoice = {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  currency: string;
  payment_terms: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes: string;
  terms: string;
  status: string;
};

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch invoice
      const { data: inv } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (!inv) return;
      setInvoice(inv);

      // Fetch client
      const { data: cl } = await supabase
        .from("clients")
        .select("*")
        .eq("id", inv.client_id)
        .single();
      setClient(cl);

      // Fetch line items
      const { data: items } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", inv.id);
      setLineItems(items || []);

      // Fetch business profile
      const { data: biz } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setBusiness(biz);

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const fmt = (n: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const color = business?.invoice_primary_color || "#0d9e8a";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${color} transparent transparent transparent` }}
          />
          <p className="text-sm text-[#9b8ea0]">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <p className="text-[#9b8ea0]">Invoice not found.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    paid: "#16a34a",
    pending: "#d97706",
    overdue: "#dc2626",
    draft: "#9b8ea0",
  };
  const statusBg: Record<string, string> = {
    paid: "#f0fdf4",
    pending: "#fffbeb",
    overdue: "#fef2f2",
    draft: "#f8f7f4",
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-['DM_Sans',sans-serif]">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* TOP ACTION BAR — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-[#e2dded] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-[#9b8ea0] hover:text-[#1a1523] transition-all"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-[#e2dded] bg-white text-sm font-medium text-[#1a1523] hover:border-[#0d9e8a] hover:bg-[#f0faf8] transition-all"
          >
            Download PDF
          </button>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            Send Invoice
          </button>
        </div>
      </div>

      {/* INVOICE SHEET */}
      <div className="max-w-3xl mx-auto my-10 print:my-0 print:max-w-none bg-white shadow-sm print:shadow-none rounded-2xl print:rounded-none overflow-hidden">

        {/* HEADER */}
        <div className="px-12 pt-12 pb-8 border-b border-[#f0edf6]">
          <div className="flex items-start justify-between">

            {/* LEFT — business info */}
            <div className="flex flex-col gap-3">
              {business?.logo_url ? (
                <img
                  src={business.logo_url}
                  alt="Logo"
                  className="h-12 object-contain"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: color }}
                >
                  {business?.company_name?.[0] || "B"}
                </div>
              )}
              <div className="mt-1">
                <p className="font-semibold text-[#1a1523] text-base">
                  {business?.company_name || "Your Company"}
                </p>
                {business?.address && (
                  <p className="text-xs text-[#9b8ea0] mt-0.5 whitespace-pre-line">
                    {business.address}
                  </p>
                )}
                {business?.company_email && (
                  <p className="text-xs text-[#9b8ea0]">{business.company_email}</p>
                )}
                {business?.phone && (
                  <p className="text-xs text-[#9b8ea0]">{business.phone}</p>
                )}
                {business?.website && (
                  <p className="text-xs" style={{ color }}>{business.website}</p>
                )}
              </div>
            </div>

            {/* RIGHT — invoice meta */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    color: statusColors[invoice.status] || "#9b8ea0",
                    backgroundColor: statusBg[invoice.status] || "#f8f7f4",
                  }}
                >
                  {(invoice.status || "draft").toUpperCase()}
                </span>
                <span
                  className="font-['DM_Mono'] text-sm font-medium"
                  style={{ color }}
                >
                  {invoice.invoice_number}
                </span>
              </div>
              <h1 className="text-4xl font-light text-[#1a1523] tracking-tight">
                INVOICE
              </h1>
              <div className="flex flex-col items-end gap-1 mt-2">
                <div className="flex items-center gap-4 text-xs text-[#9b8ea0]">
                  <span>Issued</span>
                  <span className="text-[#1a1523] font-medium">
                    {fmtDate(invoice.issue_date)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#9b8ea0]">
                  <span>Due</span>
                  <span className="font-medium" style={{ color }}>
                    {fmtDate(invoice.due_date)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#9b8ea0]">
                  <span>Terms</span>
                  <span className="text-[#1a1523] font-medium">
                    {invoice.payment_terms}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BILL TO */}
        <div className="px-12 py-8 border-b border-[#f0edf6]">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9b8ea0] uppercase mb-3">
            Bill To
          </p>
          <p className="font-semibold text-[#1a1523] text-base">{client?.name}</p>
          {client?.address && (
            <p className="text-sm text-[#6b5f7a] mt-0.5 whitespace-pre-line">
              {client.address}
            </p>
          )}
          {client?.email && (
            <p className="text-sm text-[#6b5f7a]">{client.email}</p>
          )}
          {client?.phone && (
            <p className="text-sm text-[#6b5f7a]">{client.phone}</p>
          )}
        </div>

        {/* LINE ITEMS */}
        <div className="px-12 py-8 border-b border-[#f0edf6]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0edf6]">
                {["Item", "Description", "Qty", "Unit Price", "Total"].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] font-semibold tracking-[0.12em] text-[#9b8ea0] uppercase pb-3 text-left last:text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li, i) => (
                <tr
                  key={li.id}
                  className="border-b border-[#f8f7f4] last:border-0"
                >
                  <td className="py-4 text-sm font-medium text-[#1a1523] pr-4">
                    {li.item}
                  </td>
                  <td className="py-4 text-sm text-[#9b8ea0] pr-4">
                    {li.description}
                  </td>
                  <td className="py-4 text-sm text-[#6b5f7a]">{li.qty}</td>
                  <td className="py-4 text-sm text-[#6b5f7a]">
                    {fmt(li.unit_price, invoice.currency)}
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#1a1523] text-right">
                    {fmt(li.qty * li.unit_price, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="px-12 py-8 border-b border-[#f0edf6]">
          <div className="flex justify-end">
            <div className="w-64 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#9b8ea0]">Subtotal</span>
                <span className="text-[#1a1523] font-medium">
                  {fmt(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#9b8ea0]">Discount</span>
                  <span className="text-[#dc2626] font-medium">
                    − {fmt(invoice.discount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#9b8ea0]">Tax</span>
                  <span className="text-[#1a1523] font-medium">
                    {fmt(invoice.tax, invoice.currency)}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between items-center pt-3 mt-1 border-t-2"
                style={{ borderColor: color }}
              >
                <span className="text-sm font-semibold text-[#1a1523]">
                  Total Due
                </span>
                <span className="text-2xl font-semibold" style={{ color }}>
                  {fmt(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NOTES + TERMS */}
        {(invoice.notes || invoice.terms) && (
          <div className="px-12 py-8 grid grid-cols-2 gap-8 border-b border-[#f0edf6]">
            {invoice.notes && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9b8ea0] uppercase mb-2">
                  Notes
                </p>
                <p className="text-sm text-[#6b5f7a] leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9b8ea0] uppercase mb-2">
                  Terms & Conditions
                </p>
                <p className="text-sm text-[#6b5f7a] leading-relaxed">
                  {invoice.terms}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="px-12 py-6 flex items-center justify-between">
          <p className="text-xs text-[#c4bdd0]">
            {invoice.invoice_number} · Generated by InvoiceApp
          </p>
          <div
            className="w-6 h-1 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}