export default function InvoiceTotals({ totals }) {
  return (
    <div className="mt-6 flex justify-end">
      <div className="w-1/2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{totals.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{totals.tax}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{totals.total}</span>
        </div>
      </div>
    </div>
  );
}
