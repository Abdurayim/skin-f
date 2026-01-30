import en from './en.json'
import ru from './ru.json'
import uz from './uz.json'

export const translations = {
  en,
  ru,
  uz
}

export function getTranslation(language, key, params = {}) {
  const keys = key.split('.')
  let value = translations[language]

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      value = undefined
      break
    }
  }

  if (value === undefined) {
    // Fallback to English
    value = translations.en
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = key
        break
      }
    }
  }

  if (typeof value === 'string' && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue)
    })
  }

  return value || key
}

export default translations
