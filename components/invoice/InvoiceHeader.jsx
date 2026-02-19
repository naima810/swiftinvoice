export default function InvoiceHeader({ invoice }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{invoice.business.name}</h1>
        <p>{invoice.business.address}</p>
        <p>{invoice.business.email}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">Invoice: {invoice.id}</p>
        <p>Date: {invoice.date}</p>
        <p>Due: {invoice.dueDate}</p>
      </div>
    </div>
  );
}
