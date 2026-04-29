'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaHome, FaFileInvoice, FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'
import { supabase } from '@/lib/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FaHome size={18} /> },
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [openGroups, setOpenGroups] = useState<string[]>([])


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || '')
    })
  }, [])

  // Auto-open group if a sublink is active
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subLinks?.some(sl => pathname === sl.href)) {
        setOpenGroups(prev => prev.includes(item.name) ? prev : [...prev, item.name])
      }
    })
  }, [pathname])

  const toggleGroup = (name: string) => {
    setOpenGroups(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  const expanded = hovered || mobileOpen

  const renderNavItem = (item: typeof navItems[0]) => {
    const active =
      pathname === item.href ||
      (item.subLinks?.some(sl => pathname === sl.href))

    if (item.subLinks) {
      const isOpen = openGroups.includes(item.name)
      return (
        <div key={item.name}>
          <button
            onClick={() => expanded && toggleGroup(item.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              background: active ? '#f0fdf9' : 'transparent',
              color: active ? '#0d9e8a' : '#4a5568',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {/* Icon */}
            <span style={{ flexShrink: 0, color: active ? '#0d9e8a' : '#718096' }}>{item.icon}</span>

            {/* Label — only visible when expanded */}
            <span style={{
              opacity: expanded ? 1 : 0,
              width: expanded ? 'auto' : 0,
              overflow: 'hidden',
              transition: 'opacity 0.2s, width 0.2s',
              flex: 1,
              textAlign: 'left',
            }}>
              {item.name}
            </span>

            {/* Chevron */}
            {expanded && (
              <span style={{
                fontSize: 11,
                transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}>▾</span>
            )}
          </button>

          {/* Sublinks */}
          {expanded && isOpen && (
            <div style={{ marginLeft: 16, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {item.subLinks.map(sl => {
                const subActive = pathname === sl.href
                return (
                  <button
                    key={sl.name}
                    onClick={() => router.push(sl.href)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: subActive ? '#ccfbf1' : 'transparent',
                      color: subActive ? '#0d9e8a' : '#4a5568',
                      fontSize: 13,
                      fontWeight: subActive ? 600 : 400,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!subActive) (e.currentTarget as HTMLButtonElement).style.background = '#f0fdf9' }}
                    onMouseLeave={e => { if (!subActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                  >
                    {sl.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={item.name}
        onClick={() => router.push(item.href!)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: 'none',
          borderLeft: active ? '3px solid #0d9e8a' : '3px solid transparent',
          background: active ? '#f0fdf9' : 'transparent',
          color: active ? '#0d9e8a' : '#4a5568',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#f0fdf9' }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
      >
        <span style={{ flexShrink: 0, color: active ? '#0d9e8a' : '#718096' }}>{item.icon}</span>
        <span style={{
          opacity: expanded ? 1 : 0,
          width: expanded ? 'auto' : 0,
          overflow: 'hidden',
          transition: 'opacity 0.2s',
        }}>
          {item.name}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile top bar */}
      <div style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
        padding: '12px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
        className="mobile-topbar"
      >
        <span
          style={{ fontSize: 20, fontWeight: 700, color: '#0d9e8a', cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')}
        >
          SwiftInvoice
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', fontSize: 20 }}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: ${mobileOpen ? 'flex' : 'none'} !important; }
        }
        @media (min-width: 769px) {
          .mobile-topbar { display: none !important; }
          .desktop-sidebar { display: flex !important; }
          .mobile-sidebar { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar — collapses to icons, expands on hover */}
      <aside
        className="desktop-sidebar"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: hovered ? 220 : 56,
          minWidth: hovered ? 220 : 56,
          background: 'white',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          flexDirection: 'column',
          padding: '16px 8px',
          zIndex: 50,
          transition: 'width 0.25s ease, min-width 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => router.push('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
            cursor: 'pointer',
            padding: '4px 4px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>⚡</span>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#0d9e8a',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s',
            overflow: 'hidden',
          }}>
            SwiftInvoice
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(renderNavItem)}
        </nav>

        {/* User footer */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: hovered ? 'flex-start' : 'center',
          gap: 8,
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '0 4px' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#0d9e8a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}>
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <span style={{
              fontSize: 13,
              color: '#4a5568',
              opacity: hovered ? 1 : 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flex: 1,
              transition: 'opacity 0.2s',
            }}>
              {userEmail || 'User'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: '#e53e3e',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <FaSignOutAlt size={16} style={{ flexShrink: 0 }} />
            <span style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar — full width drawer */}
      
    </>
  )
}