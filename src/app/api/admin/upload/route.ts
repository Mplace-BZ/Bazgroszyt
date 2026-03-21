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
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const age_min = parseInt(formData.get('age_min') as string)
  const age_max = parseInt(formData.get('age_max') as string)
  const educational_goals = formData.get('educational_goals') as string
  const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
  const is_published = formData.get('is_published') === 'true'
  const skill_type_ids = (formData.get('skill_type_ids') as string).split(',').filter(Boolean)
  const theme_ids = (formData.get('theme_ids') as string).split(',').filter(Boolean)
  const pdfFile = formData.get('pdf') as File
  const thumbFile = formData.get('thumbnail') as File

  // Upload PDF
  const pdfBytes = await pdfFile.arrayBuffer()
  const pdfName = `${Date.now()}_${pdfFile.name}`
  const { error: pdfError } = await supabase.storage
    .from('PDFs')
    .upload(pdfName, pdfBytes, { contentType: 'application/pdf' })
  if (pdfError) return NextResponse.json({ error: 'PDF upload failed: ' + pdfError.message }, { status: 500 })

  // Upload thumbnail
  const thumbBytes = await thumbFile.arrayBuffer()
  const thumbName = `${Date.now()}_${thumbFile.name}`
  const { error: thumbError } = await supabase.storage
    .from('Thumbnails')
    .upload(thumbName, thumbBytes, { contentType: thumbFile.type })
  if (thumbError) return NextResponse.json({ error: 'Thumbnail upload failed: ' + thumbError.message }, { status: 500 })

  const { data: thumbUrl } = supabase.storage.from('Thumbnails').getPublicUrl(thumbName)

  // Insert coloring
  const { data: coloring, error: insertError } = await supabase
    .from('colorings')
    .insert({
      title,
      description,
      age_min,
      age_max,
      educational_goals,
      tags,
      is_published,
      file_pdf_path: pdfName,
      file_thumb_path: thumbUrl.publicUrl,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: 'Insert failed: ' + insertError.message }, { status: 500 })

  // Link skill types
  if (skill_type_ids.length > 0) {
    await supabase.from('coloring_skill_types').insert(
      skill_type_ids.map(id => ({ coloring_id: coloring.id, skill_type_id: id }))
    )
  }

  // Link themes
  if (theme_ids.length > 0) {
    await supabase.from('coloring_themes').insert(
      theme_ids.map(id => ({ coloring_id: coloring.id, theme_id: id }))
    )
  }

  return NextResponse.json({ success: true, id: coloring.id })
}