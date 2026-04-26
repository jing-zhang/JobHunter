import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCreateApplication, useCreateInterview, useCreateOffer, useApplications } from '@/hooks/api'
import type { Application, Interview, Offer } from '@/api/endpoints'
import Modal from './Modal'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'application' | 'interview' | 'offer'

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('application')
  const { data: applications = [] } = useApplications()

  // Hooks
  const createApplication = useCreateApplication()
  const createInterview = useCreateInterview()
  const createOffer = useCreateOffer()

  // Form States
  const [appData, setAppData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied' as Application['status'],
    notes: '',
    url: '',
  })

  const [interviewData, setInterviewData] = useState({
    applicationId: '',
    company: '',
    position: '',
    type: 'technical' as Interview['type'],
    scheduledDate: '',
    interviewer: '',
    location: 'Remote',
    notes: '',
  })

  const [offerData, setOfferData] = useState({
    applicationId: '',
    company: '',
    position: '',
    salary: '',
    bonus: '',
    equity: '',
    expirationDate: '',
    notes: '',
  })

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...appData,
      salary: parseInt(appData.salary) || 0,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    try {
      await createApplication.mutateAsync(data)
      onClose()
      setAppData({
        company: '', position: '', location: '', salary: '',
        status: 'applied', notes: '', url: ''
      })
    } catch (err) { console.error(err) }
  }

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedApp = applications.find(a => a.id === parseInt(interviewData.applicationId))
    const data = {
      ...interviewData,
      applicationId: parseInt(interviewData.applicationId),
      company: selectedApp?.company || interviewData.company,
      position: selectedApp?.position || interviewData.position,
      status: 'scheduled' as const,
    }
    try {
      await createInterview.mutateAsync(data)
      onClose()
    } catch (err) { console.error(err) }
  }

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedApp = applications.find(a => a.id === parseInt(offerData.applicationId))
    const data = {
      ...offerData,
      applicationId: parseInt(offerData.applicationId),
      company: selectedApp?.company || offerData.company,
      position: selectedApp?.position || offerData.position,
      salary: parseInt(offerData.salary) || 0,
      bonus: parseInt(offerData.bonus) || 0,
      benefits: [],
      status: 'pending' as const,
      receivedDate: new Date().toISOString().split('T')[0],
    }
    try {
      await createOffer.mutateAsync(data)
      onClose()
    } catch (err) { console.error(err) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Quick Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}>
      <div className="modal-tabs">
        <button className={`modal-tab ${activeTab === 'application' ? 'active' : ''}`} onClick={() => setActiveTab('application')}>Application</button>
        <button className={`modal-tab ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>Interview</button>
        <button className={`modal-tab ${activeTab === 'offer' ? 'active' : ''}`} onClick={() => setActiveTab('offer')}>Offer</button>
      </div>

      {activeTab === 'application' && (
        <form onSubmit={handleAppSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input type="text" required value={appData.company} onChange={e => setAppData({...appData, company: e.target.value})} className="form-input" placeholder="Google" />
            </div>
            <div className="form-group">
              <label className="form-label">Position *</label>
              <input type="text" required value={appData.position} onChange={e => setAppData({...appData, position: e.target.value})} className="form-input" placeholder="Frontend Engineer" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" value={appData.location} onChange={e => setAppData({...appData, location: e.target.value})} className="form-input" placeholder="Remote" />
            </div>
            <div className="form-group">
              <label className="form-label">Salary</label>
              <input type="number" value={appData.salary} onChange={e => setAppData({...appData, salary: e.target.value})} className="form-input" placeholder="120000" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary"><Plus size={18} /> Add Application</button>
          </div>
        </form>
      )}

      {activeTab === 'interview' && (
        <form onSubmit={handleInterviewSubmit}>
          <div className="form-group">
            <label className="form-label">Related Application *</label>
            <select required value={interviewData.applicationId} onChange={e => setInterviewData({...interviewData, applicationId: e.target.value})} className="form-input">
              <option value="">Select an application</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>{app.company} - {app.position}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select value={interviewData.type} onChange={e => setInterviewData({...interviewData, type: e.target.value as any})} className="form-input">
                <option value="phone_screen">Phone Screen</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="portfolio_review">Portfolio Review</option>
                <option value="final">Final Round</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input type="datetime-local" required value={interviewData.scheduledDate} onChange={e => setInterviewData({...interviewData, scheduledDate: e.target.value})} className="form-input" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary"><Plus size={18} /> Add Interview</button>
          </div>
        </form>
      )}

      {activeTab === 'offer' && (
        <form onSubmit={handleOfferSubmit}>
          <div className="form-group">
            <label className="form-label">Related Application *</label>
            <select required value={offerData.applicationId} onChange={e => setOfferData({...offerData, applicationId: e.target.value})} className="form-input">
              <option value="">Select an application</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>{app.company} - {app.position}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Base Salary *</label>
              <input type="number" required value={offerData.salary} onChange={e => setOfferData({...offerData, salary: e.target.value})} className="form-input" placeholder="150000" />
            </div>
            <div className="form-group">
              <label className="form-label">Bonus</label>
              <input type="number" value={offerData.bonus} onChange={e => setOfferData({...offerData, bonus: e.target.value})} className="form-input" placeholder="20000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Expiration Date *</label>
            <input type="date" required value={offerData.expirationDate} onChange={e => setOfferData({...offerData, expirationDate: e.target.value})} className="form-input" />
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary"><Plus size={18} /> Add Offer</button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default QuickAddModal
