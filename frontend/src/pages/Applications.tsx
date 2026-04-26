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
import { useLanguage } from '@/app/LanguageProvider'

const Applications: React.FC = () => {
  const { data: applications = [], isLoading, error } = useApplications()
  const { t } = useLanguage()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const columns: Column<Application>[] = [
    {
      header: t('company'),
      accessor: 'company',
      className: 'font-semibold',
    },
    {
      header: t('position'),
      accessor: 'position',
    },
    {
      header: t('status'),
      accessor: (item) => (
        <span className={`status-badge status-${item.status}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: t('applied_date'),
      accessor: (item) => formatDate(item.appliedDate),
    },
    {
      header: t('salary'),
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
        <h1 className="text-3xl font-bold">{t('applications')}</h1>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} />
          {t('add_application')}
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
              background: 'var(--glass-bg)',
              border: 'var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text-primary)',
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
