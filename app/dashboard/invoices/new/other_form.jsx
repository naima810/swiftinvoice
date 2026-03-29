"use client";
import { useState } from "react";

const initialLineItems = [{ id: 1, item: "", description: "", qty: 1, unitPrice: 0 }];

export default function CreateInvoice() {
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", address: "" });
  const [discount, setDiscount] = useState({ type: "percent", value: 0 });
  const [tax, setTax] = useState({ type: "percent", value: 0 });
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [scheduleReminder, setScheduleReminder] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

  const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);
  const discountAmt = discount.type === "percent" ? subtotal * (discount.value / 100) : Number(discount.value);
  const taxAmt = tax.type === "percent" ? (subtotal - discountAmt) * (tax.value / 100) : Number(tax.value);
  const total = subtotal - discountAmt + taxAmt;

  const fmt = (n: any) => `$${Number(n).toFixed(2)}`;

  const updateLineItem = (id: any, field: any, val: any) =>
    setLineItems((items) => items.map((li) => (li.id === id ? { ...li, [field]: val } : li)));

  const addLineItem = () =>
    setLineItems((items) => [...items, { id: Date.now(), item: "", description: "", qty: 1, unitPrice: 0 }]);

  const removeLineItem = (id: any) => setLineItems((items) => items.filter((li) => li.id !== id));

  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

return (
  <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f7f4]">
    <div className="w-full px-6 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1523]">Create Invoice</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-[#d4cfe0] bg-teal-600 text-white text-sm font-semibold">
            Preview
          </button>
          <button className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold">
            Save Draft
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
           <Section icon="👤" title="Client Information" accent="#7c5cbf">
              
                <Field label="FULL NAME">
                  <Input placeholder="Jane Doe" value={clientInfo.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, name: e.target.value })} />
                </Field>
                <Field label="EMAIL ADDRESS">
                  <Input placeholder="jane@company.com" value={clientInfo.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, email: e.target.value })} />
                </Field>           
              <Field label="PHONE NUMBER (optional)">
                <Input placeholder="+1 555 000 0000" value={clientInfo.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, phone: e.target.value })} />
              </Field>
              <Field label="ADDRESS (optional)">
                <Input placeholder="123 Main St, City, Country" value={clientInfo.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, address: e.target.value })} />
              </Field>
             
            </Section>
          

          <Section icon="📋" title="Invoice Details" accent="#0d9e8a">
              <div className="grid grid-cols-3 gap-4">
                <Field label="INVOICE NUMBER (auto-generated)">
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-teal-600 text-white text-xs font-bold p-1 rounded-lg">INV-1002</span>
                    <span className="text-xs text-[#9b8ea0]">⟳ New</span>
                  </div>
                </Field>
                <Field label="ISSUE DATE">
                  <input type="date" defaultValue={today} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                </Field>
                <Field label="DUE DATE">
                  <input type="date" defaultValue={due} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CURRENCY">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all">
                    <option>USD</option><option>EUR</option><option>GBP</option><option>PKR</option>
                  </select>
                </Field>
                <Field label="PAYMENT TERMS">
                  <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all">
                    <option>Net 30</option><option>Net 15</option><option>Net 60</option><option>Due on Receipt</option>
                  </select>
                </Field>
              </div>
            </Section>
        </div>

        {/* ROW 2 */}
        <Section icon="📦" title="Line Items" accent="#e8832a">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[30%]" />
                <col className="w-[10%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead>
                <tr className="text-left">
                  {["ITEM", "DESCRIPTION", "QTY", "PRICE", "TOTAL", ""].map((h) => (
                    <th key={h} className="text-xs text-[#9b8ea0] pb-3 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="pr-2 pb-2">
                      <input className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </td>
                    <td className="pr-2 pb-2">
                      <input className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </td>
                    <td className="pr-2 pb-2">
                      <input type="number" className="w-full border rounded-lg px-2 py-2 text-sm text-center" />
                    </td>
                    <td className="pr-2 pb-2">
                      <input type="number" className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </td>
                    <td className="pr-2 pb-2 text-teal-600 font-semibold">
                      {fmt(li.qty * li.unitPrice)}
                    </td>
                    <td className="pb-2">
                      <button className="w-full h-8 bg-red-100 text-red-500 rounded-lg">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-3 w-full border-2 border-dashed rounded-xl py-3 text-sm">
            + Add Line Item
          </button>
        </Section>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

           <div className="grid grid-cols-2 gap-4">
                <Field label="NOTES">
                  <textarea rows={4} placeholder="Thank you for your business..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all resize-none" />
                </Field>
                <Field label="TERMS & CONDITIONS">
                  <textarea rows={4} placeholder="Payment is due within the agreed period..." value={terms} onChange={(e) => setTerms(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all resize-none" />
                </Field>
              </div>

          <div className="p-2 bg-white rounded-2xl border border-[#e2dded] shadow-sm overflow-hidden">
              <div className="border-b border-[#f0edf6]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <h2 className="font-bold text-[#1a1523] text-base">Price Summary</h2>
                </div>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b5f7a]">Subtotal</span>
                  <span className="text-sm font-semibold text-[#0d9e8a]">{fmt(subtotal)}</span>
                </div>

                {/* Discount */}
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-[#9b8ea0] uppercase mb-2">Discount</p>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-xl overflow-hidden border border-[#e2dded]">
                      <button onClick={() => setDiscount({ ...discount, type: "percent" })} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${discount.type === "percent" ? "bg-teal-600 text-white" : "bg-white text-[#9b8ea0]"}`}>%</button>
                      <button onClick={() => setDiscount({ ...discount, type: "fixed" })} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${discount.type === "fixed" ? "bg-teal-600 text-white" : "bg-white text-[#9b8ea0]"}`}>Fixed</button>
                    </div>
                    <input type="number" min="0" value={discount.value} onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })} className="flex-1 border border-[#e2dded] rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                  </div>
                </div>

                {/* Tax */}
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-[#9b8ea0] uppercase mb-2">Tax</p>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-xl overflow-hidden border border-[#e2dded]">
                      <button onClick={() => setTax({ ...tax, type: "percent" })} className={`p-2 text-xs rounded-xl font-bold transition-all ${tax.type === "percent" ? "bg-teal-600 text-white" : "bg-white text-[#9b8ea0]"}`}>%</button>
                      <button onClick={() => setTax({ ...tax, type: "fixed" })} className={`p-2 text-xs font-bold rounded-xl transition-all ${tax.type === "fixed" ? "bg-teal-600 text-white" : "bg-white text-[#9b8ea0]"}`}>Fixed</button>
                    </div>
                    <input type="number" min="0" value={tax.value} onChange={(e) => setTax({ ...tax, value: Number(e.target.value) })} className="flex-1 border border-[#e2dded] rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                  </div>
                </div>  

                {/* Total */}
                <div className="bg-[#0d9e8a] rounded-xl px-4 py-4 flex items-center justify-between mt-1">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">Total Due</p>
                    <p className="text-2xl font-bold text-white mt-0.5">{fmt(total)}</p>
                  </div>
                  <span className="text-white text-xl">→</span>
                </div>
              </div>
            </div>


        </div>

        {/* Send Options */}
            <div className="p-4 bg-white rounded-2xl border border-[#e2dded] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#f0edf6]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📤</span>
                  <h2 className="font-bold text-[#1a1523] text-base">Send Options</h2>
                </div>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="w-4 h-4 rounded border-[#d4cfe0] text-[#0d9e8a] focus:ring-[#0d9e8a] cursor-pointer" />
                  <span className="text-sm text-[#4a3f5c] group-hover:text-[#0d9e8a] transition-colors font-medium">Send via Email</span>
                </label>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0d9e8a]">Schedule Reminder</p>
                    <p className="text-xs text-[#9b8ea0] mt-0.5">Auto-remind before due date</p>
                  </div>
                  <button onClick={() => setScheduleReminder(!scheduleReminder)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${scheduleReminder ? "bg-[#0d9e8a]" : "bg-[#e2dded]"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${scheduleReminder ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-gray-200 p-3 rounded-xl">
              Download PDF
            </button>
            <button className="flex-1 bg-teal-600 text-white p-3 rounded-xl">
              Send Invoice
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
);
}

// Helpers
function Section({ icon, title, accent, children }: { icon: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mb-4 bg-white rounded-md border border-[#e2dded] shadow-sm">
      <div className="py-4 border-b border-[#f0edf6]">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className="font-bold text-base" style={{ color: accent }}>{title}</h2>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm mb-2 font-semibold tracking-widest text-[#9b8ea0] uppercase">{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white placeholder:text-[#c4bdd0] focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all"
    />
  );
}
