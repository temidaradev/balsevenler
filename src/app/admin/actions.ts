"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export interface DevUpdate {
  date: string;
  title: string;
  content: string;
}

const KEY = "balsevenler_articles";

export async function verifyPassword(password: string) {
  const secret = process.env.ADMIN_PASSWORD;
  return password === secret;
}

export async function getArticles(): Promise<DevUpdate[]> {
  const data = await kv.get<DevUpdate[]>(KEY);
  return data || [];
}

export async function addArticle(newUpdate: DevUpdate) {
  const updates = await getArticles();
  const updated = [newUpdate, ...updates];
  await kv.set(KEY, updated);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteArticle(index: number) {
  const updates = await getArticles();
  const updated = updates.filter((_, i) => i !== index);
  await kv.set(KEY, updated);
  revalidatePath("/");
  revalidatePath("/admin");
}
