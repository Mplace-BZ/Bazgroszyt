import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'

function toSlug(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base}-${Date.now()}`
}

async function checkAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return null
  return supabase
}

export async function POST(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await request.json()
  const slug = toSlug(name)
  const { data: theme, error } = await supabase.from('themes').insert({ name, slug }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ theme })
}

export async function PUT(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, name } = await request.json()
  const slug = toSlug(name)
  const { data: theme, error } = await supabase.from('themes').update({ name, slug }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ theme })
}

export async function DELETE(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await supabase.from('themes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}