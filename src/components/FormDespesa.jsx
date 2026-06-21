import { useState, useEffect } from 'react'
import { today, uid, gerarParcelas } from '../utils'
import { CATS, RECS, catOf } from '../constants'

const EMPTY = {
  id: '', descricao: '', valor: '', categoria: 'outros',
  vencimento: today(), recorrencia: 'unica', totalParcelas: 1,
  parcelaAtual: 1, status: 'pendente',
}

export default function FormDespesa({ despesaEditar, onSalvar, onSalvarVarias, onCancelar }) {
  const [form, setForm] = useState(EMPTY)
  const [nParcelas, setNParcelas] = useState(1)

  useEffect(() => {
    if (despesaEditar) {
      setForm({ ...despesaEditar, valor: String(despesaEditar.valor) })
    } else {
      setForm({ ...EMPTY, id: uid() })
    }
    setNParcelas(1)
  }, [despesaEditar])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const ehParcelado = form.recorrencia === 'parcelado'

  function handleSalvar() {
    const valorNum = parseFloat(String(form.valor).replace(',', '.')) || 0
    if (!form.descricao.trim() || valorNum <= 0) return

    const base = { ...form, valor: valorNum, id: form.id || uid() }

    if (!despesaEditar && ehParcelado && nParcelas > 1) {
      const parcelas = gerarParcelas(base, valorNum, nParcelas)
      onSalvarVarias(parcelas)
    } else {
      onSalvar(base)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px', paddingBottom: 'max(24px,calc(24px + env(safe-area-inset-bottom)))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onCancelar} style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>‹</button>
        <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>
          {despesaEditar ? 'Editar despesa' : 'Nova despesa'}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Descrição */}
        <div>
          <label style={lbl}>Descrição</label>
          <input
            value={form.descricao}
            onChange={e => set('descricao', e.target.value)}
            placeholder="Ex: Conta de luz"
            style={inp}
          />
        </div>

        {/* Valor */}
        <div>
          <label style={lbl}>Valor (R$)</label>
          <input
            type="number" inputMode="decimal" min="0" step="0.01"
            value={form.valor}
            onChange={e => set('valor', e.target.value)}
            placeholder="0,00"
            style={inp}
          />
        </div>

        {/* Vencimento */}
        <div>
          <label style={lbl}>Vencimento</label>
          <input
            type="date"
            value={form.vencimento}
            onChange={e => set('vencimento', e.target.value)}
            style={inp}
          />
        </div>

        {/* Categoria */}
        <div>
          <label style={lbl}>Categoria</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {CATS.map(c => {
              const ativo = form.categoria === c.id
              return (
                <button key={c.id} onClick={() => set('categoria', c.id)} style={{
                  padding: '10px 6px', borderRadius: 10,
                  border: `2px solid ${ativo ? c.cor : '#334155'}`,
                  background: ativo ? c.cor + '22' : 'transparent',
                  cursor: 'pointer', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20 }}>{c.icon}</div>
                  <div style={{ fontSize: 10, color: ativo ? c.cor : '#94a3b8', marginTop: 2, fontWeight: ativo ? 700 : 400 }}>{c.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recorrência — só na criação */}
        {!despesaEditar && (
          <div>
            <label style={lbl}>Tipo</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RECS.map(r => {
                const ativo = form.recorrencia === r.id
                return (
                  <button key={r.id} onClick={() => set('recorrencia', r.id)} style={{
                    padding: '8px 14px', borderRadius: 10,
                    border: `2px solid ${ativo ? '#6366f1' : '#334155'}`,
                    background: ativo ? '#6366f122' : 'transparent',
                    color: ativo ? '#6366f1' : '#94a3b8',
                    cursor: 'pointer', fontWeight: ativo ? 700 : 400, fontSize: 13,
                  }}>
                    {r.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* N° de parcelas */}
        {!despesaEditar && ehParcelado && (
          <div>
            <label style={lbl}>Número de parcelas</label>
            <input
              type="number" inputMode="numeric" min="2" max="60"
              value={nParcelas}
              onChange={e => setNParcelas(Number(e.target.value))}
              style={inp}
            />
          </div>
        )}

        {/* Status (só na edição) */}
        {despesaEditar && (
          <div>
            <label style={lbl}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['pendente', 'pago', 'atrasado'].map(s => {
                const ativo = form.status === s
                const cor = s === 'pago' ? '#10b981' : s === 'atrasado' ? '#ef4444' : '#f59e0b'
                return (
                  <button key={s} onClick={() => set('status', s)} style={{
                    flex: 1, padding: '10px 6px', borderRadius: 10, textTransform: 'capitalize',
                    border: `2px solid ${ativo ? cor : '#334155'}`,
                    background: ativo ? cor + '22' : 'transparent',
                    color: ativo ? cor : '#64748b', cursor: 'pointer', fontWeight: ativo ? 700 : 400, fontSize: 13,
                  }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Botão salvar */}
        <button onClick={handleSalvar} style={{
          background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12,
          padding: '14px', fontWeight: 700, cursor: 'pointer', fontSize: 16, marginTop: 8,
        }}>
          {despesaEditar ? 'Salvar alterações' : 'Adicionar despesa'}
        </button>

      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }
const inp = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 15, outline: 'none', boxSizing: 'border-box' }
