'use client'
import { useState } from 'react'

type SkillType = { id: string; name: string }
type Theme = { id: string; name: string }
type Coloring = {
  id: string; title: string; description: string; age_min: number; age_max: number;
  educational_goals: string; tags: string[]; is_published: boolean;
  file_pdf_path: string; file_thumb_path: string;
}

export default function AdminForm({ skillTypes, themes, editColoring, onCancel, onSaved }: {
  skillTypes: SkillType[]
  themes: Theme[]
  editColoring?: Coloring
  onCancel?: () => void
  onSaved?: () => void
}) {
  const isEdit = !!editColoring
  const [title, setTitle] = useState(editColoring?.title || '')
  const [description, setDescription] = useState(editColoring?.description || '')
  const [ageMin, setAgeMin] = useState(String(editColoring?.age_min || '3'))
  const [ageMax, setAgeMax] = useState(String(editColoring?.age_max || '10'))
  const [educationalGoals, setEducationalGoals] = useState(editColoring?.educational_goals || '')
  const [tags, setTags] = useState(editColoring?.tags?.join(', ') || '')
  const [isPublished, setIsPublished] = useState(editColoring?.is_published ?? true)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const toggleSkill = (id: string) => setSelectedSkills(prev =>
    prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
  )
  const toggleTheme = (id: string) => setSelectedThemes(prev =>
    prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
  )

  const handleSubmit = async () => {
    if (!title || (!isEdit && (!pdfFile || !thumbFile))) {
      setMessage('Wypełnij tytuł i wgraj oba pliki.')
      return
    }
    setLoading(true)
    setMessage('')
    const formData = new FormData()
    if (isEdit) formData.append('id', editColoring!.id)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('age_min', ageMin)
    formData.append('age_max', ageMax)
    formData.append('educational_goals', educationalGoals)
    formData.append('tags', tags)
    formData.append('is_published', String(isPublished))
    formData.append('skill_type_ids', selectedSkills.join(','))
    formData.append('theme_ids', selectedThemes.join(','))
    if (pdfFile) formData.append('pdf', pdfFile)
    if (thumbFile) formData.append('thumbnail', thumbFile)

    const url = isEdit ? '/api/admin/update' : '/api/admin/upload'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json()

    if (data.success) {
      setMessage(isEdit ? '✅ Kolorowanka zaktualizowana!' : '✅ Kolorowanka dodana!')
      if (!isEdit) {
        setTitle(''); setDescription(''); setTags(''); setEducationalGoals('')
        setSelectedSkills([]); setSelectedThemes([])
        setPdfFile(null); setThumbFile(null)
      }
      onSaved?.()
    } else {
      setMessage('❌ Błąd: ' + data.error)
    }
    setLoading(false)
  }

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
  const labelStyle = "block text-sm font-medium mb-1 text-gray-600"

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8" style={{ border: '2px solid #E8D5F5' }}>
      <h2 className="text-xl font-bold mb-6" style={{ color: '#7B4F9E' }}>
        {isEdit ? `Edytujesz: ${editColoring!.title}` : 'Dodaj nową kolorowankę'}
      </h2>

      {message && (
        <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelStyle}>Tytuł *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputStyle} placeholder="np. Rysiek i rakieta – labirynt" />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Opis</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputStyle} rows={3} placeholder="Krótki opis kolorowanki..." />
        </div>
        <div>
          <label className={labelStyle}>Wiek od</label>
          <input type="number" value={ageMin} onChange={e => setAgeMin(e.target.value)} className={inputStyle} min="1" max="18" />
        </div>
        <div>
          <label className={labelStyle}>Wiek do</label>
          <input type="number" value={ageMax} onChange={e => setAgeMax(e.target.value)} className={inputStyle} min="1" max="18" />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Cele edukacyjne</label>
          <textarea value={educationalGoals} onChange={e => setEducationalGoals(e.target.value)} className={inputStyle} rows={2} placeholder="np. Ćwiczy koncentrację, precyzję ruchów ręki..." />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>Tagi (oddzielone przecinkami)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputStyle} placeholder="np. rakieta, kosmos, labirynt" />
        </div>
        <div>
          <label className={labelStyle}>Plik PDF {isEdit ? '(zostaw pusty żeby nie zmieniać)' : '*'}</label>
          <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Miniaturka {isEdit ? '(zostaw puste żeby nie zmieniać)' : '*'}</label>
          <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files?.[0] || null)} className={inputStyle} />
        </div>
        {skillTypes.length > 0 && (
          <div className="md:col-span-2">
            <label className={labelStyle}>Typy umiejętności</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {skillTypes.map(s => (
                <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                  style={{ backgroundColor: selectedSkills.includes(s.id) ? '#7B4F9E' : '#E8D5F5', color: selectedSkills.includes(s.id) ? 'white' : '#7B4F9E' }}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {themes.length > 0 && (
          <div className="md:col-span-2">
            <label className={labelStyle}>Tematy</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {themes.map(t => (
                <button key={t.id} type="button" onClick={() => toggleTheme(t.id)}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                  style={{ backgroundColor: selectedThemes.includes(t.id) ? '#7B4F9E' : '#E8D5F5', color: selectedThemes.includes(t.id) ? 'white' : '#7B4F9E' }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="md:col-span-2 flex items-center gap-3">
          <input type="checkbox" id="published" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-purple-600" />
          <label htmlFor="published" className="text-sm font-medium text-gray-600">Opublikuj od razu</label>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-3 rounded-full text-white font-bold text-lg transition-opacity"
          style={{ backgroundColor: '#7B4F9E', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Zapisuję...' : isEdit ? 'Zapisz zmiany' : 'Dodaj kolorowankę'}
        </button>
        {isEdit && onCancel && (
          <button onClick={onCancel}
            className="px-6 py-3 rounded-full font-bold text-lg"
            style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}>
            Anuluj
          </button>
        )}
      </div>
    </div>
  )
}