// 'use client'

// import React, { useState } from 'react'

// interface Item {
//   description: string
//   qty: number
//   price: number
// }

// export default function CreateInvoicePage() {
//   const [items, setItems] = useState<Item[]>([{ description: '', qty: 1, price: 0 }])
//   const [clientName, setClientName] = useState('')
//   const [clientEmail, setClientEmail] = useState('')
//   const [invoiceNumber, setInvoiceNumber] = useState('INV-001')
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
//   const [dueDate, setDueDate] = useState('')
//   const [tax, setTax] = useState(0)
//   const [notes, setNotes] = useState('')

//   const addItem = () => setItems([...items, { description: '', qty: 1, price: 0 }])
//   const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))
//   const updateItem = (index: number, key: keyof Item, value: any) => {
//     const newItems = [...items]
//     newItems[index][key] = key === 'qty' || key === 'price' ? Number(value) : value
//     setItems(newItems)
//   }

//   const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0)
//   const total = subtotal + (subtotal * tax) / 100

//   const handleSave = () => {
//     alert('Invoice saved! Total: $' + total)
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header Actions */}
//       <div className="flex flex-wrap justify-end gap-3 mb-6">
//         <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Preview</button>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Download PDF</button>
//         <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Send Email</button>
//       </div>

//       {/* Page Title */}
//       <h1 className="text-3xl font-bold text-teal-700 mb-6">Create Invoice</h1>

//       {/* Company & Client Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-3">
//           <h2 className="font-semibold text-lg mb-2">Your Company</h2>
//           <input className="border p-2 rounded" placeholder="Business Name" />
//           <input className="border p-2 rounded" placeholder="Email" />
//           <input className="border p-2 rounded" placeholder="Address" />
//           <input className="border p-2 rounded" placeholder="Phone" />
//           <input type="file" className="mt-2" />
//         </div>
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-3">
//           <h2 className="font-semibold text-lg mb-2">Client Details</h2>
//           <input
//             className="border p-2 rounded"
//             type="text"
//             placeholder="Client Name"
//             value={clientName}
//             onChange={e => setClientName(e.target.value)}
//           />
//           <input
//             className="border p-2 rounded"
//             type="email"
//             placeholder="Client Email"
//             value={clientEmail}
//             onChange={e => setClientEmail(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Invoice Meta */}
//       <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4 mb-6">
//         <div className="flex flex-col w-48">
//           <label className="text-gray-600 text-sm">Invoice Number</label>
//           <input
//             className="border p-2 rounded"
//             type="text"
//             value={invoiceNumber}
//             onChange={e => setInvoiceNumber(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col w-48">
//           <label className="text-gray-600 text-sm">Date</label>
//           <input
//             className="border p-2 rounded"
//             type="date"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col w-48">
//           <label className="text-gray-600 text-sm">Due Date</label>
//           <input
//             className="border p-2 rounded"
//             type="date"
//             value={dueDate}
//             onChange={e => setDueDate(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Items Table */}
//       <div className="bg-white shadow rounded-lg p-4 mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="text-lg font-semibold">Line Items</h2>
//           <button
//             onClick={addItem}
//             className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
//           >
//             + Add Item
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-2 py-1">Description</th>
//                 <th className="border px-2 py-1">Qty</th>
//                 <th className="border px-2 py-1">Price</th>
//                 <th className="border px-2 py-1">Total</th>
//                 <th className="border px-2 py-1">Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="border px-2 py-1">
//                     <input
//                       type="text"
//                       className="w-full border rounded p-1"
//                       placeholder="Item description"
//                       value={item.description}
//                       onChange={e => updateItem(i, 'description', e.target.value)}
//                     />
//                   </td>
//                   <td className="border px-2 py-1">
//                     <input
//                       type="number"
//                       min={1}
//                       className="w-full border rounded p-1"
//                       value={item.qty}
//                       onChange={e => updateItem(i, 'qty', e.target.value)}
//                     />
//                   </td>
//                   <td className="border px-2 py-1">
//                     <input
//                       type="number"
//                       min={0}
//                       className="w-full border rounded p-1"
//                       value={item.price}
//                       onChange={e => updateItem(i, 'price', e.target.value)}
//                     />
//                   </td>
//                   <td className="border px-2 py-1">${item.qty * item.price}</td>
//                   <td className="border px-2 py-1 text-center">
//                     <button className="text-red-600 font-bold" onClick={() => removeItem(i)}>
//                       X
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Summary + Notes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white shadow rounded-lg p-4 max-w-sm">
//           <label className="text-gray-600 text-sm">Tax %</label>
//           <input
//             type="number"
//             min={0}
//             className="border p-2 rounded mb-2 w-full"
//             value={tax}
//             onChange={e => setTax(Number(e.target.value))}
//           />
//           <div className="flex justify-between font-bold mb-1">
//             <span>Subtotal:</span>
//             <span>${subtotal}</span>
//           </div>
//           <div className="flex justify-between font-bold">
//             <span>Total:</span>
//             <span>${total}</span>
//           </div>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4">
//           <label className="text-gray-600 text-sm">Notes / Terms</label>
//           <textarea
//             className="w-full border rounded p-2 h-32 mt-2"
//             placeholder="Optional notes..."
//             value={notes}
//             onChange={e => setNotes(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-3">
//         <button
//           onClick={handleSave}
//           className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
//         >
//           Save / Generate Invoice
//         </button>
//         <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">
//           Send Email
//         </button>
//       </div>
//     </div>
//   )
// }