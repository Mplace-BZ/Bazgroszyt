'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
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
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#7B4F9E' }}>Zaloguj się</h1>
        <p className="text-center text-gray-500 mb-6">Witaj z powrotem w Bazgroszycie!</p>
        {error && (<div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>)}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400" placeholder="twoj@email.pl" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-600">Hasło</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400" placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-full text-white font-bold text-lg transition hover:opacity-90" style={{ backgroundColor: '#7B4F9E' }}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Nie masz konta? <a href="/register" style={{ color: '#7B4F9E' }} className="font-medium">Zarejestruj się</a>
        </p>
      </div>
    </main>
  )
}