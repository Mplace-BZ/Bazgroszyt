'use client'
import { useState } from 'react'

type Skill = { id: string; name: string }

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newName.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() })
    })
    const data = await res.json()
    if (data.skill) {
      setSkills(prev => [...prev, data.skill])
      setNewName('')
    }
    setLoading(false)
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName.trim() })
    })
    const data = await res.json()
    if (data.skill) {
      setSkills(prev => prev.map(s => s.id === id ? data.skill : s))
      setEditId(null)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (data.success) {
      setSkills(prev => prev.filter(s => s.id !== id))
      setDeleteConfirm(null)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      {/* Dodaj nową */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm" style={{ border: '2px solid #E8D5F5' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#7B4F9E' }}>Dodaj nowy typ umiejętności</h2>
        <div className="flex gap-3">
          <input
            type="text" value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="np. Grafomotoryka"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
          />
          <button onClick={handleAdd} disabled={loading || !newName.trim()}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40"
            style={{ backgroundColor: '#7B4F9E' }}>
            Dodaj
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '2px solid #E8D5F5' }}>
        <div className="p-5 border-b" style={{ borderColor: '#E8D5F5' }}>
          <h2 className="font-bold" style={{ color: '#7B4F9E' }}>Typy umiejętności ({skills.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
              {editId === skill.id ? (
                <>
                  <input
                    type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUpdate(skill.id)}
                    className="flex-1 px-3 py-2 rounded-xl border border-purple-300 focus:outline-none text-sm"
                    autoFocus
                  />
                  <button onClick={() => handleUpdate(skill.id)} disabled={loading}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                    style={{ backgroundColor: '#7B4F9E' }}>Zapisz</button>
                  <button onClick={() => setEditId(null)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600">Anuluj</button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-gray-700">{skill.name}</span>
                  <button onClick={() => { setEditId(skill.id); setEditName(skill.name) }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>Edytuj</button>
                  {deleteConfirm === skill.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(skill.id)} disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white">
                        {loading ? '...' : 'Usuń'}
                      </button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600">Anuluj</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(skill.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-600">Usuń</button>
                  )}
                </>
              )}
            </div>
          ))}
          {skills.length === 0 && <p className="text-center text-gray-400 py-12">Brak umiejętności.</p>}
        </div>
      </div>
    </div>
  )
}