import { useState, useMemo } from 'react'
import { mKey, today } from './utils'
import { useDespesas } from './hooks/useDespesas'
import { useToast } from './hooks/useToast'
import { useInstall } from './hooks/useInstall'
import Header from './components/Header'
import AgendaView from './components/AgendaView'
import ResumoView from './components/ResumoView'
import FormDespesa from './components/FormDespesa'
import ConfirmModal from './components/ConfirmModal'
import ConfigModal from './components/ConfigModal'
import Toast from './components/Toast'

function mesPadrao() {
  return today().slice(0, 7)
}

export default function App() {
  const { despesas, carregando, adicionar, adicionarVarias, atualizar, remover, alterarStatus, mesclarTodos, substituirTodos } = useDespesas()
  const { toast, show } = useToast()
  const { canInstall, install, isStandalone } = useInstall()

  const [mes,  setMes]  = useState(mesPadrao)
  const [view, setView] = useState('agenda')

  const [editando,  setEditando]  = useState(null)
  const [excluindo, setExcluindo] = useState(null)
  const [configAberto, setConfigAberto] = useState(false)

  // Totais do mês atual
  const todayStr = today()
  const totais = useMemo(() => {
    const doMes = despesas.filter(d => mKey(d.vencimento) === mes)
    const total      = doMes.reduce((s, d) => s + (d.valor || 0), 0)
    const totalPago  = doMes.filter(d => d.status === 'pago').reduce((s, d) => s + d.valor, 0)
    const totalPend  = doMes.filter(d => d.status !== 'pago').reduce((s, d) => s + d.valor, 0)
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

  async function handleMesclar(novas) {
    await mesclarTodos(novas)
    show(`${novas.length} despesas mescladas!`)
  }

  async function handleSubstituir(novas) {
    await substituirTodos(novas)
    show(`Substituído! ${novas.length} despesas importadas.`)
  }

  // Exportar JSON (backup)
  function handleExportar() {
    const blob = new Blob([JSON.stringify(despesas, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alka-agenda-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
    show('Backup exportado!')
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
        onConfig={() => setConfigAberto(true)}
        totais={totais}
        canInstall={canInstall}
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

      <ConfigModal
        aberto={configAberto}
        onFechar={() => setConfigAberto(false)}
        onMesclar={handleMesclar}
        onSubstituir={handleSubstituir}
        onExportar={handleExportar}
        canInstall={canInstall}
        install={install}
        isStandalone={isStandalone}
        show={show}
        totalDespesas={despesas.length}
      />

      <Toast toast={toast} />
    </div>
  )
}
