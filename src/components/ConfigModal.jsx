import { useRef, useState } from 'react'
import { uid } from '../utils'

export default function ConfigModal({ aberto, onFechar, onMesclar, onSubstituir, onExportar, canInstall, install, isStandalone, show, totalDespesas }) {
  const fileRef = useRef()
  const [pendente, setPendente] = useState(null)   // { dados, count } aguardando escolha do modo
  const [iosInstructions, setIosInstructions] = useState(false)

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)

  async function handleInstall() {
    if (canInstall) {
      const ok = await install()
      if (ok) { show('App instalado!'); onFechar() }
    } else if (isIos && isSafari && !isStandalone) {
      setIosInstructions(true)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const dados = JSON.parse(ev.target.result)
        if (!Array.isArray(dados) || dados.length === 0) throw new Error('Arquivo vazio ou formato inválido')
        const normalizados = dados.map(d => ({
          id: d.id || uid(),
          descricao: d.descricao || '',
          valor: parseFloat(d.valor) || 0,
          vencimento: d.vencimento || '',
          categoria: d.categoria || 'outros',
          recorrencia: d.recorrencia || 'unica',
          status: d.status || 'pendente',
          parcelaAtual: parseInt(d.parcelaAtual) || 1,
          totalParcelas: parseInt(d.totalParcelas || d.parcelas) || 1,
          obs: d.obs || '',
        }))
        setPendente({ dados: normalizados, count: normalizados.length })
      } catch (err) {
        show('Arquivo inválido: ' + err.message, 'err')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  function confirmarMesclar() {
    if (!pendente) return
    onMesclar(pendente.dados)
    setPendente(null)
  }

  function confirmarSubstituir() {
    if (!pendente) return
    onSubstituir(pendente.dados)
    setPendente(null)
  }

  if (!aberto) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 640, padding: '24px 20px', paddingBottom: 'max(28px,calc(28px + env(safe-area-inset-bottom)))' }}>

        <div style={{ width: 40, height: 4, background: '#334155', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Tela de escolha do modo de importação */}
        {pendente ? (
          <>
            <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Como importar?</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {pendente.count} despesas no arquivo · {totalDespesas} já cadastradas no app
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <BtnItem
                icon="🔄"
                titulo="Substituir tudo"
                desc={`Remove as ${totalDespesas} despesas atuais e importa as ${pendente.count} do arquivo. Use para migrar da agenda antiga.`}
                cor="#ef4444"
                onClick={confirmarSubstituir}
              />
              <BtnItem
                icon="➕"
                titulo="Mesclar (atualizar + adicionar)"
                desc="Atualiza despesas com mesmo ID e adiciona as novas. Não remove nenhuma."
                cor="#10b981"
                onClick={confirmarMesclar}
              />
            </div>

            <button onClick={() => setPendente(null)} style={{ ...btnGhost, width: '100%' }}>Cancelar</button>
          </>
        ) : (
          <>
            <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Dados & Instalação</h2>

            {iosInstructions && (
              <div style={{ background: '#0f172a', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #6366f1' }}>
                <div style={{ color: '#6366f1', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Como instalar no iPhone:</div>
                <ol style={{ color: '#94a3b8', fontSize: 13, paddingLeft: 18, lineHeight: 1.8 }}>
                  <li>Toque em <strong style={{ color: '#f1f5f9' }}>Compartilhar</strong> (ícone ↑ na barra do Safari)</li>
                  <li>Role e toque em <strong style={{ color: '#f1f5f9' }}>Adicionar à Tela de Início</strong></li>
                  <li>Toque em <strong style={{ color: '#f1f5f9' }}>Adicionar</strong></li>
                </ol>
                <button onClick={() => setIosInstructions(false)} style={{ ...btnGhost, marginTop: 12, width: '100%' }}>Entendido</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {!isStandalone && (
                <BtnItem
                  icon="📲"
                  titulo="Instalar no celular"
                  desc={canInstall ? 'Adicionar à tela inicial (Android/Chrome)' : isIos ? 'Ver instruções para iPhone (Safari)' : 'Abra no Chrome ou Safari para instalar'}
                  cor="#6366f1"
                  onClick={canInstall || (isIos && isSafari) ? handleInstall : null}
                  disabled={!canInstall && !(isIos && isSafari)}
                />
              )}

              {isStandalone && (
                <div style={{ background: '#10b98122', border: '1px solid #10b981', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>✓</span>
                  <div>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>App instalado</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>Rodando como app nativo</div>
                  </div>
                </div>
              )}

              <BtnItem
                icon="📥"
                titulo="Importar dados (JSON)"
                desc="Carregue o arquivo exportado da agenda antiga ou um backup"
                cor="#f59e0b"
                onClick={() => fileRef.current?.click()}
              />
              <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleFileChange} />

              <BtnItem
                icon="📤"
                titulo="Exportar backup (JSON)"
                desc={`Salva as ${totalDespesas} despesas atuais em arquivo`}
                cor="#10b981"
                onClick={onExportar}
              />

            </div>

            <button onClick={onFechar} style={{ ...btnGhost, width: '100%', marginTop: 16 }}>Fechar</button>
          </>
        )}
      </div>
    </div>
  )
}

function BtnItem({ icon, titulo, desc, cor, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: '#0f172a',
        border: `1px solid ${disabled ? '#1e293b' : cor + '55'}`,
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: '100%', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>{titulo}</div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </button>
  )
}

const btnGhost = { padding: '12px 16px', borderRadius: 10, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 14 }
