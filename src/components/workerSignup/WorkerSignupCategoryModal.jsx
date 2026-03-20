import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDemoMode } from '../../contexts/DemoModeContext'
import { useNavigate } from 'react-router-dom'
import './WorkerSignupModals.css'

const CATEGORY_CARDS = [
  { id: 'cleaning', labelKey: 'workerSignup.cleaning', icon: '/assets/icon-clean.png' },
  { id: 'repairs', labelKey: 'workerSignup.repairs', icon: '/assets/icon-repair.png' },
  { id: 'services', labelKey: 'workerSignup.services', icon: '/assets/icon-services.png' },
]

export default function WorkerSignupCategoryModal({ open, onClose, onContinue }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setVisible(true))
      document.body.style.overflow = 'hidden'
      return () => {
        cancelAnimationFrame(id)
        document.body.style.overflow = ''
      }
    }
    setVisible(false)
    document.body.style.overflow = ''
  }, [open])

  useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  if (!open) return null

  const handleContinue = () => {
    if (!selected) return
    onContinue(selected)
  }

  return (
    <div className={`ws-modal ws-modal--category${visible ? ' ws-modal--open' : ''}`} role="presentation">
      <button type="button" className="ws-modal__backdrop" aria-label={t('common.cancel')} onClick={onClose} />
      <div
        className="ws-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ws-cat-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ws-modal__close" onClick={onClose} aria-label={t('common.cancel')}>
          <X size={22} strokeWidth={2} />
        </button>

        <div className="ws-modal__scroll">
          <h1 id="ws-cat-title" className="ws-modal__title">
            {t('workerSignupGate.categoryTitle')}
          </h1>
          <p className="ws-modal__sub">{t('workerSignupGate.categorySubtitle')}</p>

          <div className="ws-modal__cat-grid" role="listbox" aria-label={t('workerSignupGate.categoryTitle')}>
            {CATEGORY_CARDS.map((cat) => {
              const isSel = selected === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  className={`ws-modal__cat-card${isSel ? ' ws-modal__cat-card--selected' : ''}`}
                  onClick={() => setSelected(cat.id)}
                >
                  <span className="ws-modal__cat-icon-wrap">
                    <img src={cat.icon} alt="" className="ws-modal__cat-icon" />
                  </span>
                  <span className="ws-modal__cat-label">{t(cat.labelKey)}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="ws-modal__btn-primary ws-modal__continue"
            disabled={!selected}
            onClick={handleContinue}
          >
            {t('workerSignupGate.continue')}
          </button>

          {isDemoMode && (
            <p
              className="ws-modal__demo"
              onClick={() => navigate('/dashboard/worker')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/worker')}
            >
              {t('common.demoSkip')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
