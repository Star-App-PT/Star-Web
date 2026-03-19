import { Link } from 'react-router-dom'
import './Legal.css'

export default function Privacy() {
  return (
    <div className="legal-page container">
      <h1 className="legal-page__title">Privacy Policy</h1>
      <p className="legal-page__updated">Last updated: March 2025</p>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">1. Introduction</h2>
        <p>
          Starsvs (“we”, “our”, or “us”) operates a service marketplace that connects clients with local professionals in Portugal. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. By using Starsvs, you agree to the practices described in this policy.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">2. Information We Collect</h2>
        <p>
          We collect information you provide directly (such as name, email, phone number, profile photo, and address when you sign up as a client or a service professional). We also collect usage data, device information, and location data where necessary to provide and improve our services and to comply with applicable law.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">3. How We Use Your Information</h2>
        <p>
          We use your information to operate the marketplace, match clients with professionals, process bookings, communicate with you, improve our platform, prevent fraud, and comply with legal obligations. We may also use aggregated or anonymised data for analytics and product development.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">4. Sharing and Disclosure</h2>
        <p>
          We may share your information with service professionals or clients as needed to fulfil bookings, with service providers who assist our operations (under strict confidentiality), and with authorities when required by law. We do not sell your personal data to third parties for marketing purposes.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">5. Data Retention and Security</h2>
        <p>
          We retain your data for as long as your account is active or as needed to provide services and comply with legal obligations. We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">6. Your Rights</h2>
        <p>
          Under applicable data protection law (including the GDPR), you may have the right to access, correct, delete, or restrict processing of your personal data, and to data portability or to object to certain processing. You may also have the right to lodge a complaint with a supervisory authority. To exercise these rights, please contact us using the details below.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the “Last updated” date. Your continued use of Starsvs after such changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <p className="legal-page__contact">
        For questions about this Privacy Policy or our data practices, contact us at{' '}
        <a href="mailto:info@star-app.co">info@star-app.co</a>.
      </p>
      <Link to="/" className="legal-page__back">Back to home</Link>
    </div>
  )
}
