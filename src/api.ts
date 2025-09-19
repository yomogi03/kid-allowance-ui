// APIのレスポンス型を定義
export interface Transaction {
  id: number
  date: string
  type: 'IN' | 'OUT'
  amount: number
  note: string
}

export interface Page<T> {
  content: T[]
  totalPages: number
  number: number
  size: number
  totalElements: number
  first: boolean
  last: boolean
}

export async function fetchTransactions(params: {
  page?: number; size?: number; sort?: string[]
} = {}): Promise<Page<Transaction>> {
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  params.sort?.forEach(s => search.append('sort', s))
  const res = await fetch(`/api/transactions?${search}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchBalance(): Promise<number> {
  const res = await fetch('/api/transactions/balance')
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.text().then(Number)
}
