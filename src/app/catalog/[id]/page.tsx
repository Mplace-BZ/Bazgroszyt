import { createClient } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import DownloadButton from './DownloadButton'

export default async function ColoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const serverSupabase = await createServerSupabaseClient()

  const { data: { session } } = await serverSupabase.auth.getSession()
  const { data: coloring, error } = await supabase.from('colorings').select('*').eq('id', id).single()

  if (error || !coloring) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F3EEF8' }}>
        <p className="text-gray-400">Nie znaleziono kolorowanki. {error?.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#F3EEF8' }}>
      <div className="max-w-2xl mx-auto">
        <a href="/catalog" style={{ color: '#7B4F9E' }} className="text-sm font-medium">Wróc do katalogu</a>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6" style={{ border: '2px solid #E8D5F5' }}>
          {coloring.file_thumb_path && (<img src={coloring.file_thumb_path} alt={coloring.title} className="w-full object-contain max-h-96" />)}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#7B4F9E' }}>{coloring.title}</h1>
            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>{coloring.age_min}-{coloring.age_max} lat</span>
            <p className="text-gray-600 mt-4 leading-relaxed">{coloring.description}</p>
            {coloring.educational_goals && (
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#F3EEF8' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#7B4F9E' }}>Cele edukacyjne:</p>
                <p className="text-gray-600 text-sm">{coloring.educational_goals}</p>
              </div>
            )}
            {coloring.tags && (
              <div className="flex flex-wrap gap-1 mt-4">
                {coloring.tags.map((tag: string) => (<span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">#{tag}</span>))}
              </div>
            )}
            <DownloadButton coloringId={id} isLoggedIn={!!session} />
          </div>
        </div>
      </div>
    </main>
  )
}