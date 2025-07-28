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
          <h1 className="text-4xl font-bold mb-8">プライバシーポリシー</h1>
          <p className="text-gray-400 mb-8">最終更新日: 2025年7月</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. 収集する情報</h2>
              <p>Feed Spaceはraihara3による個人プロジェクトです。アカウント作成やRSSフィード追加時など、サービス提供に必要な最小限の情報のみを収集します。</p>
              <h3 className="text-xl font-medium mt-4 mb-2 text-white">アカウント情報</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>メールアドレス</li>
                <li>ユーザー名（任意）</li>
                <li>パスワード（暗号化）</li>
              </ul>
              <h3 className="text-xl font-medium mt-4 mb-2 text-white">使用状況情報</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>追加したRSSフィード</li>
                <li>閲覧設定</li>
                <li>サービス使用パターン</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. 情報の使用方法</h2>
              <p>収集した情報は以下の目的で使用します：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>サービスの提供、維持、改善</li>
                <li>アカウントの作成と管理</li>
                <li>RSSフィードのデバイス間での保存と同期</li>
                <li>技術的な通知とサポートメッセージの送信</li>
                <li>コメント、質問、リクエストへの対応</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. 情報の共有</h2>
              <p>個人開発者として、個人情報の販売、取引、貸与は行いません。データは以下の場合のみ共有される可能性があります：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>明示的な同意がある場合</li>
                <li>法律で要求される場合</li>
                <li>Supabase（認証およびデータベースプロバイダー）との間で</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. データセキュリティ</h2>
              <p>個人プロジェクトとして、情報を保護するための合理的なセキュリティ対策を実装しています。データはSupabaseのインフラストラクチャを使用して安全に保存されます。ただし、インターネット上の伝送方法は100%安全ではなく、個人開発者として絶対的なセキュリティを保証することはできないことをご理解ください。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. データ保持</h2>
              <p>データはサービスをご利用いただいている間保持されます。いつでもアカウントを削除でき、その際に個人情報が削除されます。これは個人プロジェクトであるため、合理的な通知とともにサービスを停止する必要がある場合があります。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. あなたの権利</h2>
              <p>以下の権利があります：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>個人情報へのアクセス</li>
                <li>情報の更新または修正</li>
                <li>アカウントと関連データの削除</li>
                <li>RSSフィードリストのエクスポート</li>
                <li>必須でない通信のオプトアウト</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Cookie</h2>
              <p>以下の目的で必須のCookieを使用します：</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>ログイン状態の維持</li>
                <li>設定の記憶</li>
                <li>セキュリティの確保</li>
              </ul>
              <p className="mt-2">トラッキングや広告用のCookieは使用しません。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. 第三者サービス</h2>
              <p>Feed Spaceは認証とデータ保存にSupabaseと統合しています。Supabaseは信頼できるサービスプロバイダーであり、データの取り扱いについてはSupabaseのプライバシーポリシーの確認をお勧めします。</p>
              <p className="mt-2">追加するRSSフィードには、フィード発行者が管理するトラッキングピクセルやその他の技術が含まれる場合があります。これらの第三者技術については制御できません。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. 子どものプライバシー</h2>
              <p>Feed Spaceは13歳未満の子どもを対象としていません。13歳未満の子どもから個人情報を故意に収集することはありません。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. ポリシーの変更</h2>
              <p>プライバシーポリシーは随時更新される場合があります。変更がある場合は、このページに新しいプライバシーポリシーを掲載し、「最終更新日」を更新することで通知します。</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. お問い合わせ</h2>
              <p>このプライバシーポリシーについてご質問がある場合は、<a href="https://x.com/raihara3" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">X (Twitter)</a>でお問い合わせください。</p>
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