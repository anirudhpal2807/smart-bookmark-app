import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch initial bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header user={user} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-400">
            Organize and access your bookmarks in real-time
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bookmark Form */}
          <div className="lg:col-span-1">
            <BookmarkForm userId={user.id} />
          </div>
          
          {/* Bookmark List */}
          <div className="lg:col-span-2">
            <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Real-time Sync</h3>
            <p className="text-gray-400 text-sm">Changes appear instantly across all your devices</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Private & Secure</h3>
            <p className="text-gray-400 text-sm">Your bookmarks are only visible to you</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-xl mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Access Anywhere</h3>
            <p className="text-gray-400 text-sm">Access your bookmarks from any device</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">
            Built with Next.js, Supabase &amp; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}

