import React, { useState } from 'react'
import { useDeleteInterview, useInterviews } from '@/hooks/api'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import type { Interview } from '@/api/endpoints'
import { Search, Filter, Plus, Trash2 } from 'lucide-react'
import QuickAddModal from '@/components/QuickAddModal'
import { formatStatus } from '@/utils/format'
import Modal from '@/components/Modal'
import InterviewDetail from '@/components/InterviewDetail'
import { useLanguage } from '@/app/LanguageProvider'

const Interviews: React.FC = () => {
  const { data: interviews = [], isLoading, error } = useInterviews()
  const deleteInterview = useDeleteInterview()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  const columns: Column<Interview>[] = [
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
      header: t('type'),
      accessor: (item) => formatStatus(item.type),
      className: 'text-capitalize',
    },
    {
      header: t('date_time'),
      accessor: (item) => new Date(item.scheduledDate).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    },
    {
      header: t('interviewer'),
      accessor: 'interviewer',
    },
    {
      header: t('status'),
      accessor: (item) => (
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      ),
    },
    {
      header: '',
      accessor: (item) => (
        <button
          type="button"
          className="btn-danger"
          style={{ padding: '0.4rem 0.6rem' }}
          title={t('delete_interview')}
          onClick={async (e) => {
            e.stopPropagation()
            const ok = window.confirm(t('confirm_delete_interview'))
            if (!ok) return
            try {
              await deleteInterview.mutateAsync(item.id)
            } catch (err) {
              console.error(err)
            }
          }}
          disabled={deleteInterview.isPending}
        >
          <Trash2 size={16} />
        </button>
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
        <h1 className="text-3xl font-bold">{t('interviews')}</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            {t('add_interview')}
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
            placeholder={t('search_placeholder_int')}
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
          {t('filter')}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredInterviews}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedInterview(row)}
      />

      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTab="interview"
      />

      <Modal
        isOpen={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
        title={t('interview_details')}
      >
        {selectedInterview && (
          <InterviewDetail interview={selectedInterview} onClose={() => setSelectedInterview(null)} />
        )}
      </Modal>
    </div>
  )
}

export default Interviews
