import Link from 'next/link'

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: January 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p>By accessing and using Feed Space ("the Service"), a personal project by raihara3, you accept and agree to be bound by the terms and provision of this agreement. This is a free service provided by an individual developer.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
              <p>raihara3 grants you a personal, non-transferable, non-exclusive license to use Feed Space. You may:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Access and use the service for your personal needs</li>
                <li>Add and manage RSS feeds from public sources</li>
                <li>Read and organize your feed content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
              <p>When you create an account with us, you must provide information that is accurate and complete. You are responsible for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Prohibited Uses</h2>
              <p>You may not use Feed Space:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>For any illegal purpose or to solicit others to perform illegal acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Content</h2>
              <p>Our service allows you to add RSS feeds and view content from third-party sources. We are not responsible for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>The accuracy, copyright compliance, legality, or decency of content from RSS feeds</li>
                <li>Any loss or damage resulting from your use of third-party content</li>
                <li>The availability or reliability of external RSS feeds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Privacy</h2>
              <p>Your use of Feed Space is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Service and informs users of our data collection practices.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Termination</h2>
              <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Disclaimer</h2>
              <p>Feed Space is a personal project provided on an "as is" basis without any warranties. As an individual developer, raihara3:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Cannot guarantee continuous service availability</li>
                <li>Cannot guarantee the service will meet all your requirements</li>
                <li>Excludes all representations and warranties relating to this service</li>
                <li>Excludes all liability for damages arising from your use of this service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Limitation of Liability</h2>
              <p>This is a free service provided by an individual. In no event shall raihara3 be liable to you for anything arising out of or in any way connected with your use of Feed Space, whether such liability is under contract, tort, or otherwise. The service is provided without any warranties or guarantees.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Changes to Terms</h2>
              <p>raihara3 reserves the right to revise these terms at any time. By using Feed Space, you are expected to review these Terms on a regular basis to ensure you understand all terms and conditions governing use of this service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us on <a href="https://x.com/raihara3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">X (Twitter)</a>.</p>
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