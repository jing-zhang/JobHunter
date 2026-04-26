import React, { useState } from 'react'
import { useInterviews } from '@/hooks/api'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import type { Interview } from '@/api/endpoints'
import { Search, Filter, Plus, Calendar } from 'lucide-react'
import QuickAddModal from '@/components/QuickAddModal'
import { formatDate, formatStatus } from '@/utils/format'

const Interviews: React.FC = () => {
  const { data: interviews = [], isLoading, error } = useInterviews()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const columns: Column<Interview>[] = [
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
      header: 'Type',
      accessor: (item) => formatStatus(item.type),
      className: 'text-capitalize',
    },
    {
      header: 'Date & Time',
      accessor: (item) => new Date(item.scheduledDate).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    },
    {
      header: 'Interviewer',
      accessor: 'interviewer',
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

  const filteredInterviews = interviews.filter((interview: any) => {
    const company = interview.company || interview.application?.company || ''
    const position = interview.position || interview.application?.position || ''
    const interviewer = interview.interviewer || ''
    
    return (
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (error) {
    return <div className="glass-card">Error loading interviews: {error.message}</div>
  }

  return (
    <div className="interviews-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 className="text-3xl font-bold">Interviews</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="glass"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
          >
            <Calendar size={20} />
            Calendar View
          </button>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            Add Interview
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
            placeholder="Search companies, positions, interviewers..."
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
        data={filteredInterviews}
        isLoading={isLoading}
      />

      <QuickAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default Interviews
