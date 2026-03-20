import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Briefcase,
  Cake,
  Camera,
  ChevronRight,
  GraduationCap,
  Languages,
  MapPin,
  Music,
  Palette,
  PartyPopper,
  PawPrint,
  Plus,
  Sparkles,
} from 'lucide-react'
import { supabase } from '../supabase'
import {
  ABOUT_FIELD_LABEL_KEYS,
  emptyAboutFields,
  fetchProfileAbout,
  persistProfileAbout,
  uploadProfileAvatar,
} from '../lib/profileAbout'
import { fetchClientPastWorkers } from '../lib/fetchClientPastWorkers'
import { PROFILE_INTEREST_OPTIONS } from '../data/profileInterestOptions'
import ProfileEditInterestsModal from '../components/ProfileEditInterestsModal'
import './ProfileEdit.css'

const VALID_INTEREST_IDS = new Set(PROFILE_INTEREST_OPTIONS.map((o) => o.id))
const INTEREST_ICON_BY_ID = Object.fromEntries(
  PROFILE_INTEREST_OPTIONS.map((o) => [o.id, o.Icon]),
)

function parseProfileInterests(meta) {
  const raw = meta?.profile_interests
  let arr = []
  if (Array.isArray(raw)) arr = raw
  else if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw)
      if (Array.isArray(p)) arr = p
    } catch {
      /* ignore */
    }
  }
  return arr.map(String).filter((id) => VALID_INTEREST_IDS.has(id)).slice(0, 20)
}

const FIELD_CONFIG = [
  { key: 'school', Icon: GraduationCap },
  { key: 'dream_destination', Icon: MapPin },
  { key: 'work', Icon: Briefcase },
  { key: 'pets', Icon: PawPrint },
  { key: 'birth_decade', Icon: Cake },
  { key: 'fav_song_childhood', Icon: Music },
  { key: 'hobbies', Icon: Palette },
  { key: 'useless_skill', Icon: Sparkles },
  { key: 'fun_fact', Icon: PartyPopper },
  { key: 'languages', Icon: Languages },
].map(({ key, Icon }) => ({ key, labelKey: ABOUT_FIELD_LABEL_KEYS[key], Icon }))

const MOCK_HIRED = [
  { nameKey: 'profileEdit.hiredMockName1', categoryKey: 'home.categoryClean', rating: '4.9', dateKey: 'profileEdit.hiredMockDate1' },
  { nameKey: 'profileEdit.hiredMockName2', categoryKey: 'home.categoryRepair', rating: '4.8', dateKey: 'profileEdit.hiredMockDate2' },
  { nameKey: 'profileEdit.hiredMockName3', categoryKey: 'home.categoryServices', rating: '5.0', dateKey: 'profileEdit.hiredMockDate3' },
]

export default function ProfileEdit() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState(emptyAboutFields)
  const [editingKey, setEditingKey] = useState(null)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showHiredOnProfile, setShowHiredOnProfile] = useState(true)
  const [pastWorkers, setPastWorkers] = useState([])
  const [interestsModalOpen, setInterestsModalOpen] = useState(false)
  const [selectedInterestIds, setSelectedInterestIds] = useState([])
  const fileRef = useRef(null)
  const inputRef = useRef(null)
  const skipBlurSave = useRef(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/signup', { replace: true })
        return
      }
      setUser(session.user)
      setSelectedInterestIds(parseProfileInterests(session.user.user_metadata))
      setShowHiredOnProfile(session.user.user_metadata?.profile_show_hired_workers !== false)
      const url =
        session.user.user_metadata?.avatar_url ||
        session.user.user_metadata?.picture ||
        session.user.user_metadata?.profile_photo_url ||
        null
      setAvatarUrl(url)
      fetchProfileAbout(session.user).then(({ fields }) => {
        setValues(fields)
        setLoading(false)
      })
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setSelectedInterestIds(parseProfileInterests(session.user.user_metadata))
        setShowHiredOnProfile(session.user.user_metadata?.profile_show_hired_workers !== false)
        const url =
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture ||
          session.user.user_metadata?.profile_photo_url ||
          null
        setAvatarUrl(url)
      }
    })
    return () => subscription?.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    fetchClientPastWorkers(user.id, t, i18n.language).then((rows) => {
      if (!cancelled) setPastWorkers(rows)
    })
    return () => {
      cancelled = true
    }
  }, [user?.id, t, i18n.language])

  useEffect(() => {
    if (editingKey && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingKey])

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) setUser(session.user)
  }, [])

  const saveFields = useCallback(
    async (next) => {
      if (!supabase || !user) return
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user || user
      setSaving(true)
      const { error } = await persistProfileAbout(u, next)
      setSaving(false)
      if (!error) await refreshUser()
    },
    [user, refreshUser],
  )

  const commitField = async (key, raw) => {
    if (skipBlurSave.current) {
      skipBlurSave.current = false
      return
    }
    const trimmed = typeof raw === 'string' ? raw.trim() : ''
    const next = { ...values, [key]: trimmed }
    setValues(next)
    setEditingKey(null)
    setDraft('')
    await saveFields(next)
  }

  const startEdit = (key) => {
    setEditingKey(key)
    setDraft(values[key] || '')
  }

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user || !supabase) return

    const { publicUrl, error: upErr } = await uploadProfileAvatar(user.id, file)
    let nextUrl = publicUrl

    if (upErr || !nextUrl) {
      nextUrl = await new Promise((resolve) => {
        const r = new FileReader()
        r.onload = () => resolve(typeof r.result === 'string' ? r.result : null)
        r.onerror = () => resolve(null)
        r.readAsDataURL(file)
      })
    }

    if (!nextUrl) return

    setAvatarUrl(nextUrl)
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        avatar_url: nextUrl,
        profile_photo_url: nextUrl,
      },
    })
    setSaving(false)
    if (!error) await refreshUser()
  }

  const handleInterestsSave = useCallback(
    async (ids) => {
      const cleaned = ids.filter((id) => VALID_INTEREST_IDS.has(id)).slice(0, 20)
      setSelectedInterestIds(cleaned)
      if (!supabase || !user) return
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user || user
      await supabase.auth.updateUser({
        data: { ...u.user_metadata, profile_interests: cleaned },
      })
      await refreshUser()
    },
    [user, refreshUser],
  )

  const toggleHiredVisibility = async () => {
    const next = !showHiredOnProfile
    setShowHiredOnProfile(next)
    if (!supabase || !user) return
    const { data: { session } } = await supabase.auth.getSession()
    const u = session?.user || user
    await supabase.auth.updateUser({
      data: { ...u.user_metadata, profile_show_hired_workers: next },
    })
    await refreshUser()
  }

  const handleDone = async () => {
    let finalValues = values
    if (editingKey !== null) {
      finalValues = { ...values, [editingKey]: draft.trim() }
      setValues(finalValues)
      setEditingKey(null)
      setDraft('')
    }
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user || user
      if (u) await persistProfileAbout(u, finalValues)
    }
    navigate('/profile')
  }

  const mockCardRows = useMemo(
    () =>
      MOCK_HIRED.map((w, i) => ({
        id: `mock-${i}`,
        name: t(w.nameKey),
        service: t(w.categoryKey),
        rating: w.rating,
        date: t(w.dateKey),
        photoUrl: null,
      })),
    [t],
  )

  const orderedInterestIds = useMemo(() => {
    const order = PROFILE_INTEREST_OPTIONS.map((o) => o.id)
    const sel = new Set(selectedInterestIds)
    return [
      ...order.filter((id) => sel.has(id)),
      ...selectedInterestIds.filter((id) => !order.includes(id)),
    ]
  }, [selectedInterestIds])

  if (loading || !user) {
    return (
      <div className="profile-edit">
        <div className="profile-edit__loading">{t('common.submitting')}</div>
      </div>
    )
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '?'

  const hasBookingHistory = pastWorkers.length > 0
  const displayHiredCards = hasBookingHistory ? pastWorkers : mockCardRows

  return (
    <div className="profile-edit">
      <div className="profile-edit__inner">
        <div className="profile-edit__hero">
          <div className="profile-edit__photo-col">
            <div className="profile-edit__photo-wrap">
              <div className="profile-edit__photo-disk">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="profile-edit__photo-img" />
                ) : (
                  <span className="profile-edit__photo-initial">{firstName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="profile-edit__photo-input"
                aria-hidden
                tabIndex={-1}
                onChange={handlePhotoPick}
              />
              <button
                type="button"
                className="profile-edit__photo-edit"
                onClick={() => fileRef.current?.click()}
              >
                <Camera className="profile-edit__photo-edit-icon" strokeWidth={2} aria-hidden />
                {t('profile.edit')}
              </button>
            </div>
          </div>
          <div className="profile-edit__intro">
            <h1 className="profile-edit__title">{t('profileEdit.title')}</h1>
            <p className="profile-edit__subtitle">{t('profileEdit.subtitle')}</p>
          </div>
        </div>

        <div className="profile-edit__grid" role="list">
          {FIELD_CONFIG.map(({ key, labelKey, Icon }) => {
            const isEditing = editingKey === key
            const display = values[key]?.trim() || t('profileEdit.add')

            return (
              <div key={key} role="listitem" className="profile-edit__row-wrap">
                {isEditing ? (
                  <div className="profile-edit__row profile-edit__row--editing">
                    <span className="profile-edit__row-icon" aria-hidden>
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <div className="profile-edit__row-body">
                      <span className="profile-edit__row-label">{t(labelKey)}</span>
                      <input
                        ref={inputRef}
                        type="text"
                        className="profile-edit__input"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commitField(key, draft)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            commitField(key, draft)
                          }
                          if (e.key === 'Escape') {
                            skipBlurSave.current = true
                            setEditingKey(null)
                            setDraft('')
                          }
                        }}
                        aria-label={t(labelKey)}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="profile-edit__row"
                    onClick={() => startEdit(key)}
                  >
                    <span className="profile-edit__row-icon" aria-hidden>
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <div className="profile-edit__row-body">
                      <span className="profile-edit__row-label">{t(labelKey)}</span>
                      <span className="profile-edit__row-value">{display}</span>
                    </div>
                    <ChevronRight className="profile-edit__row-chevron" strokeWidth={2} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="profile-edit__section-divider" aria-hidden />

        <section className="profile-edit__section" aria-labelledby="profile-edit-hired-heading">
          <div className="profile-edit__section-head">
            <div className="profile-edit__section-head-text">
              <h2 id="profile-edit-hired-heading" className="profile-edit__section-title">
                {hasBookingHistory ? t('profileEdit.hiredTitle') : t('profileEdit.suggestedWorkersTitle')}
              </h2>
              <p className="profile-edit__section-subtitle">
                {hasBookingHistory ? t('profileEdit.hiredSubtitle') : t('profileEdit.suggestedWorkersSubtitle')}
              </p>
            </div>
            <button
              type="button"
              className={`profile-edit__toggle${showHiredOnProfile ? ' profile-edit__toggle--on' : ''}`}
              role="switch"
              aria-checked={showHiredOnProfile}
              aria-label={t('profileEdit.hiredToggleAria')}
              onClick={toggleHiredVisibility}
            >
              <span className="profile-edit__toggle-knob" />
            </button>
          </div>
          {!showHiredOnProfile && (
            <p className="profile-edit__hired-hidden-banner" role="status">
              {t('profileEdit.hiredHiddenNote')}
            </p>
          )}
          <div
            className={`profile-edit__hired-cards${!showHiredOnProfile ? ' profile-edit__hired-cards--dimmed' : ''}`}
          >
            {displayHiredCards.map((w) => (
              <div key={w.id} className="profile-edit__hired-card">
                {w.photoUrl ? (
                  <img src={w.photoUrl} alt="" className="profile-edit__hired-avatar-img" />
                ) : (
                  <div className="profile-edit__hired-avatar" aria-hidden />
                )}
                <p className="profile-edit__hired-name">{w.name}</p>
                <p className="profile-edit__hired-service">{w.service}</p>
                <p className="profile-edit__hired-rating">★ {w.rating}</p>
                <p className="profile-edit__hired-date">{w.date}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="profile-edit__section-divider" aria-hidden />

        <section className="profile-edit__section" aria-labelledby="profile-edit-interests-heading">
          <h2 id="profile-edit-interests-heading" className="profile-edit__section-title">
            {t('profileEdit.interestsTitle')}
          </h2>
          <p className="profile-edit__section-subtitle">{t('profileEdit.interestsSubtitle')}</p>
          <div className="profile-edit__interest-pills">
            {orderedInterestIds.map((id) => {
              const Icon = INTEREST_ICON_BY_ID[id]
              return (
                <span key={id} className="profile-edit__interest-pill-filled">
                  {Icon ? <Icon className="profile-edit__interest-pill-filled-icon" size={18} strokeWidth={1.75} aria-hidden /> : null}
                  {t(`profileEdit.interestOpt.${id}`)}
                </span>
              )
            })}
            {orderedInterestIds.length < 20 && (
              <button
                type="button"
                className="profile-edit__interest-pill"
                aria-label={t('profileEdit.addInterests')}
                onClick={() => setInterestsModalOpen(true)}
              >
                <Plus className="profile-edit__interest-pill-icon" strokeWidth={2} aria-hidden />
              </button>
            )}
          </div>
          <button
            type="button"
            className="profile-edit__add-interests-btn"
            onClick={() => setInterestsModalOpen(true)}
          >
            {t('profileEdit.addInterests')}
          </button>
        </section>

        <div className="profile-edit__section-divider" aria-hidden />
      </div>

      <button type="button" className="profile-edit__done" onClick={handleDone} disabled={saving}>
        {t('common.done')}
      </button>

      <ProfileEditInterestsModal
        open={interestsModalOpen}
        onClose={() => setInterestsModalOpen(false)}
        onSave={handleInterestsSave}
        initialSelected={selectedInterestIds}
        t={t}
      />
    </div>
  )
}
