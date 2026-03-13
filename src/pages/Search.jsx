import { useNavigate } from 'react-router-dom'

export default function Search() {
  const navigate = useNavigate()
  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h1>Search results</h1>
      <p>Search page – coming soon.</p>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}
