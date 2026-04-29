"use client";

import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase/client";

// ⚠️ NOTE: Before logo upload works, create a Supabase Storage bucket called `logos`.
// Go to Supabase Dashboard → Storage → New Bucket → name it `logos` → set to Public.

export default function CompanySettingsPage() {
  const [color, setColor] = useState("#0d9e8a");
  const [form, setForm] = useState({
    company_name: "",
    company_email: "",
    phone: "",
    website: "",
    address: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) return;

      setForm({
        company_name: data.company_name || "",
        company_email: data.company_email || "",
        phone: data.phone || "",
        website: data.website || "",
        address: data.address || "",
      });
      setColor(data.invoice_primary_color || "#0d9e8a");
      setLogoUrl(data.logo_url || null);
      setLogoPreview(data.logo_url || null);
      setGmailConnected(data.gmail_connected || false);
      setGmailEmail(data.gmail_email || null);
    };

    fetchProfile();
  }, []);

  // Handle logo file selection + upload to Supabase Storage
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    setLogoUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("logos") // ⚠️ Make sure this bucket exists (see note above)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      alert("Logo upload failed");
      setLogoUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("logos")
      .getPublicUrl(filePath);

    setLogoUrl(urlData.publicUrl);
    setLogoUploading(false);
  };

  // Save profile
  const saveBusinessProfile = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Login required");
        return;
      }
const { data: existing, error: fetchError } = await supabase
  .from("business_profiles")
  .select("id")
  .eq("user_id", user.id)
  .maybeSingle(); // ✅ returns null safely if no row, no error thrown

const payload = {
  ...form,
  invoice_primary_color: color,
  logo_url: logoUrl,
  gmail_connected: gmailConnected,
  gmail_email: gmailEmail,
};

if (existing) {
  const { error } = await supabase
    .from("business_profiles")
    .update(payload)
    .eq("user_id", user.id);
  if (error) { console.error(error); alert("Update failed"); return; }
} else {
  const { error } = await supabase
    .from("business_profiles")
    .insert({ user_id: user.id, ...payload });
  if (error) { console.error(error); alert("Insert failed"); return; }
}

      alert("Saved successfully 🚀");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Gmail placeholder handler
  const handleGmailConnect = () => {
    // TODO: Wire up real Gmail OAuth flow
    alert("Gmail OAuth coming soon. This will redirect to Google's consent screen.");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f7f4]">
      <div className="w-full px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1523]">Business Profile</h1>
            <p className="text-sm text-[#9b8ea0] mt-1">
              Manage your business profile and email integrations.
            </p>
          </div>
          <button
            onClick={saveBusinessProfile}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="flex flex-col gap-6 max-w-5xl">

          {/* COMPANY INFO */}
          <Section icon="🏢" title="Company Information" accent="#7c5cbf">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Company Name">
                <Input
                  placeholder="Acme Inc."
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                />
              </Field>
              <Field label="Company Email">
                <Input
                  placeholder="hello@acme.com"
                  value={form.company_email}
                  onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                />
              </Field>
              <Field label="Phone (optional)">
                <Input
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="Website (optional)">
                <Input
                  placeholder="https://acme.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Address (optional)">
                  <textarea
                    rows={3}
                    placeholder="123 Main St, City, Country"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-[#e2dded] rounded-xl px-3 py-2.5 text-sm text-[#1a1523] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all resize-none"
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* BRANDING */}
          <Section icon="🎨" title="Branding" accent="#e8832a">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* LOGO UPLOAD */}
              <Field label="Company Logo">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#d4cfe0] rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9e8a] hover:bg-[#f0faf8] transition-all"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-28 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#9b8ea0]">
                      <span className="text-3xl">🖼️</span>
                      <span className="text-sm font-medium">
                        {logoUploading ? "Uploading..." : "Click to upload logo"}
                      </span>
                      <span className="text-xs">PNG, JPG up to 2MB</span>
                    </div>
                  )}
                </div>
                {logoPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoPreview(null);
                      setLogoUrl(null);
                    }}
                    className="mt-2 text-xs bg-red text-red-400 hover:text-red-600 transition-all"
                  >
                    Remove logo
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </Field>

              {/* COLOR PICKER */}
              <Field label="Invoice Primary Color">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-14 h-10 border border-[#e2dded] rounded-lg cursor-pointer"
                    />
                    <span className="text-sm font-mono text-[#6b5f7a]">{color}</span>
                  </div>

                  {/* LIVE PREVIEW */}
                  <div className="border border-[#e2dded] rounded-xl overflow-hidden">
                    <div
                      className="px-4 py-3 flex items-center justify-between"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-white font-bold text-sm">
                        {form.company_name || "Your Company"}
                      </span>
                      <span className="text-white text-xs opacity-80">INVOICE</span>
                    </div>
                    <div className="px-4 py-3 bg-white flex justify-between items-center">
                      <div>
                        <p className="text-xs text-[#9b8ea0]">Total Due</p>
                        <p className="text-lg font-bold" style={{ color }}>$0.00</p>
                      </div>
                      <div
                        className="text-xs text-white px-3 py-1 rounded-lg font-semibold"
                        style={{ backgroundColor: color }}
                      >
                        Pay Now
                      </div>
                    </div>
                  </div>
                </div>
              </Field>

            </div>
          </Section>

          {/* EMAIL INTEGRATION */}
          <Section icon="📧" title="Email Integration" accent="#0d9e8a">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#1a1523] font-medium">
                  {gmailConnected ? `Connected: ${gmailEmail}` : "Connect your Gmail account"}
                </p>
                <p className="text-xs text-[#9b8ea0] mt-1">
                  Send invoices and reminders directly from your business Gmail account.
                </p>
              </div>

              {gmailConnected ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-teal-600 font-semibold bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                    ✓ Connected
                  </span>
                  <button
                    onClick={() => {
                      setGmailConnected(false);
                      setGmailEmail(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-600 transition-all font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGmailConnect}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2dded] rounded-xl text-sm font-semibold text-[#1a1523] hover:border-[#0d9e8a] hover:bg-[#f0faf8] transition-all shadow-sm"
                >
                  <span>🔗</span> Connect Gmail
                </button>
              )}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  accent,
  children,
}: {
  icon: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 mb-4 bg-white rounded-xl border border-[#e2dded] shadow-sm">
      <div className="py-4 border-b border-[#f0edf6]">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className="font-bold text-base" style={{ color: accent }}>
            {title}
          </h2>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-widest text-[#9b8ea0] uppercase mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-[#e2dded] rounded-xl p-2 text-sm text-[#1a1523] bg-white placeholder:text-[#c4bdd0] focus:outline-none focus:ring-2 focus:ring-[#0d9e8a]/30 focus:border-[#0d9e8a] transition-all"
    />
  );
}