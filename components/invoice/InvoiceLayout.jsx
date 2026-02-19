import InvoiceHeader from "./InvoiceHeader";
import ClientInfo from "./ClientInfo";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import Footer from "./Footer";
import StatusBadge from "./StatusBadge";

export default function InvoiceLayout({ invoice }) {
  return (
    <div className="max-w-3xl mx-auto p-8 border shadow-md bg-white">
      <InvoiceHeader invoice={invoice} />
      <div className="flex justify-between mt-6">
        <ClientInfo client={invoice.client} />
        <StatusBadge status={invoice.status} />
      </div>
      <InvoiceItemsTable items={invoice.items} />
      <InvoiceTotals totals={invoice.totals} />
      <Footer notes={invoice.notes} />
    </div>
  );
}
