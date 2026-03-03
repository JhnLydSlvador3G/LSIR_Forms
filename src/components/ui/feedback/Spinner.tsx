// src/ui/feedback/Spinner.tsx

import React from 'react'

interface SpinnerProps {
  size?: string // Size of the spinner
  color?: string // Color of the spinner
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'h-8 w-8',
  color = 'border-leb',
}) => {
  return (
    <div
      className={`${size} animate-spin border-4 ${color} border-solid rounded-full border-t-transparent`}
    ></div>
  )
}

export default Spinner
