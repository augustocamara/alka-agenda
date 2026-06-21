export default function ConfirmModal({ aberto, mensagem, onConfirmar, onCancelar }) {
  if (!aberto) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: 24,
    }}>
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, maxWidth: 300, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#f1f5f9' }}>
          {mensagem ?? 'Excluir despesa?'}
        </div>
        <div style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
          Esta ação não pode ser desfeita.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancelar} style={btnGhost}>Cancelar</button>
          <button onClick={onConfirmar} style={btnDanger}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

const btnGhost  = { flex: 1, padding: 12, borderRadius: 10, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 14 }
const btnDanger = { flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }
