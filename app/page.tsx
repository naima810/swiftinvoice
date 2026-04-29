'use client';

import NavbarWrapper from "@/components/NavbarWrapper";

export default function Home() {
  return (
    <div className="">
    <NavbarWrapper />
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-0">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stop tracking hours in spreadsheets. Start invoicing in minutes.
            </h1>
            <p className="text-gray-700 mb-6">
              Time tracking + invoicing for freelancers & small agencies. Simple. Fast. Paid.
            </p>
            <div className="flex gap-4">
              <a href="#signup" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
                Free Plan
              </a>
              <a href="#signup" className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700">
                Pro Plan
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="/dashboard-placeholder.png" alt="Dashboard Preview" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-0 text-center">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
              <p>Start/stop timer or log hours manually, linked to projects.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Invoicing</h3>
              <p>Auto-generate PDF invoices and send to clients easily.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Projects & Clients</h3>
              <p>Unlimited projects & clients (Pro). Assign rates quickly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Reporting</h3>
              <p>View total hours, revenue, and unpaid invoices at a glance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Payments</h3>
              <p>Accept payments via Stripe or PayPal (Pro).</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Estimates</h3>
              <p>Create project estimates before work starts and track progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-100" id="pricing">
        <div className="container mx-auto px-6 md:px-0 text-center">
          <h2 className="text-3xl font-bold mb-12">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-gray-600 mb-6">$0 / month</p>
              <ul className="text-left mb-6 list-disc list-inside text-gray-700 space-y-2">
                <li>Track up to 2 projects</li>
                <li>Log time manually or with a timer</li>
                <li>Generate 1 invoice/month</li>
                <li>Basic reporting</li>
              </ul>
              <a href="#signup" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
                Sign Up
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg shadow border-2 border-blue-600">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-gray-600 mb-6">$5 / month per user<br/>or $50/year</p>
              <ul className="text-left mb-6 list-disc list-inside text-gray-700 space-y-2">
                <li>Unlimited projects & clients</li>
                <li>Unlimited invoices & PDF export</li>
                <li>Time tracking (manual & timer)</li>
                <li>Basic reporting & revenue summary</li>
                <li>Stripe/PayPal integration</li>
              </ul>
              <a href="#signup" className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700">
                Sign Up
              </a>
            </div>

            {/* Launch Offer */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Launch Offer</h3>
              <p className="text-gray-600 mb-6">$1 first month</p>
              <ul className="text-left mb-6 list-disc list-inside text-gray-700 space-y-2">
                <li>Full Pro features at discounted price</li>
                <li>Early feedback & testimonials</li>
              </ul>
              <a href="#signup" className="bg-yellow-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-yellow-600">
                Grab Offer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 mt-20">
        <div className="container mx-auto px-6 md:px-0 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} [Your SaaS Name]. All rights reserved.</p>
          <p className="mt-2">Built for freelancers & small agencies who hate accounting.</p>
        </div>
      </footer>
    </main>
    </div>
  );
}
