import { useState, useEffect, useCallback } from 'react'
import { dbGetAll, dbPut, dbPutMany, dbDelete } from '../db'

export function useDespesas() {
  const [despesas, setDespesas]     = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    dbGetAll()
      .then(data => setDespesas(data ?? []))
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  const adicionar = useCallback(async (despesa) => {
    await dbPut(despesa)
    setDespesas(prev => [...prev, despesa])
  }, [])

  const adicionarVarias = useCallback(async (novas) => {
    await dbPutMany(novas)
    setDespesas(prev => [...prev, ...novas])
  }, [])

  const atualizar = useCallback(async (despesa) => {
    await dbPut(despesa)
    setDespesas(prev => prev.map(d => d.id === despesa.id ? despesa : d))
  }, [])

  const remover = useCallback(async (id) => {
    await dbDelete(id)
    setDespesas(prev => prev.filter(d => d.id !== id))
  }, [])

  const alterarStatus = useCallback(async (id, status) => {
    setDespesas(prev => {
      const despesa = prev.find(d => d.id === id)
      if (!despesa) return prev
      const atualizada = { ...despesa, status }
      dbPut(atualizada)
      return prev.map(d => d.id === id ? atualizada : d)
    })
  }, [])

  return { despesas, carregando, adicionar, adicionarVarias, atualizar, remover, alterarStatus }
}
