import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCreateApplication } from '@/hooks/api'
import type { Application } from '@/api/endpoints'
import Modal from './Modal'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied' as Application['status'],
    notes: '',
    url: '',
  })

  const createApplication = useCreateApplication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const applicationData = {
      ...formData,
      salary: parseInt(formData.salary) || 0,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    }

    try {
      await createApplication.mutateAsync(applicationData)
      onClose()
      setFormData({
        company: '',
        position: '',
        location: '',
        salary: '',
        status: 'applied',
        notes: '',
        url: '',
      })
    } catch (error) {
      console.error('Failed to create application:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Application">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Google"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Position *</label>
            <input
              type="text"
              name="position"
              required
              value={formData.position}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Frontend Engineer"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Remote"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Salary (Annual)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. 120000"
            />
          </div>
        </div>

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
          <label className="form-label">Job URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="form-input"
            placeholder="https://company.com/jobs/123"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="form-input"
            style={{ resize: 'vertical' }}
            placeholder="Add any specific details about the job or company..."
          />
        </div>

        <div className="modal-footer" style={{ borderTop: 'none', padding: 0, marginTop: '1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createApplication.isPending}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {createApplication.isPending ? (
              'Adding...'
            ) : (
              <>
                <Plus size={18} />
                Add Application
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default QuickAddModal
