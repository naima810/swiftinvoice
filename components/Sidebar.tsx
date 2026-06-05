'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  FaHome,
  FaFileInvoice,
  FaUserCircle,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { supabase } from '@/lib/supabase/client'

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <FaHome size={18} />
  },
  {
    name: 'Invoices',
    icon: <FaFileInvoice size={18} />,
    subLinks: [
      { name: 'All Invoices', href: '/dashboard/invoices/allInvoices' },
      { name: 'Create Invoice', href: '/dashboard/invoices/new' },
      { name: 'Sent Reminders', href: '/dashboard/invoices/reminders' },
    ],
  },
  {
    name: 'Account',
    icon: <FaUserCircle size={18} />,
    subLinks: [
      { name: 'Company Setting', href: '/dashboard/account/company' },
      { name: 'Account Settings', href: '/dashboard/account/settings' },
    ],
  },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>([])
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || '')
    })
  }, [])

  const toggleGroup = (name: string) => {
    setOpenGroups(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden h-16 bg-white flex items-center justify-between px-4 sticky top-0 z-40">
        <h1 className="hidden md:block font-bold text-emerald-600 text-lg">
          SwiftInvoice
        </h1>

        <button onClick={() => setSidebarOpen(true)}>
          <FaBars size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            {userEmail?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen bg-white border-r border-gray-200
          flex flex-col transition-all duration-300
          
          ${collapsed ? 'w-[80px]' : 'w-[240px]'}
          
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <h2 className="font-bold text-emerald-600 text-xl">
              SwiftInvoice
            </h2>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block text-gray-500"
            >
              ☰
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">

          {navItems.map(item => {
            const active =
              pathname === item.href ||
              item.subLinks?.some(sl => pathname === sl.href)

            if (item.subLinks) {
              const isOpen = openGroups.includes(item.name)

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition
                      ${active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {item.icon}

                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">
                          {item.name}
                        </span>

                        <span className={`transition ${isOpen ? 'rotate-180' : ''}`}>
                          ▾
                        </span>
                      </>
                    )}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.subLinks.map(sl => (
                        <button
                          key={sl.href}
                          onClick={() => {
                            router.push(sl.href)
                            setSidebarOpen(false)
                          }}
                          className={`
                            block w-full text-left px-3 py-2 rounded-md text-sm
                            ${pathname === sl.href
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {sl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href!)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition
                  ${active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {item.icon}

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              {userEmail?.[0]?.toUpperCase() || 'U'}
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {userEmail}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            <FaSignOutAlt />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}