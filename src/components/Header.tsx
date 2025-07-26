'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.refresh()
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">FEED SPACE</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}