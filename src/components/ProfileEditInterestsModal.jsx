import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  PROFILE_INTEREST_OPTIONS,
  INTEREST_INITIAL_VISIBLE,
  INTEREST_MAX_SELECTED,
} from '../data/profileInterestOptions'
import './ProfileEditInterestsModal.css'

export default function ProfileEditInterestsModal({
  open,
  onClose,
  onSave,
  initialSelected,
  t,
}) {
  const [selected, setSelected] = useState(() => new Set(initialSelected || []))
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (open) {
      setSelected(new Set(initialSelected || []))
      setShowAll(false)
    }
  }, [open, initialSelected])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < INTEREST_MAX_SELECTED) {
        next.add(id)
      }
      return next
    })
  }, [])

  const visibleOptions = showAll
    ? PROFILE_INTEREST_OPTIONS
    : PROFILE_INTEREST_OPTIONS.slice(0, INTEREST_INITIAL_VISIBLE)

  const handleSave = async () => {
    await Promise.resolve(onSave([...selected]))
    onClose()
  }

  if (!open) return null

  return (
    <div className="pe-imodal" role="dialog" aria-modal="true" aria-labelledby="pe-imodal-title">
      <button type="button" className="pe-imodal__backdrop" aria-label={t('common.cancel')} onClick={onClose} />
      <div className="pe-imodal__panel">
        <button type="button" className="pe-imodal__close" onClick={onClose} aria-label={t('common.cancel')}>
          <X size={22} strokeWidth={2} />
        </button>

        <div className="pe-imodal__scroll">
          <h2 id="pe-imodal-title" className="pe-imodal__title">
            {t('profileEdit.interestsModalTitle')}
          </h2>
          <p className="pe-imodal__subtitle">{t('profileEdit.interestsModalSubtitle')}</p>

          <div className="pe-imodal__grid">
            {visibleOptions.map(({ id, Icon }) => {
              const isOn = selected.has(id)
              return (
                <button
                  key={id}
                  type="button"
                  className={`pe-imodal__pill${isOn ? ' pe-imodal__pill--selected' : ''}`}
                  onClick={() => toggle(id)}
                  aria-pressed={isOn}
                >
                  <Icon className="pe-imodal__pill-icon" size={18} strokeWidth={1.75} aria-hidden />
                  <span>{t(`profileEdit.interestOpt.${id}`)}</span>
                </button>
              )
            })}
          </div>

          {!showAll && PROFILE_INTEREST_OPTIONS.length > INTEREST_INITIAL_VISIBLE && (
            <button type="button" className="pe-imodal__show-all" onClick={() => setShowAll(true)}>
              {t('profileEdit.interestsShowAll')}
            </button>
          )}
        </div>

        <div className="pe-imodal__footer">
          <span className="pe-imodal__count">
            {t('profileEdit.interestsSelectedCount', { count: selected.size, max: INTEREST_MAX_SELECTED })}
          </span>
          <button type="button" className="pe-imodal__save" onClick={handleSave}>
            {t('profileEdit.interestsSave')}
          </button>
        </div>
      </div>
    </div>
  )
}
