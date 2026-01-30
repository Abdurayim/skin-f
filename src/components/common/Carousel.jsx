import { useState, useEffect, useCallback, useRef } from 'react'
import useSound from '../../hooks/useSound'

export default function Carousel({
  children,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  showDots = true,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const { play } = useSound()
  const containerRef = useRef(null)

  const items = Array.isArray(children) ? children : [children]
  const totalItems = items.length

  const goToSlide = useCallback((index) => {
    play('slide')
    setCurrentIndex(index)
  }, [play])

  const goToNext = useCallback(() => {
    play('whoosh')
    setCurrentIndex((prev) => (prev + 1) % totalItems)
  }, [totalItems, play])

  const goToPrev = useCallback(() => {
    play('whoosh')
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }, [totalItems, play])

  useEffect(() => {
    if (!autoPlay || isHovered || totalItems <= 1) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, isHovered, goToNext, totalItems])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > 50

    if (isSwipe) {
      if (distance > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }

  if (totalItems === 0) return null

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 hover:glow-red z-10"
            style={{ opacity: isHovered ? 1 : 0.5 }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 hover:glow-red z-10"
            style={{ opacity: isHovered ? 1 : 0.5 }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-6 sm:w-8 glow-red'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && totalItems > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalItems) * 100}%`,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
            }}
          />
        </div>
      )}
    </div>
  )
}

// Multi-item Carousel for grids
export function MultiCarousel({
  children,
  itemsPerView = { sm: 2, md: 3, lg: 4 },
  gap = 16,
  showArrows = true,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(4)
  const { play } = useSound()
  const containerRef = useRef(null)

  const items = Array.isArray(children) ? children : [children]
  const maxIndex = Math.max(0, items.length - visibleItems)

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth
      if (width < 640) {
        setVisibleItems(itemsPerView.sm || 1)
      } else if (width < 1024) {
        setVisibleItems(itemsPerView.md || 2)
      } else {
        setVisibleItems(itemsPerView.lg || 4)
      }
    }

    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    return () => window.removeEventListener('resize', updateVisibleItems)
  }, [itemsPerView])

  const goToNext = () => {
    if (currentIndex < maxIndex) {
      play('whoosh')
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      play('whoosh')
      setCurrentIndex(prev => Math.max(prev - 1, 0))
    }
  }

  const itemWidth = `calc((100% - ${gap * (visibleItems - 1)}px) / ${visibleItems})`

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gap}px`,
            transform: `translateX(calc(-${currentIndex} * (${itemWidth} + ${gap}px)))`
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showArrows && items.length > visibleItems && (
        <>
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:border-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
