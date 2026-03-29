'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaFileInvoice, FaChartPie, FaUserCircle, FaAngleDown } from 'react-icons/fa';

export default function Navbar({ user}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null); // For mobile accordion

  const navItems = [
    {
      name: 'Features', icon: <FaFileInvoice />,
    },
    { name: 'Pricing', href: '/analytics', icon: <FaChartPie /> },

    { name: 'How it works', href: '/dashboard', icon: <FaHome /> },
  ];

  const hoverBg = "hover:bg-teal-50";

  const auth= () => {
    router.push('/auth');
  }

  // // DRY User Info
  // const UserInfo = ({ user, logout }) => (
  //   <div className="flex items-center gap-3">
  //     <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
  //       {user.email[0].toUpperCase()}
  //     </div>
  //     <span className="text-gray-600 text-sm">{user.email}</span>
  //     <button
  //       onClick={logout}
  //       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
  //     >
  //       Logout
  //     </button>
  //   </div>
  // );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-teal-700 cursor-pointer hover:text-teal-600 transition"
          onClick={() => router.push('/')}
        >
          SwiftInvoice
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 relative">
          {navItems.map(item => {
            const active = pathname === item.href || (item.subLinks && item.subLinks.some(sl => sl.href === pathname));

            return (
              <div key={item.name} className={`relative ${item.subLinks ? 'group' : ''}`}>
                <button
                  onClick={() => !item.subLinks && router.push(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    active ? 'bg-teal-100 shadow-sm border-l-4 border-teal-600 text-teal-700' : `text-gray-700 ${hoverBg}`
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.name}</span>
                  {item.subLinks && <FaAngleDown className="text-sm" />}
                </button>

                {/* Desktop Dropdown */}
                {item.subLinks && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                    {item.subLinks.map(sl => (
                      <button
                        key={sl.name}
                        onClick={() => router.push(sl.href)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 transition"
                      >
                        {sl.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* User Info */}
          <div className="ml-4 border-l border-gray-200 pl-4">
            <button onClick={auth} className="bg-teal-500 text-bolder text-white hover:bg-teal-600 transition px-3 py-1 rounded text-sm">
              Login/Signup
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 hover:text-teal-600 transition text-2xl"
          >
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t border-gray-200 flex flex-col gap-2">
          {navItems.map(item => (
            <div key={item.name} className="flex flex-col gap-1">
              <button
                onClick={() => {
                  if (!item.subLinks) { router.push(item.href); setMenuOpen(false); }
                  else setOpenSub(item.name === openSub ? null : item.name);
                }}
                className={`flex justify-between items-center px-4 py-2 rounded-lg font-medium transition ${
                  pathname === item.href ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon} {item.name}
                </div>
                {item.subLinks && <FaAngleDown className={`transition-transform ${item.name === openSub ? 'rotate-180' : ''}`} />}
              </button>

              {/* Mobile SubLinks Accordion */}
              {item.subLinks && item.name === openSub && (
                <div className="flex flex-col ml-4">
                  {item.subLinks.map(sl => (
                    <button
                      key={sl.name}
                      onClick={() => { router.push(sl.href); setMenuOpen(false); }}
                      className="px-4 py-2 text-gray-700 hover:bg-teal-50 rounded transition"
                    >
                      {sl.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* User Info */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button onClick={auth} className="w-full bg-teal-500 text-bolder text-white hover:bg-teal-600 transition px-3 py-2 rounded text-sm">
              Login/Signup
            </button>
          </div>

        </div>
      )}
    </nav>
  );
}
