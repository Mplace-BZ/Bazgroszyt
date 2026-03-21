import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - no session' }, { status: 401 })
  }

  const { data: coloring, error } = await supabase
    .from('colorings')
    .select('file_pdf_path')
    .eq('id', id)
    .single()

  if (error || !coloring?.file_pdf_path) {
    return NextResponse.json({ error: 'Not found', details: error?.message }, { status: 404 })
  }

  const { data: signedUrl, error: urlError } = await supabase.storage
    .from('PDFs')
    .createSignedUrl(coloring.file_pdf_path, 60)

  if (urlError || !signedUrl) {
    return NextResponse.json({ error: 'Could not generate URL', details: urlError?.message }, { status: 500 })
  }

  return NextResponse.json({ url: signedUrl.signedUrl })
}