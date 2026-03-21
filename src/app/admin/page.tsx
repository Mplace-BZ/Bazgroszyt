import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: skillTypes } = await supabase.from('skill_types').select('id, name').order('name')
  const { data: themes } = await supabase.from('themes').select('id, name').order('name')
  const { data: colorings } = await supabase.from('colorings').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#7B4F9E' }}>Kolorowanki</h1>
        <p className="text-gray-500 text-sm mt-1">Zarządzaj wszystkimi kolorowankami w katalogu</p>
      </div>
      <AdminClient
        skillTypes={skillTypes || []}
        themes={themes || []}
        initialColorings={colorings || []}
      />
    </div>
  )
}