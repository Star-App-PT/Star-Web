import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="home container">
      <h1 className="home__title">{t('home.title')}</h1>
      <Link to="/worker/signup" className="home__cta">
        {t('home.becomeAStar')}
      </Link>
    </div>
  )
}
