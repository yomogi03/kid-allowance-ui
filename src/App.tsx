import { useEffect, useState } from 'react'
import { fetchTransactions, fetchBalance, type Transaction, type Page } from './api'

function App() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Page<Transaction> | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    async function load() {
      const [pg, bal] = await Promise.all([
        fetchTransactions({ page: 0, size: 5, sort: ['date,desc', 'id,desc'] }),
        fetchBalance(),
      ])
      setData(pg)
      setBalance(bal)
    }
    load()
  }, [])

  return (
    <div>
      <h1>残高: {balance}円</h1>
      {data && (
        <ul>
          {data.content.map(tx => (
            <li key={tx.id}>
              {tx.date} {tx.type} {tx.amount} ({tx.note})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
