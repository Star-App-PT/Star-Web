import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../supabase'
import { useAuthSession } from '../../contexts/AuthSessionContext'
import { fetchWorkerDashboardPayload } from '../../lib/workerSupabase'
import './WorkerPackagesManage.css'

export default function WorkerPackagesManage() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '' })
  const [category, setCategory] = useState('cleaning')
  /** Local inactive set until `is_active` column exists on worker_service_packages */
  const [inactiveIds, setInactiveIds] = useState(() => new Set())

  useEffect(() => {
    if (!user?.id) return
    fetchWorkerDashboardPayload(user.id).then(({ packages: pkgs, workerRow }) => {
      setPackages(pkgs || [])
      const c = workerRow?.category || user.user_metadata?.worker_category || 'cleaning'
      setCategory(['cleaning', 'repairs', 'services'].includes(c) ? c : 'cleaning')
      setLoading(false)
    })
  }, [user?.id, user?.user_metadata?.worker_category])

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditForm({
      title: p.title || '',
      description: p.description || '',
      price: String(p.price ?? ''),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', description: '', price: '' })
  }

  const saveEdit = async (id) => {
    if (!supabase) return
    const priceNum = parseFloat(editForm.price)
    if (Number.isNaN(priceNum) || priceNum <= 0) return
    const { error } = await supabase
      .from('worker_service_packages')
      .update({
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price: priceNum,
      })
      .eq('id', id)
    if (!error) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, title: editForm.title.trim(), description: editForm.description.trim(), price: priceNum }
            : p,
        ),
      )
      cancelEdit()
    }
  }

  const toggleActive = (p) => {
    setInactiveIds((prev) => {
      const next = new Set(prev)
      if (next.has(p.id)) next.delete(p.id)
      else next.add(p.id)
      return next
    })
  }

  const deletePkg = async (id) => {
    if (!supabase || !window.confirm(t('workerHost.deletePackageConfirm'))) return
    const { error } = await supabase.from('worker_service_packages').delete().eq('id', id)
    if (!error) setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="wpkgm">
        <div className="wpkgm__inner container">
          <p className="wpkgm__loading">{t('common.submitting')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wpkgm">
      <div className="wpkgm__inner container">
        <div className="wpkgm__head">
          <h1 className="wpkgm__title">{t('workerHost.packagesTitle')}</h1>
          <Link to={`/worker/packages/${category}`} className="wpkgm__add btn-primary">
            {t('workerHost.addPackage')}
          </Link>
        </div>

        {packages.length === 0 ? (
          <div className="wpkgm__empty">
            <p>{t('workerHost.packagesEmpty')}</p>
          </div>
        ) : (
          <ul className="wpkgm__list">
            {packages.map((p) => (
              <li key={p.id} className="wpkgm__card">
                {editingId === p.id ? (
                  <div className="wpkgm__edit">
                    <label className="wpkgm__label">{t('packages.titleLabel')}</label>
                    <input
                      className="wpkgm__input"
                      value={editForm.title}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <label className="wpkgm__label">{t('packages.descLabel')}</label>
                    <textarea
                      className="wpkgm__textarea"
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <label className="wpkgm__label">{t('packages.priceLabel')}</label>
                    <input
                      className="wpkgm__input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                    />
                    <div className="wpkgm__edit-actions">
                      <button type="button" className="wpkgm__btn" onClick={cancelEdit}>
                        {t('common.cancel')}
                      </button>
                      <button type="button" className="wpkgm__btn wpkgm__btn--primary" onClick={() => saveEdit(p.id)}>
                        {t('common.done')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="wpkgm__row">
                      <div>
                        <h2 className="wpkgm__name">{p.title}</h2>
                        <p className="wpkgm__desc">{p.description || '—'}</p>
                        <p className="wpkgm__price">
                          €{Number(p.price).toFixed(0)} / {p.price_type || 'visit'}
                          {p.duration ? ` · ${p.duration}` : ''}
                        </p>
                      </div>
                      <div className="wpkgm__actions">
                        <label className="wpkgm__toggle-wrap">
                          <span className="wpkgm__toggle-label">{t('workerHost.active')}</span>
                          <button
                            type="button"
                            className={`wpkgm__mini-toggle${inactiveIds.has(p.id) ? '' : ' wpkgm__mini-toggle--on'}`}
                            onClick={() => toggleActive(p)}
                          />
                        </label>
                        <button type="button" className="wpkgm__linkish" onClick={() => startEdit(p)}>
                          {t('workerHost.edit')}
                        </button>
                        <button type="button" className="wpkgm__linkish wpkgm__linkish--danger" onClick={() => deletePkg(p.id)}>
                          {t('workerHost.delete')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
