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
          <h1 className="text-4xl font-bold mb-8">利用規約</h1>
          <p className="text-gray-400 mb-8">最終更新日: 2025年7月</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. 規約の同意</h2>
              <p>raihara3による個人プロジェクトであるFeed Space（「本サービス」）にアクセスし、これを使用することで、本規約の条項に同意したものとみなされます。これは個人開発者によって提供される無料サービスです。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. 使用許諾</h2>
              <p>raihara3は、あなたにFeed Spaceの個人的、譲渡不可、非独占的なライセンスを付与します。以下の利用が可能です：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>個人的な用途でのサービスへのアクセスと使用</li>
                <li>公開ソースからのRSSフィードの追加と管理</li>
                <li>フィードコンテンツの閲覧と整理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. ユーザーアカウント</h2>
              <p>アカウントを作成する際は、正確で完全な情報を提供する必要があります。以下の責任があります：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>アカウントのセキュリティの維持</li>
                <li>アカウントで発生するすべての活動</li>
                <li>不正使用の通知</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. 禁止事項</h2>
              <p>Feed Spaceを以下の目的で使用することはできません：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>違法な目的、または他者に違法行為を促すこと</li>
                <li>国際、連邦、州、地方の規制、規則、法律、条例の違反</li>
                <li>当方または他者の知的財産権の侵害</li>
                <li>虚偽または誤解を招く情報の送信</li>
                <li>ウイルスやその他の悪意のあるコードのアップロードや送信</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. コンテンツ</h2>
              <p>本サービスではRSSフィードを追加し、第三者ソースからのコンテンツを表示できます。以下について責任を負いません：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>RSSフィードのコンテンツの正確性、著作権遵守、合法性、品位</li>
                <li>第三者コンテンツの使用による損失や損害</li>
                <li>外部RSSフィードの可用性や信頼性</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. プライバシー</h2>
              <p>Feed Spaceの使用は、プライバシーポリシーにも規定されています。サービスを規定し、データ収集の慣行をユーザーに通知するプライバシーポリシーをご確認ください。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. サービス終了</h2>
              <p>当方の単独の裁量により、規約違反を含むがこれに限定されない理由で、事前通知や責任を負うことなく、即座にアカウントを終了またはサービスへのアクセスを停止する場合があります。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. 免責事項</h2>
              <p>Feed Spaceは個人プロジェクトとして「現状のまま」で提供され、いかなる保証もありません。個人開発者として、raihara3は：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>継続的なサービスの可用性を保証できません</li>
                <li>サービスがすべてのご要望を満たすことを保証できません</li>
                <li>本サービスに関するすべての表明と保証を除外します</li>
                <li>本サービスの使用に起因する損害のすべての責任を除外します</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. 責任の制限</h2>
              <p>これは個人によって提供される無料サービスです。いかなる場合も、raihara3はFeed Spaceの使用に起因または関連して生じるいかなる損害についても、契約、不法行為、その他の理由を問わず、責任を負いません。本サービスは保証や保証なしで提供されます。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. 規約の変更</h2>
              <p>raihara3はいつでも本規約を改訂する権利を留保します。Feed Spaceを使用することで、本サービスの使用を規定するすべての条項を理解するため、定期的に本規約を確認することが期待されます。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. お問い合わせ</h2>
              <p>本規約についてご質問がある場合は、<a href="https://x.com/raihara3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">X (Twitter)</a>でお問い合わせください。</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}