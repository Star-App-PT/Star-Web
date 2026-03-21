import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './WorkerToday.css'

export default function WorkerToday() {
  const { t } = useTranslation()
  const [available, setAvailable] = useState(true)

  const pending = []
  const confirmed = []
  const unreadMessages = 0
  const earningsToday = 0

  return (
    <div className="wtoday">
      <div className="wtoday__inner container">
        <div className="wtoday__availability">
          <span className="wtoday__avail-label">{t('workerHost.availableNow')}</span>
          <button
            type="button"
            role="switch"
            aria-checked={available}
            className={`wtoday__toggle${available ? ' wtoday__toggle--on' : ' wtoday__toggle--off'}`}
            onClick={() => setAvailable((v) => !v)}
          >
            <span className="wtoday__toggle-knob" />
          </button>
          <span className={`wtoday__avail-status${available ? ' wtoday__avail-status--on' : ''}`}>
            {available ? t('workerHost.statusAvailable') : t('workerHost.statusUnavailable')}
          </span>
        </div>

        <section className="wtoday__section">
          <h2 className="wtoday__h">{t('workerHost.pendingRequests')}</h2>
          {pending.length === 0 ? (
            <p className="wtoday__empty">{t('workerHost.pendingEmpty')}</p>
          ) : (
            <ul className="wtoday__list">{/* future */}</ul>
          )}
        </section>

        <section className="wtoday__section">
          <h2 className="wtoday__h">{t('workerHost.confirmedToday')}</h2>
          {confirmed.length === 0 ? (
            <p className="wtoday__empty">{t('workerHost.confirmedEmpty')}</p>
          ) : (
            <ul className="wtoday__list">{/* future */}</ul>
          )}
        </section>

        <section className="wtoday__section wtoday__section--row">
          <div>
            <h2 className="wtoday__h">{t('workerHost.unreadMessages')}</h2>
            {unreadMessages === 0 ? (
              <p className="wtoday__empty">{t('workerHost.noUnread')}</p>
            ) : (
              <Link to="/dashboard/worker/messages" className="wtoday__link">
                {t('workerHost.unreadCount', { count: unreadMessages })}
              </Link>
            )}
          </div>
          <div>
            <h2 className="wtoday__h">{t('workerHost.earningsToday')}</h2>
            <p className="wtoday__earnings">€{earningsToday.toFixed(2)}</p>
            {earningsToday === 0 && <p className="wtoday__empty">{t('workerHost.earningsEmpty')}</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
