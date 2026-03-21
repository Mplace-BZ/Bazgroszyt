export const dynamic = 'force-dynamic'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <main style={{backgroundColor:'#F3EEF8',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',position:'relative'}}>
      <div style={{position:'absolute',top:'1rem',right:'1rem',display:'flex',alignItems:'center',gap:'1rem'}}>
        {user ? (
          <>
            <span style={{color:'#7B4F9E',fontWeight:'bold'}}>Cześć, {user.user_metadata?.full_name || user.email}!</span>
            <form action="/logout" method="POST">
              <button type="submit" style={{color:'#7B4F9E',fontWeight:'bold',background:'none',border:'none',cursor:'pointer'}}>Wyloguj</button>
            </form>
          </>
        ) : (
          <a href="/login" style={{color:'#7B4F9E',fontWeight:'bold'}}>Zaloguj się</a>
        )}
      </div>
      <h1 style={{color:'#7B4F9E',fontSize:'3rem',fontWeight:'bold'}}>Bazgroszyt</h1>
      <img src="/bazgroszyt-rakieta.jpg" alt="kolorowanka" style={{maxWidth:'20rem',width:'100%',border:'4px solid #7B4F9E',borderRadius:'1rem',margin:'1rem 0'}} />
      <a href="/catalog" style={{backgroundColor:'#7B4F9E',color:'white',padding:'0.75rem 2rem',borderRadius:'9999px',fontWeight:'bold',textDecoration:'none'}}>Przegladaj kolorowanki</a>
    </main>
  )
}