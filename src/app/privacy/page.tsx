export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()} | Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                TRYON-APP ("we," "us," "our") is committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and 
                use our virtual try-on services, including AI-powered fashion recommendations and augmented reality features.
              </p>
              <p className="text-gray-700">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, do not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, postal address, date of birth</li>
                    <li><strong>Authentication Data:</strong> Username, encrypted passwords, security questions</li>
                    <li><strong>Payment Information:</strong> Credit card details, billing address (processed through secure third-party payment processors)</li>
                    <li><strong>Communication Data:</strong> Records of your communications with our customer service team</li>
                    <li><strong>Profile Preferences:</strong> Size preferences, style preferences, favorite brands, shopping history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Virtual Try-On and Biometric Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Images and Photos:</strong> Pictures you upload or capture for virtual try-on purposes</li>
                    <li><strong>Biometric Identifiers:</strong> Facial measurements, body proportions (automatically processed and anonymized)</li>
                    <li><strong>Camera Data:</strong> Real-time video feed when using live try-on features (not stored)</li>
                    <li><strong>AR/3D Modeling Data:</strong> Temporary 3D body models created for fitting visualization</li>
                    <li><strong>AI Analysis Results:</strong> Style recommendations, fit predictions, color matching data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Technical and Usage Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Usage Analytics:</strong> Pages visited, time spent, click patterns, search queries</li>
                    <li><strong>Performance Data:</strong> App crashes, loading times, feature usage statistics</li>
                    <li><strong>Location Data:</strong> General location for shipping and local recommendations (with consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.1 Service Provision</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Provide virtual try-on services and AI-powered recommendations</li>
                    <li>Process orders, payments, and manage your account</li>
                    <li>Deliver products and provide customer support</li>
                    <li>Maintain and improve our platform security</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.2 Personalization and Analytics</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Personalize product recommendations and content</li>
                    <li>Analyze usage patterns to improve our services</li>
                    <li>Conduct research and development for new features</li>
                    <li>Create aggregate, anonymous analytics reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.3 Legal and Business Purposes</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Comply with legal obligations and regulatory requirements</li>
                    <li>Prevent fraud and ensure platform security</li>
                    <li>Enforce our terms of service and policies</li>
                    <li>Respond to legal requests and protect our rights</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <div className="space-y-4">
                <p className="text-gray-700">We do not sell your personal information. We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our platform (payment processors, shipping companies, cloud storage)</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security and Storage</h2>
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Encryption:</strong> All data in transit and at rest is encrypted using AES-256 encryption</li>
                  <li><strong>Access Controls:</strong> Strict employee access controls and regular security training</li>
                  <li><strong>Image Processing:</strong> Virtual try-on images are processed securely and deleted within 30 days unless saved to your account</li>
                  <li><strong>Regular Audits:</strong> Third-party security audits and vulnerability assessments</li>
                  <li><strong>Data Backup:</strong> Secure, encrypted backups with geographic redundancy</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  <strong>Data Retention:</strong> We retain your personal information only as long as necessary for the purposes outlined in this policy, 
                  typically 3-7 years depending on the type of data and legal requirements.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Restriction:</strong> Request limitation on how we process your information</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for processing that requires your consent</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  <strong>Exercising Your Rights:</strong> To exercise these rights, contact us at privacy@tryon-app.com. 
                  We will respond within 30 days and may require identity verification.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">We use various technologies to collect information:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used for personalized advertising (with consent)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You can manage cookie preferences through our cookie banner or browser settings.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place, including Standard Contractual Clauses approved by the European Commission and 
                adequacy decisions where applicable.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected such information, we will 
                take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically. We will notify you of any material changes by posting the 
                new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we may 
                provide additional notice such as email notification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> privacy@tryon-app.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@tryon-app.com</p>
                  <p><strong>Address:</strong> TRYON-APP Privacy Team<br />123 Fashion Street<br />New York, NY 10001<br />United States</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
