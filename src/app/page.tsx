import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Feed Space Logo"
                width="32"
                height="32"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Feed Space
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                はじめる
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                すべてのフィードを一箇所に。
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Feed
                Spaceは散らばったRSSフィードをまとめ、情報収集をよりスマートで効率的にします。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/signup"
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105"
                >
                  無料で始める
                </Link>
                <Link
                  href="/auth/login"
                  className="border border-purple-600 hover:bg-purple-900/30 px-8 py-4 rounded-lg text-lg font-medium transition-all"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image */}
              <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 aspect-[4/3] overflow-hidden">
                <img
                  src="/hero-image.png"
                  alt="Feed Space Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">特徴</h2>
          <div className="text-center text-gray-400 mb-8">
            1フィードにつき最新の50記事を保存。
            <br />
            2時間おきに最新記事を取得します。
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-colors">
              <div className="mb-4">
                <div className="text-purple-400">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">無料で利用可能</h3>
              <p className="text-gray-400">
                フィードは5件まで追加可能。個別に連絡いただければ追加も可能です。
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-colors">
              <div className="mb-4">
                <div className="text-purple-400">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">フィルタリング機能</h3>
              <p className="text-gray-400">
                フィードやキーワードで記事を絞り込み。必要な情報だけを効率的に見つけることができます。
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-colors">
              <div className="mb-4">
                <div className="text-purple-400">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">どこでも利用可能</h3>
              <p className="text-gray-400">
                あらゆるデバイスで読めます。フィードはすべてのプラットフォームで自動同期されます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">使い方</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">アカウントを作成</h3>
                <p className="text-gray-400">
                  数秒でサインアップできます。クレジットカードは不要です。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  RSSフィードを追加
                </h3>
                <p className="text-gray-400">
                  お気に入りのブログやニュースサイトのRSS URLを貼り付けるだけ。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">読み始める</h3>
                <p className="text-gray-400">
                  すべてのフィードが整理され、すぐに利用できます。重要なことに集中しましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo.png"
                  alt="Feed Space Logo"
                  width="24"
                  height="24"
                  className="w-6 h-6"
                />
                <span className="font-bold">Feed Space</span>
              </div>
              <p className="text-gray-400 text-sm">
                すべてのフィードを一箇所に。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">プロダクト</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition-colors"
                  >
                    はじめる
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors"
                  >
                    ログイン
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">法的事項</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">コンタクト</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://x.com/raihara3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Xでお問い合わせ</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 raihara3. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
