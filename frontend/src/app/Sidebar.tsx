import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Calendar, DollarSign, Briefcase } from 'lucide-react'

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/applications', icon: FileText, label: 'Applications' },
    { to: '/interviews', icon: Calendar, label: 'Interviews' },
    { to: '/offers', icon: DollarSign, label: 'Offers' },
  ]

  return (
    <aside
      className="glass hidden md:flex flex-col fixed left-4 top-4 p-6 gap-8 z-50"
      style={{
        width: '260px',
        height: 'calc(100vh - 2rem)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
        <Briefcase size={28} color="var(--color-primary)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>JobHunter</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--color-text-secondary)',
              backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
