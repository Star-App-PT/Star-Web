import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './WorkerMessagesPanels.css'

export default function WorkerMessagesPanels() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const conversations = []

  return (
    <div className="wmsg">
      <div className="wmsg__toolbar">
        <button type="button" className="wmsg__icon-btn" aria-label={t('workerHost.messagesSearch')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button type="button" className="wmsg__icon-btn" aria-label={t('workerHost.messagesSettings')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      <div className="wmsg__layout">
        <aside className="wmsg__list-col">
          <div className="wmsg__filters">
            <button
              type="button"
              className={`wmsg__filter${filter === 'all' ? ' wmsg__filter--on' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('workerHost.filterAll')}
            </button>
            <button
              type="button"
              className={`wmsg__filter${filter === 'unread' ? ' wmsg__filter--on' : ''}`}
              onClick={() => setFilter('unread')}
            >
              {t('workerHost.filterUnread')}
            </button>
          </div>

          {conversations.length === 0 ? (
            <div className="wmsg__empty">
              <div className="wmsg__empty-icon" aria-hidden>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="wmsg__empty-title">{t('workerHost.messagesEmptyTitle')}</p>
              <p className="wmsg__empty-sub">{t('workerHost.messagesEmptySub')}</p>
            </div>
          ) : (
            <ul className="wmsg__list">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`wmsg__thread${selectedId === c.id ? ' wmsg__thread--active' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className="wmsg__thread-avatar" />
                    <span className="wmsg__thread-body">
                      <span className="wmsg__thread-name">{c.name}</span>
                      <span className="wmsg__thread-preview">{c.preview}</span>
                    </span>
                    <span className="wmsg__thread-time">{c.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="wmsg__thread-col">
          {!selectedId ? (
            <div className="wmsg__placeholder">
              <p className="wmsg__placeholder-text">{t('workerHost.selectConversation')}</p>
            </div>
          ) : (
            <div className="wmsg__thread-messages">{/* future thread */}</div>
          )}
        </section>
      </div>
    </div>
  )
}
