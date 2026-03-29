export function PrivacyPolicy() {
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '3rem 1.5rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '3rem' }}>
        Last updated: January 1, 2025
      </p>

      <div style={{ lineHeight: 1.8, color: '#374151' }}>
        <Section title="1. Introduction">
          TripGenie ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our travel booking platform.
        </Section>

        <Section title="2. Information We Collect">
          <strong>Personal Information:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Name, email address, and phone number</li>
            <li>Payment information (credit card details, billing address)</li>
            <li>Travel preferences and booking history</li>
            <li>Passport information (when required for bookings)</li>
            <li>Date of birth and nationality</li>
          </ul>
          
          <strong style={{ display: 'block', marginTop: '1rem' }}>Automatically Collected Information:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Browsing activity on our platform</li>
            <li>Location data (with your permission)</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          We use the collected information to:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Process and manage your bookings</li>
            <li>Send booking confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Personalize your travel experience</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Improve our services and user experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Sharing Your Information">
          We may share your information with:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li><strong>Service Providers:</strong> Hotels, airlines, tour operators to fulfill your bookings</li>
            <li><strong>Payment Processors:</strong> To process transactions securely</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
            <li><strong>Business Partners:</strong> Only with your explicit consent</li>
          </ul>
          <p style={{ marginTop: '0.5rem' }}>
            We do NOT sell, trade, or rent your personal information to third parties.
          </p>
        </Section>

        <Section title="5. Data Security">
          We implement robust security measures to protect your information:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>SSL encryption for all data transmission</li>
            <li>Secure servers with firewall protection</li>
            <li>Regular security audits and updates</li>
            <li>Limited employee access to personal data</li>
            <li>Encryption of sensitive information at rest</li>
          </ul>
        </Section>

        <Section title="6. Cookies and Tracking">
          We use cookies and similar technologies to:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our platform</li>
            <li>Provide personalized content and ads</li>
            <li>Analyze traffic and improve performance</li>
          </ul>
          <p style={{ marginTop: '0.5rem' }}>
            You can control cookie settings through your browser preferences.
          </p>
        </Section>

        <Section title="7. Your Rights and Choices">
          You have the right to:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </Section>

        <Section title="8. Data Retention">
          We retain your information only as long as necessary:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Active account data: As long as your account is active</li>
            <li>Booking records: 7 years for legal compliance</li>
            <li>Marketing data: Until you unsubscribe</li>
            <li>Analytics data: Anonymized after 2 years</li>
          </ul>
        </Section>

        <Section title="9. International Data Transfers">
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this policy.
        </Section>

        <Section title="10. Children's Privacy">
          Our services are not intended for children under 18. We do not knowingly collect personal information from children. If we discover such collection, we will delete the information promptly.
        </Section>

        <Section title="11. Changes to This Policy">
          We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our platform. Continued use after changes constitutes acceptance.
        </Section>

        <Section title="12. Contact Us">
          For privacy-related questions or concerns:
          <br />
          Email: privacy@tripgenie.com
          <br />
          Phone: +880 1234 567 890
          <br />
          Address: House #123, Road #45, Dhaka 1212, Bangladesh
        </Section>
      </div>
    </div>
  );
}

// Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: '#1f2937',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {title}
      </h2>
      <div style={{ lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
