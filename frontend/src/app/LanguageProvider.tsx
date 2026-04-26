import React, { createContext, useContext, useMemo, useState } from 'react'

export type Language = 'en' | 'zh'

type Translations = Record<string, { en: string; zh: string }>

const translations: Translations = {
  dashboard: { en: 'Dashboard', zh: '仪表盘' },
  applications: { en: 'Applications', zh: '投递记录' },
  interviews: { en: 'Interviews', zh: '面试' },
  offers: { en: 'Offers', zh: 'Offer' },
  job_offers: { en: 'Job Offers', zh: '工作 Offer' },
  add_application: { en: 'Add Application', zh: '新增投递' },
  add_interview: { en: 'Add Interview', zh: '新增面试' },
  add_offer: { en: 'Add Offer', zh: '新增 Offer' },
  search_applications: { en: 'Search applications...', zh: '搜索投递记录…' },
  toggle_theme: { en: 'Toggle theme', zh: '切换主题' },
  toggle_language: { en: 'Switch language', zh: '切换语言' },

  // Common table headers
  company: { en: 'Company', zh: '公司' },
  position: { en: 'Position', zh: '岗位' },
  status: { en: 'Status', zh: '状态' },
  applied_date: { en: 'Applied Date', zh: '投递日期' },
  salary: { en: 'Salary', zh: '薪资' },
  type: { en: 'Type', zh: '类型' },
  date_time: { en: 'Date & Time', zh: '时间' },
  interviewer: { en: 'Interviewer', zh: '面试官' },
  base_salary: { en: 'Base Salary', zh: '基本工资' },
  bonus: { en: 'Bonus', zh: '奖金' },
  equity: { en: 'Equity', zh: '股权' },
  expiration: { en: 'Expiration', zh: '到期日' },

  // Dashboard
  active_applications: { en: 'Active Applications', zh: '活跃投递' },
  upcoming_interviews: { en: 'Upcoming Interviews', zh: '即将面试' },
  pending_offers: { en: 'Pending Offers', zh: '待处理 Offer' },
  job_hunt_progress: { en: 'Job Hunt Progress', zh: '求职进度' },
  overall_progress: { en: 'Overall Progress', zh: '总体进度' },
  progress_blurb: {
    en: "You're making great progress on your job hunt! Keep up the momentum.",
    zh: '你的求职进展很不错！继续保持节奏。',
  },
  active: { en: 'active', zh: '活跃' },
  upcoming: { en: 'upcoming', zh: '即将' },
  pending: { en: 'pending', zh: '待处理' },

  // Modal titles
  application_details: { en: 'Application Details', zh: '投递详情' },
  interview_details: { en: 'Interview Details', zh: '面试详情' },
  offer_details: { en: 'Offer Details', zh: 'Offer 详情' },
  quick_add_application: { en: 'Quick Add Application', zh: '快速新增投递' },
  quick_add_interview: { en: 'Quick Add Interview', zh: '快速新增面试' },
  quick_add_offer: { en: 'Quick Add Offer', zh: '快速新增 Offer' },

  // Tab labels
  tab_application: { en: 'Application', zh: '投递' },
  tab_interview: { en: 'Interview', zh: '面试' },
  tab_offer: { en: 'Offer', zh: 'Offer' },

  // Form labels
  location: { en: 'Location', zh: '地点' },
  job_url: { en: 'Job URL', zh: '职位链接' },
  notes: { en: 'Notes', zh: '备注' },
  related_application: { en: 'Related Application', zh: '关联投递' },
  select_application: { en: 'Select an application', zh: '选择一个投递' },
  scheduled_time: { en: 'Scheduled Time', zh: '面试时间' },
  annual_salary: { en: 'Salary (Annual)', zh: '年薪' },
  base_salary_label: { en: 'Base Salary', zh: '基本工资' },
  bonus_label: { en: 'Bonus', zh: '奖金' },
  equity_label: { en: 'Equity', zh: '股权' },
  expiration_date_label: { en: 'Expiration Date', zh: '到期日' },
  interview_location: { en: 'Location', zh: '地点' },

  // Status values
  status_applied: { en: 'Applied', zh: '已投递' },
  status_interviewing: { en: 'Interviewing', zh: '面试中' },
  status_offer: { en: 'Offer', zh: 'Offer' },
  status_rejected: { en: 'Rejected', zh: '未通过' },
  status_scheduled: { en: 'Scheduled', zh: '已安排' },
  status_completed: { en: 'Completed', zh: '已完成' },
  status_cancelled: { en: 'Cancelled', zh: '已取消' },
  status_pending: { en: 'Pending', zh: '待处理' },
  status_accepted: { en: 'Accepted', zh: '已接受' },
  status_declined: { en: 'Declined', zh: '已拒绝' },
  status_expired: { en: 'Expired', zh: '已过期' },

  // Interview types
  type_phone_screen: { en: 'Phone Screen', zh: '电话筛选' },
  type_technical: { en: 'Technical', zh: '技术面' },
  type_behavioral: { en: 'Behavioral', zh: '行为面' },
  type_portfolio_review: { en: 'Portfolio Review', zh: '作品集评审' },
  type_final: { en: 'Final Round', zh: '终面' },

  // Buttons
  save: { en: 'Save', zh: '保存' },
  saving: { en: 'Saving...', zh: '保存中…' },
  save_changes: { en: 'Save Changes', zh: '保存修改' },
  cancel: { en: 'Cancel', zh: '取消' },
  delete: { en: 'Delete', zh: '删除' },

  // Confirm dialogs
  confirm_delete_application: {
    en: 'Are you sure you want to delete this application?',
    zh: '确定要删除这条投递记录吗？',
  },
  confirm_delete_interview: { en: 'Delete this interview?', zh: '删除此面试？' },
  confirm_delete_offer: { en: 'Delete this offer?', zh: '删除此 Offer？' },

  // Search placeholders
  search_placeholder_app: { en: 'Search companies, positions...', zh: '搜索公司、岗位…' },
  search_placeholder_int: {
    en: 'Search companies, positions, interviewers...',
    zh: '搜索公司、岗位、面试官…',
  },
  search_placeholder_offer: { en: 'Search companies, positions...', zh: '搜索公司、岗位…' },

  // Toolbar buttons
  filter: { en: 'Filter', zh: '筛选' },

  // Misc
  open_link: { en: 'Open link', zh: '打开链接' },
  close_modal: { en: 'Close modal', zh: '关闭弹窗' },
  delete_application: { en: 'Delete application', zh: '删除投递' },
  delete_interview: { en: 'Delete interview', zh: '删除面试' },
  delete_offer: { en: 'Delete offer', zh: '删除 Offer' },

  // Placeholders
  placeholder_company: { en: 'e.g. Google', zh: '例如 Google' },
  placeholder_position: { en: 'e.g. Frontend Engineer', zh: '例如 前端工程师' },
  placeholder_location: { en: 'e.g. Remote', zh: '例如 远程' },
  placeholder_salary: { en: 'e.g. 120000', zh: '例如 120000' },
  placeholder_url: { en: 'https://company.com/jobs/123', zh: 'https://company.com/jobs/123' },
  placeholder_notes: {
    en: 'Add any specific details about the job or company...',
    zh: '添加关于职位或公司的详细信息…',
  },
  placeholder_interviewer: { en: 'e.g. Jane Smith', zh: '例如 面试官姓名' },
  placeholder_interview_location: { en: 'e.g. Zoom / Onsite', zh: '例如 Zoom / 现场' },
  placeholder_bonus: { en: 'e.g. 20000', zh: '例如 20000' },
  placeholder_equity: { en: 'e.g. 0.1%', zh: '例如 0.1%' },
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: keyof typeof translations) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = window.localStorage.getItem('language')
    return stored === 'zh' ? 'zh' : 'en'
  })

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem('language', next)
  }

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh' : 'en')

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      toggleLanguage,
      t: (key) => translations[key]![language],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
