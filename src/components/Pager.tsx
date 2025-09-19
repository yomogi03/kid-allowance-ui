type Props = {
  page: number
  totalPages: number
  onChange: (next: number) => void
}
export default function Pager({ page, totalPages, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0' }}>
      <button onClick={() => onChange(page - 1)} disabled={page <= 0}>← 前</button>
      <span>Page {page + 1} / {totalPages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page + 1 >= totalPages}>次 →</button>
    </div>
  )
}
