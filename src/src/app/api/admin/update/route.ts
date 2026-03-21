import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const age_min = parseInt(formData.get('age_min') as string)
  const age_max = parseInt(formData.get('age_max') as string)
  const educational_goals = formData.get('educational_goals') as string
  const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
  const is_published = formData.get('is_published') === 'true'
  const skill_type_ids = (formData.get('skill_type_ids') as string).split(',').filter(Boolean)
  const theme_ids = (formData.get('theme_ids') as string).split(',').filter(Boolean)
  const pdfFile = formData.get('pdf') as File | null
  const thumbFile = formData.get('thumbnail') as File | null

  const updateData: Record<string, unknown> = { title, description, age_min, age_max, educational_goals, tags, is_published }

  if (pdfFile && pdfFile.size > 0) {
    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfName = `${Date.now()}_${pdfFile.name}`
    const { error: pdfError } = await supabase.storage.from('PDFs').upload(pdfName, pdfBytes, { contentType: 'application/pdf' })
    if (pdfError) return NextResponse.json({ error: 'PDF upload failed: ' + pdfError.message }, { status: 500 })
    updateData.file_pdf_path = pdfName
  }

  if (thumbFile && thumbFile.size > 0) {
    const thumbBytes = await thumbFile.arrayBuffer()
    const thumbName = `${Date.now()}_${thumbFile.name}`
    const { error: thumbError } = await supabase.storage.from('Thumbnails').upload(thumbName, thumbBytes, { contentType: thumbFile.type })
    if (thumbError) return NextResponse.json({ error: 'Thumbnail upload failed: ' + thumbError.message }, { status: 500 })
    const { data: thumbUrl } = supabase.storage.from('Thumbnails').getPublicUrl(thumbName)
    updateData.file_thumb_path = thumbUrl.publicUrl
  }

  const { error: updateError } = await supabase.from('colorings').update(updateData).eq('id', id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  await supabase.from('coloring_skill_types').delete().eq('coloring_id', id)
  await supabase.from('coloring_themes').delete().eq('coloring_id', id)

  if (skill_type_ids.length > 0) {
    await supabase.from('coloring_skill_types').insert(skill_type_ids.map(sid => ({ coloring_id: id, skill_type_id: sid })))
  }
  if (theme_ids.length > 0) {
    await supabase.from('coloring_themes').insert(theme_ids.map(tid => ({ coloring_id: id, theme_id: tid })))
  }

  return NextResponse.json({ success: true })
}