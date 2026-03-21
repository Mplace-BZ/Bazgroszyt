'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('parent')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/catalog'
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#F3EEF8' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md" style={{ border: '2px solid #E8D5F5' }}>
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#7B4F9E' }}>Zarejestruj się</h1>
        <p className="text-center text-gray-500 mb-6">Dołącz do Bazgroszytu za darmo!</p>
        {error && (<div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>)}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Imię i nazwisko</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400" placeholder="Jan Kowalski" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400" placeholder="twoj@email.pl" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Hasło</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400" placeholder="minimum 6 znaków" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-600">Kim jesteś?</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400">
            <option value="parent">Rodzic</option>
            <option value="teacher">Nauczyciel</option>
            <option value="therapist">Terapeuta</option>
          </select>
        </div>
        <button onClick={handleRegister} disabled={loading} className="w-full py-3 rounded-full text-white font-bold text-lg transition hover:opacity-90" style={{ backgroundColor: '#7B4F9E' }}>
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Masz już konto? <a href="/login" style={{ color: '#7B4F9E' }} className="font-medium">Zaloguj się</a>
        </p>
      </div>
    </main>
  )
}