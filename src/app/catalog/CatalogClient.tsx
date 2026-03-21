'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type SkillType = { id: string; name: string }
type Theme = { id: string; name: string }

export default function CatalogFilters({ skillTypes, themes }: { skillTypes: SkillType[], themes: Theme[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '')
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '')
  const [ageMin, setAgeMin] = useState(searchParams.get('age_min') || '')
  const [ageMax, setAgeMax] = useState(searchParams.get('age_max') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedTheme) params.set('theme', selectedTheme)
    if (selectedSkill) params.set('skill', selectedSkill)
    if (ageMin) params.set('age_min', ageMin)
    if (ageMax) params.set('age_max', ageMax)
    router.push('/catalog?' + params.toString())
  }

  const clearFilters = () => {
    setSearch(''); setSelectedTheme(''); setSelectedSkill(''); setAgeMin(''); setAgeMax('')
    router.push('/catalog')
  }

  const hasFilters = search || selectedTheme || selectedSkill || ageMin || ageMax

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm" style={{ border: '2px solid #E8D5F5' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            placeholder="🔍 Szukaj kolorowanki..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
          />
        </div>
        <div>
          <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm">
            <option value="">Wszystkie tematy</option>
            {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm">
            <option value="">Wszystkie umiejętności</option>
            {skillTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <input type="number" value={ageMin} onChange={e => setAgeMin(e.target.value)}
            placeholder="Wiek od" min="1" max="18"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm" />
        </div>
        <div className="flex gap-2">
          <input type="number" value={ageMax} onChange={e => setAgeMax(e.target.value)}
            placeholder="Wiek do" min="1" max="18"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm" />
        </div>
        <div className="lg:col-span-2 flex gap-3">
          <button onClick={applyFilters}
            className="flex-1 py-3 rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: '#7B4F9E' }}>
            Szukaj
          </button>
          {hasFilters && (
            <button onClick={clearFilters}
              className="px-6 py-3 rounded-full font-bold text-sm"
              style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>
              Wyczyść
            </button>
          )}
        </div>
      </div>
    </div>
  )
}