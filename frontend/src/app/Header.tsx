import React from 'react'
import { useTheme } from '@/app/ThemeProvider'
import { Sun, Moon, Search } from 'lucide-react'
import { useLanguage } from '@/app/LanguageProvider'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <header
      className="glass z-40 relative ml-4 md:ml-[296px]"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px',
        marginTop: '1rem',
        marginRight: '1rem',
        marginBottom: '1rem',
        borderRadius: 'var(--radius)',
        padding: '0 1rem',
        gap: '1rem',
      }}
    >
      <div style={{ position: 'relative', flex: '1 1 auto', minWidth: 0 }}>
        <Search
          size={18}
          color="var(--color-text-secondary)"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          placeholder={t('search_applications')}
          className="glass"
          style={{
            width: '100%',
            padding: '0.6rem 1rem 0.6rem 2.5rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleLanguage}
          className="glass"
          aria-label={t('toggle_language')}
          style={{
            height: '40px',
            padding: '0 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius)',
          }}
        >
          {language === 'en' ? '中文' : 'EN'}
        </button>

        <button
          onClick={toggleTheme}
          className="glass"
          aria-label={t('toggle_theme')}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'white',
            fontSize: '0.8rem',
          }}
        >
          JZ
        </div>
      </div>
    </header>
  )
}

export default Header
