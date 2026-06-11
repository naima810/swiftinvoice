"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarClock, Send } from "lucide-react";

/**
 * ============================================================================
 * STATUS MODEL
 * ============================================================================
 * payment_status (stored value, can be set manually by the user) is one of:
 *   "draft" | "unpaid" | "paid" | "cancelled" | "overdue"
 *
 * However, "overdue" is special: it is NOT something the user normally sets
 * directly. Instead, an invoice is considered overdue automatically when:
 *    - payment_status === "unpaid"  (i.e. not paid/cancelled/draft)
 *    - AND due_date is in the past
 *
 * getDisplayStatus() below is the SINGLE SOURCE OF TRUTH for what status
 * is shown/filtered in the UI. It layers the automatic "overdue" check on
 * top of the raw payment_status.
 *
 * If the user manually changes status (e.g. marks "paid" or "cancelled"),
 * that overrides the automatic overdue calculation, since those statuses
 * are checked first.
 * ============================================================================
 */

// All statuses the user is allowed to manually set from the UI dropdown.
// "overdue" is intentionally excluded — it's derived, not set directly.
const MANUAL_STATUS_OPTIONS = ["draft", "unpaid", "paid", "cancelled"];

// Badge color map for each *display* status (includes derived "overdue")
const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
  draft: "bg-yellow-100 text-yellow-700",
};

/**
 * Returns the status that should actually be displayed/filtered on,
 * applying the automatic overdue rule on top of the stored payment_status.
 */
function getDisplayStatus(inv) {
  if (inv.payment_status === "paid") return "paid";
  if (inv.payment_status === "cancelled") return "cancelled";
  if (inv.payment_status === "draft") return "draft";

  // Only "unpaid" invoices can become "overdue"
  if (inv.payment_status === "unpaid") {
    const dueDate = new Date(inv.due_date);
    const today = new Date();
    if (dueDate < today) return "overdue";
    return "unpaid";
  }

  // Fallback (shouldn't normally happen)
  return inv.payment_status;
}

/**
 * Returns how many days overdue an invoice is (0 if not overdue).
 */
function getDaysOverdue(inv) {
  const diffMs = new Date() - new Date(inv.due_date);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

/**
 * Generates email subject/body for a given invoice + tone.
 * Pure function — no side effects, easy to unit test.
 */
function generateEmail(inv, tone) {
  const daysLate = getDaysOverdue(inv);

  const templates = {
    friendly: {
      subject: "Friendly reminder about your invoice",
      body: `Hi ${inv.clients?.name},

Just a quick reminder that invoice ${inv.invoice_number} is still pending.

It was due on ${inv.due_date} (${daysLate} days ago).

Whenever you're ready, you can process the payment.

Thanks!`,
    },
    firm: {
      subject: "Payment Reminder - Invoice Overdue",
      body: `Dear ${inv.clients?.name},

This is a reminder that invoice ${inv.invoice_number} is overdue.

Due date: ${inv.due_date}
Days overdue: ${daysLate}

Please clear the payment as soon as possible.`,
    },
    casual: {
      subject: "Hey, quick payment reminder",
      body: `Hey ${inv.clients?.name},

Just checking in about invoice ${inv.invoice_number}.

It's been ${daysLate} days since the due date (${inv.due_date}).

Let me know if anything is needed.`,
    },
    custom: {
      subject: "",
      body: "",
    },
  };

  return templates[tone] || templates.custom;
}

/**
 * ============================================================================
 * API LAYER (frontend-only mocks for now)
 * ============================================================================
 * These functions are isolated so that swapping in real backend calls later
 * is just a matter of replacing the body of each function — nothing in the
 * component needs to change.
 * ============================================================================
 */

async function apiFetchInvoices() {
  const res = await fetch("/api/invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

/**
 * Update an invoice's payment_status.
 * TODO (backend): replace with PATCH /api/invoices/:id
 *   body: { payment_status: newStatus }
 */
async function apiUpdateInvoiceStatus(invoiceId, newStatus) {
  // --- MOCK ---
  await new Promise((r) => setTimeout(r, 300));
  return { id: invoiceId, payment_status: newStatus };

  // --- REAL IMPLEMENTATION (uncomment when backend is ready) ---
  // const res = await fetch(`/api/invoices/${invoiceId}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ payment_status: newStatus }),
  // });
  // if (!res.ok) throw new Error("Failed to update status");
  // return res.json();
}

/**
 * Send a reminder email for an invoice.
 * TODO (backend): replace with POST /api/invoices/:id/send-reminder
 *   body: { subject, body }
 */
async function apiSendReminder(invoiceId, emailPayload) {
  // --- MOCK ---
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, sentAt: new Date().toISOString() };

  // --- REAL IMPLEMENTATION (uncomment when backend is ready) ---
  // const res = await fetch(`/api/invoices/${invoiceId}/send-reminder`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(emailPayload),
  // });
  // if (!res.ok) throw new Error("Failed to send reminder");
  // return res.json();
}

/**
 * ============================================================================
 * COMPONENT
 * ============================================================================
 */
export default function RemindersPage() {
  const router = useRouter();

  // --- Data state ---
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter / tab state ---
  const [tab, setTab] = useState("overdue"); // "overdue" | "due" | "all"

  // --- Sending state ---
  const [sendingId, setSendingId] = useState(null);
  const [sentCount, setSentCount] = useState(0);

  // --- Status update state (for the inline status dropdown per row) ---
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // --- Modal / draft email state ---
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [draft, setDraft] = useState({
    tone: "friendly",
    subject: "",
    body: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await apiFetchInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles tone changes inside the modal.
   * Regenerates subject/body for preset tones; clears them for "custom"
   * so the user can type their own from scratch.
   */
  function handleToneChange(newTone) {
    if (!selectedInvoice) return;

    if (newTone === "custom") {
      setDraft((prev) => ({
        ...prev,
        tone: "custom",
        subject: "Custom Email",
        body: "",
      }));
      return;
    }

    const email = generateEmail(selectedInvoice, newTone);
    setDraft({
      tone: newTone,
      subject: email.subject,
      body: email.body,
    });
  }

  /**
   * Opens the "Send Reminder" modal for a given invoice,
   * pre-filling the draft with a "friendly" tone email.
   */
  function openReminderModal(inv) {
    const email = generateEmail(inv, "friendly");
    setSelectedInvoice(inv);
    setDraft({
      tone: "friendly",
      subject: email.subject,
      body: email.body,
    });
    setShowModal(true);
  }

  /**
   * Sends the reminder using the current draft contents.
   */
  async function sendReminder() {
    if (!selectedInvoice) return;

    setSendingId(selectedInvoice.id);
    try {
      await apiSendReminder(selectedInvoice.id, {
        subject: draft.subject,
        body: draft.body,
      });

      setSentCount((prev) => prev + 1);
      setShowModal(false);
      setSelectedInvoice(null);
    } catch (err) {
      console.error(err);
      alert("Failed to send reminder. Please try again.");
    } finally {
      setSendingId(null);
    }
  }

  /**
   * Manually update an invoice's payment_status (e.g. mark as Paid).
   * Updates local state optimistically, then calls the API.
   */
  async function updateInvoiceStatus(invoiceId, newStatus) {
    setUpdatingStatusId(invoiceId);

    // Optimistic update
    const previousInvoices = invoices;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, payment_status: newStatus } : inv
      )
    );

    try {
      await apiUpdateInvoiceStatus(invoiceId, newStatus);
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Reverting.");
      setInvoices(previousInvoices); // rollback on failure
    } finally {
      setUpdatingStatusId(null);
    }
  }

  /**
   * Filters invoices based on the active tab, using the DERIVED
   * display status (so "overdue" is calculated automatically).
   */
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const status = getDisplayStatus(inv);

      if (tab === "all") return true;
      if (tab === "overdue") return status === "overdue";
      if (tab === "due") return status === "unpaid"; // due, not yet overdue

      return true;
    });
  }, [invoices, tab]);

  /**
   * Stat counts — derived live from invoices, not hardcoded.
   */
  const overdueCount = useMemo(
    () => invoices.filter((inv) => getDisplayStatus(inv) === "overdue").length,
    [invoices]
  );

  const dueSoonCount = useMemo(
    () => invoices.filter((inv) => getDisplayStatus(inv) === "unpaid").length,
    [invoices]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Reminders</h1>
          <p className="text-sm text-gray-500">
            Track overdue invoices and send reminders
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded shadow flex flex-row justify-start items-center gap-4">
          <AlertTriangle className="text-red-600" size={24} />
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm text-gray-500">Overdue Invoices</p>
            <p className="text-xl font-bold text-red-600">{overdueCount}</p>
            <p className="text-xs text-gray-400">Past due date</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-row justify-start items-center gap-4">
          <CalendarClock className="text-orange-500" size={24} />
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm text-gray-500">Due (Not Yet Overdue)</p>
            <p className="text-xl font-bold text-orange-500">{dueSoonCount}</p>
            <p className="text-xs text-gray-400">Awaiting payment</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-row justify-start items-center gap-4">
          <Send className="text-teal-600" size={24} />
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm text-gray-500">Reminders Sent</p>
            <p className="text-xl font-bold text-teal-600">{sentCount}</p>
            <p className="text-xs text-gray-400">This session</p>
          </div>
        </div>
      </div>

      {/* TABS + LIST */}
      <div className="flex flex-col bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-row gap-2 mb-4 border-b">
          <button
            onClick={() => setTab("overdue")}
            className={`px-3 py-2 text-sm font-medium ${
              tab === "overdue"
                ? "border-b-2 border-teal-600 text-black"
                : "text-gray-500"
            }`}
          >
            Overdue ({overdueCount})
          </button>

          <button
            onClick={() => setTab("due")}
            className={`px-3 py-2 text-sm font-medium ${
              tab === "due"
                ? "border-b-2 border-teal-600 text-black"
                : "text-gray-500"
            }`}
          >
            Due ({dueSoonCount})
          </button>

          <button
            onClick={() => setTab("all")}
            className={`px-3 py-2 text-sm font-medium ${
              tab === "all"
                ? "border-b-2 border-teal-600 text-black"
                : "text-gray-500"
            }`}
          >
            All ({invoices.length})
          </button>
        </div>

        {/* MOBILE CARDS */}
        <div className="grid gap-3 sm:hidden">
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">No invoices in this view.</p>
          ) : (
            filtered.map((inv) => {
              const status = getDisplayStatus(inv);
              return (
                <div key={inv.id} className="bg-white p-4 rounded shadow border">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{inv.invoice_number}</p>

                    {/* Status dropdown — lets user manually change status */}
                    <select
                      value={inv.payment_status}
                      disabled={updatingStatusId === inv.id}
                      onChange={(e) =>
                        updateInvoiceStatus(inv.id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded border-0 ${STATUS_STYLES[status]}`}
                    >
                      {MANUAL_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {inv.clients?.name}
                  </p>

                  <p className="text-sm mt-1">Due: {inv.due_date}</p>

                  {status === "overdue" && (
                    <p className="text-xs text-red-500 mt-1">
                      {getDaysOverdue(inv)} days overdue
                    </p>
                  )}

                  <p className="font-bold mt-1 text-teal-600">${inv.total}</p>

                  <button
                    onClick={() => openReminderModal(inv)}
                    disabled={sendingId === inv.id}
                    className="mt-3 w-full bg-teal-600 text-white py-2 rounded disabled:opacity-50"
                  >
                    {sendingId === inv.id ? "Sending..." : "Send Reminder"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block border border-gray-200 bg-white rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Invoice</th>
                <th className="p-3">Client</th>
                <th className="p-3">Due</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-4 text-sm text-gray-400" colSpan={6}>
                    No invoices in this view.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const status = getDisplayStatus(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 ">
                      <td className="p-3 font-medium">{inv.invoice_number}</td>
                      <td className="p-3">{inv.clients?.name}</td>
                      <td className="p-3">
                        {inv.due_date}
                        {status === "overdue" && (
                          <span className="block text-xs text-red-500">
                            {getDaysOverdue(inv)} days overdue
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-teal-600">
                        ${inv.total}
                      </td>

                      <td className="p-3">
                        {/* Status dropdown — lets user manually change status.
                            "overdue" itself isn't selectable since it's
                            derived automatically from "unpaid" + due date. */}
                        <select
                          value={inv.payment_status}
                          disabled={updatingStatusId === inv.id}
                          onChange={(e) =>
                            updateInvoiceStatus(inv.id, e.target.value)
                          }
                          className={`text-xs px-2 py-1 rounded border-0 ${STATUS_STYLES[status]}`}
                        >
                          {MANUAL_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => openReminderModal(inv)}
                          disabled={sendingId === inv.id}
                          className="bg-teal-500 px-1 rounded text-white font-medium hover:bg-teal-700 disabled:opacity-50"
                        >
                          {sendingId === inv.id ? "Sending..." : "Send Reminder"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEND REMINDER MODAL */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl overflow-x-scroll scrollbar-thin rounded-xl shadow-xl my-2 max-h-[90vh]">
            {/* HEADER */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Send Reminder</h2>
              <p className="text-xs text-gray-500">
                Review before sending email
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-4">
              {/* INVOICE INFO */}
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                <p>
                  <b>Invoice:</b> {selectedInvoice.invoice_number}
                </p>
                <p>
                  <b>Client:</b> {selectedInvoice.clients?.name}
                </p>
                <p>
                  <b>Email:</b> {selectedInvoice.clients?.email}
                </p>
                <p>
                  <b>Due Date:</b> {selectedInvoice.due_date}
                </p>
              </div>

              {/* TONE */}
              <div>
                <label className="text-sm font-medium">Tone</label>
                <select
                  value={draft.tone}
                  onChange={(e) => handleToneChange(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                >
                  <option value="friendly">Friendly</option>
                  <option value="firm">Firm</option>
                  <option value="casual">Casual</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* EMAIL EDITOR */}
              <div className="border rounded-lg overflow-hidden">
                {/* SUBJECT */}
                <div className="p-2 border-b bg-gray-50">
                  <input
                    className="w-full outline-none text-sm bg-transparent"
                    value={draft.subject}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Subject"
                  />
                </div>

                {/* BODY */}
                <div className="p-2">
                  <textarea
                    className="w-full min-h-[160px] outline-none text-sm"
                    value={draft.body}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, body: e.target.value }))
                    }
                    placeholder="Email content..."
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg text-sm"
                disabled={sendingId === selectedInvoice.id}
              >
                Cancel
              </button>

              <button
                onClick={sendReminder}
                disabled={sendingId === selectedInvoice.id}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {sendingId === selectedInvoice.id ? "Sending..." : "Send Reminder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}