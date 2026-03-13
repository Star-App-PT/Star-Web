import { useNavigate } from 'react-router-dom'

export default function Workers() {
  const navigate = useNavigate()
  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h1>Workers in your area</h1>
      <p>All workers – coming soon.</p>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}
