'use client'

import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
      >
        <span>{language === 'pt-BR' ? '🇧🇷' : '🇺🇸'}</span>
        <span>{language === 'pt-BR' ? 'English' : 'Português'}</span>
      </button>
    </div>
  )
} 