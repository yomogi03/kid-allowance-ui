import { useEffect, useState } from 'react'
import { fetchTransactions, fetchBalance, type Transaction, type Page } from './api'
import Pager from './components/Pager'

export default function App() {
  const [data, setData] = useState<Page<Transaction> | null>(null)
  const [balance, setBalance] = useState(0)
  const [page, setPage] = useState(0)
  const [size] = useState(5)
  const [sort, setSort] = useState<string[]>(['date,desc', 'id,desc'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const load = async (p = page) => {
    setLoading(true); setError('')
    try {
      const [pg, bal] = await Promise.all([
        fetchTransactions({ page: p, size, sort }),
        fetchBalance(),
      ])
      setData(pg)
      setBalance(bal)
      setPage(p)
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(0) }, [])

  const toggleSort = () => {
    // date降順↔昇順トグル（例）
    setSort(prev =>
      prev[0] === 'date,desc' ? ['date,asc', 'id,asc'] : ['date,desc', 'id,desc']
    )
  }

  // sortが変わったら1ページ目から再取得
  useEffect(() => { load(0) }, [sort])

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>おこづかい管理</h1>

      <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, marginBottom: 16 }}>
        <strong>現在の残高：</strong> {balance} 円
        <button style={{ marginLeft: 12 }} onClick={toggleSort}>
          並び替え: {sort[0]}
        </button>
      </div>

      {error && <div style={{ color: '#fff', background: '#c00', padding: 8, borderRadius: 6 }}>{error}</div>}
      {loading && <div>読み込み中…</div>}

      {data && (
        <>
          <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr><th>ID</th><th>日付</th><th>種別</th><th>金額</th><th>メモ</th></tr>
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
            onChange={(next) => load(next)}
          />
        </>
      )}
    </div>
  )
}
