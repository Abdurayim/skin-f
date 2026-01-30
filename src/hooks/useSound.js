import { useCallback, useRef } from 'react'

// Sound effect URLs (using Web Audio API for generated sounds)
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null

const createOscillator = (frequency, type, duration, volume = 0.1) => {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = type

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

const sounds = {
  click: () => {
    // Sharp digital click
    createOscillator(1200, 'square', 0.05, 0.7)
    setTimeout(() => createOscillator(800, 'sine', 0.08, 0.5), 20)
  },
  hover: () => {
    // Subtle tech beep
    createOscillator(900, 'sine', 0.04, 0.5)
    setTimeout(() => createOscillator(1100, 'sine', 0.03, 0.4), 30)
  },
  success: () => {
    // Victory fanfare
    createOscillator(523.25, 'sine', 0.1, 0.7)
    setTimeout(() => createOscillator(659.25, 'sine', 0.1, 0.7), 80)
    setTimeout(() => createOscillator(783.99, 'sine', 0.15, 0.7), 160)
    setTimeout(() => createOscillator(1046.5, 'sine', 0.2, 0.6), 240)
  },
  error: () => {
    // Harsh digital error
    createOscillator(300, 'sawtooth', 0.15, 0.7)
    setTimeout(() => createOscillator(250, 'square', 0.2, 0.6), 100)
    setTimeout(() => createOscillator(200, 'sawtooth', 0.25, 0.5), 200)
  },
  notification: () => {
    // Attention grabber
    createOscillator(1000, 'sine', 0.08, 0.6)
    setTimeout(() => createOscillator(1200, 'sine', 0.08, 0.6), 90)
    setTimeout(() => createOscillator(1400, 'sine', 0.12, 0.5), 180)
  },
  whoosh: () => {
    if (!audioContext) return
    const duration = 0.2
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  },
  pop: () => {
    // Bubble pop sound
    createOscillator(600, 'sine', 0.06, 0.7)
    setTimeout(() => createOscillator(400, 'sine', 0.04, 0.5), 30)
  },
  slide: () => {
    if (!audioContext) return
    const duration = 0.25
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(0.7, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }
}

export function useSound() {
  const enabledRef = useRef(true)

  const play = useCallback((soundName) => {
    if (!enabledRef.current) return
    if (audioContext?.state === 'suspended') {
      audioContext.resume()
    }
    sounds[soundName]?.()
  }, [])

  const setEnabled = useCallback((enabled) => {
    enabledRef.current = enabled
  }, [])

  return { play, setEnabled }
}

export default useSound
