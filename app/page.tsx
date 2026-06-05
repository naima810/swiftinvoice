'use client';

import NavbarWrapper from "@/components/NavbarWrapper";
import Image from "next/image";
import {
  FaFileAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
  FaFileInvoice,
  FaPaperPlane,
  FaBell
} from "react-icons/fa";
import { Facebook, Linkedin, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-4">
    <NavbarWrapper />
    <main id="hero" className="flex flex-row align-center justify-center">
      <div className="flex flex-col gap-4 justify-center items-center md:items-start p-8 md:w-1/2">
        <p className="text-[10px] bg-teal-500 p-[3px] text-white w-fit border rounded">INOVICE + REMINDER. ALL IN ONE.</p>
        <p className="text-3xl font-bold">Create Invoices.</p>
        <p className="text-3xl font-bold text-teal-500">Send Reminders.</p>
        <p className="text-3xl font-bold">Get Paid Faster.</p>
        <p className="text-md md-text-start text-center">SwiftInvoice helps you create professional invoices and automatically send friendly email reminders so you get paid on time.</p>
      <div className="flex md:flex-row flex-col gap-4">
        <button className="text-nowrap p-[5px] bg-teal-500 text-white rounded md:p-2">Create your First Invoice</button>
        <button className="text-nowrap ml-2 p-2 border border-teal-500 text-teal-500 rounded">Watch Demo</button>
      </div>
      </div>
      <Image className="hidden md:block" loading="eager" src="/dashboard-hero.png" alt="Hero" width={500} height={300} />
      
    </main>
    <main id="works-with" className="bg-[#d2e6e9] w-full mt-4 py-10 px-4">
  <div className="max-w-6xl mx-auto text-center">

    <p className="text-teal-700 text-sm md:text-base mb-8">
      Works with tools you already use
    </p>

    <div className="flex flex-wrap justify-between items-center md:gap-12">

      {/* Stripe */}
      <img
        src="/logos/stripe.png"
        alt="Stripe"
        className="h-8 md:h-10 object-contain hover:scale-105 transition"
      />

      {/* PayPal */}
      <Image
        src="/logos/paypal.png"
        alt="PayPal"
        width={120}
        height={40}
        className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition"
      />

      {/* Slack */}
      <img
        src="/logos/slack.png"
        alt="Slack"
        className="h-8 md:h-10 object-contain hover:scale-105 transition"
      />

      {/* Notion */}
      <img
        src="/logos/notion.png"
        alt="Notion"
        className="h-8 md:h-10 object-contain hover:scale-105 transition"
      />

      {/* GitHub */}
      <img
        src="/logos/github.png"
        alt="GitHub"
        className="h-8 md:h-10 object-contain hover:scale-105 transition"
      />

    </div>
  </div>
</main>
<main id="features" className="flex flex-col items-center justify-center">
  <p className="text-sm bg-teal-500 text-white px-2 py-[5px] w-fit rounded-2xl">FEATURES</p>
  <p className="text-4xl font-bold mt-6 text-center px-4">Everything you need to get paid on time.</p>
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Feature 1 */}
          <div className="p-5 border border-gray-300 rounded-xl hover:shadow-md transition">
            <FaFileAlt className="text-teal-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-2">Professional Invoice</h3>
            <p className="text-gray-600 text-sm">
              Create beautiful invoices in seconds with customized branding, taxes, discounts and more.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 border border-gray-300 rounded-xl hover:shadow-md transition">
            <FaEnvelope className="text-teal-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-2">Email Reminders</h3>
            <p className="text-gray-600 text-sm">
              Send automated and friendly reminder emails before and after due dates.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 border border-gray-300 rounded-xl hover:shadow-md transition">
            <FaCalendarAlt className="text-teal-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-2">Automate Follow-ups</h3>
            <p className="text-gray-600 text-sm">
              Set up multi-step reminders and let SwiftInvoice handle the follow-ups for you.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 border border-gray-300 rounded-xl hover:shadow-md transition">
            <FaChartLine className="text-teal-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg mb-2">Track & Get Paid</h3>
            <p className="text-gray-600 text-sm">
              Track invoice status, payments, and overdue invoices in one dashboard.
            </p>
          </div>

        </div>

      </div>
    </div>
</main>
<main id="how-it-works" className="flex flex-col items-center justify-center px-4">
  <p className="text-sm bg-teal-500 text-white text-center px-2 py-[5px] w-fit rounded-2xl">HOW IT WORKS</p>
  <p className="text-4xl font-bold mt-6 text-center px-4">Get Started In 3 Simple Steps</p>
<div className="flex flex-col md:flex-row gap-4 mt-8">

          {/* Step 1 */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-300 shadow-md flex-1">
            <FaFileInvoice className="text-teal-600 text-4xl shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Create Your Invoice</h3>
              <p className="text-gray-600 text-sm mt-1">
                Build a professional invoice with your branding, taxes, and details in seconds.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-300 shadow-md flex-1">
            <FaPaperPlane className="text-teal-600 text-4xl shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Send it</h3>
              <p className="text-gray-600 text-sm mt-1">
                Share your invoice instantly with clients via email or link.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-300 shadow-md flex-1">
            <FaBell className="text-teal-600 text-4xl shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">We Remind For You</h3>
              <p className="text-gray-600 text-sm mt-1">
                Automated reminders keep your payments on track without you chasing clients.
              </p>
            </div>
          </div>

        </div>
</main>
<main id="cta" className="flex md:flex-row flex-col bg-[#d2e6e9] w-full px-2 py-4 mt-6 justify-between items-center gap-4">
  <Image className="hidden md:block" loading="eager" src="/swiftinvoice-actiondiv.png" alt="Hero" width={300} height={100} />
  <div className="flex flex-col mb-4 md:mb-0 gap-2">
    <p className="text-center text-xl font-bold">Stop Chasing Payment.<br />Let SwiftInvoice Handle It.</p>
    <p className="text-center hidden md:block">Join thousands of people who get paid faster with smarter and automated invoices and automated reminders.</p>
  </div>
  <div>
    <button className="p-[5px] bg-teal-500 text-white rounded md:p-2 text-nowrap">Create your First Invoice</button>
    <p className="text-center text-sm text-teal-700 mt-2">No credit card required</p>
  </div>
</main>
<main
  id="pricing"
  className="flex flex-col items-center justify-center px-4 py-4"
>
  <p className="text-sm bg-teal-500 text-white text-center px-2 py-[5px] w-fit rounded-2xl">
    PRICING
  </p>

  <p className="text-4xl font-bold mt-6 text-center px-4">
    Simple Pricing For Everyone
  </p>

  <p className="text-gray-600 text-center mt-3 max-w-xl">
    Start for free and upgrade when you need unlimited invoices and automated reminders.
  </p>

  <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-5xl">

    {/* Free Plan */}
    <div className="flex-1 bg-white p-8 rounded-xl border border-gray-300 shadow-md">
      <h3 className="text-2xl font-bold">Free</h3>

      <p className="text-5xl font-bold mt-4">
        $0
        <span className="text-lg text-gray-500 font-normal">/month</span>
      </p>

      <ul className="mt-8 space-y-4 text-gray-700">
        <li>✓ Up to 10 invoices/month</li>
        <li>✓ Up to 5 clients</li>
        <li>✓ PDF invoice export</li>
        <li>✓ Manual invoice tracking</li>
        <li>✓ Basic dashboard</li>
      </ul>

      <button className="w-full mt-8 border border-teal-500 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition">
        Get Started Free
      </button>
    </div>

    {/* Pro Plan */}
    <div className="flex-1 bg-white p-8 rounded-xl border-2 border-teal-500 shadow-xl relative">

      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-sm px-4 py-1 rounded-full">
        Most Popular
      </span>

      <h3 className="text-2xl font-bold">Pro</h3>

      <p className="text-5xl font-bold mt-4">
        $5
        <span className="text-lg text-gray-500 font-normal">/month</span>
      </p>

      <ul className="mt-8 space-y-4 text-gray-700">
        <li>✓ Unlimited invoices</li>
        <li>✓ Unlimited clients</li>
        <li>✓ Automated reminder emails</li>
        <li>✓ Custom branding</li>
        <li>✓ Advanced dashboard</li>
        <li>✓ Priority support</li>
      </ul>

      <button className="w-full mt-8 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition">
        Upgrade To Pro
      </button>
    </div>

  </div>
</main>
<main id="testimonials" className="w-full bg-white py-6 px-6">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-14 items-center justify-center flex flex-col gap-3">
      <p className="text-sm bg-teal-500 text-white text-center px-2 py-[5px] w-fit rounded-2xl">
        Testimonials
      </p>

      <h2 className="text-4xl font-bold text-gray-900 mt-3">
        Loved by freelancers and businesses
      </h2>

      <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
        Thousands of users trust SwiftInvoice to create invoices,
        track payments, and get paid faster.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
            A
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Alex Carter
            </h3>

            <p className="text-sm text-gray-500">
              Freelance Designer
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-7">
          SwiftInvoice completely changed how I handle invoices.
          The reminder feature alone helped me get paid much faster.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
            S
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Sarah Khan
            </h3>

            <p className="text-sm text-gray-500">
              Startup Founder
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-7">
          Clean UI, easy invoice generation, and automated reminders.
          Exactly what our small team needed.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
            M
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Michael Lee
            </h3>

            <p className="text-sm text-gray-500">
              Agency Owner
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-7">
          Before SwiftInvoice, following up on unpaid invoices was chaos.
          Now everything feels organized and automated.
        </p>
      </div>

    </div>
  </div>
</main>
<main id="footer" className="w-full bg-[#d2e6e9] border-t border-gray-200 pt-12 sm:pt-16 pb-8 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto">

    {/* Footer Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">

      {/* Column 1 */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
            S
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            SwiftInvoice
          </h2>
        </div>

        <p className="text-gray-500 leading-7 mb-6">
          Smart invoices. Friendly reminders. Faster payments.
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-4">
          <a className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white transition">
            <Facebook size={18} />
          </a>

          <a className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white transition">
            <FaXTwitter size={16} />
          </a>

          <a className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white transition">
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* Columns 2–4 */}
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Product</h3>
        <ul className="space-y-3 text-gray-500">
          <li><a className="hover:text-teal-600">Features</a></li>
          <li><a className="hover:text-teal-600">Pricing</a></li>
          <li><a className="hover:text-teal-600">Templates</a></li>
          <li><a className="hover:text-teal-600">What's New</a></li>
        </ul>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Resources</h3>
        <ul className="space-y-3 text-gray-500">
          <li><a className="hover:text-teal-600">Help Center</a></li>
          <li><a className="hover:text-teal-600">Guides</a></li>
          <li><a className="hover:text-teal-600">Blog</a></li>
          <li><a className="hover:text-teal-600">Tutorials</a></li>
        </ul>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Company</h3>
        <ul className="space-y-3 text-gray-500">
          <li><a className="hover:text-teal-600">About Us</a></li>
          <li><a className="hover:text-teal-600">Careers</a></li>
          <li><a className="hover:text-teal-600">Privacy Policy</a></li>
          <li><a className="hover:text-teal-600">Terms</a></li>
        </ul>
      </div>

      {/* Column 5 */}
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Stay in the loop
        </h3>

        <p className="text-gray-500 leading-7 mb-5">
          Get tips on invoicing and getting paid straight to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-teal-700 rounded-xl overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-4 outline-none text-sm"
          />

          <button className="bg-teal-600 hover:bg-teal-700 transition px-4 py-4 text-white flex items-center justify-center">
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500 text-sm">
      © 2026 SwiftInvoice. All rights reserved.
    </div>

  </div>
</main>
    </div>
  );
}
