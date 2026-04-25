import React, { useState, useEffect } from 'react'
import type { Application } from '@/api/endpoints'
import { useUpdateApplication, useDeleteApplication } from '@/hooks/api'
import { Trash2, Save, ExternalLink } from 'lucide-react'

interface ApplicationDetailProps {
  application: Application
  onClose: () => void
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application, onClose }) => {
  const [formData, setFormData] = useState<Application>(application)
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

  useEffect(() => {
    setFormData(application)
  }, [application])

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
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteMutation.mutateAsync(application.id)
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
          <label className="form-label">Company</label>
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
          <label className="form-label">Position</label>
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
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Salary</label>
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
        <label className="form-label">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Job URL</label>
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
              title="Open link"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
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
          <span style={{ verticalAlign: 'middle' }}>Delete</span>
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={updateMutation.isPending}
          >
            <Save size={18} />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ApplicationDetail
