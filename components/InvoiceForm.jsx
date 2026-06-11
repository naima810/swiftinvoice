'use client'

import { useState, useEffect } from 'react'

export default function InvoiceForm({initialData, mode}) {

  const [step, setStep] = useState(1)

const [formData, setFormData] = useState({
  id:'',
  clientName: "",
  clientEmail: "",
  companyName: "",
  dueDate: "",
  invoiceNumber: "",
  tax: { type: "percent", value: 0 },
  discount: { type: "percent", value: 0 },
  currency: "USD",
  notes: "",
  items: [],
  reminders: {
    enabled: false,
    mode: "light",
  },
  sendNow: true,
});

useEffect(() => {
  if (!initialData) return;

  setFormData((prev) => ({
  ...prev,
  ...initialData,
}));
}, [initialData]);

  const isEdit = mode === "edit";
  const invoiceId = initialData?.id;
  async function handleSubmit() {
    
      const payload = {
        id: formData.id,
    clientName: formData.clientName,
    clientEmail: formData.clientEmail,
    companyName: formData.companyName,
    due_date: formData.dueDate,
    currency: formData.currency,
    notes: formData.notes,
    tax: formData.tax.value,
    discount: formData.discount.value,
    total: totalAmount,
  };
    if (!isEdit) {
    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        items: formData.items,
        reminders: formData.reminders,
      }),
    });

    return;
  }
  console.log("initialData:", initialData);
console.log("initialData.id:", initialData?.id);
    await fetch(`/api/invoices/${invoiceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      due_date: formData.dueDate,
      currency: formData.currency,
      notes: formData.notes,
      tax: formData.tax.value,
      discount: formData.discount.value,
      total: totalAmount,
    }),
  });
}

  const reminderRules = {
  light: {
    beforeDue: [5],
    afterDue: [7]
  },

  standard: {
    beforeDue: [3],
    afterDue: [1, 4, 10]
  },

  aggressive: {
    beforeDue: [2],
    afterDue: [1, 2, 5, 7]
  }
}

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const updatedItems = [...formData.items]

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemName: '',
          quantity: 1,
          price: 0,
          invoiceId: '', // Associate with current invoice
        },
      ],
    })
  }

const subtotal = formData.items.reduce(
  (acc, item) => acc + Number(item.quantity) * Number(item.price),
  0
)

const discountAmount = (subtotal * formData.discount.value) / 100
const taxedBase = subtotal - discountAmount
const taxAmount = (taxedBase * formData.tax.value) / 100

const totalAmount = taxedBase + taxAmount

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          
  {mode === "edit"
    ? <h1>Edit Invoice</h1>
    : <h1>Create Invoice</h1>}


          <p className="text-gray-500">
            Create and send invoices in a few simple steps.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10">

          {/* Step 1 */}
          <div className="flex items-center flex-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${step >= 1
                  ? 'bg-[#00bba7] text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              1
            </div>

            <div
              className={`
                flex-1 h-1 mx-2 rounded-full transition-all duration-300
                ${step >= 2 ? 'bg-[#00bba7]' : 'bg-gray-200'}
              `}
            />
          </div>
          

          {/* Step 2 */}
          <div className="flex items-center flex-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${step >= 2
                  ? 'bg-[#00bba7] text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              2
            </div>

            <div
              className={`
                flex-1 h-1 mx-2 rounded-full transition-all duration-300
                ${step >= 3 ? 'bg-[#00bba7]' : 'bg-gray-200'}
              `}
            />
          </div>

          {/* Step 3 */}
          <div className="flex items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${step >= 3
                  ? 'bg-[#00bba7] text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              3
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm text-gray-500 mb-8 px-1">
          <span>Client Info</span>
          <span>Invoice Items</span>
          <span>Send</span>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 md:p-8">
{/* STEP 1 */}
{step === 1 && (
  <div>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Client Information
      </h2>

      <button className="p-2 bg-[#00bba7] hover:bg-[#009a8a] transition text-white rounded-xl text-sm font-medium">
        + Add New Client
      </button>
    </div>

    {/* Client Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Name
        </label>

        <input
          type="text"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({
              ...formData,
              clientName: e.target.value,
            })
          }
          placeholder="John Doe"
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Email
        </label>

        <input
          type="email"
          value={formData.clientEmail}
          disabled={isEdit}
          onChange={(e) =>
            setFormData({
              ...formData,
              clientEmail: e.target.value,
            })
          }
          placeholder="john@example.com"
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>

        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({
              ...formData,
              companyName: e.target.value,
            })
          }
          placeholder="Acme Inc"
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
        />
      </div>
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Currency
  </label>

  <select
    value={formData.currency}
    onChange={(e) =>
      setFormData({
        ...formData,
        currency: e.target.value,
      })
    }
    className="w-full border border-gray-200 rounded-xl p-3"
    disabled={mode === "edit"}
  >
    <option value="USD">USD</option>
    <option value="PKR">PKR</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
  </select>
</div>
    </div>

    {/* Divider */}
    <hr className="my-8 border-gray-200" />

    {/* Invoice Details */}
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
      Invoice Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invoice Number
        </label>

        <input
          type="text"
          value={formData.invoiceNumber}
          disabled
          className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Date
        </label>

        <input
          type="date"
          disabled={isEdit}
          value={formData.issueDate || new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>

        <input
          type="date"
          
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              dueDate: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
        />
      </div>
    </div>
  </div>
)}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Invoice Items
                </h2>

                <button
                  onClick={addItem}
                  className="bg-[#00bba7] hover:bg-[#00bba7]-700 transition text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-5">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name
                        </label>

                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(index, 'itemName', e.target.value)
                          }
                          placeholder="Website Design"
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>

                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', Number(e.target.value))
                          }
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>

                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, 'price', Number(e.target.value))
                          }
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
                {/* Adjustments */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

  {/* Discount */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Discount (% or fixed)
    </label>
    <div className="flex items-center gap-3 mt-4 md:mt-8">
    <select
      value={formData.discount.type}
      onChange={(e) =>
        setFormData({
          ...formData,
          discount: {
            ...formData.discount,
            type: e.target.value,
          },
        })
      }
      className="border border-gray-200 rounded-xl p-3"
    >
      <option className='hover:bg-[#00bba7]' value="percent">%</option>
      <option value="fixed">Fixed</option>
    </select>
    <input
      type="number"
      value={formData.discount.value}
      onChange={(e) =>
        setFormData({
          ...formData,
          discount: {
            ...formData.discount,
            value: Number(e.target.value),
          },
        })
      }
      placeholder="e.g. 10"
      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
    />
    </div>
  </div>

  {/* Tax */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Tax (%)
    </label>
    <div className="flex flex-row items-center gap-3 mt-4 md:mt-8">
      <select
      value={formData.tax.type}
      onChange={(e) =>
        setFormData({
          ...formData,
          tax: {
            ...formData.tax,
            type: e.target.value,
          },
        })
      }
      className="border border-gray-200 rounded-xl p-3"
    >
      <option className='hover:bg-[#00bba7]' value="percent">%</option>
      <option className='hover:bg-[#00bba7]' value="fixed">Fixed</option>
    </select>
    <input
      type="number"
      value={formData.tax.value}
      onChange={(e) =>
        setFormData({
          ...formData,
          tax: {
            ...formData.tax,
            value: Number(e.target.value),
          },
        })
      }
      placeholder="e.g. 15"
      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00bba7]"
    />
    </div>
  </div>

</div>
              {/* Total */}
              <div className="mt-8 flex justify-end">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 min-w-[220px]">
                  <p className="text-sm text-gray-500 mb-1">
                    Total Amount
                  </p>

                  <h3 className="text-3xl font-bold text-[#00bba7]">
                    <div className="space-y-1 text-right">
  <p className="text-sm text-gray-500">Subtotal: ${subtotal}</p>
  <p className="text-sm text-gray-500">Discount: -${discountAmount}</p>
  <p className="text-sm text-gray-500">Tax: +${taxAmount}</p>

  <h3 className="text-3xl font-bold text-[#00bba7]">
    ${totalAmount}
  </h3>
</div>
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Send & Reminders
              </h2>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Notes
  </label>

  <textarea
    value={formData.notes}
    onChange={(e) =>
      setFormData({
        ...formData,
        notes: e.target.value,
      })
    }
    placeholder="Add any extra notes for the client..."
    className="w-full border border-gray-200 rounded-xl p-3 h-28 outline-none focus:ring-2 focus:ring-[#00bba7]"
  />
</div>

              <div className="space-y-5">

                <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Send Invoice Immediately
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Automatically email invoice after creation.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.sendNow}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sendNow: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>

                {/* Enable Reminders */}
<div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">
  <div>
    <h3 className="font-semibold text-gray-900">
      Enable Reminders
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      Send payment reminders automatically.
    </p>
  </div>

  <input
    type="checkbox"
    checked={formData.reminders.enabled}
    onChange={(e) =>
      setFormData({
        ...formData,
        reminders: {
          ...formData.reminders,
          enabled: e.target.checked,
        },
      })
    }
    className="w-5 h-5"
  />
</div>
{formData.reminders.enabled && (
  <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
    
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">
          Reminder Settings
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Use global settings or customize for this invoice.
        </p>
      </div>

    </div>

    {/* Only show custom settings if NOT using default */}
    <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
  <h3 className="font-semibold text-gray-900">
    Reminder Behavior
  </h3>

  <p className="text-sm text-gray-500">
    Choose how aggressively you want to follow up unpaid invoices.
  </p>

  {/* LIGHT */}
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="radio"
      name="reminderMode"
      value="light"
      checked={formData.reminders.mode === "light"}
      onChange={(e) =>
        setFormData({
          ...formData,
          reminders: {
            ...formData.reminders,
            mode: e.target.value,
            enabled: true,
          },
        })
      }
      className="mt-1"
    />

    <div>
      <p className="font-medium text-gray-900">Light (Friendly)</p>
      <p className="text-sm text-gray-500">
        Minimal reminders. Best for trusted clients.
      </p>
    </div>
  </label>

  {/* STANDARD */}
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="radio"
      name="reminderMode"
      value="standard"
      checked={formData.reminders.mode === "standard"}
      onChange={(e) =>
        setFormData({
          ...formData,
          reminders: {
            ...formData.reminders,
            mode: e.target.value,
            enabled: true,
          },
        })
      }
      className="mt-1"
    />

    <div>
      <p className="font-medium text-gray-900">Standard (Balanced)</p>
      <p className="text-sm text-gray-500">
        Default reminders before and after due date.
      </p>
    </div>
  </label>

  {/* AGGRESSIVE */}
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="radio"
      name="reminderMode"
      value="aggressive"
      checked={formData.reminders.mode === "aggressive"}
      onChange={(e) =>
        setFormData({
          ...formData,
          reminders: {
            ...formData.reminders,
            mode: e.target.value,
            enabled: true,
          },
        })
      }
      className="mt-1"
    />

    <div>
      <p className="font-medium text-gray-900">Aggressive (Strict)</p>
      <p className="text-sm text-gray-500">
        Frequent reminders. For late or unreliable clients.
      </p>
    </div>
  </label>
</div>
  </div>
)}

                {/* Summary */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Invoice Summary
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client</span>
                      <span className="font-medium text-gray-900">
                        {formData.clientName || 'Not Added'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Items</span>
                      <span className="font-medium text-gray-900">
                        {formData.items.length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-emerald-700 text-lg">
                        ${totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">

            <button
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium disabled:opacity-40"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="bg-[#00bba7] hover:bg-[#009a8a] transition text-white px-6 py-3 rounded-xl font-medium"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}  
                className="bg-[#00bba7] hover:bg-emerald-700 transition text-white px-6 py-3 rounded-xl font-medium"
              >
                {isEdit ? "Update Invoice" : "Create Invoice"}
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}
