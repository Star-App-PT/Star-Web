import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './SignupChoice.css'

export default function SignupChoice() {
  const { t } = useTranslation()

  return (
    <div className="signup-choice">
      <div className="signup-choice__card">
        <h1 className="signup-choice__title">{t('signupChoice.title')}</h1>
        <p className="signup-choice__sub">{t('signupChoice.subtitle')}</p>
        <div className="signup-choice__options">
          <Link to="/client/signup" className="signup-choice__option">
            {t('signupChoice.needService')}
          </Link>
          <div className="signup-choice__sep" />
          <Link to="/worker/choose-category" className="signup-choice__option">
            {t('signupChoice.wantToWork')}
          </Link>
          <div className="signup-choice__sep" />
        </div>
        <div className="signup-choice__sep" />
        <Link to="/" className="signup-choice__back">{t('signupChoice.backToHome')}</Link>
      </div>
    </div>
  )
}
