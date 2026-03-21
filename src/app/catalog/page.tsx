import { createClient } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Suspense } from 'react'
import CatalogFilters from './CatalogClient'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'
const PAGE_SIZE = 24

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const supabase = createClient()
  const serverSupabase = await createServerSupabaseClient()
  const { data: { user } } = await serverSupabase.auth.getUser()

  const { data: skillTypes } = await supabase.from('skill_types').select('id, name').order('name')
  const { data: themes } = await supabase.from('themes').select('id, name').order('name')

  const page = parseInt(params.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from('colorings').select('*', { count: 'exact' }).eq('is_published', true)

  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }
  if (params.age_min) {
    query = query.gte('age_min', parseInt(params.age_min))
  }
  if (params.age_max) {
    query = query.lte('age_max', parseInt(params.age_max))
  }

  // Filtr po temacie - przez relację
  if (params.theme) {
    const { data: themeColorings } = await supabase
      .from('coloring_themes')
      .select('coloring_id')
      .eq('theme_id', params.theme)
    const ids = themeColorings?.map(c => c.coloring_id) || []
    if (ids.length === 0) {
      return renderEmpty(user?.email === ADMIN_EMAIL, skillTypes || [], themes || [], page, 0, params)
    }
    query = query.in('id', ids)
  }

  // Filtr po umiejętności - przez relację
  if (params.skill) {
    const { data: skillColorings } = await supabase
      .from('coloring_skill_types')
      .select('coloring_id')
      .eq('skill_type_id', params.skill)
    const ids = skillColorings?.map(c => c.coloring_id) || []
    if (ids.length === 0) {
      return renderEmpty(user?.email === ADMIN_EMAIL, skillTypes || [], themes || [], page, 0, params)
    }
    query = query.in('id', ids)
  }

  const { data: colorings, count } = await query.order('created_at', { ascending: false }).range(from, to)
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return renderPage(colorings || [], user?.email === ADMIN_EMAIL, skillTypes || [], themes || [], page, totalPages, count || 0, params)
}

function renderEmpty(isAdmin: boolean, skillTypes: {id:string,name:string}[], themes: {id:string,name:string}[], page: number, total: number, params: Record<string, string>) {
  return renderPage([], isAdmin, skillTypes, themes, page, 0, total, params)
}

function renderPage(
  colorings: Record<string, unknown>[],
  isAdmin: boolean,
  skillTypes: {id:string,name:string}[],
  themes: {id:string,name:string}[],
  page: number,
  totalPages: number,
  total: number,
  params: Record<string, string>
) {
  const buildPageUrl = (p: number) => {
    const newParams = new URLSearchParams({ ...params, page: String(p) })
    return '/catalog?' + newParams.toString()
  }

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#F3EEF8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <a href="/" style={{ color: '#7B4F9E' }} className="text-sm font-medium">← Strona główna</a>
          {isAdmin && (
            <a href="/admin" className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: '#7B4F9E', color: 'white' }}>
              Panel admina
            </a>
          )}
        </div>
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#7B4F9E' }}>Katalog kolorowanek</h1>
          <p className="text-gray-500">Znajdź idealną kolorowankę dla swojego dziecka</p>
        </div>

        <Suspense>
          <CatalogFilters skillTypes={skillTypes} themes={themes} />
        </Suspense>

        {total > 0 && (
          <p className="text-sm text-gray-500 mb-4">Znaleziono: <strong>{total}</strong> kolorowanek</p>
        )}

        {colorings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {colorings.map((coloring) => (
                <div key={coloring.id as string} className="bg-white rounded-2xl shadow-md overflow-hidden" style={{ border: '2px solid #E8D5F5' }}>
                  {coloring.file_thumb_path ? (
                    <img src={coloring.file_thumb_path as string} alt={coloring.title as string} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: '#F3EEF8' }}>🎨</div>
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-1" style={{ color: '#7B4F9E' }}>{coloring.title as string}</h2>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{coloring.description as string}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>{coloring.age_min as number}–{coloring.age_max as number} lat</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(coloring.tags as string[])?.map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">#{tag}</span>
                      ))}
                    </div>
                    <a href={"/catalog/" + (coloring.id as string)} className="mt-4 w-full py-2 rounded-full text-white font-semibold text-sm block text-center" style={{ backgroundColor: '#7B4F9E' }}>Zobacz szczegóły</a>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <a href={buildPageUrl(page - 1)} className="px-4 py-2 rounded-full font-semibold text-sm" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>← Poprzednia</a>
                )}
                <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#7B4F9E' }}>
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <a href={buildPageUrl(page + 1)} className="px-4 py-2 rounded-full font-semibold text-sm" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>Następna →</a>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">Brak kolorowanek spełniających kryteria.</p>
        )}
      </div>
    </main>
  )
}