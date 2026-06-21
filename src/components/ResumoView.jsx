import { useMemo } from 'react'
import { fmt, mKey } from '../utils'
import { catOf, stOf, CATS, STATS } from '../constants'

export default function ResumoView({ despesas, mes }) {
  const doMes = useMemo(() =>
    despesas.filter(d => mKey(d.vencimento) === mes), [despesas, mes])

  const total      = doMes.reduce((s, d) => s + (d.valor || 0), 0)
  const totalPago  = doMes.filter(d => d.status === 'pago').reduce((s, d) => s + d.valor, 0)
  const totalPend  = doMes.filter(d => d.status !== 'pago').reduce((s, d) => s + d.valor, 0)

  // Por categoria
  const porCat = useMemo(() => {
    const map = {}
    doMes.forEach(d => {
      map[d.categoria] = (map[d.categoria] || 0) + d.valor
    })
    return Object.entries(map)
      .map(([id, valor]) => ({ ...catOf(id), valor, pct: total > 0 ? (valor / total) * 100 : 0 }))
      .sort((a, b) => b.valor - a.valor)
  }, [doMes, total])

  // Por status
  const porStatus = useMemo(() => {
    const map = {}
    doMes.forEach(d => {
      const s = d.status === 'pendente' && d.vencimento < new Date().toISOString().slice(0, 10) ? 'atrasado' : d.status
      map[s] = (map[s] || 0) + d.valor
    })
    return Object.entries(map).map(([id, valor]) => ({ ...stOf(id), valor }))
  }, [doMes])

  if (doMes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#64748b' }}>Sem dados neste mês</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px', paddingBottom: 'max(24px,calc(24px + env(safe-area-inset-bottom)))' }}>

      {/* Cards gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <BigCard label="Total do mês" valor={total}     cor="#6366f1" />
        <BigCard label="Total de despesas" valor={doMes.length} cor="#8b5cf6" isCount />
        <BigCard label="Pago"   valor={totalPago} cor="#10b981" />
        <BigCard label="Aberto" valor={totalPend} cor="#f59e0b" />
      </div>

      {/* Por status */}
      <Section titulo="Por status">
        {porStatus.map(s => (
          <BarraItem key={s.id} label={s.label} valor={s.valor} cor={s.cor} total={total} />
        ))}
      </Section>

      {/* Por categoria */}
      <Section titulo="Por categoria">
        {porCat.map(c => (
          <BarraItem key={c.id} label={`${c.icon} ${c.label}`} valor={c.valor} cor={c.cor} total={total} />
        ))}
      </Section>

    </div>
  )
}

function BigCard({ label, valor, cor, isCount }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 14, padding: '16px 14px', borderTop: `3px solid ${cor}` }}>
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: cor }}>
        {isCount ? valor : fmt(valor)}
      </div>
    </div>
  )
}

function Section({ titulo, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>{titulo}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  )
}

function BarraItem({ label, valor, cor, total }) {
  const pct = total > 0 ? (valor / total) * 100 : 0
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: cor, fontWeight: 700 }}>{fmt(valor)}</span>
      </div>
      <div style={{ height: 6, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: cor, borderRadius: 4, transition: 'width .4s ease' }} />
      </div>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{pct.toFixed(1)}%</div>
    </div>
  )
}
