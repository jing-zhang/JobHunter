import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: '0 1rem 1rem 280px', flex: 1 }}>
          <div
            className="glass"
            style={{
              padding: '2rem',
              minHeight: 'calc(100vh - 100px)',
              borderRadius: 'var(--radius)',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
