"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
const initialLineItems = [{ id: 1, item: "", description: "", qty: 1, unitPrice: 0 }];


export default function CreateInvoice() {
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", address: "" });
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0000");
  const [discount, setDiscount] = useState({ type: "percent", value: 0 });
  const [tax, setTax] = useState({ type: "percent", value: 0 });
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [scheduleReminder, setScheduleReminder] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

const [reminderConfig, setReminderConfig] = useState({
  beforeDue: 3,
  onDue: 0,
  afterDue: 2,

  repeat: {
    enabled: true,
    everyDays: 3,
    maxReminders: 5,
  },
});
  const router = useRouter();
  const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);
  const discountAmt = discount.type === "percent" ? subtotal * (discount.value / 100) : Number(discount.value);
  const taxAmt = tax.type === "percent" ? (subtotal - discountAmt) * (tax.value / 100) : Number(tax.value);
  const total = subtotal - discountAmt + taxAmt;

  const fmt = (n: any) => `$${Number(n).toFixed(2)}`;
  

useEffect(() => {
  const fetchInvoiceNumber = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    const last = data?.[0]?.invoice_number || "INV-0000";
    const nextNumber = `INV-${String(
      Number(last.split("-")[1]) + 1
    ).padStart(4, "0")}`;

  setIssueDate(new Date().toISOString().slice(0, 10));
  setDueDate(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    setInvoiceNumber(nextNumber);
  };

  fetchInvoiceNumber();
}, []);

  const updateLineItem = (id: any, field: any, val: any) =>
    setLineItems((items) => items.map((li) => (li.id === id ? { ...li, [field]: val } : li)));

  const addLineItem = () =>
    setLineItems((items) => [...items, { id: Date.now(), item: "", description: "", qty: 1, unitPrice: 0 }]);

  const removeLineItem = (id: any) => setLineItems((items) => items.filter((li) => li.id !== id));

  const handleSaveInvoice = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("Not logged in");

  // 1. Create or insert client
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name: clientInfo.name,
      email: clientInfo.email,
      phone: clientInfo.phone,
      address: clientInfo.address,
    })
    .select()
    .single();

  if (clientError) {
    console.error(clientError);
    return;
  }

  // 2. Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: client.id,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      currency,
      payment_terms: paymentTerms,

      subtotal,
      discount: discountAmt,
      tax: taxAmt,
      total,

      notes,
      terms,
    })
    .select()
    .single();

  if (invoiceError) {
    console.log(invoiceError);
    return;
  }

const { error: reminderError } = await supabase
  .from("invoice_reminders")
  .insert({
    invoice_id: invoice.id,
    enabled: scheduleReminder,
    config: reminderConfig,
    sent_count: 0,
    status: "active",
  });

if (reminderError) {
  console.error(reminderError);
  return;
}
  // 3. Insert line items
  const itemsPayload = lineItems.map((li) => ({
    invoice_id: invoice.id,
    item: li.item,
    description: li.description,
    qty: li.qty,
    unit_price: li.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsPayload);

  if (itemsError) {
    console.error(itemsError);
    return;
  }

  router.push(`/dashboard/invoices/${invoice.id}/preview`);
};


return (
  <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f7f4]">
    <div className="w-full px-6 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1523]">Create Invoice</h1>
        <div className="flex gap-3">
          
          <button onClick={handleSaveInvoice} className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold">
            Save Draft
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
           <Section icon="👤" title="Client Information" accent="#7c5cbf">
              
                <Field label="FULL NAME">
                  <Input placeholder="Jane Doe" required value={clientInfo.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, name: e.target.value })} />
                </Field>
                <Field label="EMAIL ADDRESS">
                  <Input placeholder="jane@company.com" required value={clientInfo.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, email: e.target.value })} />
                </Field>           
              <Field label="PHONE NUMBER (optional)">
                <Input placeholder="+1 555 000 0000" value={clientInfo.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, phone: e.target.value })} />
              </Field>
              <Field label="ADDRESS (optional)">
                <textarea rows={3} className="border rounded-xl p-2" placeholder="123 Main St, City, Country" value={clientInfo.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientInfo({ ...clientInfo, address: e.target.value })} />
              </Field>
             
            </Section>
          

          <Section icon="📋" title="Invoice Details" accent="#0d9e8a">
              <div className="grid grid-cols-3 gap-4">
                <Field label="INVOICE NUMBER (auto-generated)">
                  <input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-teal-600 text-white text-xs font-bold p-1 rounded-lg"
                  />
                </Field>
                <Field label="ISSUE DATE">
                  <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                </Field>
                <Field label="DUE DATE">
                  <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CURRENCY">
                  <select value={currency} required onChange={(e) => setCurrency(e.target.value)} className="w-full border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all">
                    <option>USD</option><option>EUR</option><option>GBP</option><option>PKR</option>
                  </select>
                </Field>
                <Field label="PAYMENT TERMS">
                  <select value={paymentTerms} required onChange={(e) => setPaymentTerms(e.target.value)} className="w-full border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all">
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
                <tr className="text-center">
                  {["ITEM", "DESCRIPTION", "QTY", "PRICE", "TOTAL", ""].map((h) => (
                    <th key={h} className="text-xs text-[#9b8ea0] pb-2 pr-2">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lineItems.map((li) => (
                  <tr className="m-4" key={li.id}>
                    <td className="pr-2 pb-2">
                    <input
                    required
                    className="w-full border rounded-lg px-2 py-2 text-sm text-center"
                    value={li.item}
                    onChange={(e) =>
                      updateLineItem(li.id, "item", e.target.value)
                    }
                  />
                  </td>
                  <td className="pr-2 pb-2">  
                  
                  <input
                  required
                  className="w-full border rounded-lg px-2 py-2 text-sm text-center"
                    value={li.description}
                    onChange={(e) =>
                      updateLineItem(li.id, "description", e.target.value)
                    }
                  />
                  </td>
                  <td className="pr-2 pb-2">
                      <input
                        required
                        type="number"
                        className="w-full border rounded-lg px-2 py-2 text-sm text-center"
                        value={li.qty}
                        onChange={(e) =>
                          updateLineItem(li.id, "qty", Number(e.target.value))
                        }
                      />
                    </td>
                      
                    <td className="pr-2 pb-2">
                      <input
                      required
                        type="number"
                        className="w-full border rounded-lg px-2 py-2 text-sm"
                        value={li.unitPrice}
                        onChange={(e) =>
                          updateLineItem(li.id, "unitPrice", Number(e.target.value))
                        }
                      />
                    </td>
                    <td className="pr-2 pb-2 text-teal-600 font-semibold">
                      {fmt(li.qty * li.unitPrice)}
                    </td>
                    <td className="pb-2">
                      <button className="w-full p-2 bg-red-100 text-red-500 rounded-lg" onClick={() => removeLineItem(li.id)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addLineItem} className="mt-2 mb-4 w-full border-2 border-dashed border-[#d4cfe0] rounded-xl py-3 text-sm font-semibold text-[#9b8ea0] hover:border-[#0d9e8a] hover:text-[#0d9e8a] hover:bg-[#f0faf8] transition-all">
                + Add Line Item
              </button>
        </Section>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section icon="📝" title="Additional Notes" accent="#7c5cbf">
           <div className="grid grid-cols-2 gap-4">
                <Field label="Notes & Conditions">
                  <textarea rows={4} placeholder="Thank you for your business..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all resize-none" />
                </Field>
                <Field label="TERMS & CONDITIONS">
                  <textarea rows={4} placeholder="Payment is due within the agreed period..." value={terms} onChange={(e) => setTerms(e.target.value)} className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all resize-none" />
                </Field>
              </div>
          </Section>
          <div className="p-2 bg-white rounded-xl border border-[#e2dded] shadow-sm overflow-hidden">
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
                    <input type="number" min="0" value={discount.value} onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })} className="flex-1 border border-[#e2dded] rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
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
                    <input type="number" min="0" value={tax.value} onChange={(e) => setTax({ ...tax, value: Number(e.target.value) })} className="flex-1 border border-[#e2dded] rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all" />
                  </div>
                </div>  

                {/* Total */}
                <div className="bg-teal-600 rounded-xl px-4 py-4 flex items-center justify-between mt-1">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-white uppercase">Total Due</p>
                    <p className="text-2xl font-bold text-white mt-0.5">{fmt(total)}</p>
                  </div>
                  <span className="text-white text-xl">→</span>
                </div>
              </div>
            </div>


        </div>

        {/* Send Options */}
           <div className="p-4 bg-white rounded-xl border border-[#e2dded] shadow-sm overflow-hidden">
  
  {/* HEADER */}
  <div className="px-5 py-4 border-b border-[#f0edf6]">
    <div className="flex items-center gap-2">
      <span className="text-lg">📤</span>
      <h2 className="font-bold text-[#1a1523] text-base">
        Send Options
      </h2>
    </div>
  </div>

  <div className="px-5 py-4 flex flex-col gap-6">

    {/* EMAIL */}
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={sendEmail}
        onChange={(e) => setSendEmail(e.target.checked)}
        className="w-4 h-4 mt-1 accent-[#0d9e8a]"
      />

      <div>
        <p className="text-sm font-semibold text-[#1a1523]">
          Send invoice via email
        </p>
        <p className="text-xs text-[#9b8ea0]">
          Automatically email invoice to client after saving
        </p>
      </div>
    </label>

{/* REMINDERS */}
<div className="flex flex-col gap-4">

  {/* HEADER + TOGGLE */}
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-semibold text-[#1a1523]">
        Payment reminders
      </p>
      <p className="text-xs text-[#9b8ea0]">
        Configure when to remind clients
      </p>
    </div>

    {/* REAL TOGGLE */}
    <button
      type="button"
      onClick={() => setScheduleReminder((prev) => !prev)}
      className={`relative inline-flex items-center rounded-full p-2 bg-teal-600 hover:bg-teal-700 text-white`}
    >
      {scheduleReminder ?"Disable Reminders" : "Enable Reminders"}
    </button>
  </div>

  {/* SETTINGS */}
  {scheduleReminder && (
    <div className="flex flex-col gap-4 mt-2">

      {/* BEFORE DUE */}
      <div className="flex flex-row justify-between gap-1">
        <label className="text-md text-[#9b8ea0] uppercase">
          Before due date (days)
        </label>
        <input
          type="number"
          min="0"
          value={reminderConfig.beforeDue}
          onChange={(e) =>
            setReminderConfig((prev) => ({
              ...prev,
              beforeDue: Number(e.target.value),
            }))
          }
          className="w-24 border rounded-lg p-2 text-sm"
        />
      </div>

      {/* ON DUE */}
      <div className="flex flex-row justify-between gap-1">
        <label className="text-md text-[#9b8ea0] uppercase">
          On due date
        </label>
        <span className="text-sm text-[#9b8ea0]">Auto (always sends)</span>
      </div>

      {/* AFTER DUE */}
      <div className="flex flex-row justify-between gap-1">
        <label className="text-md text-[#9b8ea0] uppercase">
          After due date (days)
        </label>
        <input
          type="number"
          min="0"
          value={reminderConfig.afterDue}
          onChange={(e) =>
            setReminderConfig((prev) => ({
              ...prev,
              afterDue: Number(e.target.value),
            }))
          }
          className="w-24 border rounded-lg p-2 text-sm"
        />
      </div>

      {/* REPEAT SETTINGS */}
      <div className="border-t pt-4 flex flex-col gap-3">

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={reminderConfig.repeat.enabled}
            onChange={(e) =>
              setReminderConfig((prev) => ({
                ...prev,
                repeat: {
                  ...prev.repeat,
                  enabled: e.target.checked,
                },
              }))
            }
          />
          Repeat reminders after overdue
        </label>

        {reminderConfig.repeat.enabled && (
          <div className="flex flex-col gap-3">

            {/* Every X days */}
            <div className="flex flex-row justify-between gap-1">
              <label className="text-md text-[#9b8ea0] uppercase">
                Repeat every (days)
              </label>
              <input
                type="number"
                min="1"
                value={reminderConfig.repeat.everyDays}
                onChange={(e) =>
                  setReminderConfig((prev) => ({
                    ...prev,
                    repeat: {
                      ...prev.repeat,
                      everyDays: Number(e.target.value),
                    },
                  }))
                }
                className="w-24 border rounded-lg p-2 text-sm"
              />
            </div>

            {/* Max reminders */}
            <div className="flex flex-row justify-between gap-1">
              <label className="text-md text-[#9b8ea0] uppercase">
                Max reminders
              </label>
              <input
                type="number"
                min="1"
                value={reminderConfig.repeat.maxReminders}
                onChange={(e) =>
                  setReminderConfig((prev) => ({
                    ...prev,
                    repeat: {
                      ...prev.repeat,
                      maxReminders: Number(e.target.value),
                    },
                  }))
                }
                className="w-24 border rounded-lg p-2 text-sm"
              />
            </div>

          </div>
        )}
      </div>

    </div>
  )}
</div>

  </div>
</div>

          <div className="flex flex-row justify-end gap-4">
            <button className="p-2 bg-gray-200 p-3 rounded-xl hover:bg-gray-300 transition-all">
              Download PDF
            </button>
            <button className="p-2 bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-all">
              Send Invoice
            </button>
          </div>

        </div>

      </div>
    </div>
);
}

// Helpers
function Section({ icon, title, accent, children }: { icon: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mb-4 bg-white rounded-xl border border-[#e2dded] shadow-sm">
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

function Input({required=false, placeholder, value, onChange }: { required?: boolean; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white placeholder:text-[#c4bdd0] focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all"
    />
  );
}
