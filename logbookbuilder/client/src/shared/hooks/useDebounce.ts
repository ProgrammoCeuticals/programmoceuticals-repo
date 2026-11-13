import { useState, useEffect } from 'react'

/**
 * Delays updating a value until the user stops changing it.
 * Use for search inputs to avoid firing an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
