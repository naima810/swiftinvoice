'use client';

import { useState, ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import jsPDF from "jspdf";

interface LineItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export default function InvoiceForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { name: "", description: "", quantity: 1, price: 0, tax: 0 },
  ]);

  const [sendEmail, setSendEmail] = useState(false);

  // Handle line item changes
  const handleLineChange = (index: number, field: keyof LineItem, value: any) => {
    const items = [...lineItems];
    items[index][field] = field === "quantity" || field === "price" || field === "tax" ? Number(value) : value;
    setLineItems(items);
  };

  const addLineItem = () => setLineItems([...lineItems, { name: "", description: "", quantity: 1, price: 0, tax: 0 }]);
  const removeLineItem = (index: number) => setLineItems(lineItems.filter((_, i) => i !== index));

  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;
    lineItems.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;
      taxTotal += (item.tax / 100) * itemTotal;
    });
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCompanyLogo(e.target.files[0]);
  };

  const handleDownload = () => {
    const { subtotal, taxTotal, total } = calculateTotals();
    const doc = new jsPDF();

    // Company logo
    if (companyLogo) {
      const reader = new FileReader();
      reader.onload = function () {
        const imgData = reader.result as string;
        doc.addImage(imgData, "PNG", 10, 10, 40, 20);
        doc.text(`${companyName}`, 55, 15);
        doc.text(`${companyAddress}`, 55, 22);
        doc.text(`Email: ${companyEmail}`, 55, 29);
        doc.text(`Phone: ${companyPhone}`, 55, 36);
        drawInvoiceContent(doc);
      };
      reader.readAsDataURL(companyLogo);
    } else {
      doc.text(`${companyName}`, 10, 10);
      doc.text(`${companyAddress}`, 10, 17);
      doc.text(`Email: ${companyEmail}`, 10, 24);
      doc.text(`Phone: ${companyPhone}`, 10, 31);
      drawInvoiceContent(doc);
    }

    function drawInvoiceContent(doc: jsPDF) {
      doc.text(`Invoice #${invoiceNumber}`, 10, 50);
      doc.text(`Invoice Date: ${invoiceDate}`, 10, 57);
      doc.text(`Due Date: ${dueDate}`, 10, 64);
      doc.text(`Bill To: ${clientName}`, 10, 71);
      doc.text(`${clientAddress}`, 10, 78);
      doc.text(`Email: ${clientEmail}`, 10, 85);
      doc.text(`Phone: ${clientPhone}`, 10, 92);

      let y = 100;
      lineItems.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.name} - ${item.description} | Qty: ${item.quantity} | Price: ${currency} ${item.price} | Tax: ${item.tax}%`,
          10,
          y
        );
        y += 7;
      });

      doc.text(`Subtotal: ${currency} ${subtotal.toFixed(2)}`, 10, y + 7);
      doc.text(`Tax: ${currency} ${taxTotal.toFixed(2)}`, 10, y + 14);
      doc.text(`Total: ${currency} ${total.toFixed(2)}`, 10, y + 21);

      doc.save(`invoice-${invoiceNumber}.pdf`);
    }
  };

  const handleSendInvoice = async () => {
    if (!clientEmail) {
      alert("Enter client email to send invoice.");
      return;
    }

    const { subtotal, taxTotal, total } = calculateTotals();
    const supabase = createClient();
    const { error } = await supabase.functions.invoke("send-invoice", {
      body: JSON.stringify({
        to: clientEmail,
        invoice: {
          invoiceNumber,
          invoiceDate,
          dueDate,
          companyName,
          billingFrom: companyAddress,
          clientName,
          clientAddress,
          lineItems,
          subtotal,
          taxTotal,
          total,
        },
      }),
    });

    if (error) alert("Failed to send email: " + error.message);
    else alert("Invoice sent successfully!");
  };

  const handleSubmit = () => {
    handleDownload();
    if (sendEmail) handleSendInvoice();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Invoice</h1>

      {/* Company Info & Logo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="border p-1 rounded col-span-1"
        />
        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className="border p-2 rounded col-span-1"/>
        <input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Company Email" className="border p-2 rounded col-span-1"/>
        <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="Company Phone" className="border p-2 rounded col-span-1"/>
      </div>
      <input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Company Address" className="border p-2 rounded w-full"/>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name" className="border p-2 rounded"/>
        <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Client Email" className="border p-2 rounded"/>
        <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Client Phone" className="border p-2 rounded"/>
        <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client Address" className="border p-2 rounded"/>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Invoice #" className="border p-2 rounded"/>
        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="border p-2 rounded"/>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border p-2 rounded"/>
        <input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Currency" className="border p-2 rounded"/>
      </div>

      {/* Line Items Table */}
      <div>
        <h2 className="font-semibold mb-2">Line Items</h2>
        {lineItems.map((item, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 mb-2 items-center">
            <input placeholder="Item Name" value={item.name} onChange={(e) => handleLineChange(i, "name", e.target.value)} className="border p-2 rounded"/>
            <input placeholder="Description" value={item.description} onChange={(e) => handleLineChange(i, "description", e.target.value)} className="border p-2 rounded"/>
            <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleLineChange(i, "quantity", e.target.value)} className="border p-2 rounded"/>
            <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleLineChange(i, "price", e.target.value)} className="border p-2 rounded"/>
            <input type="number" placeholder="Tax %" value={item.tax} onChange={(e) => handleLineChange(i, "tax", e.target.value)} className="border p-2 rounded"/>
            <button onClick={() => removeLineItem(i)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
          </div>
        ))}
        <button onClick={addLineItem} className="bg-teal-600 text-white px-4 py-2 rounded mt-2">Add Item</button>
      </div>

      {/* Notes & Terms */}
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="border p-2 rounded w-full"/>
      <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} className="border p-2 rounded w-full"/>

      {/* Email Option */}
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
        <span>Send invoice via email?</span>
      </div>

      <button onClick={handleSubmit} className="bg-teal-600 text-white px-6 py-2 rounded font-medium">Generate Invoice</button>
    </div>
  );
}