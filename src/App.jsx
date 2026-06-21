import { useState, useMemo } from 'react'
import { mKey, today } from './utils'
import { useDespesas } from './hooks/useDespesas'
import { useToast } from './hooks/useToast'
import Header from './components/Header'
import AgendaView from './components/AgendaView'
import ResumoView from './components/ResumoView'
import FormDespesa from './components/FormDespesa'
import ConfirmModal from './components/ConfirmModal'
import Toast from './components/Toast'

function mesPadrao() {
  return today().slice(0, 7)
}

export default function App() {
  const { despesas, carregando, adicionar, adicionarVarias, atualizar, remover, alterarStatus } = useDespesas()
  const { toast, show } = useToast()

  const [mes,  setMes]  = useState(mesPadrao)
  const [view, setView] = useState('agenda')

  const [editando, setEditando]   = useState(null)    // despesa sendo editada, ou null = nova
  const [excluindo, setExcluindo] = useState(null)    // id a excluir

  // Totais do mês atual
  const todayStr = today()
  const totais = useMemo(() => {
    const doMes = despesas.filter(d => mKey(d.vencimento) === mes)
    const total     = doMes.reduce((s, d) => s + (d.valor || 0), 0)
    const totalPago = doMes.filter(d => d.status === 'pago').reduce((s, d) => s + d.valor, 0)
    const totalPend = doMes.filter(d => d.status !== 'pago').reduce((s, d) => s + d.valor, 0)
    const temAtrasado = doMes.some(d => d.status === 'pendente' && d.vencimento < todayStr)
    return { total, totalPago, totalPend, temAtrasado }
  }, [despesas, mes, todayStr])

  // Handlers do formulário
  async function handleSalvar(despesa) {
    if (editando) {
      await atualizar(despesa)
      show('Despesa atualizada!')
    } else {
      await adicionar(despesa)
      show('Despesa adicionada!')
    }
    setView('agenda')
    setEditando(null)
  }

  async function handleSalvarVarias(parcelas) {
    await adicionarVarias(parcelas)
    show(`${parcelas.length} parcelas adicionadas!`)
    setView('agenda')
    setEditando(null)
  }

  function handleEditar(despesa) {
    setEditando(despesa)
    setView('form')
  }

  function handleNova() {
    setEditando(null)
    setView('form')
  }

  function handleCancelarForm() {
    setEditando(null)
    setView('agenda')
  }

  async function handleStatus(id, status) {
    await alterarStatus(id, status)
    show(status === 'pago' ? 'Marcado como pago ✓' : 'Status atualizado')
  }

  async function handleConfirmarExclusao() {
    if (!excluindo) return
    await remover(excluindo)
    setExcluindo(null)
    show('Despesa excluída', 'info')
  }

  if (carregando) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6366f1', fontSize: 15, fontWeight: 600 }}>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      <Header
        mes={mes}
        setMes={setMes}
        view={view}
        setView={setView}
        onNova={handleNova}
        totais={totais}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {view === 'form' ? (
          <FormDespesa
            despesaEditar={editando}
            onSalvar={handleSalvar}
            onSalvarVarias={handleSalvarVarias}
            onCancelar={handleCancelarForm}
          />
        ) : view === 'resumo' ? (
          <ResumoView despesas={despesas} mes={mes} />
        ) : (
          <AgendaView
            despesas={despesas}
            mes={mes}
            onEditar={handleEditar}
            onStatus={handleStatus}
            onExcluir={id => setExcluindo(id)}
          />
        )}
      </main>

      <ConfirmModal
        aberto={!!excluindo}
        onConfirmar={handleConfirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />

      <Toast toast={toast} />
    </div>
  )
}
