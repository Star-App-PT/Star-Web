import { useTranslation } from 'react-i18next'
import WorkerMessagesPanels from '../../components/workerHost/WorkerMessagesPanels'
import './WorkerMessagesHost.css'

export default function WorkerMessagesHost() {
  const { t } = useTranslation()

  return (
    <div className="wmhost">
      <div className="wmhost__inner container">
        <h1 className="wmhost__title">{t('workerHost.messagesPageTitle')}</h1>
        <WorkerMessagesPanels />
      </div>
    </div>
  )
}
