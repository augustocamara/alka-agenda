import { fmt, nomeMes, shiftMes } from '../utils'

export default function Header({ mes, setMes, view, setView, onNova, totais }) {
  const { total, totalPago, totalPend, temAtrasado } = totais

  return (
    <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', borderBottom: '1px solid #1e293b', padding: '0 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Título + botão nova */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'max(20px, calc(16px + env(safe-area-inset-top))', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, textTransform: 'uppercase' }}>Alka</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Agenda</div>
          </div>
          {view !== 'form' && (
            <button onClick={onNova} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              + Nova
            </button>
          )}
        </div>

        {/* Navegação de mês */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setMes(m => shiftMes(m, -1))} style={navBtn}>‹</button>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#cbd5e1', textTransform: 'capitalize' }}>
            {nomeMes(mes)}
          </span>
          <button onClick={() => setMes(m => shiftMes(m, 1))} style={navBtn}>›</button>
        </div>

        {/* Cards de totais */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <CardTotal label="Total"  valor={total}      cor="#6366f1" />
          <CardTotal label="Pago"   valor={totalPago}   cor="#10b981" />
          <CardTotal label="Aberto" valor={totalPend}   cor={temAtrasado ? '#ef4444' : '#f59e0b'} />
        </div>

        {/* Abas Agenda / Resumo */}
        {view !== 'form' && (
          <div style={{ display: 'flex', borderBottom: '1px solid #1e293b' }}>
            {['agenda', 'resumo'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: 'transparent', border: 'none',
                color: view === v ? '#6366f1' : '#64748b',
                padding: '10px 20px', fontWeight: 600, cursor: 'pointer',
                borderBottom: view === v ? '2px solid #6366f1' : '2px solid transparent',
                fontSize: 14, textTransform: 'capitalize',
              }}>
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CardTotal({ label, valor, cor }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '12px 10px', borderTop: `3px solid ${cor}` }}>
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: cor }}>{fmt(valor)}</div>
    </div>
  )
}

const navBtn = { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 18 }
