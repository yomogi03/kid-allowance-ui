export async function fetchTransactions({ page = 0, size = 10, sort = ['date,desc', 'id,desc'] } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  sort.forEach(s => params.append('sort', s))
  const res = await fetch(`/api/transactions?${params.toString()}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() // Page<Transaction> を想定
}

export async function fetchBalance() {
  const res = await fetch('/api/transactions/balance')
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.text().then(t => Number(t))
}