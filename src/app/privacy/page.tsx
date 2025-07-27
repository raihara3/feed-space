import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <svg width="32" height="32" viewBox="0 0 100 100" className="text-purple-400">
                <defs>
                  <radialGradient id="blackhole-gradient">
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="30%" stopColor="#16213e" />
                    <stop offset="60%" stopColor="#0f3460" />
                    <stop offset="100%" stopColor="#e94560" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="20" fill="url(#blackhole-gradient)" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Feed Space
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
              <p>Feed Space is a personal project by raihara3. We collect minimal information necessary to provide the service, such as when you create an account or add RSS feeds.</p>
              <h3 className="text-xl font-medium mt-4 mb-2 text-white">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email address</li>
                <li>Username (optional)</li>
                <li>Password (encrypted)</li>
              </ul>
              <h3 className="text-xl font-medium mt-4 mb-2 text-white">Usage Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>RSS feeds you add</li>
                <li>Reading preferences</li>
                <li>Service usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Save and sync your RSS feeds across devices</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
              <p>As an individual developer, I do not and will not sell, trade, or rent your personal information. Your data may only be shared:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>With your explicit consent</li>
                <li>If required by law</li>
                <li>With Supabase (our authentication and database provider)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
              <p>As a personal project, I implement reasonable security measures to protect your information. Your data is stored securely using Supabase's infrastructure. However, please understand that no method of transmission over the Internet is 100% secure, and as an individual developer, I cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Retention</h2>
              <p>Your data is retained as long as you use the service. You can delete your account at any time, which will remove your personal information. As this is a personal project, I may need to shut down the service with reasonable notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Export your RSS feed list</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Cookies</h2>
              <p>We use essential cookies to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Ensure security</li>
              </ul>
              <p className="mt-2">We do not use tracking or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Third-Party Services</h2>
              <p>Feed Space integrates with Supabase for authentication and data storage. Supabase is a trusted service provider, and we recommend reviewing their privacy policy for information about how they handle data.</p>
              <p className="mt-2">RSS feeds you add may contain tracking pixels or other technologies controlled by the feed publishers. We have no control over these third-party technologies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Children's Privacy</h2>
              <p>Feed Space is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us on <a href="https://x.com/raihara3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">X (Twitter)</a>.</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}