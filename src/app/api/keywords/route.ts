import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: keywords, error } = await supabase
    .from('user_keywords')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ keywords })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { keyword } = await request.json()

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const trimmedKeyword = keyword.trim()

    if (trimmedKeyword.length === 0) {
      return NextResponse.json({ error: 'Keyword cannot be empty' }, { status: 400 })
    }

    if (trimmedKeyword.length > 20) {
      return NextResponse.json({ error: 'Keyword must be 20 characters or less' }, { status: 400 })
    }

    // Check if user already has 10 keywords
    const { count } = await supabase
      .from('user_keywords')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count >= 10) {
      return NextResponse.json({ error: 'Maximum 10 keywords allowed' }, { status: 400 })
    }

    // Insert new keyword
    const { data, error } = await supabase
      .from('user_keywords')
      .insert([
        {
          user_id: user.id,
          keyword: trimmedKeyword
        }
      ])
      .select()

    if (error) {
      if (error.code === '23505') { // unique constraint violation
        return NextResponse.json({ error: 'This keyword is already registered' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ keyword: data[0] })
  } catch (error) {
    console.error('Error adding keyword:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { keywordId } = await request.json()

    if (!keywordId) {
      return NextResponse.json({ error: 'Keyword ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_keywords')
      .delete()
      .eq('id', keywordId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting keyword:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}