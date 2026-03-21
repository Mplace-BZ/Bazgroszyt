import { createClient } from '@/lib/supabase'

export default async function CatalogPage() {
  const supabase = createClient()
  const { data: colorings, error } = await supabase
    .from('colorings')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) { console.error(error) }
  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#F3EEF8' }}>
      <div className="max-w-5xl mx-auto">
        <a href="/" style={{ color: '#7B4F9E' }} className="text-sm font-medium">Strona glowna</a>
        <div className="text-center mb-10 mt-4">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#7B4F9E' }}>Katalog kolorowanek</h1>
          <p className="text-gray-500">Znajdz idealna kolorowanka dla swojego dziecka</p>
        </div>
        {colorings && colorings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {colorings.map((coloring) => (
              <div key={coloring.id} className="bg-white rounded-2xl shadow-md overflow-hidden" style={{ border: '2px solid #E8D5F5' }}>
                {coloring.file_thumb_path ? (
                  <img src={coloring.file_thumb_path} alt={coloring.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: '#F3EEF8' }}>🎨</div>
                )}
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-1" style={{ color: '#7B4F9E' }}>{coloring.title}</h2>
                  <p className="text-gray-500 text-sm mb-3">{coloring.description}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>{coloring.age_min}-{coloring.age_max} lat</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {coloring.tags && coloring.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">#{tag}</span>
                    ))}
                  </div>
                  <a href={"/catalog/" + coloring.id} className="mt-4 w-full py-2 rounded-full text-white font-semibold text-sm block text-center" style={{ backgroundColor: '#7B4F9E' }}>Zobacz szczegoly</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-20">Brak kolorowanek.</p>
        )}
      </div>
    </main>
  )
}