import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useCreateApplication,
  useCreateInterview,
  useCreateOffer,
  useApplications,
} from '@/hooks/api'
import type { Application, Interview } from '@/api/endpoints'
import Modal from './Modal'
import { useLanguage } from '@/app/LanguageProvider'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: TabType
}

type TabType = 'application' | 'interview' | 'offer'

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'application',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const { data: applications = [] } = useApplications()
  const { t } = useLanguage()

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
      appliedDate: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
    }
    try {
      await createApplication.mutateAsync(data)
      onClose()
      setAppData({
        company: '',
        position: '',
        location: '',
        salary: '',
        status: 'applied',
        notes: '',
        url: '',
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedApp = applications.find((a) => a.id === parseInt(interviewData.applicationId))
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
    } catch (err) {
      console.error(err)
    }
  }

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedApp = applications.find((a) => a.id === parseInt(offerData.applicationId))
    const data = {
      ...offerData,
      applicationId: parseInt(offerData.applicationId),
      company: selectedApp?.company || offerData.company,
      position: selectedApp?.position || offerData.position,
      salary: parseInt(offerData.salary) || 0,
      bonus: parseInt(offerData.bonus) || 0,
      benefits: [],
      status: 'pending' as const,
      receivedDate: new Date().toISOString().slice(0, 10),
    }
    try {
      await createOffer.mutateAsync(data)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const titleKey =
    activeTab === 'application'
      ? 'quick_add_application'
      : activeTab === 'interview'
        ? 'quick_add_interview'
        : 'quick_add_offer'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(titleKey)}>
      <div className="modal-tabs">
        <button
          className={`modal-tab ${activeTab === 'application' ? 'active' : ''}`}
          onClick={() => setActiveTab('application')}
        >
          {t('tab_application')}
        </button>
        <button
          className={`modal-tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          {t('tab_interview')}
        </button>
        <button
          className={`modal-tab ${activeTab === 'offer' ? 'active' : ''}`}
          onClick={() => setActiveTab('offer')}
        >
          {t('tab_offer')}
        </button>
      </div>

      {activeTab === 'application' && (
        <form onSubmit={handleAppSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('company')} *</label>
              <input
                type="text"
                required
                value={appData.company}
                onChange={(e) => setAppData({ ...appData, company: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_company')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('position')} *</label>
              <input
                type="text"
                required
                value={appData.position}
                onChange={(e) => setAppData({ ...appData, position: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_position')}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('location')}</label>
              <input
                type="text"
                value={appData.location}
                onChange={(e) => setAppData({ ...appData, location: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_location')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('annual_salary')}</label>
              <input
                type="number"
                value={appData.salary}
                onChange={(e) => setAppData({ ...appData, salary: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_salary')}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('status')}</label>
            <select
              value={appData.status}
              onChange={(e) =>
                setAppData({ ...appData, status: e.target.value as Application['status'] })
              }
              className="form-input"
            >
              <option value="applied">{t('status_applied')}</option>
              <option value="interviewing">{t('status_interviewing')}</option>
              <option value="offer">{t('status_offer')}</option>
              <option value="rejected">{t('status_rejected')}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('job_url')}</label>
            <input
              type="url"
              value={appData.url}
              onChange={(e) => setAppData({ ...appData, url: e.target.value })}
              className="form-input"
              placeholder={t('placeholder_url')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('notes')}</label>
            <textarea
              value={appData.notes}
              onChange={(e) => setAppData({ ...appData, notes: e.target.value })}
              className="form-input"
              placeholder={t('placeholder_notes')}
              rows={3}
            />
          </div>
          <div
            className="modal-footer"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={18} /> {t('add_application')}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'interview' && (
        <form onSubmit={handleInterviewSubmit}>
          <div className="form-group">
            <label className="form-label">{t('related_application')} *</label>
            <select
              required
              value={interviewData.applicationId}
              onChange={(e) =>
                setInterviewData({ ...interviewData, applicationId: e.target.value })
              }
              className="form-input"
            >
              <option value="">{t('select_application')}</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} - {app.position}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('type')}</label>
              <select
                value={interviewData.type}
                onChange={(e) =>
                  setInterviewData({ ...interviewData, type: e.target.value as Interview['type'] })
                }
                className="form-input"
              >
                <option value="phone_screen">{t('type_phone_screen')}</option>
                <option value="technical">{t('type_technical')}</option>
                <option value="behavioral">{t('type_behavioral')}</option>
                <option value="portfolio_review">{t('type_portfolio_review')}</option>
                <option value="final">{t('type_final')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('date_time')} *</label>
              <input
                type="datetime-local"
                required
                value={interviewData.scheduledDate}
                onChange={(e) =>
                  setInterviewData({ ...interviewData, scheduledDate: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('interviewer')}</label>
              <input
                type="text"
                value={interviewData.interviewer}
                onChange={(e) =>
                  setInterviewData({ ...interviewData, interviewer: e.target.value })
                }
                className="form-input"
                placeholder={t('placeholder_interviewer')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('interview_location')}</label>
              <input
                type="text"
                value={interviewData.location}
                onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_interview_location')}
              />
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={18} /> {t('add_interview')}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'offer' && (
        <form onSubmit={handleOfferSubmit}>
          <div className="form-group">
            <label className="form-label">{t('related_application')} *</label>
            <select
              required
              value={offerData.applicationId}
              onChange={(e) => setOfferData({ ...offerData, applicationId: e.target.value })}
              className="form-input"
            >
              <option value="">{t('select_application')}</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} - {app.position}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('base_salary_label')} *</label>
              <input
                type="number"
                required
                value={offerData.salary}
                onChange={(e) => setOfferData({ ...offerData, salary: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_salary')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('bonus_label')}</label>
              <input
                type="number"
                value={offerData.bonus}
                onChange={(e) => setOfferData({ ...offerData, bonus: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_bonus')}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('equity_label')}</label>
              <input
                type="text"
                value={offerData.equity}
                onChange={(e) => setOfferData({ ...offerData, equity: e.target.value })}
                className="form-input"
                placeholder={t('placeholder_equity')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('expiration_date_label')} *</label>
              <input
                type="date"
                required
                value={offerData.expirationDate}
                onChange={(e) => setOfferData({ ...offerData, expirationDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={18} /> {t('add_offer')}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default QuickAddModal
