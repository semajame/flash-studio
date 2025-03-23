'use client'

import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { filters } from '../utils/filters' // Adjust the path as needed

import {
  RotateCcw,
  ArrowRight,
  Aperture,
  Camera,
  Timer,
  Repeat,
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'

import { motion, AnimatePresence } from 'framer-motion'

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [photos, setPhotos] = useState<string[]>([])

  const [countdown, setCountdown] = useState<number | null>(null)
  const [capturing, setCapturing] = useState(false) // Define capturing state

  let [selectedTimer, setSelectedTimer] = useState(3)
  const autoCaptureActive = useRef(false) // Track if auto capture is active

  const [selectedFilter, setSelectedFilter] = useState<string>('None')

  const router = useRouter()

  useEffect(() => {
    startCamera() // Restart the camera when the component mounts
    localStorage.clear() // Clear stored photos

    console.log(localStorage)
  }, [])

  //^ start camera
  const startCamera = async () => {
    try {
      // Stop any existing streams
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const photo = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get the correct video width and height
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    // Set canvas width and height BEFORE applying filters
    canvas.width = videoWidth
    canvas.height = videoHeight

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Force Safari to recognize filters
    ctx.globalCompositeOperation = 'copy'

    // Apply the selected filter BEFORE transformations
    const filter = filters[selectedFilter] || ''
    ctx.filter = filter

    // Apply mirroring if enabled
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)

    // Draw the video frame onto the canvas
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight)

    // Reset transformations and filters
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = 'none'
    ctx.globalCompositeOperation = 'source-over' // Reset operation

    // Convert canvas content to image
    const newPhoto = canvas.toDataURL('image/png')
    setPhotos((prevPhotos) =>
      prevPhotos.length < 4 ? [...prevPhotos, newPhoto] : prevPhotos
    )
  }

  //^ TAKE PHOTO
  const takePhoto = () => {
    if (capturing) return // Prevent multiple captures
    setCapturing(true) // Disable button while capturing

    setCountdown(selectedTimer)

    const countdownFn = (count: number) => {
      if (count === 0) {
        setCountdown(null)

        setTimeout(() => {
          photo() // Capture the photo
          setCapturing(false) // Enable button after capture
        }, 500)

        return
      }

      setTimeout(() => {
        setCountdown((prev) => (prev ? prev - 1 : null))
        countdownFn(count - 1) // Continue countdown
      }, 1000)
    }

    countdownFn(selectedTimer)
  }

  //^ Auto Capture 4 Photos
  const autoCapturePhotos = async () => {
    autoCaptureActive.current = true
    if (capturing) return
    setCapturing(true)
    localStorage.clear() // ✅ Clear local storage before capturing
    setPhotos([]) // ✅ Clear previous photos

    for (let count = 0; count < 4; count++) {
      // Countdown from 3 to 1
      for (let i = 3; i > 0; i--) {
        setCountdown(i)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 sec delay
      }

      setCountdown(null) // Clear countdown before taking the photo

      // Ensure the camera has time to render before capturing
      await new Promise((resolve) => setTimeout(resolve, 500))

      // ✅ Capture the photo and wait for it to complete
      photo()

      await new Promise((resolve) => setTimeout(resolve, 500)) // UI update delay
    }

    setCapturing(false)
    autoCaptureActive.current = false
  }

  //^ Retake Photos
  const retakePhoto = () => {
    autoCaptureActive.current = false // Stop auto capture
    setPhotos([]) // Reset photos
    setCountdown(null) // Reset countdown
    setCapturing(false)
    localStorage.clear()
  }

  return (
    <div className='lg:flex lg:gap-10 items-start lg:justify-evenly py-[3rem] px-[1rem] sm:px-[5rem]'>
      <div>
        <div className='mb-4 flex justify-between items-center'>
          <button
            onClick={startCamera}
            className='px-6 py-4 bg-black text-white rounded-full cursor-pointer flex gap-2 hover:bg-white hover:text-black  transition ease-in-out duration-200'
          >
            <Camera />
            Start Camera
          </button>
          {/* Timer Selection UI */}
          <Select onValueChange={(value) => setSelectedTimer(Number(value))}>
            <SelectTrigger className='rounded-full bg-black text-white cursor-pointer border-none'>
              <Timer />
              <SelectValue placeholder='Select Timer' />
            </SelectTrigger>
            <SelectContent className='bg-black text-white rounded border-none'>
              <SelectGroup className='text-center'>
                <SelectItem
                  value='3'
                  className='hover:bg-zinc-800 cursor-pointer '
                >
                  3s delay
                </SelectItem>
                <SelectItem
                  value='5'
                  className='hover:bg-zinc-800 cursor-pointer'
                >
                  5s delay
                </SelectItem>
                <SelectItem
                  value='10'
                  className='hover:bg-zinc-800 cursor-pointer'
                >
                  10s delay
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='relative'>
          <div
            style={{
              filter: filters[selectedFilter],
              WebkitFilter: filters[selectedFilter],
              willChange: 'filter, transform, opacity',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full border border-zinc-800 rounded-lg object-cover h-auto -scale-x-100`}
            />
          </div>

          {countdown !== null && countdown > 0 && (
            <h1
              className='absolute text-7xl text-white font-bold  w-20 h-20 flex items-center justify-center rounded-full animate-ping
      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            >
              {countdown}
            </h1>
          )}
        </div>
        <canvas ref={canvasRef} className='hidden w-full h-auto' />
        <div className='mt-4'>
          {photos.length < 4 ? (
            <div className='flex gap-4 justify-between'>
              <div className='flex gap-4'>
                <button
                  onClick={takePhoto}
                  disabled={capturing} // Disable when capturing
                  className={`px-6 py-4 flex gap-2 rounded-full transition ease-in-out duration-200 ${
                    capturing
                      ? 'opacity-75 bg-black cursor-not-allowed' // Disabled styles
                      : 'bg-black text-white hover:bg-white hover:text-black cursor-pointer' // Active styles
                  }`}
                >
                  <Aperture />
                  Take Photo
                </button>

                <button
                  onClick={autoCapturePhotos}
                  disabled={capturing} // Disable when capturing
                  className={`px-6 py-4 bg-black flex gap-2 text-white rounded-full cursor-pointertransition ease-in-out duration-200 ${
                    capturing
                      ? 'opacity-75 bg-black cursor-not-allowed' // Disabled styles
                      : 'bg-black text-white hover:bg-white hover:text-black cursor-pointer' // Active styles`
                  }`}
                >
                  <Repeat />
                  Auto Capture
                </button>
              </div>
              {photos.length > 0 && (
                <motion.button
                  onClick={retakePhoto}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='p-4 bg-black text-white rounded-full cursor-pointer hover:bg-zinc-800 hover:border-zinc-800 transition ease-in-out'
                >
                  <RotateCcw />
                </motion.button>
              )}
            </div>
          ) : (
            <div className='flex gap-2 justify-between'>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  localStorage.setItem('capturedPhotos', JSON.stringify(photos))
                  router.push('/print')
                }}
                className='px-6 py-4 bg-green-600 hover:bg-green-800 transition ease-in-out text-white rounded-full cursor-pointer flex gap-2'
              >
                Next <ArrowRight />
              </motion.button>
              <button
                onClick={retakePhoto}
                className='p-4 bg-black text-white rounded-full cursor-pointer hover:bg-zinc-800 hover:border-zinc-800 transition ease-in-out'
              >
                <RotateCcw />
              </button>
            </div>
          )}
        </div>
        <div className='my-6'>
          {photos.length < 4 && (
            <div className='my-6'>
              <div className='grid grid-cols-3 md:grid-cols-5 gap-2 my-2 justify-between flex-wrap'>
                {Object.keys(filters).map((key) => (
                  <button
                    key={key}
                    disabled={capturing || selectedFilter === key} // Disable when capturing or already selected
                    className={`py-3 px-4 rounded-full transition 
    ${
      selectedFilter === key
        ? 'opacity-75 bg-black text-white cursor-not-allowed'
        : 'bg-black text-white hover:bg-white hover:text-black cursor-pointer' // Active styles`
    }
    ${capturing ? 'opacity-75 cursor-not-allowed' : ''}`} // Extra disabled styles when capturing
                    onClick={() => setSelectedFilter(key)}
                  >
                    {key.replace(/([A-Z])/g, ' $1')}{' '}
                    {/* Formats 'blackAndWhite' to 'Black And White' */}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col items-center gap-4 min-h-[220px] lg:w-[300px] w-full justify-center'>
        <AnimatePresence mode='popLayout'>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }} // Fade-in & scale up when added
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }} // Fade-out & scale down when removed
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <img
                  src={photo}
                  alt={`Captured ${index + 1}`}
                  className='w-full max-w-md border border-zinc-600 rounded h-auto object-contain'
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key='no-photos'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='h-[200px] w-full flex items-center justify-center text-white'
            >
              No Photos Yet
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
