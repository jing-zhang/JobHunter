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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        <Header />
        <main
          className="flex-1"
          style={{
            padding: '0 1rem 5rem 1rem', // Extra bottom padding for mobile nav
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* We add a spacer div for desktop sidebar via Tailwind md:ml-[260px] or just put it in a responsive container. Wait, let's use a standard tailwind responsive class for the margin. */}
          <div
            className="glass flex-1 md:ml-[280px]"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              marginTop: '0',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 glass flex justify-around items-center p-3 z-50 border-t"
        style={{ borderColor: 'var(--glass-border)' }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            })}
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
