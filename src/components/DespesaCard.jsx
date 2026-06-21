import { fmt, fmtD } from '../utils'
import { catOf, stOf } from '../constants'

export default function DespesaCard({ despesa, onEditar, onStatus, onExcluir }) {
  const cat  = catOf(despesa.categoria)
  const st   = stOf(despesa.status)

  return (
    <div style={{
      background: '#1e293b', borderRadius: 14, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      borderLeft: `4px solid ${cat.cor}`,
    }}>
      {/* Ícone categoria */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: cat.cor + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {cat.icon}
      </div>

      {/* Info central */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {despesa.descricao}
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
          {cat.label} · {fmtD(despesa.vencimento)}
          {despesa.totalParcelas > 1 && ` · ${despesa.parcelaAtual}/${despesa.totalParcelas}`}
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{
            display: 'inline-block', background: st.bg, color: st.cor,
            borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
          }}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Valor */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{fmt(despesa.valor)}</div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'flex-end' }}>
          {despesa.status !== 'pago' && (
            <ActionBtn onClick={() => onStatus(despesa.id, 'pago')} cor="#10b981" title="Marcar como pago">✓</ActionBtn>
          )}
          {despesa.status === 'pago' && (
            <ActionBtn onClick={() => onStatus(despesa.id, 'pendente')} cor="#f59e0b" title="Desmarcar">↩</ActionBtn>
          )}
          <ActionBtn onClick={() => onEditar(despesa)} cor="#6366f1" title="Editar">✎</ActionBtn>
          <ActionBtn onClick={() => onExcluir(despesa.id)} cor="#ef4444" title="Excluir">✕</ActionBtn>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ onClick, cor, children, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 28, height: 28, borderRadius: 7, border: 'none',
      background: cor + '22', color: cor, cursor: 'pointer',
      fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </button>
  )
}
