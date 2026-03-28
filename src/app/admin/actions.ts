"use server";

import { createClient } from "redis";
import { revalidatePath } from "next/cache";

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function getRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

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
  const redis = await getRedis();
  const data = await redis.get(KEY);
  return data ? JSON.parse(data) : [];
}

export async function addArticle(newUpdate: DevUpdate) {
  const redis = await getRedis();
  const updates = await getArticles();
  const updated = [newUpdate, ...updates];
  await redis.set(KEY, JSON.stringify(updated));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteArticle(index: number) {
  const redis = await getRedis();
  const updates = await getArticles();
  const updated = updates.filter((_, i) => i !== index);
  await redis.set(KEY, JSON.stringify(updated));
  revalidatePath("/");
  revalidatePath("/admin");
}
