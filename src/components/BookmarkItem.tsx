'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/database'
import { useState } from 'react'

interface BookmarkItemProps {
  bookmark: Bookmark
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmark.id)

    if (error) {
      alert('Failed to delete bookmark: ' + error.message)
      setLoading(false)
    } else {
      setDeleted(true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  if (deleted) return null

  return (
    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Favicon */}
        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
          {getFaviconUrl(bookmark.url) ? (
            <img
              src={getFaviconUrl(bookmark.url)!}
              alt=""
              className="w-6 h-6"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:text-purple-400 transition-colors truncate block"
          >
            {bookmark.title}
          </a>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 text-sm hover:text-purple-400 transition-colors truncate block mt-1"
          >
            {bookmark.url}
          </a>
          <span className="text-gray-500 text-xs mt-2 block">
            Added {formatDate(bookmark.created_at)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
            title="Open link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Delete bookmark"
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
