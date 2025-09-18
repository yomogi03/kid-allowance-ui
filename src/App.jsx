import { useEffect, useState } from 'react'
import { fetchTransactions, fetchBalance } from './api'

function Pager({ page, totalPages, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page <= 0}>← 前</button>
      <span>Page {page + 1} / {totalPages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page + 1 >= totalPages}>次 →</button>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(0)
  const [size] = useState(5)
  const [data, setData] = useState(null)   // Page<Transaction>
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [balance, setBalance] = useState(0)

  const load = async (p = page) => {
    setLoading(true); setError('')
    try {
      const [pg, bal] = await Promise.all([
        fetchTransactions({ page: p, size }),
        fetchBalance(),
      ])
      setData(pg); setBalance(bal); setPage(p)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(0) }, [])

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>おこづかい管理（フロント最初の一歩）</h1>
      <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, marginBottom: 16 }}>
        <strong>現在の残高：</strong> {balance} 円
      </div>

      {error && <div style={{ color: 'white', background: '#c00', padding: 8, borderRadius: 6 }}>{error}</div>}
      {loading && <div>読み込み中...</div>}

      {data && (
        <>
          <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>日付</th>
                <th>種別</th>
                <th>金額</th>
                <th>メモ</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td style={{ color: tx.amount < 0 ? '#c00' : '#090' }}>{tx.amount}</td>
                  <td>{tx.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pager
            page={data.number}
            totalPages={data.totalPages}
            onChange={(p) => load(p)}
          />
        </>
      )}
    </div>
  )
}

export default App