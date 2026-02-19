"use client";

import { useState } from "react";

export default function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    company: {
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    details: {
      invoiceNumber: `SW-${Math.floor(Math.random() * 10000)}`,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      currency: "USD",
      status: "Draft",
    },
    items: [
      { name: "", description: "", quantity: 1, price: 0 },
    ],
    tax: 0,
    discount: 0,
    notes: "",
  });

  const handleChange = (section, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { name: "", description: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(invoice);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Client Info */}
        <div>
          <h2 className="font-semibold mb-2">Client Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Client Name"
              className="input"
              value={invoice.client.name}
              onChange={(e) => handleChange("client", "name", e.target.value)}
              required
            />
            <input
              placeholder="Client Email"
              className="input"
              value={invoice.client.email}
              onChange={(e) => handleChange("client", "email", e.target.value)}
            />
            <input
              placeholder="Client Phone"
              className="input"
              value={invoice.client.phone}
              onChange={(e) => handleChange("client", "phone", e.target.value)}
            />
            <input
              placeholder="Client Address"
              className="input"
              value={invoice.client.address}
              onChange={(e) => handleChange("client", "address", e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Details */}
        <div>
          <h2 className="font-semibold mb-2">Invoice Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Invoice Number"
              className="input"
              value={invoice.details.invoiceNumber}
              onChange={(e) =>
                handleChange("details", "invoiceNumber", e.target.value)
              }
            />
            <input
              type="date"
              className="input"
              value={invoice.details.issueDate}
              onChange={(e) =>
                handleChange("details", "issueDate", e.target.value)
              }
            />
            <input
              type="date"
              className="input"
              value={invoice.details.dueDate}
              onChange={(e) =>
                handleChange("details", "dueDate", e.target.value)
              }
            />
            <select
              className="input"
              value={invoice.details.currency}
              onChange={(e) =>
                handleChange("details", "currency", e.target.value)
              }
            >
              <option>USD</option>
              <option>EUR</option>
              <option>PKR</option>
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h2 className="font-semibold mb-2">Line Items</h2>
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 mb-2">
              <input
                placeholder="Item Name"
                className="input"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
              />
              <input
                placeholder="Description"
                className="input"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Qty"
                className="input"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="input"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", Number(e.target.value))
                }
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white rounded px-2"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            + Add Item
          </button>
        </div>

        {/* Tax & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Tax %"
            className="input"
            value={invoice.tax}
            onChange={(e) =>
              setInvoice({ ...invoice, tax: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Discount %"
            className="input"
            value={invoice.discount}
            onChange={(e) =>
              setInvoice({ ...invoice, discount: Number(e.target.value) })
            }
          />
        </div>

        {/* Notes */}
        <textarea
          placeholder="Notes"
          className="input w-full"
          value={invoice.notes}
          onChange={(e) =>
            setInvoice({ ...invoice, notes: e.target.value })
          }
        />

        {/* Summary */}
        <div className="text-right space-y-1">
          <p>Subtotal: {subtotal.toFixed(2)}</p>
          <p>Tax: {taxAmount.toFixed(2)}</p>
          <p>Discount: {discountAmount.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: {total.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Save Invoice
        </button>

      </form>
    </div>
  );
}
