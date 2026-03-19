import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DemoLanding() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div
      onClick={() => navigate('/', { replace: true })}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#FFFFFF',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <img
          src="/star-logo-blue.svg"
          alt="Star SVS"
          style={{ width: '180px', maxWidth: '70%', marginBottom: '24px' }}
        />
        <h1 style={{ margin: '0 0 10px', color: '#1B4FBA', fontSize: '2rem', fontWeight: 700 }}>
          Demo
        </h1>
        <p style={{ margin: '0 0 10px', color: '#222222', fontSize: '1rem' }}>
          Skip buttons are enabled on all sign up steps.
        </p>
        <p style={{ margin: 0, color: '#888888', fontSize: '0.9rem' }}>
          This preview is for demonstration purposes only.
        </p>
      </div>
    </div>
  )
}
