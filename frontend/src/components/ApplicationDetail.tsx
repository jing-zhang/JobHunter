import React, { useState } from 'react'
import type { Application } from '@/api/endpoints'
import { useUpdateApplication, useDeleteApplication } from '@/hooks/api'
import { Trash2, Save, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/app/LanguageProvider'

interface ApplicationDetailProps {
  application: Application
  onClose: () => void
  onDeleted?: () => void
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onClose,
  onDeleted,
}) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Application>(application)
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

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
        id: application.id,
        data: {
          ...formData,
          salary: Number(formData.salary),
        },
      })
      onClose()
    } catch (err) {
      console.error('Failed to update:', err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(t('confirm_delete_application'))) {
      try {
        await deleteMutation.mutateAsync(application.id)
        onDeleted?.()
        onClose()
      } catch (err) {
        console.error('Failed to delete:', err)
      }
    }
  }

  return (
    <form onSubmit={handleUpdate} className="application-detail">
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
          <label className="form-label">{t('status')}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="applied">{t('status_applied')}</option>
            <option value="interviewing">{t('status_interviewing')}</option>
            <option value="offer">{t('status_offer')}</option>
            <option value="rejected">{t('status_rejected')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('salary')}</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('location')}</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('job_url')}</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="form-input"
          />
          {formData.url && (
            <a
              href={formData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}
              title={t('open_link')}
            >
              <ExternalLink size={18} />
            </a>
          )}
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
        style={{
          borderTop: 'none',
          padding: 0,
          marginTop: '2rem',
          justifyContent: 'space-between',
        }}
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

export default ApplicationDetail
