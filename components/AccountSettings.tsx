

export default function AccountSettings() {
  return (
    <div className="space-y-6">

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            className="border rounded-xl p-3"
          />

          <input
            placeholder="Email Address"
            className="border rounded-xl p-3"
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Security
        </h2>

        <div className="space-y-3">
          <button className="px-4 py-2 bg-gray-100 rounded-xl">
            Change Password
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Subscription
        </h2>

        <div className="flex items-center justify-between">

          <div>
            <p className="font-medium">
              Current Plan
            </p>

            <p className="text-sm text-gray-500">
              Free Plan
            </p>
          </div>

          <button className="px-4 py-2 bg-teal-600 text-white rounded-xl">
            Upgrade
          </button>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <h2 className="font-semibold text-red-700 mb-2">
          Danger Zone
        </h2>

        <p className="text-sm text-red-600 mb-4">
          Permanently delete your account and all invoices.
        </p>

        <button className="px-4 py-2 bg-red-600 text-white rounded-xl">
          Delete Account
        </button>
      </div>

    </div>
  );
}