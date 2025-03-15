'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { filters } from './utils/filters' // Adjust the path as needed

import {
  Eclipse,
  Ban,
  RotateCcw,
  ArrowRight,
  ArrowRightLeft,
  X,
} from 'lucide-react'

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [capturing, setCapturing] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCancelled, setIsCancelled] = useState(false) // Track cancellation

  const [selectedTimer, setSelectedTimer] = useState(3)

  const [selectedFilter, setSelectedFilter] = useState<string>('none')
  const [isMirrored, setIsMirrored] = useState(false)
  const countdownInterval = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  useEffect(() => {
    startCamera() // Restart the camera when the component mounts
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

    // Maintain aspect ratio
    const aspectRatio = videoWidth / videoHeight

    // Set canvas width and height to match video dimensions
    canvas.width = videoWidth
    canvas.height = videoHeight

    // Clear the previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply mirroring if enabled
    if (isMirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    // Apply the selected filter
    const filter = filters[selectedFilter] || ''
    ctx.filter = filter

    // Adjust `drawImage()` to maintain aspect ratio
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight)

    // Reset transformations and filters
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = 'none'

    // Convert canvas content to image
    const newPhoto = canvas.toDataURL('image/png')
    setPhotos((prevPhotos) =>
      prevPhotos.length < 4 ? [...prevPhotos, newPhoto] : prevPhotos
    )
  }

  //^ capture photo
  const takePhoto = () => {
    if (capturing) return
    setCapturing(true)

    let count = selectedTimer // Use selectedTimer as the countdown value
    setCountdown(count)

    countdownInterval.current = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count === 0) {
        clearInterval(countdownInterval.current as NodeJS.Timeout)
        photo()
        setCapturing(false)
      }
    }, 1000)
  }

  // //^ Auto Capture 4 Photos
  // const autoCapturePhotos = async () => {
  //   if (capturing) return
  //   setCapturing(true)
  //   setIsCancelled(false)

  //   const video = videoRef.current
  //   if (!video) return

  //   // Ensure video is fully loaded
  //   while (video.readyState < 2) {
  //     if (isCancelled) return
  //     await new Promise((resolve) => setTimeout(resolve, 500))
  //   }

  //   let capturedPhotos: string[] = []

  //   for (let i = 0; i < 4; i++) {
  //     if (isCancelled) return

  //     // Countdown before first capture
  //     if (i === 0) {
  //       for (let j = 3; j > 0; j--) {
  //         setCountdown(j)
  //         await new Promise((resolve) => setTimeout(resolve, 1000))
  //       }
  //     }

  //     setCountdown(null)
  //     await new Promise((resolve) => requestAnimationFrame(resolve))

  //     photo()
  //     await new Promise((resolve) => setTimeout(resolve, 500))

  //     if (isCancelled) return

  //     // Ensure the photo is valid
  //     let newPhoto = canvasRef.current?.toDataURL('image/png') || ''
  //     if (!newPhoto || newPhoto.length < 100) {
  //       console.warn('Black frame detected, retrying...')
  //       i--
  //       continue
  //     }

  //     capturedPhotos.push(newPhoto)
  //     setPhotos([...capturedPhotos])
  //   }

  //   setCapturing(false)
  // }

  //^ Retake Photos
  const retakePhoto = () => {
    setIsCancelled(true)
    clearInterval(countdownInterval.current as NodeJS.Timeout)
    setPhotos([])
    setCountdown(null)
    setCapturing(false)
  }

  return (
    <div className='lg:flex lg:gap-10 items-start lg:justify-evenly '>
      <div>
        <div className='mb-4 flex justify-between items-center'>
          <button
            onClick={startCamera}
            className='px-6 py-4 bg-zinc-800 text-white rounded-full cursor-pointer inline-block'
          >
            Start Camera
          </button>
          {/* Timer Selection UI */}
          <div className=' flex gap-4 items-center'>
            <select
              value={selectedTimer}
              onChange={(e) => setSelectedTimer(Number(e.target.value))}
              className='p-2 border rounded bg-black text-white cursor-pointer'
            >
              <option value={3}>3 Seconds</option>
              <option value={5}>5 Seconds</option>
              <option value={10}>10 Seconds</option>
            </select>
          </div>
        </div>
        <div className='relative'>
          <div style={{ filter: filters[selectedFilter] }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full border border-zinc-800 rounded-lg object-cover h-auto`}
              style={{
                transform: isMirrored ? 'scaleX(-1)' : 'none',
              }}
            />
          </div>

          {countdown !== null && countdown > 0 && (
            <h1
              className='absolute text-3xl text-white font-bold bg-zinc-400 w-20 h-20 flex items-center justify-center rounded-full animate-ping
      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            >
              {countdown}
            </h1>
          )}
        </div>
        <canvas ref={canvasRef} className='hidden' />
        <div className='mt-4'>
          {photos.length < 4 ? (
            <div className='flex gap-4 justify-between'>
              <div className='flex gap-4'>
                <button
                  onClick={takePhoto}
                  className='px-6 py-4 bg-black text-white rounded-full cursor-pointer hover:bg-white hover:text-black transition ease-in-out duration-200'
                >
                  Capture Photo
                </button>
                {/* {photos.length < 1 && ( // Keep Auto Capture visible
                  <button
                    onClick={autoCapturePhotos}
                    className='px-6 py-4 bg-black text-white rounded-full cursor-pointer hover:bg-white hover:text-black transition ease-in-out duration-200'
                  >
                    Auto Capture
                  </button>
                )} */}
              </div>
              <button
                onClick={retakePhoto}
                className='p-4 bg-black text-white rounded-full cursor-pointer hover:bg-zinc-800 hover:border-zinc-800 transition ease-in-out'
              >
                <RotateCcw />
              </button>
            </div>
          ) : (
            <div className='flex gap-2 justify-between'>
              <button
                onClick={() => {
                  localStorage.setItem('capturedPhotos', JSON.stringify(photos))
                  router.push('/print')
                }}
                className='px-6 py-4 bg-green-600 hover:bg-green-800 transition ease-in-out text-white rounded-full cursor-pointer'
              >
                <ArrowRight />
              </button>
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
                    className={`py-2 px-4 border rounded-full cursor-pointer ${
                      selectedFilter === key
                        ? 'bg-zinc-850 text-white'
                        : 'bg-black text-white'
                    }`}
                    onClick={() => setSelectedFilter(key)}
                  >
                    {key.replace(/([A-Z])/g, ' $1')}{' '}
                    {/* Formats 'blackAndWhite' to 'Black And White' */}
                  </button>
                ))}
                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  className={`py-2 px-4 border rounded-full cursor-pointer  ${
                    isMirrored ? 'bg-zinc-850' : 'bg-black'
                  } text-white `}
                >
                  Mirror
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 min-h-[220px] lg:w-[300px] w-full border border-transparent justify-center'>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={index}>
              <img
                src={photo}
                alt={`Captured ${index + 1}`}
                className='w-full max-w-md border border-zinc-800 rounded h-auto object-contain'
              />
            </div>
          ))
        ) : (
          <div className='h-[200px] w-full flex items-center justify-center text-gray-500'>
            No Photos Yet
          </div>
        )}
      </div>
    </div>
  )
}
