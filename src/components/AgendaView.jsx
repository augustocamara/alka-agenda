import { useMemo } from 'react'
import { mKey, fmtD, today } from '../utils'
import { stOf } from '../constants'
import DespesaCard from './DespesaCard'

export default function AgendaView({ despesas, mes, onEditar, onStatus, onExcluir }) {
  const todayStr = today()

  // Filtra pelo mês e marca atrasados automaticamente
  const doMes = useMemo(() => {
    return despesas
      .filter(d => mKey(d.vencimento) === mes)
      .map(d => {
        const atrasado = d.status === 'pendente' && d.vencimento < todayStr
        return atrasado ? { ...d, status: 'atrasado' } : d
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  }, [despesas, mes, todayStr])

  // Agrupa por data de vencimento
  const grupos = useMemo(() => {
    const map = new Map()
    doMes.forEach(d => {
      const k = d.vencimento
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(d)
    })
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [doMes])

  if (grupos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#64748b' }}>Nenhuma despesa</div>
        <div style={{ fontSize: 14 }}>Toque em "+ Nova" para adicionar</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 20px', paddingBottom: 'max(24px,calc(24px + env(safe-area-inset-bottom)))' }}>
      {grupos.map(([data, items]) => (
        <div key={data} style={{ marginBottom: 20 }}>
          <DiaHeader data={data} items={items} todayStr={todayStr} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(d => (
              <DespesaCard
                key={d.id}
                despesa={d}
                onEditar={onEditar}
                onStatus={onStatus}
                onExcluir={onExcluir}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DiaHeader({ data, items, todayStr }) {
  const totalDia = items.reduce((s, d) => s + (d.valor || 0), 0)
  const temAtrasado = items.some(d => d.status === 'atrasado')
  const eHoje = data === todayStr

  const cor = eHoje ? '#6366f1' : temAtrasado ? '#ef4444' : '#334155'
  const label = eHoje ? 'Hoje · ' + fmtD(data) : fmtD(data)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: cor, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#475569' }}>
        {items.length} {items.length === 1 ? 'item' : 'itens'}
      </div>
    </div>
  )
}
