'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user was redirected here after email confirmation
    const checkAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const error = hashParams.get('error')
      const errorDescription = hashParams.get('error_description')

      if (error) {
        setError(errorDescription || 'An error occurred during email confirmation')
        setLoading(false)
        return
      }

      // If no error, redirect to home
      router.push('/')
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Confirming your email...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">FEED SPACE</h1>
          
          {error ? (
            <>
              <h2 className="text-xl text-center mb-6 text-red-400">Confirmation Error</h2>
              <p className="text-gray-300 text-center mb-6">{error}</p>
              <Link 
                href="/auth/login"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 text-center"
              >
                Back to Login
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl text-center mb-6 text-green-400">Email Confirmed!</h2>
              <p className="text-gray-300 text-center mb-6">
                Your email has been confirmed. You can now sign in to your account.
              </p>
              <Link 
                href="/auth/login"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 text-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}