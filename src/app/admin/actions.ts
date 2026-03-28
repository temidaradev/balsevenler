"use server";

export async function verifyPassword(password: string) {
  const secret = process.env.ADMIN_PASSWORD || "balsevenler1337";
  return password === secret;
}
