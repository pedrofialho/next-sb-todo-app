'use client'

import { useState, useTransition } from 'react'
import { addTodo } from './actions'

export default function AddTodo() {
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()

      if (!title.trim()) return
      
      startTransition(async () => { 
        await addTodo(title)
      })

      setTitle('')
    }} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  )
} 