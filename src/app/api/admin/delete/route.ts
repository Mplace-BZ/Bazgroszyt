import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  const { data: coloring } = await supabase
    .from('colorings')
    .select('file_pdf_path, file_thumb_path')
    .eq('id', id)
    .single()

  if (coloring?.file_pdf_path) {
    await supabase.storage.from('PDFs').remove([coloring.file_pdf_path])
  }

  await supabase.from('coloring_skill_types').delete().eq('coloring_id', id)
  await supabase.from('coloring_themes').delete().eq('coloring_id', id)

  const { error } = await supabase.from('colorings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}