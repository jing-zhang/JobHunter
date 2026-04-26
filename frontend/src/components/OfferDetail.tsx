import React, { useState, useEffect } from 'react'
import type { Offer } from '@/api/endpoints'
import { useUpdateOffer, useDeleteOffer } from '@/hooks/api'
import { Trash2, Save } from 'lucide-react'
import { useLanguage } from '@/app/LanguageProvider'

interface OfferDetailProps {
  offer: Offer
  onClose: () => void
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer, onClose }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Offer>(offer)
  const updateMutation = useUpdateOffer()
  const deleteMutation = useDeleteOffer()

  useEffect(() => {
    setFormData(offer)
  }, [offer])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id: offer.id,
        data: {
          ...formData,
          salary: Number(formData.salary),
          bonus: Number(formData.bonus),
        },
      })
      onClose()
    } catch (err) {
      console.error('Failed to update offer:', err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(t('confirm_delete_offer'))) {
      try {
        await deleteMutation.mutateAsync(offer.id)
        onClose()
      } catch (err) {
        console.error('Failed to delete offer:', err)
      }
    }
  }

  return (
    <form onSubmit={handleUpdate} className="offer-detail">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('company')}</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('position')}</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('base_salary_label')}</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('bonus_label')}</label>
          <input
            type="number"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('equity_label')}</label>
          <input
            type="text"
            name="equity"
            value={formData.equity}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('status')}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="pending">{t('status_pending')}</option>
            <option value="accepted">{t('status_accepted')}</option>
            <option value="declined">{t('status_declined')}</option>
            <option value="expired">{t('status_expired')}</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('expiration_date_label')}</label>
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('notes')}</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="form-input"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div
        className="modal-footer"
        style={{ borderTop: 'none', padding: 0, marginTop: '2rem', justifyContent: 'space-between' }}
      >
        <button type="button" onClick={handleDelete} className="btn-danger">
          <Trash2 size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          <span style={{ verticalAlign: 'middle' }}>{t('delete')}</span>
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={updateMutation.isPending}
          >
            <Save size={18} />
            {updateMutation.isPending ? t('saving') : t('save_changes')}
          </button>
        </div>
      </div>
    </form>
  )
}

export default OfferDetail
