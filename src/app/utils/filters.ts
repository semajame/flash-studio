export const filters: { [key: string]: string } = {
  None: 'none',
  BNW: 'grayscale(100%)',
  Sepia: 'sepia(100%)',

  // Ensure proper filter syntax for Canvas API
  Vintage: 'sepia(100%) contrast(1.25) brightness(0.9)',
  Soft: 'brightness(1.1) saturate(1.1) blur(1px)',
  Noir: 'grayscale(100%) contrast(1.25) brightness(0.75)',
  Vivid: 'saturate(2) contrast(1.5) brightness(1.1)',
}
