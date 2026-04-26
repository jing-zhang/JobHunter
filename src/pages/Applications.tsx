import React, { useState } from 'react'
import { useApplications } from '@/hooks/api'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import type { Application } from '@/api/endpoints'
import { Search, Filter, Plus } from 'lucide-react'
import Modal from '@/components/Modal'
import ApplicationDetail from '@/components/ApplicationDetail'
import QuickAddModal from '@/components/QuickAddModal'
import { formatCurrency, formatDate, formatStatus } from '@/utils/format'

const Applications: React.FC = () => {
  const { data: applications = [], isLoading, error } = useApplications()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const columns: Column<Application>[] = [
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
      header: 'Status',
      accessor: (item) => (
        <span className={`status-badge status-${item.status}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: 'Applied Date',
      accessor: (item) => formatDate(item.appliedDate),
    },
    {
      header: 'Salary',
      accessor: (item) => (item.salary ? formatCurrency(item.salary) : 'N/A'),
    },
  ]

  const handleRowClick = (app: Application) => {
    setSelectedApp(app)
  }

  const filteredApplications = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return <div className="glass-card">Error loading applications: {error.message}</div>
  }

  return (
    <div className="applications-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 className="text-3xl font-bold">Applications</h1>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} />
          Add Application
        </button>
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
        data={filteredApplications}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
      >
        {selectedApp && (
          <ApplicationDetail
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </Modal>

      {/* Quick Add Modal */}
      <QuickAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default Applications
