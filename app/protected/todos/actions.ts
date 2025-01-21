"use server";

import { db } from "@/server/db";
import { todos } from "@/server/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function addTodo(title: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await db.insert(todos).values({
    title,
    completed: false,
    userId: user.id,
  });

  revalidatePath("/protected/todos");
}

export async function toggleTodo(id: number, completed: boolean) {
  await db.update(todos).set({ completed: !completed }).where(eq(todos.id, id));

  revalidatePath("/protected/todos");
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));

  revalidatePath("/protected/todos");
}
