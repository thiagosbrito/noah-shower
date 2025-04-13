'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { FaGlobe } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLanguage: 'pt-BR' | 'en') => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-orange-100 hover:border-orange-200 transition-all duration-300"
      >
        <FaGlobe className="text-orange-700 text-xl" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white/90 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-orange-100">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="pt-BR"
                checked={language === 'pt-BR'}
                onChange={() => handleLanguageChange('pt-BR')}
                className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
              />
              <span className="text-orange-800">Português (Brasil)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={() => handleLanguageChange('en')}
                className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
              />
              <span className="text-orange-800">English</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
} 