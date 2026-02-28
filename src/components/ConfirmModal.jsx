import React from 'react'

export default function ConfirmModal({
  visible, title, message,
  confirmLabel = 'Evet, Sil',
  confirmClass = 'bg-accent',
  onConfirm, onCancel
}) {
  if (!visible) return null
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-5 w-full max-w-[400px] modal-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-base font-black text-textmain mb-1">{title}</div>
        <div className="text-xs font-semibold text-muted mb-4">{message}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-extrabold text-sm text-muted bg-appbg border border-border"
          >Vazgeç</button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-extrabold text-sm text-white ${confirmClass}`}
          >{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
