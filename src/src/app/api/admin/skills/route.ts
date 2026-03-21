import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'

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
  const { data: skill, error } = await supabase.from('skill_types').insert({ name }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skill })
}

export async function PUT(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, name } = await request.json()
  const { data: skill, error } = await supabase.from('skill_types').update({ name }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skill })
}

export async function DELETE(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await supabase.from('skill_types').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}