import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000'
}

let app = null
let auth = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
} catch (error) {
  console.warn('Firebase initialization failed:', error.message)
}

export const setupRecaptcha = (containerId) => {
  if (!auth) throw new Error('Firebase not initialized')
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {}
    })
  }
  return window.recaptchaVerifier
}

export const sendOTP = async (phoneNumber) => {
  if (!auth) throw new Error('Firebase not initialized')
  const appVerifier = setupRecaptcha('recaptcha-container')
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  window.confirmationResult = confirmationResult
  return confirmationResult
}

export const verifyOTP = async (otp) => {
  if (!window.confirmationResult) {
    throw new Error('No confirmation result found')
  }
  const result = await window.confirmationResult.confirm(otp)
  return result.user
}

export const getIdToken = async () => {
  if (!auth) return null
  const user = auth.currentUser
  if (user) {
    return await user.getIdToken()
  }
  return null
}

export { app, auth }
