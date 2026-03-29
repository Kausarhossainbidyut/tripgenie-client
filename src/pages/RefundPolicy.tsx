export function RefundPolicy() {
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '3rem 1.5rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
        Refund & Cancellation Policy
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '3rem' }}>
        Last updated: January 1, 2025
      </p>

      <div style={{ lineHeight: 1.8, color: '#374151' }}>
        <Section title="1. Overview">
          At TripGenie, we understand that travel plans can change. This policy outlines our refund and cancellation procedures to ensure transparency and fairness for all customers.
        </Section>

        <Section title="2. Cancellation Timeframes">
          <strong>Free Cancellation Period:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Most bookings: Free cancellation up to 48 hours before check-in</li>
            <li>Luxury properties: Free cancellation up to 7 days before arrival</li>
            <li>Group bookings (10+ guests): Free cancellation up to 14 days prior</li>
            <li>Special events/festivals: Non-refundable or stricter policies apply</li>
          </ul>

          <strong style={{ display: 'block', marginTop: '1rem' }}>Late Cancellation Fees:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>24-48 hours before check-in: 50% of total booking amount</li>
            <li>Less than 24 hours: 100% charge (no refund)</li>
            <li>No-show: 100% charge (no refund)</li>
          </ul>
        </Section>

        <Section title="3. Refund Processing">
          <strong>Refund Timeline:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Approval time: 1-2 business days</li>
            <li>Credit/Debit cards: 5-7 business days after approval</li>
            <li>Digital wallets: 3-5 business days after approval</li>
            <li>Bank transfers: 7-10 business days after approval</li>
          </ul>

          <strong style={{ display: 'block', marginTop: '1rem' }}>Refund Method:</strong>
          <p style={{ marginTop: '0.5rem' }}>
            All refunds are processed back to the original payment method used during booking. If the original payment method is no longer valid, please contact our support team.
          </p>
        </Section>

        <Section title="4. Non-Refundable Bookings">
          The following bookings are typically non-refundable:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Flash sales and special promotional offers</li>
            <li>Last-minute bookings (within 24 hours of check-in)</li>
            <li>Customized tour packages once confirmed</li>
            <li>Bookings marked as "Non-Refundable" during checkout</li>
            <li>Travel insurance premiums (if purchased)</li>
          </ul>
        </Section>

        <Section title="5. Exceptions and Force Majeure">
          Full refunds may be granted in exceptional circumstances:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Natural disasters at the destination</li>
            <li>Government travel restrictions or bans</li>
            <li>Medical emergencies (with documentation)</li>
            <li>Death in the family (with death certificate)</li>
            <li>Service provider bankruptcy or closure</li>
          </ul>
          <p style={{ marginTop: '0.5rem' }}>
            Documentation may be required for exception-based refunds.
          </p>
        </Section>

        <Section title="6. Partial Refunds">
          Partial refunds may apply in these scenarios:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Early checkout: No refund for unused nights</li>
            <li>Service issues: Pro-rated refund based on severity</li>
            <li>Property changes: Full refund if alternative not acceptable</li>
            <li>Overbooking: Full refund plus compensation voucher</li>
          </ul>
        </Section>

        <Section title="7. How to Request a Refund">
          Follow these steps to request a refund:
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Log into your TripGenie account</li>
            <li>Navigate to "My Bookings" page</li>
            <li>Select the booking you wish to cancel</li>
            <li>Click "Cancel Booking"</li>
            <li>Confirm cancellation and refund request</li>
            <li>You'll receive email confirmation within 24 hours</li>
          </ol>
          <p style={{ marginTop: '0.5rem' }}>
            For assistance, contact support@tripgenie.com or call +880 1234 567 890.
          </p>
        </Section>

        <Section title="8. Disputes and Appeals">
          If you disagree with a refund decision:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Contact our customer support within 7 days of decision</li>
            <li>Provide supporting documentation</li>
            <li>Our team will review within 5 business days</li>
            <li>Final decision will be communicated via email</li>
            <li>Further escalation possible through consumer forums</li>
          </ul>
        </Section>

        <Section title="9. Travel Insurance">
          We strongly recommend purchasing travel insurance:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Covers trip cancellations due to medical emergencies</li>
            <li>Protects against lost baggage and delays</li>
            <li>Provides coverage for unforeseen circumstances</li>
            <li>Available during checkout process</li>
            <li>Terms and conditions apply separately</li>
          </ul>
        </Section>

        <Section title="10. Changes to This Policy">
          TripGenie reserves the right to modify this refund policy at any time. Changes will be effective immediately upon posting. Your bookings are protected by the policy in effect at the time of booking.
        </Section>

        <Section title="11. Contact Information">
          For refund-related inquiries:
          <br />
          Email: refunds@tripgenie.com
          <br />
          Phone: +880 1234 567 890
          <br />
          Hours: Sunday-Friday, 9AM-6PM BDT
        </Section>

        {/* Info Box */}
        <div style={{ 
          marginTop: '3rem',
          padding: '2rem',
          background: '#eff6ff',
          borderLeft: '4px solid #667eea',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem' }}>
            💡 Quick Tips
          </h3>
          <ul style={{ color: '#1e40af', lineHeight: 1.8 }}>
            <li>Always review cancellation policy before booking</li>
            <li>Consider travel insurance for expensive trips</li>
            <li>Keep booking confirmation emails for reference</li>
            <li>Request cancellations as early as possible</li>
            <li>Save all communication regarding refunds</li>
          </ul>
        </div>
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
