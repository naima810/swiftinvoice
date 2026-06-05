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
  <div className="min-h-screen w-full bg-gray-50 px-4 md:px-10 py-8">

    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your business profile and email integrations.
          </p>
        </div>

        <button
          onClick={saveBusinessProfile}
          disabled={saving}
          className="px-5 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* SECTIONS WRAPPER */}
      <div className="flex flex-col gap-6">

        {/* COMPANY INFO */}
        <Section icon="🏢" title="Company Information" accent="#7c5cbf">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Company Name">
              <Input
                placeholder="Acme Inc."
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
              />
            </Field>

            <Field label="Company Email">
              <Input
                placeholder="hello@acme.com"
                value={form.company_email}
                onChange={(e) =>
                  setForm({ ...form, company_email: e.target.value })
                }
              />
            </Field>

            <Field label="Phone (optional)">
              <Input
                placeholder="+1 555 000 0000"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </Field>

            <Field label="Website (optional)">
              <Input
                placeholder="https://acme.com"
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Address (optional)">
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </Field>
            </div>
          </div>
        </Section>

        {/* BRANDING */}
        <Section icon="🎨" title="Branding" accent="#e8832a">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LOGO */}
            <Field label="Company Logo">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl h-44 flex items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    className="h-28 object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <p className="text-3xl">🖼️</p>
                    <p className="text-sm mt-2">
                      {logoUploading ? "Uploading..." : "Upload Logo"}
                    </p>
                  </div>
                )}
              </div>
            </Field>

            {/* COLOR */}
            <Field label="Primary Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border"
                />
                <span className="text-sm text-gray-500">{color}</span>
              </div>

              {/* preview */}
              <div className="mt-4 border rounded-2xl overflow-hidden">
                <div
                  className="px-4 py-3 text-white font-semibold"
                  style={{ backgroundColor: color }}
                >
                  {form.company_name || "Your Company"}
                </div>
                <div className="p-4 bg-white flex justify-between">
                  <span>Total</span>
                  <span style={{ color }} className="font-bold">
                    $0.00
                  </span>
                </div>
              </div>
            </Field>

          </div>
        </Section>

        {/* EMAIL */}
        <Section icon="📧" title="Email Integration" accent="#0d9e8a">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">
                {gmailConnected
                  ? `Connected: ${gmailEmail}`
                  : "Connect Gmail"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Send invoices and reminders automatically.
              </p>
            </div>

            <button className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm">
              {gmailConnected ? "Disconnect" : "Connect Gmail"}
            </button>
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