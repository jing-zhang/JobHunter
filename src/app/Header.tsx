import React from 'react'
import { useTheme } from '@/app/ThemeProvider'
import { Sun, Moon, Bell, Search } from 'lucide-react'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="glass flex justify-between items-center px-4 md:px-6 z-40 relative"
      style={{
        height: '70px',
        margin: '1rem',
        borderRadius: 'var(--radius)',
      }}
    >
      <div style={{ position: 'relative', width: '300px' }}>
        <Search
          size={18}
          color="var(--color-text-secondary)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search applications..."
          className="glass"
          style={{
            width: '100%',
            padding: '0.6rem 1rem 0.6rem 2.5rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="glass"
          aria-label="Notifications"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <Bell size={20} color="var(--color-text-secondary)" />
        </button>

        <button
          onClick={toggleTheme}
          className="glass"
          aria-label="Toggle theme"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'white',
            fontSize: '0.8rem',
          }}
        >
          JZ
        </div>
      </div>
    </header>
  )
}

export default Header
