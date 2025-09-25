import { useState } from 'react'
import { createTransaction, type TxType } from '../api'

type Props = {
  onSuccess: () => void  // 送信成功後に一覧をリロード
}

export default function TxForm({ onSuccess }: Props) {
  const [type, setType] = useState<TxType>('IN')
  const [amount, setAmount] = useState<number>(100)
  const [date, setDate] = useState<string>('')  // 空ならサーバで today
  const [note, setNote] = useState<string>('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!amount || amount <= 0) {
      setError('金額は0より大きい数値を入力してください')
      return
    }
    setSubmitting(true)
    try {
      await createTransaction({
        amount,
        type,
        date: date || null, // 空文字は送らない
        note: note || undefined,
      })
      // フォームをリセット
      setType('IN'); setAmount(100); setDate(''); setNote('')
      onSuccess() // 一覧を再取得
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12, alignItems:'end', margin:'12px 0' }}>
      <div>
        <label>種別</label><br/>
        <select value={type} onChange={e => setType(e.target.value as TxType)}>
          <option value="IN">入金</option>
          <option value="OUT">出金</option>
        </select>
      </div>
      <div>
        <label>金額</label><br/>
        <input type="number" min={1} value={amount}
               onChange={e => setAmount(Number(e.target.value))} />
      </div>
      <div>
        <label>日付（省略可）</label><br/>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div style={{ gridColumn:'span 1' }}>
        <label>メモ</label><br/>
        <input type="text" value={note} onChange={e => setNote(e.target.value)} maxLength={100}/>
      </div>
      <div>
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中…' : '登録'}
        </button>
        {error && <div style={{ color:'#c00', marginTop:6, fontSize:12 }}>{error}</div>}
      </div>
    </form>
  )
}
