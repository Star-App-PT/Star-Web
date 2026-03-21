import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './WorkerCalendar.css'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function WorkerCalendar() {
  const { t } = useTranslation()
  const [view, setView] = useState('month')
  const [cursor, setCursor] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const { daysInMonth, startPad } = useMemo(() => {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    return {
      daysInMonth: last.getDate(),
      startPad: first.getDay(),
    }
  }, [year, month])

  const cells = []
  for (let i = 0; i < startPad; i++) cells.push({ key: `p-${i}`, day: null })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ key: `d-${d}`, day: d })

  const label = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="wcal">
      <div className="wcal__inner container">
        <div className="wcal__toolbar">
          <div className="wcal__nav-month">
            <button type="button" className="wcal__arrow" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label={t('workerHost.prevMonth')}>
              ‹
            </button>
            <span className="wcal__month-label">{label}</span>
            <button type="button" className="wcal__arrow" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label={t('workerHost.nextMonth')}>
              ›
            </button>
          </div>
          <div className="wcal__view-toggle">
            <button type="button" className={`wcal__view-btn${view === 'month' ? ' wcal__view-btn--on' : ''}`} onClick={() => setView('month')}>
              {t('workerHost.viewMonth')}
            </button>
            <button type="button" className={`wcal__view-btn${view === 'week' ? ' wcal__view-btn--on' : ''}`} onClick={() => setView('week')}>
              {t('workerHost.viewWeek')}
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <>
            <div className="wcal__dow">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="wcal__dow-cell">
                  {d}
                </div>
              ))}
            </div>
            <div className="wcal__grid">
              {cells.map(({ key, day }) => (
                <button
                  key={key}
                  type="button"
                  className={`wcal__cell${day == null ? ' wcal__cell--empty' : ''}${selectedDay === day ? ' wcal__cell--selected' : ''}`}
                  disabled={day == null}
                  onClick={() => day != null && setSelectedDay(day)}
                >
                  {day != null ? (
                    <>
                      <span className="wcal__day-num">{day}</span>
                      {/* placeholder dots for bookings */}
                    </>
                  ) : null}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="wcal__week-placeholder">
            <p className="wcal__hint">{t('workerHost.weekViewHint')}</p>
          </div>
        )}

        {selectedDay != null && (
          <div className="wcal__panel">
            <h3 className="wcal__panel-title">{t('workerHost.dayBookings', { day: selectedDay, month: label })}</h3>
            <p className="wcal__empty">{t('workerHost.dayBookingsEmpty')}</p>
            <p className="wcal__hint">{t('workerHost.blockDayHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
