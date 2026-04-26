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
  notifications: { en: 'Notifications', zh: '通知' },
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
      t: (key) => translations[key][language],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
