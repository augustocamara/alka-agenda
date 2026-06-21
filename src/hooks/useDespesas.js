import { useState, useEffect, useCallback } from 'react'
import { dbGetAll, dbPut, dbPutMany, dbDelete, dbClear } from '../db'

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

  const mesclarTodos = useCallback(async (novas) => {
    // Upsert por ID: atualiza existentes e adiciona novos
    await dbPutMany(novas)
    setDespesas(prev => {
      const mapa = new Map(prev.map(d => [d.id, d]))
      novas.forEach(d => mapa.set(d.id, d))
      return [...mapa.values()]
    })
  }, [])

  const substituirTodos = useCallback(async (novas) => {
    await dbClear()
    await dbPutMany(novas)
    setDespesas(novas)
  }, [])

  return { despesas, carregando, adicionar, adicionarVarias, atualizar, remover, alterarStatus, mesclarTodos, substituirTodos }
}
