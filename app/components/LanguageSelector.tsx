'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { FaGlobe } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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
        className="bg-white/95 p-2 rounded-full shadow-lg cursor-pointer backdrop-blur-sm hover:bg-white/100 transition-colors duration-300"
      >
        <FaGlobe className="text-lg text-orange-800" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white/95 p-3 rounded-xl shadow-lg backdrop-blur-sm min-w-[160px]">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-orange-50/50 p-1 rounded transition-colors duration-300">
              <input
                type="radio"
                name="language"
                value="pt-BR"
                checked={language === 'pt-BR'}
                onChange={() => handleLanguageChange('pt-BR')}
                className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
              />
              <span className="text-sm text-orange-800">Português (Brasil)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-orange-50/50 p-1 rounded transition-colors duration-300">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={() => handleLanguageChange('en')}
                className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
              />
              <span className="text-sm text-orange-800">English</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
} 