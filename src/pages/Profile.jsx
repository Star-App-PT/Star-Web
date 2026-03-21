import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { ABOUT_FIELD_KEYS, ABOUT_FIELD_LABEL_KEYS, fetchProfileAbout } from '../lib/profileAbout'
import './Profile.css'

export default function Profile() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [jobsBooked, setJobsBooked] = useState(0)
  const [reviewsReceived, setReviewsReceived] = useState(0)
  const [aboutFields, setAboutFields] = useState({})

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfileAbout(session.user).then(({ fields }) => setAboutFields(fields))
        const uid = session.user.id
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('client_id', uid).then(({ count }) => {
          setJobsBooked(typeof count === 'number' ? count : 0)
        }).catch(() => setJobsBooked(0))
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('reviewee_id', uid).then(({ count }) => {
          setReviewsReceived(typeof count === 'number' ? count : 0)
        }).catch(() => setReviewsReceived(0))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null)
      } else {
        setUser(session.user)
        fetchProfileAbout(session.user).then(({ fields }) => setAboutFields(fields))
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user && !loading) {
      navigate('/signup', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    navigate('/')
  }

  const langCode = i18n.language?.startsWith('pt') ? 'pt-PT' : i18n.language?.startsWith('es') ? 'es' : 'en'
  const langLabel = { 'pt-PT': 'PT', en: 'EN', es: 'ES' }[langCode] || 'EN'

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">{t('common.submitting')}</div>
      </div>
    )
  }

  if (!user) return null

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.profile_photo_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.profile_photo_url ||
    null
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || ''
  const city = user.user_metadata?.city || user.user_metadata?.location || ''
  const isWorker = user.user_metadata?.profile_complete === true
  const memberType = isWorker ? t('profile.memberTypeWorker') : t('profile.memberTypeClient')
  const emailVerified = !!user.email_confirmed_at
  const phoneVerified = !!(user.phone && user.phone !== '')
  const verified = emailVerified || phoneVerified
  const created = user.created_at ? new Date(user.created_at) : null
  const memberSince = created ? t('profile.memberSinceFormat', { month: created.toLocaleString(i18n.language || 'en', { month: 'long' }), year: created.getFullYear() }) : '—'

  return (
    <div className="profile-page">
      <div className="profile-page__inner container">
        <aside className="profile-page__sidebar">
          <div className="profile-page__card profile-page__card--sidebar">
            <div className="profile-page__avatar-wrap">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="profile-page__avatar" />
              ) : (
                <span className="profile-page__avatar-initial">{firstName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2 className="profile-page__name">{firstName}</h2>
            {city && <p className="profile-page__location">{city}</p>}
            <nav className="profile-page__nav">
              <Link to="/profile/bookings" className="profile-page__nav-link">{t('profile.myBookings')}</Link>
              <Link to="/client/favourites" className="profile-page__nav-link">{t('profile.savedWorkers')}</Link>
              <Link to="/profile/settings" className="profile-page__nav-link">{t('profile.settings')}</Link>
              <button type="button" className="profile-page__nav-link profile-page__nav-link--signout" onClick={handleSignOut}>
                {t('dashboard.signOut')}
              </button>
            </nav>
          </div>
        </aside>

        <main className="profile-page__main">
          <div className="profile-page__card profile-page__card--about">
            <div className="profile-page__about-header">
              <h1 className="profile-page__about-title">{t('profile.aboutMe')}</h1>
              <Link to="/profile/edit" className="profile-page__edit-btn">
                {t('profile.edit')}
              </Link>
            </div>

            <div className="profile-page__stats">
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">{jobsBooked}</span>
                <span className="profile-page__stat-label">{t('profile.jobsBooked')}</span>
              </div>
              <div className="profile-page__stat">
                <span className="profile-page__stat-value">{reviewsReceived}</span>
                <span className="profile-page__stat-label">{t('profile.reviewsReceived')}</span>
              </div>
              <div className="profile-page__stat">
                <span className="profile-page__stat-value profile-page__stat-value--text">{memberSince}</span>
                <span className="profile-page__stat-label">{t('profile.memberSince')}</span>
              </div>
            </div>

            {ABOUT_FIELD_KEYS.some((k) => aboutFields[k]?.trim()) && (
              <div className="profile-page__about-extra">
                <h2 className="profile-page__about-extra-title">{t('profile.getToKnowMe')}</h2>
                <ul className="profile-page__about-list">
                  {ABOUT_FIELD_KEYS.filter((k) => aboutFields[k]?.trim()).map((k) => (
                    <li key={k} className="profile-page__about-item">
                      <span className="profile-page__about-item-label">{t(ABOUT_FIELD_LABEL_KEYS[k])}</span>
                      <span className="profile-page__about-item-value">{aboutFields[k]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="profile-page__info">
              <div className="profile-page__info-row">
                <span className="profile-page__info-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>{city || t('profile.locationNotSet')}</span>
              </div>
              <div className="profile-page__info-row">
                <span className="profile-page__info-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span>{memberType}</span>
              </div>
              {verified && (
                <div className="profile-page__info-row">
                  <span className="profile-page__info-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </span>
                  <span>{t('profile.verified')}</span>
                </div>
              )}
              <div className="profile-page__info-row">
                <span className="profile-page__info-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span>{t('profile.preferredLanguage')}: {langLabel}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
