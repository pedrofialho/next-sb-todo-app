import { db } from '@/server/db'
import { todos } from '@/server/db/schema'
import { createClient } from '@/utils/supabase/server'
import { desc } from 'drizzle-orm'
import AddTodo from './add-todo'
import TodoList from './todo-list'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Please login</div>
  }

  const todosList = await db.query.todos.findMany({
    where: (todos, { eq }) => eq(todos.userId, user.id),
    orderBy: [desc(todos.createdAt)]
  })

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      <AddTodo />
      <TodoList todos={todosList} />
    </div>
  )
}