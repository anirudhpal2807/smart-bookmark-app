'use client'

import { useState } from 'react'
import { Bookmark } from '@/types/database'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'

interface BookmarkDashboardProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkDashboard({ initialBookmarks, userId }: BookmarkDashboardProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === newBookmark.id)) return prev
      return [newBookmark, ...prev]
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <BookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
      </div>
      <div className="lg:col-span-2">
        <BookmarkList
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          userId={userId}
        />
      </div>
    </div>
  )
}
