import { createContext, useState, useEffect, useCallback } from 'react'
import { translations, getTranslation } from '../i18n'

export const LanguageContext = createContext(null)

const STORAGE_KEY = 'skintrader_language'
const DEFAULT_LANGUAGE = 'en'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || DEFAULT_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguageState(lang)
    }
  }, [])

  const t = useCallback((key, params = {}) => {
    return getTranslation(language, key, params)
  }, [language])

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'uz', name: 'Uzbek', nativeName: "O'zbek" }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
