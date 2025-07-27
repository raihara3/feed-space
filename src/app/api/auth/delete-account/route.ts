import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Verify the password by attempting to sign in
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    })

    if (authError) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }

    // Delete the user's profile (this will cascade delete feeds and feed_items)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return NextResponse.json({ error: 'Failed to delete profile data' }, { status: 500 })
    }

    // Delete user from Supabase Auth using admin client
    try {
      const adminClient = createAdminClient()
      const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id)
      
      if (deleteUserError) {
        console.error('Error deleting user from auth:', deleteUserError)
      }
    } catch (adminError) {
      console.error('Admin client error:', adminError)
      // Continue with signout even if admin deletion fails
    }

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}