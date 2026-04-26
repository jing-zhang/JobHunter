import React, { useEffect, useMemo, useState } from 'react'
import type { Interview } from '@/api/endpoints'
import { useUpdateInterview } from '@/hooks/api'
import { Save } from 'lucide-react'
import { useLanguage } from '@/app/LanguageProvider'

interface InterviewDetailProps {
  interview: Interview
  onClose: () => void
}

const toDatetimeLocal = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const InterviewDetail: React.FC<InterviewDetailProps> = ({ interview, onClose }) => {
  const { t } = useLanguage()
  const updateInterview = useUpdateInterview()

  const [scheduledDateLocal, setScheduledDateLocal] = useState('')
  const [status, setStatus] = useState<Interview['status']>(interview.status)

  const initialLocal = useMemo(() => toDatetimeLocal(interview.scheduledDate), [interview.scheduledDate])

  useEffect(() => {
    setScheduledDateLocal(initialLocal)
    setStatus(interview.status)
  }, [initialLocal, interview.status])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const scheduledDate = scheduledDateLocal ? new Date(scheduledDateLocal).toISOString() : interview.scheduledDate
      await updateInterview.mutateAsync({
        id: interview.id,
        data: {
          scheduledDate,
          status,
        },
      })
      onClose()
    } catch (err) {
      console.error('Failed to update interview:', err)
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t('scheduled_time')} *</label>
          <input
            type="datetime-local"
            className="form-input"
            value={scheduledDateLocal}
            onChange={(e) => setScheduledDateLocal(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('status')}</label>
          <select
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Interview['status'])}
          >
            <option value="scheduled">{t('status_scheduled')}</option>
            <option value="completed">{t('status_completed')}</option>
            <option value="cancelled">{t('status_cancelled')}</option>
          </select>
        </div>
      </div>

      <div className="modal-footer" style={{ borderTop: 'none', padding: 0, marginTop: '2rem' }}>
        <button type="button" onClick={onClose} className="btn-secondary">
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={updateInterview.isPending}
        >
          <Save size={18} />
          {updateInterview.isPending ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  )
}

export default InterviewDetail

