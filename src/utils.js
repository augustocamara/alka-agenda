export const fmt  = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
export const fmtD = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
export const mKey = (d) => d?.slice(0, 7) ?? ''
export const today = () => new Date().toISOString().slice(0, 10)
export const uid  = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function shiftMes(base, n) {
  const [y, m] = base.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function nomeMes(ym) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function gerarParcelas(form, baseVal, nParcelas) {
  const grupoId = uid()
  const parcelas = []
  const baseDate = new Date(form.vencimento + 'T12:00:00')
  const diaBase  = baseDate.getDate()
  for (let i = 0; i < nParcelas; i++) {
    const dt = new Date(form.vencimento + 'T12:00:00')
    dt.setMonth(dt.getMonth() + i)
    const maxDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate()
    dt.setDate(Math.min(diaBase, maxDay))
    const yy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    parcelas.push({
      ...form,
      id: uid(),
      valor: baseVal,
      vencimento: `${yy}-${mm}-${dd}`,
      parcelaAtual: i + 1,
      totalParcelas: nParcelas,
      grupoId,
    })
  }
  return parcelas
}
