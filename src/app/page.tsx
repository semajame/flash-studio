'use client'

import { useRef, useState } from 'react'
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

  const [selectedFilter, setSelectedFilter] = useState<string>('none')
  const [isMirrored, setIsMirrored] = useState(false)

  const router = useRouter()

  //^ start camera
  const startCamera = async () => {
    try {
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
    if (canvas && video) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the image from the video onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply grayscale filter if selected
      if (selectedFilter === 'blackAndWhite') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3 // Calculate average for grayscale
          data[i] = avg // Red
          data[i + 1] = avg // Green
          data[i + 2] = avg // Blue
        }

        ctx.putImageData(imageData, 0, 0)
      }

      // Convert canvas to image
      const newPhoto = canvas.toDataURL('image/png')
      setPhotos((prevPhotos) =>
        prevPhotos.length < 4 ? [...prevPhotos, newPhoto] : prevPhotos
      )
    }
  }

  //^ capture photo
  const takePhoto = () => {
    if (capturing) return // Prevent multiple clicks
    setCapturing(true)

    let countdown = 3
    setCountdown(countdown) // Start countdown from 3

    const countdownInterval = setInterval(() => {
      countdown -= 1
      setCountdown(countdown)

      if (countdown <= 0) {
        clearInterval(countdownInterval)
        photo() // Capture photo
        setCapturing(false)
        setCountdown(null) // Reset countdown after capture
      }
    }, 1000) // Update countdown every second
  }

  //^ Auto Capture Photos
  const autoCapturePhotos = async () => {
    if (capturing) return
    setCapturing(true)
    setIsCancelled(false) // Reset cancellation state

    let capturedPhotos: string[] = []

    const video = videoRef.current
    if (!video) return

    // Ensure the first frame is fully loaded
    while (video.readyState < 2) {
      if (isCancelled) return // Stop if retake is clicked
      console.log('Waiting for video to be ready...')
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Add a short delay before taking the first photo to avoid black frames
    await new Promise((resolve) => setTimeout(resolve, 1000))

    for (let count = 0; count < 4; count++) {
      if (isCancelled) return // Stop if retake is clicked

      // Only show countdown if it's the first capture
      if (count === 0) {
        for (let i = 3; i > 0; i--) {
          setCountdown(i)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      setCountdown(null)
      await new Promise((resolve) => requestAnimationFrame(resolve))

      takePhoto()

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (isCancelled) return // Stop if retake is clicked

      // Ensure the photo is not black before adding it
      let newPhoto = canvasRef.current?.toDataURL('image/png') || ''
      if (!newPhoto || newPhoto.length < 100) {
        console.warn('Black frame detected, retrying...')
        count--
        continue
      }

      capturedPhotos.push(newPhoto)
      setPhotos([...capturedPhotos])
    }

    setCapturing(false)
  }

  //^ RETAKE PHOTO
  const retakePhoto = () => {
    setIsCancelled(true) // Stop autoCapturePhotos
    setPhotos([])
    setCountdown(null)
    setCapturing(false)
  }

  return (
    <div className='flex items-start gap-10 justify-evenly'>
      <div>
        <div className='mb-4'>
          <button
            onClick={startCamera}
            className='px-6 py-4 bg-zinc-800 text-white rounded-full cursor-pointer inline-block'
          >
            Start Camera
          </button>
        </div>
        <div className='relative'>
          <video
            ref={videoRef}
            autoPlay
            className={`w-[600px] border border-zinc-800 rounded-lg object-cover h-[500px] ${filters[selectedFilter]}`}
            style={isMirrored ? { transform: 'scaleX(-1)' } : {}}
          />

          {countdown !== null && countdown > 0 && (
            <h1 className='absolute text-3xl text-white font-bold top-[12rem] left-[15.5rem] bg-zinc-400 w-22 h-22 flex items-center justify-center rounded-full animate-ping'>
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
              <div className='flex gap-2 my-2'>
                <button
                  onClick={() => setSelectedFilter('none')}
                  className={`p-3 rounded-full cursor-pointer border border-zinc-700 ${
                    selectedFilter === 'none' ? 'bg-zinc-800' : 'bg-black'
                  } text-white rounded h-12 w-12`}
                >
                  <X />
                </button>

                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  className={`p-3 rounded-full cursor-pointer border border-zinc-700 ${
                    isMirrored ? 'bg-zinc-800' : 'bg-black'
                  } text-white rounded h-12 w-12`}
                >
                  <ArrowRightLeft />
                </button>
                <button
                  onClick={() => setSelectedFilter('blackAndWhite')}
                  className={`p-3 rounded-full cursor-pointer border border-zinc-700 ${
                    selectedFilter === 'blackAndWhite'
                      ? 'bg-zinc-800'
                      : 'bg-black'
                  } text-white rounded  h-12 w-12`}
                >
                  <Eclipse />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 min-h-[220px] w-[300px] border border-transparent'>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={index}>
              <img
                src={photo}
                alt={`Captured ${index + 1}`}
                className='w-full max-w-md border border-zinc-800 rounded h-[200px]'
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
