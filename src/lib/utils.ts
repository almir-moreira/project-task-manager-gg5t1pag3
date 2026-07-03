import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null, pattern = 'MMM d, yyyy HH:mm'): string {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), pattern)
  } catch {
    return dateStr
  }
}
