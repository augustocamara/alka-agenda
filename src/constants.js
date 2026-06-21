export const CATS = [
  { id: 'moradia',     label: 'Moradia',      icon: '🏠', cor: '#6366f1' },
  { id: 'alimentacao', label: 'Alimentação',   icon: '🍽️', cor: '#f59e0b' },
  { id: 'transporte',  label: 'Transporte',    icon: '🚗', cor: '#10b981' },
  { id: 'saude',       label: 'Saúde',         icon: '❤️', cor: '#ef4444' },
  { id: 'lazer',       label: 'Lazer',         icon: '🎮', cor: '#8b5cf6' },
  { id: 'educacao',    label: 'Educação',      icon: '📚', cor: '#3b82f6' },
  { id: 'servicos',    label: 'Serviços',      icon: '⚡', cor: '#f97316' },
  { id: 'outros',      label: 'Outros',        icon: '📦', cor: '#6b7280' },
]

export const RECS = [
  { id: 'unica',     label: 'Única' },
  { id: 'parcelado', label: 'Parcelado' },
  { id: 'semanal',   label: 'Semanal' },
  { id: 'mensal',    label: 'Mensal' },
  { id: 'anual',     label: 'Anual' },
]

export const STATS = [
  { id: 'pendente', label: 'Pendente', cor: '#f59e0b', bg: '#f59e0b22' },
  { id: 'pago',     label: 'Pago',     cor: '#10b981', bg: '#10b98122' },
  { id: 'atrasado', label: 'Atrasado', cor: '#ef4444', bg: '#ef444422' },
]

export const catOf  = (id) => CATS.find(c => c.id === id)  || CATS[7]
export const stOf   = (id) => STATS.find(s => s.id === id) || STATS[0]
export const recOf  = (id) => RECS.find(r => r.id === id)  || RECS[0]
