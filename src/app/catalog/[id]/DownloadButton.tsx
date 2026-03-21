'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DownloadButton({ coloringId, isLoggedIn }: { coloringId: string, isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleDownload = async () => {
    if (!isLoggedIn) {
      setShowModal(true)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/download/${coloringId}`)
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="mt-6 w-full py-3 rounded-full text-white font-bold text-lg block text-center transition-opacity"
        style={{ backgroundColor: '#7B4F9E', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Przygotowuję plik...' : 'Pobierz kolorowankę'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-xl text-center" style={{ border: '2px solid #E8D5F5' }}>
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#7B4F9E' }}>
              Zaloguj się, żeby pobrać
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Pobieranie kolorowanek jest dostępne dla zarejestrowanych użytkowników. To zajmuje tylko chwilę!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 rounded-full text-white font-bold"
                style={{ backgroundColor: '#7B4F9E' }}
              >
                Zaloguj się
              </button>
              <button
                onClick={() => router.push('/register')}
                className="w-full py-3 rounded-full font-bold"
                style={{ backgroundColor: '#E8D5F5', color: '#7B4F9E' }}
              >
                Zarejestruj się bezpłatnie
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-400 mt-1"
              >
                Może później
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}