'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/database'
import { useEffect, useState } from 'react'
import BookmarkItem from './BookmarkItem'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>
  userId: string
}

export default function BookmarkList({ bookmarks, setBookmarks, userId }: BookmarkListProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Set up real-time subscription
    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark
          setBookmarks((prev) => {
            // Check if bookmark already exists to prevent duplicates
            if (prev.some((b) => b.id === newBookmark.id)) return prev
            return [newBookmark, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedBookmark = payload.old as Bookmark
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedBookmark.id))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedBookmark = payload.new as Bookmark
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
          )
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          Your Bookmarks
          <span className="text-gray-400 text-sm font-normal">({bookmarks.length})</span>
        </h2>
        
        {/* Connection Status Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}
          />
          <span className="text-xs text-gray-400">
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">No bookmarks yet</h3>
          <p className="text-gray-400 text-sm">
            Add your first bookmark using the form above
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  )
}
