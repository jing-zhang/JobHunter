import { useTheme } from '@/app/ThemeProvider'
import { Sun, Moon, Briefcase } from 'lucide-react'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={32} color="var(--color-primary)" />
          <h1 style={{ fontSize: '1.5rem' }}>JobHunter</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="glass"
          style={{
            padding: '0.5rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main style={{ display: 'grid', gap: '1.5rem' }}>
        <section className="glass-card">
          <h2>Welcome to JobHunter</h2>
          <p>This is a preview of the glassmorphism design system.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary">Get Started</button>
            <button className="glass" style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>
              Learn More
            </button>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
            <h3 style={{ color: 'var(--color-success)' }}>Applications</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>12</p>
            <p>Active this month</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <h3 style={{ color: 'var(--color-warning)' }}>Interviews</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>4</p>
            <p>Scheduled</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ color: 'var(--color-primary)' }}>Offers</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>2</p>
            <p>Received</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
