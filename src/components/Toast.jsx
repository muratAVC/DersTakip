import React from 'react'

export default function Toast({ visible, msg }) {
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[999]
      bg-textmain text-white text-xs font-bold px-5 py-2.5 rounded-full
      whitespace-nowrap pointer-events-none transition-all duration-300
      ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      {msg}
    </div>
  )
}
