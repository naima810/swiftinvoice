'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaHome, FaFileInvoice, FaChartPie, FaUserCircle, FaAngleDown, FaBars } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
  {
    name: 'Invoices',
    icon: <FaFileInvoice />,
    subLinks: [
      { name: 'All Invoices', href: '/dashboard/invoices' },
      { name: 'Create Invoice', href: '/dashboard/invoices/new' },
      { name: 'Sent Reminders', href: '/dashboard/invoices/reminders' },
    ],
  },
  { name: 'Analytics', href: '/dashboard/analytics', icon: <FaChartPie /> },
  { name: 'Account', href: '/dashboard/account', icon: <FaUserCircle /> },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [invoicesOpen, setInvoicesOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const supabase = createClient()
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUserEmail(data.user?.email || '')
     console.log("User email set to:", data); 
  })
 
}, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (err) {
      console.error('Logout failed', err)
      alert('Logout failed. Please try again.')
    }
  }

  const renderNavItem = (item: typeof navItems[0]) => {
    const active =
      pathname === item.href ||
      (item.subLinks && item.subLinks.some(sl => sl.href === pathname))

    if (item.subLinks) {
      return (
        <div key={item.name} className="relative">
          <button
            onClick={() => setInvoicesOpen(!invoicesOpen)}
            className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              active
                ? 'bg-teal-100 shadow-sm border-l-4 border-teal-600 text-teal-700'
                : 'text-gray-700 hover:bg-teal-50'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
            <FaAngleDown className="text-sm" />
          </button>

          {invoicesOpen &&
            item.subLinks.map(sl => (
              <button
                key={sl.name}
                onClick={() => router.push(sl.href)}
                className="px-4 py-2 text-gray-700 hover:bg-teal-50 rounded transition text-left ml-4 mt-1"
              >
                {sl.name}
              </button>
            ))}
        </div>
      )
    } else {
      return (
        <button
          key={item.name}
          onClick={() => router.push(item.href)}
          className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            active
              ? 'bg-teal-100 shadow-sm border-l-4 border-teal-600 text-teal-700'
              : 'text-gray-700 hover:bg-teal-50'
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </button>
      )
    }
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
        <div
          className="text-2xl font-bold text-teal-700 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          SwiftInvoice
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-2xl text-gray-800"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`h-screen bg-white md:flex md:flex-col md:w-64 shadow-md p-4 absolute md:relative z-50 ${
          mobileOpen ? 'block' : 'hidden'
        } md:block`}
      >
        {/* Brand */}
        <div
          className="hidden md:block text-2xl font-bold text-teal-700 cursor-pointer mb-6"
          onClick={() => router.push('/dashboard')}
        >
          SwiftInvoice
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">{navItems.map(renderNavItem)}</nav>

        {/* User info */}
        <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userEmail ? userEmail[0].toUpperCase() : 'U'}
          </div>
          <span className="text-gray-600 text-sm">{userEmail || 'User'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}