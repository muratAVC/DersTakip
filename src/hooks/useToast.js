import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState({ visible: false, msg: '' })

  const showToast = useCallback((msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2200)
  }, [])

  return { toast, showToast }
}
