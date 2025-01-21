'use client'

import type { Todo } from '@/server/db/schema'
import { deleteTodo, toggleTodo } from './actions'
import { cn } from '@/lib/utils'

export default function TodoList({ todos }: { todos: Todo[] }) {
  const handleToggle = async (todo: Todo) => {
    await toggleTodo(todo.id, todo.completed)
  }

  const handleDelete = async (id: number) => {
    await deleteTodo(id)
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-2 p-2 border rounded">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
            className="h-4 w-4"
          />
          <span className={cn(todo.completed && 'line-through text-gray-500')}>
            {todo.title}
          </span>
          <button
            onClick={() => handleDelete(todo.id)}
            className="ml-auto px-2 py-1 text-red-500 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
} 