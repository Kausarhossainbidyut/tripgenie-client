export function TermsOfService() {
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '3rem 1.5rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '3rem' }}>
        Last updated: January 1, 2025
      </p>

      <div style={{ lineHeight: 1.8, color: '#374151' }}>
        <Section title="1. Acceptance of Terms">
          By accessing and using TripGenie's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
        </Section>

        <Section title="2. Use License">
          Permission is granted to temporarily access the materials on TripGenie for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person</li>
          </ul>
        </Section>

        <Section title="3. Booking Terms">
          When you make a booking through TripGenie:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for reviewing all booking details before confirmation</li>
            <li>Prices are subject to change until confirmed</li>
            <li>Availability is not guaranteed until confirmed via email</li>
            <li>You must be at least 18 years old to make a booking</li>
          </ul>
        </Section>

        <Section title="4. Cancellation and Refund Policy">
          Cancellation policies vary by destination and service provider:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Free cancellation is available up to 48 hours before check-in for most bookings</li>
            <li>Cancellations within 48 hours may incur charges</li>
            <li>No-shows are not eligible for refunds</li>
            <li>Refunds are processed within 5-7 business days</li>
            <li>Special events and peak seasons may have stricter cancellation policies</li>
          </ul>
        </Section>

        <Section title="5. Payment Terms">
          All payments processed through TripGenie are secure:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>We accept major credit cards, debit cards, and online payment methods</li>
            <li>All transactions are encrypted using SSL technology</li>
            <li>Full payment is required at the time of booking</li>
            <li>Additional fees may apply for certain services</li>
            <li>Currency conversion rates are determined by your card issuer</li>
          </ul>
        </Section>

        <Section title="6. User Responsibilities">
          As a user of TripGenie, you agree to:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Provide accurate and up-to-date account information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect the property and rules of destinations you visit</li>
          </ul>
        </Section>

        <Section title="7. Limitation of Liability">
          TripGenie shall not be liable for:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Personal injury resulting from use of our services</li>
            <li>Changes or cancellations by service providers</li>
            <li>Force majeure events beyond our control</li>
          </ul>
        </Section>

        <Section title="8. Privacy">
          Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
        </Section>

        <Section title="9. Changes to Terms">
          TripGenie reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
        </Section>

        <Section title="10. Governing Law">
          These terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
        </Section>

        <Section title="11. Contact Information">
          For questions about these Terms of Service, please contact us at:
          <br />
          Email: support@tripgenie.com
          <br />
          Phone: +880 1234 567 890
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
