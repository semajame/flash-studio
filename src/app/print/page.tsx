'use client'

import html2canvas from 'html2canvas'
import { useEffect, useState } from 'react'

import { Download, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

export default function PrintPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [bgColor, setBgColor] = useState('white') // Default background color
  const [customText, setCustomText] = useState('') // Store custom text
  const [showDate, setShowDate] = useState(false) // Toggle date display
  const [fontColor, setFontColor] = useState('white')

  const router = useRouter()

  useEffect(() => {
    const storedPhotos = localStorage.getItem('capturedPhotos')
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos))
    }
  }, [])

  const todayDate = new Date().toLocaleDateString() // Get today's date

  //^ DOWNLOAD PHOTO
  const handleDownload = () => {
    const element = document.getElementById('photoStrip') // ID of the element you want to download
    if (!element) return

    html2canvas(element).then((canvas) => {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'photo-strip.png'
      link.click()
    })
  }

  //^ FONT COLOR
  const toggleColor = (color: string) => {
    setFontColor(color)
  }

  //^ CONFETTI
  const confettiButton = () => {
    const duration = 15 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: any, max: any) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  return (
    <div className='flex flex-col gap-10 lg:flex lg:flex-row lg:justify-evenly'>
      <div>
        <h1 className='text-3xl font-bold mb-5'>Photo Strip Editor</h1>
        <div className='flex gap-4 flex-col'>
          {/* Photo Strip Selection
          <div>
            <h2 className='text-gray-400'>Select Photo Strip</h2>
            <div className='my-2 grid grid-cols-3 gap-2'>
              <button className='py-2 px-10 border border-zinc-800 rounded-md bg-black text-white cursor-pointer text-xs'>
                Default
              </button>
              <button className='py-2 px-10 border border-zinc-800 rounded-md bg-black text-white cursor-pointer text-xs'>
                Film Strip
              </button>
              <button className='py-2 px-10 border border-zinc-800 rounded-md bg-black text-white cursor-pointer text-xs'>
                I don’t know yet
              </button>
            </div>
          </div> */}
          {/* Background Color Selection */}
          <div>
            <h2 className='text-gray-400'>Select Background Color</h2>
            <div className='my-2 grid grid-cols-3 gap-2'>
              {[
                'white',
                '#0000',
                '#001524',
                '#592E83',
                '#EF798A',
                '#ff579f',
              ].map((color) => (
                <button
                  key={color}
                  className={`py-4 px-10 rounded-md text-white cursor-pointer border${
                    bgColor === color ? 'ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBgColor(color)}
                />
              ))}
            </div>

            {/* CUSTOM COLOR BACKGROUND */}
            <div className='my-5'>
              <h2 className='text-gray-400'>Select a custom color</h2>
              <input
                type='color'
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className='w-full mt-2 cursor-pointer h-12 p-1 border border-gray-500 '
              />
            </div>
            <div className='my-5'>
              <h2 className='text-gray-400 '>
                What do you want to say about the photo? (max 30 chars)
              </h2>
              <input
                type='text'
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={30}
                className='w-full h-11 px-3 mt-2 border border-zinc-800 rounded-md bg-black  outline-none text-gray-400'
                placeholder='Enter your message here...'
              />
            </div>

            <div className='my-4'>
              <h2 className='text-gray-400'>Select Font Color</h2>
              <div className='my-2 flex gap-2'>
                <button
                  className={`py-2 px-10 rounded-md text-black cursor-pointer  bg-white w-full border text-sm`}
                  onClick={() => toggleColor('white')}
                >
                  White
                </button>

                <button
                  className={`py-2 px-10 rounded-md text-white cursor-pointer  bg-black w-full border text-sm`}
                  onClick={() => toggleColor('black')}
                >
                  Black
                </button>
              </div>

              <div className='mt-4'>
                <h2 className='text-gray-400'>Select Custom Font Color</h2>
                <input
                  type='color'
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className='w-full cursor-pointer h-12 p-1 border border-gray-500 mt-2'
                />
              </div>
            </div>

            {/* Checkbox to Show Date */}
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='showDate'
                checked={showDate}
                onChange={() => setShowDate(!showDate)}
                className='w-5 h-5 cursor-pointer bg-zinc-800'
              />
              <label
                htmlFor='showDate'
                className='text-gray-400 cursor-pointer'
              >
                Show today's date
              </label>
            </div>
          </div>
          {/* Print Button */}
          <div className='flex gap-2 justify-center lg:justify-start'>
            <button
              onClick={() => {
                handleDownload()
                confettiButton()
              }}
              className='px-4 py-2 bg-green-500 text-white  rounded-full cursor-pointer'
            >
              <div className='flex items-center justify-center gap-2'>
                <Download />
                <p>Save</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/')}
              className='p-4 bg-black text-white rounded-full cursor-pointer hover:bg-zinc-800 hover:border-zinc-800 transition ease-in-out'
            >
              <RotateCcw />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Display with Dynamic Background */}
      <div className='flex justify-center'>
        <div
          className='flex flex-col gap-4 p-7 pb-[7rem] w-[350px]  '
          id='photoStrip'
          style={{ backgroundColor: bgColor }} // Apply background color
        >
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Photo ${index + 1}`}
              className='w-full max-w-md h-auto '
            />
          ))}

          <div>
            {customText && (
              <p
                className='mt-4 text-sm font-semibold'
                style={{ color: fontColor }}
              >
                {customText}
              </p>
            )}
            {/* Display Date if Checkbox is Checked */}
            {showDate && (
              <p className='text-sm font-bold' style={{ color: fontColor }}>
                {todayDate}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
