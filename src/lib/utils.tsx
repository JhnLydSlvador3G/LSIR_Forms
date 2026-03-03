import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function calculateTotalStudRow(row: any) {
  return [row.male, row.female]
    .map(Number)
    .reduce((a, b) => a + (isNaN(b) ? 0 : b), 0)
}
