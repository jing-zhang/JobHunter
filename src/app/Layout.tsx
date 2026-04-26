import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Calendar, DollarSign } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dash' },
    { to: '/applications', icon: FileText, label: 'Apps' },
    { to: '/interviews', icon: Calendar, label: 'Interviews' },
    { to: '/offers', icon: DollarSign, label: 'Offers' },
  ]

  return (
    <div className="min-h-screen flex bg-slate-900 text-white overflow-x-hidden pb-16 md:pb-0">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[280px] w-full max-w-[100vw] transition-all duration-300">
        <Header />
        <main className="px-4 md:px-6 pb-6 flex-1 flex flex-col">
          <div
            className="glass flex-1"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass flex justify-around items-center p-3 z-50 border-t border-white/10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Layout
