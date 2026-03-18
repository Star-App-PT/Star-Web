import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import { useDemoMode } from '../contexts/DemoModeContext'
import './WorkerAbout.css'

const MAX_CHARS = 90

export default function WorkerAbout() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const { isDemoMode } = useDemoMode()
  const placeholderCategory = ['cleaning', 'repairs', 'services'].includes(category) ? category : 'cleaning'

  const [years, setYears] = useState(null)
  const [notable, setNotable] = useState('')
  const [training, setTraining] = useState('')
  const [honours, setHonours] = useState('')

  const categoryLabel = t(`workerSignup.${category}`) || category

  const incYears = () => setYears((v) => (v === null ? 1 : Math.min(v + 1, 50)))
  const decYears = () => setYears((v) => (v === null ? null : Math.max(v - 1, 1)))

  const displayYears = years === null ? '–' : years >= 10 ? '10+' : years

  const allFilled = years !== null && notable.trim() && training.trim() && honours.trim()

  const handleNext = async () => {
    if (!allFilled) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({
            data: {
              worker_years: years,
              worker_notable: notable.trim(),
              worker_training: training.trim(),
              worker_honours: honours.trim(),
            },
          })
        }
      } catch { /* continue even if save fails */ }
    }
    navigate(`/worker/signup/${category}`)
  }

  return (
    <div className="wa">
      <div className="wa__top">
        <button
          type="button"
          className="wa__back btn-back"
          onClick={() => navigate(`/worker/service-area/${category}`)}
        >
          {t('common.back')}
        </button>
      </div>

      <div className="wa__body">
        <div className="wa__card">
          <h1 className="wa__title">{t('workerAbout.title')}</h1>
          <p className="wa__subtitle">{t('workerAbout.subtitle')}</p>

          <div className="wa__field">
            <label className="wa__label">
              {t('workerAbout.yearsLabel', { category: categoryLabel })}
            </label>
            <div className="wa__stepper">
              <button
                type="button"
                className="wa__stepper-btn"
                onClick={decYears}
                disabled={years === null || years <= 1}
                aria-label={t('workerAbout.decrease')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span className={`wa__stepper-val${years === null ? ' wa__stepper-val--empty' : ''}`}>
                {displayYears}
              </span>
              <button
                type="button"
                className="wa__stepper-btn"
                onClick={incYears}
                disabled={years >= 50}
                aria-label={t('workerAbout.increase')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="wa__field">
            <label className="wa__label">{t('workerAbout.notableLabel')}</label>
            <div className="wa__textarea-wrap">
              <textarea
                className="wa__textarea"
                maxLength={MAX_CHARS}
                rows={3}
                placeholder={t(`workerAbout.placeholders.${placeholderCategory}.notable`)}
                value={notable}
                onChange={(e) => setNotable(e.target.value)}
              />
              <span className="wa__counter">{notable.length}/{MAX_CHARS}</span>
            </div>
          </div>

          <div className="wa__field">
            <label className="wa__label">{t('workerAbout.trainingLabel')}</label>
            <div className="wa__textarea-wrap">
              <textarea
                className="wa__textarea"
                maxLength={MAX_CHARS}
                rows={3}
                placeholder={t(`workerAbout.placeholders.${placeholderCategory}.training`)}
                value={training}
                onChange={(e) => setTraining(e.target.value)}
              />
              <span className="wa__counter">{training.length}/{MAX_CHARS}</span>
            </div>
          </div>

          <div className="wa__field">
            <label className="wa__label">{t('workerAbout.honoursLabel')}</label>
            <div className="wa__textarea-wrap">
              <textarea
                className="wa__textarea"
                maxLength={MAX_CHARS}
                rows={3}
                placeholder={t(`workerAbout.placeholders.${placeholderCategory}.honours`)}
                value={honours}
                onChange={(e) => setHonours(e.target.value)}
              />
              <span className="wa__counter">{honours.length}/{MAX_CHARS}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wa__footer">
        <button
          type="button"
          className="wa__next btn-primary"
          disabled={!allFilled}
          onClick={handleNext}
        >
          {t('serviceArea.next')}
        </button>
        {/* DEMO ONLY — REMOVE BEFORE LAUNCH */}
        {isDemoMode && (
          <p
            onClick={() => navigate(`/worker/signup/${category}`)}
            style={{
              textAlign: 'center',
              color: '#AAAAAA',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '16px',
            }}
          >
            {t('common.demoSkip')}
          </p>
        )}
      </div>
    </div>
  )
}
