import { createServerSupabaseClient } from '@/lib/supabase-server'
import SkillsClient from './SkillsClient'

export default async function SkillsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: skills } = await supabase.from('skill_types').select('*').order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#7B4F9E' }}>Typy umiejętności</h1>
        <p className="text-gray-500 text-sm mt-1">Zarządzaj kategoriami umiejętności</p>
      </div>
      <SkillsClient initialSkills={skills || []} />
    </div>
  )
}