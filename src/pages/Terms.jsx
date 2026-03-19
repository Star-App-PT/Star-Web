import { Link } from 'react-router-dom'
import './Legal.css'

export default function Terms() {
  return (
    <div className="legal-page container">
      <h1 className="legal-page__title">Terms of Service</h1>
      <p className="legal-page__updated">Last updated: March 2025</p>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">1. Agreement to Terms</h2>
        <p>
          These Terms of Service (“Terms”) govern your use of the Star platform and related services operated by Star. By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree, you may not use our platform.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">2. Description of Service</h2>
        <p>
          Star is a marketplace that connects clients seeking local services (such as cleaning, repairs, and other home or personal services) with independent service professionals in Portugal. We facilitate discovery, booking, and communication but do not employ the professionals; they operate as independent providers. We do not guarantee the quality, safety, or legality of any service performed.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">3. Accounts and Eligibility</h2>
        <p>
          You must be at least 18 years old and have the legal capacity to enter into a binding contract to use Star. You are responsible for maintaining the confidentiality of your account and for all activity under your account. You must provide accurate and complete information when registering and keep it up to date.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">4. Use of the Platform</h2>
        <p>
          You agree to use the platform only for lawful purposes and in accordance with these Terms. You must not misuse the platform, harass other users, post false or misleading information, or violate any applicable laws or third-party rights. We reserve the right to suspend or terminate accounts that breach these Terms.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">5. Bookings and Payments</h2>
        <p>
          Bookings are subject to the availability and terms agreed between you and the service professional. Payment terms, cancellation policies, and any guarantees are as displayed on the platform or as agreed with the professional. Disputes regarding the quality or completion of a service should be raised with the professional or through our support channels.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Star and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or from any transaction between you and a service professional. Our total liability in connection with these Terms or the platform shall not exceed the amount you paid to Star in the twelve months preceding the claim, if any.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">7. Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of Portugal. Any disputes arising from or relating to these Terms or the platform shall be subject to the exclusive jurisdiction of the courts of Portugal, without prejudice to any mandatory consumer rights you may have in your country of residence.
        </p>
      </section>

      <section className="legal-page__section">
        <h2 className="legal-page__section-title">8. Changes</h2>
        <p>
          We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the “Last updated” date. Your continued use of Star after such changes constitutes acceptance of the updated Terms. If you do not agree, you must stop using the platform.
        </p>
      </section>

      <p className="legal-page__contact">
        For questions about these Terms of Service, contact us at{' '}
        <a href="mailto:info@star-app.co">info@star-app.co</a>.
      </p>
      <Link to="/" className="legal-page__back">Back to home</Link>
    </div>
  )
}
