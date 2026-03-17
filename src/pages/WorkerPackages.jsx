import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import './WorkerPackages.css'

const DURATION_OPTIONS = [
  { value: '30min', label: '30 min' },
  { value: '1hr', label: '1 hr' },
  { value: '1hr30', label: '1 hr 30 min' },
  { value: '2hr', label: '2 hr' },
  { value: '3hr', label: '3 hr' },
  { value: '4hr', label: '4 hr' },
  { value: 'fullday', label: 'Full day' },
]

const GROUP_OPTIONS = [
  { value: 'guest', labelKey: 'packages.perGuest' },
  { value: 'group', labelKey: 'packages.perGroup' },
  { value: 'flat', labelKey: 'packages.flatRate' },
]

const EMPTY_PKG = {
  title: '',
  price: '',
  duration: '1hr',
  groupType: 'guest',
  description: '',
  thumbUrl: null,
  thumbFile: null,
}

export default function WorkerPackages() {
  const { t } = useTranslation()
  const { category } = useParams()
  const navigate = useNavigate()
  const thumbRef = useRef(null)

  const [packages, setPackages] = useState([{ ...EMPTY_PKG, id: crypto.randomUUID() }])
  const [activeThumbId, setActiveThumbId] = useState(null)

  if (!category) {
    navigate('/choose-category', { replace: true })
    return null
  }

  const updatePkg = (id, field, value) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const addPackage = () => {
    if (packages.length >= 5) return
    setPackages((prev) => [...prev, { ...EMPTY_PKG, id: crypto.randomUUID() }])
  }

  const removePackage = (id) => {
    if (packages.length <= 1) return
    setPackages((prev) => {
      const removed = prev.find((p) => p.id === id)
      if (removed?.thumbUrl) URL.revokeObjectURL(removed.thumbUrl)
      return prev.filter((p) => p.id !== id)
    })
  }

  const openThumbPicker = (id) => {
    setActiveThumbId(id)
    thumbRef.current?.click()
  }

  const handleThumbFile = (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeThumbId) return
    const url = URL.createObjectURL(file)
    updatePkg(activeThumbId, 'thumbUrl', url)
    updatePkg(activeThumbId, 'thumbFile', file)
    if (thumbRef.current) thumbRef.current.value = ''
    setActiveThumbId(null)
  }

  const isValid = packages.some(
    (p) => p.title.trim() && p.price && parseFloat(p.price) > 0 && p.description.trim()
  )

  const handleNext = async () => {
    if (!isValid) return
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const pkgData = packages
            .filter((p) => p.title.trim() && p.price)
            .map((p) => ({
              title: p.title.trim(),
              price: parseFloat(p.price),
              duration: p.duration,
              groupType: p.groupType,
              description: p.description.trim(),
            }))
          await supabase.auth.updateUser({ data: { worker_packages: pkgData } })
        }
      } catch { /* continue */ }
    }
    navigate('/dashboard')
  }

  const durationLabel = (val) => DURATION_OPTIONS.find((o) => o.value === val)?.label || val

  return (
    <div className="pk">
      <div className="pk__top">
        <span className="pk__step">{t('packages.step')}</span>
        <button type="button" className="pk__back btn-back" onClick={() => navigate(`/worker-portfolio/${category}`)}>
          {t('common.back')}
        </button>
      </div>

      <input ref={thumbRef} type="file" accept="image/*" className="pk__file-input" onChange={handleThumbFile} />

      <div className="pk__body">
        <div className="pk__content">
          <h1 className="pk__title">{t('packages.title')}</h1>
          <p className="pk__subtitle">{t('packages.subtitle')}</p>

          <div className="pk__list">
            {packages.map((pkg, idx) => (
              <div key={pkg.id} className="pk__card">
                <div className="pk__card-header">
                  <span className="pk__card-num">{t('packages.packageNum', { n: idx + 1 })}</span>
                  {packages.length > 1 && (
                    <button type="button" className="pk__card-remove" onClick={() => removePackage(pkg.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>

                <div className="pk__card-thumb" onClick={() => openThumbPicker(pkg.id)}>
                  {pkg.thumbUrl ? (
                    <img src={pkg.thumbUrl} alt="" className="pk__card-thumb-img" />
                  ) : (
                    <div className="pk__card-thumb-empty">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span>{t('packages.addThumb')}</span>
                    </div>
                  )}
                </div>

                <div className="pk__card-fields">
                  <div className="pk__field">
                    <label className="pk__field-label">{t('packages.titleLabel')}</label>
                    <input
                      type="text"
                      className="pk__input"
                      placeholder={t('packages.titlePlaceholder')}
                      value={pkg.title}
                      onChange={(e) => updatePkg(pkg.id, 'title', e.target.value)}
                      maxLength={60}
                    />
                  </div>

                  <div className="pk__field-row">
                    <div className="pk__field pk__field--half">
                      <label className="pk__field-label">{t('packages.priceLabel')}</label>
                      <div className="pk__price-wrap">
                        <span className="pk__currency">€</span>
                        <input
                          type="number"
                          className="pk__input pk__input--price"
                          placeholder="0"
                          min="0"
                          value={pkg.price}
                          onChange={(e) => updatePkg(pkg.id, 'price', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pk__field pk__field--half">
                      <label className="pk__field-label">{t('packages.durationLabel')}</label>
                      <select
                        className="pk__select"
                        value={pkg.duration}
                        onChange={(e) => updatePkg(pkg.id, 'duration', e.target.value)}
                      >
                        {DURATION_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pk__field">
                    <label className="pk__field-label">{t('packages.pricingType')}</label>
                    <div className="pk__pills">
                      {GROUP_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          className={`pk__pill${pkg.groupType === o.value ? ' pk__pill--active' : ''}`}
                          onClick={() => updatePkg(pkg.id, 'groupType', o.value)}
                        >
                          {t(o.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pk__field">
                    <label className="pk__field-label">{t('packages.descLabel')}</label>
                    <textarea
                      className="pk__textarea"
                      placeholder={t('packages.descPlaceholder')}
                      rows={3}
                      maxLength={200}
                      value={pkg.description}
                      onChange={(e) => updatePkg(pkg.id, 'description', e.target.value)}
                    />
                    <span className="pk__char-count">{pkg.description.length}/200</span>
                  </div>
                </div>

                {/* Mini preview */}
                {pkg.title.trim() && pkg.price && (
                  <div className="pk__preview">
                    <div className="pk__preview-thumb">
                      {pkg.thumbUrl ? (
                        <img src={pkg.thumbUrl} alt="" className="pk__preview-thumb-img" />
                      ) : (
                        <div className="pk__preview-thumb-placeholder" />
                      )}
                    </div>
                    <div className="pk__preview-info">
                      <p className="pk__preview-title">{pkg.title}</p>
                      <p className="pk__preview-meta">
                        €{parseFloat(pkg.price).toFixed(0)} /{t(GROUP_OPTIONS.find((o) => o.value === pkg.groupType)?.labelKey || '')}
                        {' · '}{durationLabel(pkg.duration)}
                      </p>
                      {pkg.description.trim() && (
                        <p className="pk__preview-desc">{pkg.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {packages.length < 5 && (
            <button type="button" className="pk__add" onClick={addPackage}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t('packages.addAnother')}
            </button>
          )}
        </div>
      </div>

      <div className="pk__footer">
        <button
          type="button"
          className="pk__next btn-primary"
          disabled={!isValid}
          onClick={handleNext}
        >
          {t('packages.finish')}
        </button>
      </div>
    </div>
  )
}
