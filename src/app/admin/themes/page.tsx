import { createServerSupabaseClient } from '@/lib/supabase-server'
import ThemesClient from './ThemesClient'

export default async function ThemesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: themes } = await supabase.from('themes').select('*').order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#7B4F9E' }}>Tematy</h1>
        <p className="text-gray-500 text-sm mt-1">Zarządzaj tematami kolorowanek</p>
      </div>
      <ThemesClient initialThemes={themes || []} />
    </div>
  )
}