"use client"
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import {useRouter} from "next/navigation"


interface ScrollVideoProps {
  videoSrc?: string // Keep for backwards compatibility, but will use frames instead
  imageSrc?: string // Base path like "/frames/frame_" 
  imageCount?: number // Total number of frames
  imageExtension?: string // "jpg", "png", "webp"
  height?: string
  className?: string
}

const ScrollVideo: React.FC<ScrollVideoProps> = ({ 
  videoSrc, // Ignored, keeping for compatibility
  imageSrc = "/frames/frame_",
  imageCount = 279,
  imageExtension = "jpg",
  height = "300vh",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const router= useRouter();
  
  // Store preloaded images
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedCountRef = useRef(0)
  const currentFrameRef = useRef(0)

  // Create image path
  const getImagePath = useCallback((index: number) => {
    const paddedIndex = String(index).padStart(4, '0') // Assumes 4-digit padding like frame_0001.jpg
    return `${imageSrc}${paddedIndex}.${imageExtension}`
  }, [imageSrc, imageExtension])

  const firstFramePath = useMemo(() => getImagePath(0), [getImagePath])

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const img = imagesRef.current[frameIndex]
    
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return

    // Get container dimensions
    const container = canvas.parentElement
    if (!container) return
    
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    // Set canvas size without causing layout issues
    canvas.width = containerWidth
    canvas.height = containerHeight
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    // Clear and draw image
    ctx.clearRect(0, 0, containerWidth, containerHeight)
    ctx.drawImage(img, 0, 0, containerWidth, containerHeight)
  }, [])

  // Load first frame immediately
  useEffect(() => {
    const loadFirstFrame = () => {
      const img = new Image()
      img.onload = () => {
        imagesRef.current[0] = img
        setFirstFrameLoaded(true)
        // Draw the first frame immediately
        setTimeout(() => drawFrame(0), 0)
      }
      img.onerror = () => {
        console.warn(`Failed to load first frame: ${getImagePath(0)}`)
        setFirstFrameLoaded(true) // Set to true even if failed to prevent infinite loading
      }
      img.src = getImagePath(0)
    }

    loadFirstFrame()
  }, [getImagePath, drawFrame])

  // Preload all images
  useEffect(() => {
    const images: HTMLImageElement[] = []
    loadedCountRef.current = 0

    // If first frame is already loaded, add it to the array
    if (imagesRef.current[0]) {
      images[0] = imagesRef.current[0]
      loadedCountRef.current = 1
      setLoadProgress(1 / imageCount)
    }

    const loadImage = (index: number) => {
      return new Promise<void>((resolve) => {
        // Skip first frame if already loaded
        if (index === 0 && images[0]) {
          resolve()
          return
        }

        const img = new Image()
        img.onload = () => {
          loadedCountRef.current++
          setLoadProgress(loadedCountRef.current / imageCount)
          resolve()
        }
        img.onerror = () => {
          console.warn(`Failed to load frame ${index}: ${getImagePath(index)}`)
          // Create a blank image as fallback
          const canvas = document.createElement('canvas')
          canvas.width = 1920
          canvas.height = 1080
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, 1920, 1080)
          }
          const fallbackImg = new Image()
          fallbackImg.onload = () => {
            loadedCountRef.current++
            setLoadProgress(loadedCountRef.current / imageCount)
            resolve()
          }
          fallbackImg.src = canvas.toDataURL()
          images[index] = fallbackImg
        }
        img.src = getImagePath(index)
        images[index] = img
      })
    }

    // Load all images
    const loadAllImages = async () => {
      const promises = Array.from({ length: imageCount }, (_, i) => loadImage(i))
      await Promise.all(promises)
      
      imagesRef.current = images
      setIsLoaded(true)
    }

    loadAllImages()

    return () => {
      // Cleanup
      images.forEach(img => {
        if (img) {
          img.onload = null
          img.onerror = null
        }
      })
    }
  }, [imageCount, getImagePath, firstFrameLoaded])

  // Calculate and update frame based on scroll
  const updateFrame = useCallback(() => {
    if (!containerRef.current || (!isLoaded && !firstFrameLoaded)) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const containerHeight = container.offsetHeight
    const windowHeight = window.innerHeight
    
    const scrollableDistance = containerHeight - windowHeight
    if (scrollableDistance <= 0) return
    
    // If container is above viewport (rect.top > 0), show first frame
    // If container is below viewport (rect.top < -scrollableDistance), show last frame
    // Otherwise, calculate progress normally
    let progress: number
    if (rect.top > 0) {
      progress = 0 // Show first frame when component is above viewport
    } else if (rect.top < -scrollableDistance) {
      progress = 1 // Show last frame when component is below viewport
    } else {
      progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance))
    }
    
    const frameIndex = Math.floor(progress * (imageCount - 1))
    
    // Show button in last 2-3 frames
    const shouldShowButton = frameIndex >= imageCount - 3
    setShowButton(shouldShowButton)
    
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex
      drawFrame(frameIndex)
    }
  }, [isLoaded, firstFrameLoaded, imageCount, drawFrame])

  // Scroll handler with RAF
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateFrame()
          ticking = false
        })
        ticking = true
      }
    }

    const handleResize = () => {
      // Redraw current frame on resize
      drawFrame(currentFrameRef.current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Initial draw when first frame is loaded
    if (firstFrameLoaded) {
      updateFrame()
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateFrame, drawFrame, firstFrameLoaded])

  return (
    <div>
      <section 
        ref={containerRef} 
        className={`relative ${className}`}
        style={{ height }}
      >
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{
            backgroundImage: `url(${firstFramePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full object-cover block"
            style={{
              pointerEvents: 'none',
              display: 'block',
              maxWidth: '100%',
              height: 'auto'
            }}
          />

          {firstFrameLoaded && !isLoaded && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
              <p className="text-sm">Loading frames... {Math.round(loadProgress * 100)}%</p>
            </div>
          )}
          
          {showButton && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <button
              onClick={() => router.push("/login")}
              className={`relative z-[102] px-6 py-4 rounded text-lg translate-y-64 transition-colors reg-text custom-border-all bg-[#41c4fc5a] hover:bg-[#65d1ff9f] text-white cursor-pointer`}
            >
              Enter Gotham&apos;s Chatroom
            </button>
            </div>
          )}
        </div>
      </section>
      <div
      className='text-white w-full h-8 z-50 relative bg-black bg-opacity-50 flex justify-end  px-2 reg-text custom-border'
      >
        <span>Built with love by <a href="https://www.github.com/adeebrq" target='_blank'>adeeb</a></span>
      </div>
    </div>
  )
}

export default ScrollVideo