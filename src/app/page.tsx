'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function LandingPage() {
  return (
    <div className='px-10'>
      <div className='min-h-screen  text-white flex flex-col items-center justify-center relative '>
        {/* Header with buttons */}
        <div className='absolute top-10 sm:right-15 right-0 flex gap-4'>
          <Link
            href='https://github.com/semajame'
            passHref
            aria-label='github link'
          >
            <Button
              variant='ghost'
              size='icon'
              aria-label='github button'
              className='text-white hover:bg-white/10 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
                <path d='M9 18c-4.51 2-5-2-7-2'></path>
              </svg>
            </Button>
          </Link>
        </div>
        {/* New snippets banner */}
        <div className='mb-10'>
          <span className='inline-flex cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-3xl'>
            Made by ⚡ James
          </span>
        </div>
        {/* Main content */}
        <div className='text-center max-w-4xl px-4'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-medium mb-8 text-center'>
            Welcome to
            <span className='animate-text-gradient block bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400'>
              Digital Photobooth
            </span>
          </h1>
          <p className='text-md md:text-lg text-gray-300 mb-12 max-w-2xl mx-auto'>
            Capture, smile and share. Snap your best moments with ease, simply
            pose, click and customize your photo strip!
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Link href='/photobooth' passHref>
              <Button
                variant='secondary'
                size='lg'
                className='bg-black hover:bg-white/10 cursor-pointer border'
              >
                Go to Photobooth
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
