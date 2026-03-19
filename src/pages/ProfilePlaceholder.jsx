import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProfilePlaceholder.css'

export default function ProfilePlaceholder() {
  const { t } = useTranslation()
  return (
    <div className="profile-placeholder">
      <p className="profile-placeholder__text">{t('profile.comingSoon')}</p>
      <Link to="/profile" className="profile-placeholder__link">{t('profile.backToProfile')}</Link>
    </div>
  )
}
