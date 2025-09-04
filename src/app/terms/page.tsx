export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: August 16, 2025 | Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") 
                and TRYON-APP ("Company," "we," "us," or "our") governing your access to and use of the TRYON-APP website, 
                mobile application, virtual try-on services, and all related features and services (collectively, the "Service").
              </p>
              <p className="text-gray-700 mb-4">
                By accessing, browsing, or using our Service, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Service.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Important:</strong> These Terms contain a binding arbitration clause and class action waiver that 
                  affects your legal rights. Please read Section 15 carefully.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility and Account Requirements</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">2.1 Age Requirements</h3>
                  <p className="text-gray-700">
                    You must be at least 18 years old to create an account and make purchases. Users between 13-17 years old 
                    may use the Service with parental consent and supervision. Children under 13 are not permitted to use our Service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">2.2 Account Registration</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>You must provide accurate, current, and complete information during registration</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>You may not share your account with others or create multiple accounts</li>
                    <li>We reserve the right to suspend or terminate accounts for policy violations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Virtual Try-On Technology and Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.1 Service Description</h3>
                  <p className="text-gray-700">
                    Our virtual try-on technology uses artificial intelligence, augmented reality, and computer vision to 
                    provide simulated fitting experiences. This service is provided for entertainment and general guidance purposes only.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.2 Accuracy and Limitations</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Virtual try-on results are approximations and may not reflect actual fit or appearance</li>
                    <li>Results depend on image quality, lighting, and device capabilities</li>
                    <li>We do not guarantee the accuracy of virtual fittings or color representations</li>
                    <li>Physical products may differ from virtual representations</li>
                    <li>We recommend checking size guides and return policies before purchasing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3.3 User Responsibilities</h3>
                  <p className="text-gray-700">By using our virtual try-on service, you agree to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Only upload images you have the legal right to use</li>
                    <li>Not upload inappropriate, offensive, or illegal content</li>
                    <li>Not attempt to reverse engineer or exploit our technology</li>
                    <li>Use the service in accordance with applicable laws and regulations</li>
                    <li>Accept that uploaded images may be processed by our AI systems</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. E-Commerce Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">4.1 Product Information and Pricing</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>We strive to provide accurate product descriptions, images, and pricing</li>
                    <li>Prices are subject to change without notice and are displayed in USD unless otherwise stated</li>
                    <li>We reserve the right to correct pricing errors even after orders are submitted</li>
                    <li>Product availability is subject to change and not guaranteed until order confirmation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">4.2 Order Process and Acceptance</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Placing an order constitutes an offer to purchase</li>
                    <li>We reserve the right to accept or decline any order</li>
                    <li>Order confirmation does not guarantee acceptance</li>
                    <li>We may cancel orders due to pricing errors, product unavailability, or suspected fraud</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">4.3 Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Payment is required at the time of order placement</li>
                    <li>We accept major credit cards, PayPal, and Cash on Delivery (where available)</li>
                    <li>All transactions are processed securely through third-party payment providers</li>
                    <li>You authorize us to charge your payment method for all fees and taxes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
              <div className="space-y-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Shipping costs and delivery timeframes are provided during checkout</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss transfers to you upon delivery to the specified address</li>
                  <li>You are responsible for providing accurate shipping information</li>
                  <li>International shipping may be subject to customs duties and taxes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns, Exchanges, and Refunds</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">6.1 Return Policy</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Items may be returned within 30 days of delivery in original condition</li>
                    <li>Items must be unworn, unaltered, and with original tags attached</li>
                    <li>Custom or personalized items are not returnable</li>
                    <li>Return shipping costs are the customer's responsibility unless due to our error</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">6.2 Refund Processing</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Refunds are processed within 5-10 business days after we receive returned items</li>
                    <li>Refunds are issued to the original payment method</li>
                    <li>Shipping costs are non-refundable unless the return is due to our error</li>
                    <li>Partial refunds may apply for items not in original condition</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">7.1 Our Content</h3>
                  <p className="text-gray-700">
                    All content on our Service, including but not limited to text, graphics, logos, images, software, 
                    and AI algorithms, is owned by or licensed to us and protected by intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">7.2 User Content</h3>
                  <p className="text-gray-700">
                    By uploading content to our Service, you grant us a non-exclusive, worldwide, royalty-free license 
                    to use, process, and display such content solely for providing our services to you.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">7.3 Prohibited Uses</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Reproducing, distributing, or creating derivative works of our content</li>
                    <li>Using our content for commercial purposes without permission</li>
                    <li>Reverse engineering our software or algorithms</li>
                    <li>Removing or altering copyright notices or proprietary markings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Conduct and Prohibited Activities</h2>
              <div className="space-y-4">
                <p className="text-gray-700">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Violate any applicable laws, regulations, or these Terms</li>
                  <li>Impersonate any person or entity or falsely state your affiliation</li>
                  <li>Upload or transmit viruses, malware, or other harmful code</li>
                  <li>Engage in fraudulent activities or unauthorized commercial communications</li>
                  <li>Interfere with or disrupt our Service or servers</li>
                  <li>Collect user information without consent</li>
                  <li>Use automated tools to access our Service without permission</li>
                  <li>Upload inappropriate, offensive, or illegal content</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Our collection, use, and protection of your personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using 
                our Service, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers and Warranties</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700 text-sm mb-2">
                    <strong>IMPORTANT DISCLAIMER:</strong>
                  </p>
                  <p className="text-yellow-700 text-sm">
                    OUR SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                    EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                    AND NON-INFRINGEMENT.
                  </p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We do not warrant that our Service will be uninterrupted, secure, or error-free</li>
                  <li>We do not guarantee the accuracy of virtual try-on results</li>
                  <li>We do not warrant that defects will be corrected or that our Service is free of harmful components</li>
                  <li>Your use of our Service is at your own risk</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-700 text-sm">
                    <strong>TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF 
                    PROFITS, DATA, OR USE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</strong>
                  </p>
                </div>
                <p className="text-gray-700">
                  Our total liability to you for all claims arising out of or relating to these Terms or our Service 
                  shall not exceed the amount you paid us in the twelve months preceding the claim.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify, defend, and hold harmless TRYON-APP, its officers, directors, employees, 
                and agents from and against any claims, liabilities, damages, losses, costs, or expenses arising 
                out of or relating to your use of our Service, violation of these Terms, or infringement of any 
                third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <div className="space-y-4">
                <p className="text-gray-700">We may terminate or suspend your account and access to our Service:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>For violation of these Terms or our policies</li>
                  <li>For suspected fraudulent or illegal activity</li>
                  <li>For extended periods of inactivity</li>
                  <li>At our sole discretion with or without notice</li>
                </ul>
                <p className="text-gray-700">
                  Upon termination, your right to use our Service ceases immediately, and we may delete your account data.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700">
                These Terms are governed by and construed in accordance with the laws of the State of New York, 
                without regard to conflict of law principles. Any disputes arising out of or relating to these 
                Terms or our Service shall be subject to the exclusive jurisdiction of the state and federal 
                courts located in New York County, New York.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Dispute Resolution and Arbitration</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>PLEASE READ THIS SECTION CAREFULLY AS IT AFFECTS YOUR LEGAL RIGHTS.</strong>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">15.1 Binding Arbitration</h3>
                  <p className="text-gray-700">
                    Any dispute arising out of or relating to these Terms or our Service shall be resolved through 
                    binding arbitration administered by the American Arbitration Association (AAA) under its Consumer 
                    Arbitration Rules, rather than in court.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">15.2 Class Action Waiver</h3>
                  <p className="text-gray-700">
                    You agree that disputes will be resolved on an individual basis and waive your right to 
                    participate in class actions, collective actions, or representative proceedings.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">15.3 Exceptions</h3>
                  <p className="text-gray-700">
                    This arbitration clause does not apply to disputes in small claims court or claims for 
                    injunctive relief related to intellectual property rights.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify you of material changes 
                by posting the updated Terms on our website with a new effective date. Your continued use of our 
                Service after the effective date constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be 
                limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain 
                in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or legal notices regarding these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@tryon-app.com</p>
                  <p><strong>Legal Department:</strong> terms@tryon-app.com</p>
                  <p><strong>Address:</strong></p>
                  <p className="ml-4">
                    TRYON-APP Legal Department<br />
                    123 Fashion Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                By using TRYON-APP, you acknowledge that you have read and understood these Terms of Service 
                and agree to be bound by them. These Terms constitute the entire agreement between you and 
                TRYON-APP regarding your use of our Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
