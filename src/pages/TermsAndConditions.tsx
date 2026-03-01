export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last Updated: February 2026</p>

        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Terms of Use</h2>
            <p>
              These Terms & Conditions constitute a legally binding agreement between you ("User") and Refind. By accessing or
              using our platform, you agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information and password. You agree to
              accept responsibility for all activities that occur under your account. You must be at least 18 years old to use
              our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Acceptable Use</h2>
            <p>You agree not to use our platform for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Illegal activities or violating any laws</li>
              <li>Harassment, abuse, or threatening behavior</li>
              <li>Fraud, deception, or misrepresentation</li>
              <li>Uploading malware or harmful content</li>
              <li>Spamming or unwanted communications</li>
              <li>Intellectual property violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
            <p>
              All content on our platform, including text, graphics, logos, and software, is owned by Refind or licensed
              partners. You may not reproduce, distribute, or transmit this content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>
            <p>
              By uploading content (photos, descriptions, etc.), you grant Refind a license to use, display, and distribute
              this content on our platform. You represent that you own or have rights to the content you upload.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimers</h2>
            <p>
              Our platform is provided "as is" without warranties. We do not guarantee the accuracy of item descriptions or
              the identity of users. You use our service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Refind shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p>
              You agree to indemnify and hold Refind harmless from any claims, damages, or costs arising from your violation of
              these terms or misuse of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Dispute Resolution</h2>
            <p>
              Any disputes shall be resolved through binding arbitration rather than court proceedings. You agree to waive your
              right to a jury trial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in prohibited
              behavior.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of significant changes via email or through our
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction where Refind is incorporated, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p>
              If you have questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:legal@refind.com" className="text-primary-500 hover:text-primary-600">
                legal@refind.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
