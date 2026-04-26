import React, { useState } from 'react'
import { useOffers } from '@/hooks/api'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import type { Offer } from '@/api/endpoints'
import { Search, Filter, Plus, TrendingUp } from 'lucide-react'
import QuickAddModal from '@/components/QuickAddModal'
import { formatCurrency, formatDate } from '@/utils/format'

const Offers: React.FC = () => {
  const { data: offers = [], isLoading, error } = useOffers()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const columns: Column<Offer>[] = [
    {
      header: 'Company',
      accessor: 'company',
      className: 'font-semibold',
    },
    {
      header: 'Position',
      accessor: 'position',
    },
    {
      header: 'Base Salary',
      accessor: (item) => formatCurrency(item.salary),
    },
    {
      header: 'Bonus',
      accessor: (item) => (item.bonus ? formatCurrency(item.bonus) : '—'),
    },
    {
      header: 'Equity',
      accessor: (item) => item.equity || '—',
    },
    {
      header: 'Expiration',
      accessor: (item) => formatDate(item.expirationDate),
    },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const filteredOffers = offers.filter(
    (offer) =>
      offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return <div className="glass-card">Error loading offers: {error.message}</div>
  }

  return (
    <div className="offers-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 className="text-3xl font-bold">Job Offers</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="glass"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
          >
            <TrendingUp size={20} />
            Comparison View
          </button>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            Add Offer
          </button>
        </div>
      </div>

      <div
        className="glass"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
            }}
          />
          <input
            type="text"
            placeholder="Search companies, positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius)',
              color: 'white',
              outline: 'none',
            }}
          />
        </div>
        <button
          className="glass"
          style={{
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredOffers}
        isLoading={isLoading}
      />

      <QuickAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default Offers
