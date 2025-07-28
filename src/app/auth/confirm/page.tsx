'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (token_hash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any
          })

          if (error) {
            setError(error.message)
            setLoading(false)
            return
          }

          if (data.user) {
            // Check if profile exists
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .single()

            // Create profile if it doesn't exist
            if (!profile) {
              const username = data.user.user_metadata?.username || 
                              data.user.email?.split('@')[0] || 
                              'user'

              const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                  {
                    id: data.user.id,
                    username: username,
                  },
                ])

              if (profileError) {
                console.error('Error creating profile:', profileError)
                // Continue anyway, profile will be created later if needed
              }
            }

            // Redirect to dashboard
            router.push('/dashboard')
            return
          }
        }

        // Fallback: Check for hash-based confirmation (old method)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const hashError = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (hashError) {
          setError(errorDescription || 'An error occurred during email confirmation')
          setLoading(false)
          return
        }

        // If no specific confirmation flow, just redirect to login
        setLoading(false)
      } catch (err) {
        console.error('Confirmation error:', err)
        setError('An error occurred during confirmation')
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [router, searchParams, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">メールを確認中...</div>
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
              <h2 className="text-xl text-center mb-6 text-red-400">確認エラー</h2>
              <p className="text-gray-300 text-center mb-6">{error}</p>
              <Link 
                href="/auth/login"
                className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200 text-center"
              >
                ログインに戻る
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl text-center mb-6 text-green-400">メール確認完了！</h2>
              <p className="text-gray-300 text-center mb-6">
                メールが確認されました。アカウントにログインできます。
              </p>
              <Link 
                href="/auth/login"
                className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200 text-center"
              >
                ログイン
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}