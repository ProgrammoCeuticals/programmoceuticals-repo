export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Compute visible page numbers (up to 7, centered on current)
  const pages = []
  const half = 3
  let start = Math.max(1, page - half)
  let end = Math.min(totalPages, page + half)
  if (end - start < 6) {
    if (start === 1) end = Math.min(totalPages, start + 6)
    else start = Math.max(1, end - 6)
  }
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="pagination">
      <button
        className="pag-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pag-btn${p === page ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pag-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next ›
      </button>

      <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '0.5rem' }}>
        Page {page} of {totalPages}
      </span>
    </div>
  )
}
