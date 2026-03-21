import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'chris.maczka@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F3EEF8' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col" style={{ borderRight: '2px solid #E8D5F5' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E8D5F5' }}>
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: '#7B4F9E' }}>Bazgroszyt</span>
          </a>
          <span className="text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block" style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>
            Panel admina
          </span>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Treści</p>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 hover:bg-purple-50 transition-colors" style={{ color: '#7B4F9E' }}>
            <span className="text-lg">🎨</span> Kolorowanki
          </a>
          <a href="/admin/skills" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 hover:bg-purple-50 transition-colors" style={{ color: '#7B4F9E' }}>
            <span className="text-lg">🧠</span> Typy umiejętności
          </a>
          <a href="/admin/themes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 hover:bg-purple-50 transition-colors" style={{ color: '#7B4F9E' }}>
            <span className="text-lg">🏷️</span> Tematy
          </a>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 mt-6">Aplikacja</p>
          <a href="/catalog" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 hover:bg-purple-50 transition-colors" style={{ color: '#7B4F9E' }}>
            <span className="text-lg">🌐</span> Zobacz katalog
          </a>
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 hover:bg-purple-50 transition-colors" style={{ color: '#7B4F9E' }}>
            <span className="text-lg">🏠</span> Strona główna
          </a>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#E8D5F5' }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#7B4F9E' }}>
              {user.user_metadata?.full_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#7B4F9E' }}>{user.user_metadata?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/logout" method="POST" className="mt-2">
            <button type="submit" className="w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
              🚪 Wyloguj się
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}