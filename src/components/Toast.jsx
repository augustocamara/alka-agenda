export default function Toast({ toast }) {
  if (!toast) return null
  const bg = toast.tipo === 'err' ? '#ef4444' : toast.tipo === 'info' ? '#334155' : '#10b981'
  return (
    <div style={{
      position: 'fixed',
      bottom: 'max(24px, calc(24px + env(safe-area-inset-bottom)))',
      left: '50%', transform: 'translateX(-50%)',
      background: bg, color: '#fff',
      padding: '12px 24px', borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      boxShadow: '0 4px 20px rgba(0,0,0,.5)',
      zIndex: 1000, whiteSpace: 'nowrap',
      animation: 'fadeIn .2s ease',
    }}>
      {toast.msg}
    </div>
  )
}
