import { useCallback, useEffect, useRef, useState } from 'react'
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
import './ProfileEdit.css'

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

export default function ProfileEdit() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState(emptyAboutFields)
  const [editingKey, setEditingKey] = useState(null)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
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

  if (loading || !user) {
    return (
      <div className="profile-edit">
        <div className="profile-edit__loading">{t('common.submitting')}</div>
      </div>
    )
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '?'

  return (
    <div className="profile-edit">
      <div className="profile-edit__inner">
        <div className="profile-edit__hero">
          <div className="profile-edit__photo-col">
            <div className="profile-edit__photo-wrap">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="profile-edit__photo-img" />
              ) : (
                <span className="profile-edit__photo-initial">{firstName.charAt(0).toUpperCase()}</span>
              )}
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
                <Camera strokeWidth={2} />
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
      </div>

      <button type="button" className="profile-edit__done" onClick={handleDone} disabled={saving}>
        {t('common.done')}
      </button>
    </div>
  )
}
