"use client";

import { useState } from "react";
import { Building2, UserCog } from "lucide-react";
import BusinessSettings from "@/components/BusinessSettings";
import AccountSettings from "@/components/AccountSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(
    "business"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your business and account preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 bg-white p-2 rounded-2xl shadow-sm w-fit">

        <button
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === "business"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Building2 size={18} />
          Business Settings
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === "account"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <UserCog size={18} />
          Account Settings
        </button>

      </div>

      {/* Content */}
      {activeTab === "business" && (
        <BusinessSettings />
      )}

      {activeTab === "account" && (
        <AccountSettings />
      )}

    </div>
  );
}


