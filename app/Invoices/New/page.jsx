"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

import jsPDF from "jspdf";

export default function NewInvoice() {
  const [items, setItems] = useState([
    { description: "", qty: 1, rate: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, rate: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );
  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("SwiftInvoice", 14, 20);

  doc.setFontSize(12);
  doc.text("Invoice", 14, 30);

  let y = 40;

  items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.description} - ${item.qty} x $${item.rate}`,
      14,
      y
    );
    y += 8;
  });

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 14, y + 10);

  doc.save("invoice.pdf");
};

const saveInvoice = async () => {
  const { error } = await supabase.from("invoices").insert([
    {
      items,
      subtotal,
    },
  ]);

  if (error) {
    alert("Error saving invoice");
    console.error(error);
  } else {
    alert("Invoice saved");
  }
};

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Invoice</h1>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <input
              placeholder="Description"
              className="border p-2 col-span-2"
              value={item.description}
              onChange={(e) =>
                updateItem(index, "description", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2"
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", Number(e.target.value))
              }
            />
            <input
              type="number"
              className="border p-2"
              value={item.rate}
              onChange={(e) =>
                updateItem(index, "rate", Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-4 px-4 py-2 bg-black text-white"
      >
        Add Item
      </button>

      <div className="mt-6 text-right">
        <p className="text-lg">
          Subtotal: <strong>${subtotal.toFixed(2)}</strong>
        </p>
      </div>
      <button
  onClick={generatePDF}
  className="mt-4 px-6 py-2 bg-blue-600 text-white"
>
  Download PDF
</button>
<button
  onClick={saveInvoice}
  className="mt-4 ml-4 px-6 py-2 bg-green-600 text-white"
>
  Save Invoice
</button>


    </main>
  );
}
