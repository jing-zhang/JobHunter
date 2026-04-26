import React, { useState } from 'react'
import { useDeleteOffer, useOffers } from '@/hooks/api'
import DataTable from '@/components/DataTable'
import type { Column } from '@/components/DataTable'
import type { Offer } from '@/api/endpoints'
import { Search, Filter, Plus, Trash2 } from 'lucide-react'
import QuickAddModal from '@/components/QuickAddModal'
import OfferDetail from '@/components/OfferDetail'
import Modal from '@/components/Modal'
import { formatCurrency, formatDate } from '@/utils/format'
import { useLanguage } from '@/app/LanguageProvider'

const Offers: React.FC = () => {
  const { data: offers = [], isLoading, error } = useOffers()
  const deleteOffer = useDeleteOffer()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

  const columns: Column<Offer>[] = [
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
      header: t('base_salary'),
      accessor: (item) => formatCurrency(item.salary),
    },
    {
      header: t('bonus'),
      accessor: (item) => (item.bonus ? formatCurrency(item.bonus) : '—'),
    },
    {
      header: t('equity'),
      accessor: (item) => item.equity || '—',
    },
    {
      header: t('expiration'),
      accessor: (item) => formatDate(item.expirationDate),
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
          title={t('delete_offer')}
          onClick={async (e) => {
            e.stopPropagation()
            const ok = window.confirm(t('confirm_delete_offer'))
            if (!ok) return
            try {
              await deleteOffer.mutateAsync(item.id)
              // Close detail modal if this offer is currently selected
              if (selectedOffer?.id === item.id) {
                setSelectedOffer(null)
              }
            } catch (err) {
              console.error(err)
            }
          }}
          disabled={deleteOffer.isPending}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  const filteredOffers = offers.filter((offer: any) => {
    const company = offer.company || offer.application?.company || ''
    const position = offer.position || offer.application?.position || ''
    
    return (
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

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
        <h1 className="text-3xl font-bold">{t('job_offers')}</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            {t('add_offer')}
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
            placeholder={t('search_placeholder_offer')}
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
        data={filteredOffers}
        isLoading={isLoading}
        onRowClick={(offer) => setSelectedOffer(offer)}
      />

      <Modal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        title={t('offer_details')}
      >
        {selectedOffer && (
          <OfferDetail 
            offer={selectedOffer} 
            onClose={() => setSelectedOffer(null)}
            onDeleted={() => setSelectedOffer(null)}
          />
        )}
      </Modal>

      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTab="offer"
      />
    </div>
  )
}

export default Offers
