'use client'
import { useState, useMemo } from 'react'
import AdminForm from './AdminForm'

type SkillType = { id: string; name: string }
type Theme = { id: string; name: string }
type Coloring = {
  id: string; title: string; description: string; age_min: number; age_max: number;
  educational_goals: string; tags: string[]; is_published: boolean;
  file_pdf_path: string; file_thumb_path: string;
}

const PAGE_SIZE = 20

export default function AdminClient({ skillTypes, themes, initialColorings }: {
  skillTypes: SkillType[]
  themes: Theme[]
  initialColorings: Coloring[]
}) {
  const [colorings, setColorings] = useState<Coloring[]>(initialColorings)
  const [editColoring, setEditColoring] = useState<Coloring | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'hidden'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return colorings.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || (filterStatus === 'published' ? c.is_published : !c.is_published)
      return matchSearch && matchStatus
    })
  }, [colorings, search, filterStatus])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = async (id: string) => {
    setDeleteLoading(true)
    const res = await fetch('/api/admin/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (data.success) {
      setColorings(prev => prev.filter(c => c.id !== id))
      setDeleteConfirm(null)
    } else {
      alert('Błąd usuwania: ' + data.error)
    }
    setDeleteLoading(false)
  }

  return (
    <div>
      {!showAddForm && !editColoring && (
        <button onClick={() => setShowAddForm(true)}
          className="mb-6 px-6 py-3 rounded-full text-white font-bold"
          style={{ backgroundColor: '#7B4F9E' }}>
          + Dodaj nową kolorowankę
        </button>
      )}

      {showAddForm && !editColoring && (
        <div className="mb-8">
          <AdminForm skillTypes={skillTypes} themes={themes}
            onCancel={() => setShowAddForm(false)}
            onSaved={() => { setShowAddForm(false); window.location.reload() }} />
        </div>
      )}

      {editColoring && (
        <div className="mb-8">
          <AdminForm skillTypes={skillTypes} themes={themes}
            editColoring={editColoring}
            onCancel={() => setEditColoring(null)}
            onSaved={() => { setEditColoring(null); window.location.reload() }} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ border: '2px solid #E8D5F5' }}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-xl font-bold flex-1" style={{ color: '#7B4F9E' }}>
              Kolorowanki ({filtered.length} / {colorings.length})
            </h2>
            <input
              type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="🔍 Szukaj po tytule..."
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm w-full md:w-64"
            />
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as 'all' | 'published' | 'hidden'); setPage(1) }}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm">
              <option value="all">Wszystkie</option>
              <option value="published">Opublikowane</option>
              <option value="hidden">Ukryte</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {paginated.map(coloring => (
            <div key={coloring.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
              {coloring.file_thumb_path && (
                <img src={coloring.file_thumb_path} alt={coloring.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate" style={{ color: '#7B4F9E' }}>{coloring.title}</h3>
                <p className="text-sm text-gray-500">{coloring.age_min}–{coloring.age_max} lat</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${coloring.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {coloring.is_published ? 'Opublikowana' : 'Ukryta'}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditColoring(coloring); setShowAddForm(false) }}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>
                  Edytuj
                </button>
                {deleteConfirm === coloring.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(coloring.id)} disabled={deleteLoading}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 text-white">
                      {deleteLoading ? '...' : 'Tak, usuń'}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                      Anuluj
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(coloring.id)}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-600">
                    Usuń
                  </button>
                )}
              </div>
            </div>
          ))}
          {paginated.length === 0 && (
            <p className="text-center text-gray-400 py-12">Brak kolorowanek.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-6 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-40"
              style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>← Poprzednia</button>
            <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#7B4F9E' }}>
              {page} / {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-40"
              style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>Następna →</button>
          </div>
        )}
      </div>
    </div>
  )
}