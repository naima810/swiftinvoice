export default function InvoiceItemsTable({ items }) {
  return (
    <table className="w-full mt-6 border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Item</th>
          <th className="text-right p-2">Qty</th>
          <th className="text-right p-2">Price</th>
          <th className="text-right p-2">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-b">
            <td className="p-2">{item.name}</td>
            <td className="p-2 text-right">{item.qty}</td>
            <td className="p-2 text-right">{item.price}</td>
            <td className="p-2 text-right">{item.qty * item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
