"use server";

import { createClient } from "redis";
import { revalidatePath } from "next/cache";

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: false // Fail fast if Redis is down, don't hang Next.js rendering
  }
});

client.on("error", (err) => {
  if (err.code === "ECONNREFUSED") return; // Suppress verbose offline errors
  console.log("Redis Client Error", err);
});

async function getRedis() {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (e) {
      // Start offline if Redis not available
    }
  }
  return client;
}

export interface DevUpdate {
  date: string;
  title: string;
  content: string;
  category?: string;
}

const KEY = "balsevenler_articles";

export async function verifyPassword(password: string) {
  const secret = process.env.ADMIN_PASSWORD;
  return password === secret;
}

export async function getArticles(): Promise<DevUpdate[]> {
  const redis = await getRedis();
  if (!redis.isOpen) return [];
  try {
    const data = await redis.get(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export async function addArticle(newUpdate: DevUpdate) {
  const redis = await getRedis();
  if (!redis.isOpen) return;
  const updates = await getArticles();
  const updated = [newUpdate, ...updates];
  await redis.set(KEY, JSON.stringify(updated));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editArticle(index: number, updatedArticle: DevUpdate) {
  const redis = await getRedis();
  if (!redis.isOpen) return;
  const updates = await getArticles();
  if (index >= 0 && index < updates.length) {
    updates[index] = updatedArticle;
    await redis.set(KEY, JSON.stringify(updates));
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

export async function deleteArticle(index: number) {
  const redis = await getRedis();
  if (!redis.isOpen) return;
  const updates = await getArticles();
  const updated = updates.filter((_, i) => i !== index);
  await redis.set(KEY, JSON.stringify(updated));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function reorderArticles(fromIndex: number, toIndex: number) {
  const redis = await getRedis();
  if (!redis.isOpen) return;
  const updates = await getArticles();
  if (fromIndex >= 0 && fromIndex < updates.length && toIndex >= 0 && toIndex < updates.length) {
    const [moved] = updates.splice(fromIndex, 1);
    updates.splice(toIndex, 0, moved);
    await redis.set(KEY, JSON.stringify(updates));
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

// ==========================================
// PHASE CONTENT MANAGEMENT
// ==========================================

export interface CustomPhaseItem {
  id: string;
  title: string;
  text: string;
  startScroll: number;
  endScroll: number;
}

export interface PhaseContent {
  hyperspace: { title: string; text: string; };
  debris: { text: string; };
  tankDetach: { text1: string; text2: string; text3: string; };
  nebula: { star1: string; star2: string; };
  surface: { text: string; };
  finale: { text: string; };
  customItems?: CustomPhaseItem[];
}

const DEFAULT_PHASE_CONTENT: PhaseContent = {
  hyperspace: {
    title: "Uzay Acımasızdır",
    text: "Uzaya ne kadar yük taşımak istiyorsan o kadar yakıt doldurmalısın fakat daha fazla yakıt roketi ağırlaştırır bu sefer de o yakıtı taşımak için de daha fazla yakıta ihtiyacın olur…\n\nKısacası: Ne kadar ekmek, o kadar köfte."
  },
  debris: {
    text: "Meteor zannettin değil mi ;) Her ne kadar meteoru andırsa da o kuvvetle muhtemel eski uydulardan birinden kopan küçük bir parça. Eğer yeterince talihsizsek bu çöp bizleri bir mermi gibi delebilir. Dünyanın yörüngesinde gezinen bu tip 28.000 çöp vardır."
  },
  tankDetach: {
    text1: "Yapılan iş ne olursa olsun onun zorluğu sadece yapan bilir. 400.000 kişinin ortak emeği olan Saturn V roketi o güne kadar üretilmiş en güçlü makineydi ve her saniye 13 ton yakıt tüketiyordu.",
    text2: "Aya gitmek denize atlamaya benzemez, gelişigüzel yapılmaz. Dünyanın dönmesini bir sapan gibi kullanarak boşluğa fırlatılırsınız. E tabi uzayda sonsuza kadar mahsur kalmak istemiyorsan…",
    text3: "Şu an ayırdığımız bu devasa tanklar, Dünya'nın kütleçekiminden kurtulmamızı sağlayan fedailerdir. Ay'a varacak olan asıl parça, toplam roketin ağırlığının sadece %1'inden bile azdır."
  },
  nebula: {
    star1: "Aya gidildikçe sadece aradaki mesafe artmaz. Ayrıca aradaki zaman da artar. Aya gittikçe zaman minik farklarla daha yavaş akmaya başlar… Gençleşmenin sırrı ;)",
    star2: "Bir küpün içindeki tüm atomları boşaltırsan, geriye 'hiçlik' kaldığını sanırsın. Oysa yanılıyorsun. Maddenin bittiği yerde Uzay-Zamanın Dokusu başlar.\n\nNesneleri nesne kılan şey sadece içlerindeki atomlar değil, o atomların içinde yüzdüğü bu esnek dokudur. Eğer evrendeki tüm yıldızları ve gezegenleri yok etseydin, geriye bomboş bir karanlık değil; gerilen, bükülen ve dalgalanan bir 'mekan kumaşı' kalırdı.\n\nKuantum Boşluk Çalkantıları nedeniyle, en boş sandığın yerde bile atom altı parçacıklar bir anlığına var olup yok olmaya devam eder. Yani evrende gerçek bir 'hiçlik' yoktur; sadece henüz dokunmadığın bir varlık formu vardır."
  },
  surface: {
    text: "Ay'a dikilen ilk bayraklar Apollo'nun egzozundan dolayı yanıp kül oldu. Lakin ayak izleri hala orada. O gün Ay'a ulaşılabileceğini kanıtlamışken şimdi oraya konaklamaya gidiyoruz ;)"
  },
  finale: {
    text: "Ay'a giden yol, mühendislikten, felsefeden ve cesaretten geçer.\nBu hikayenin bir sonraki bölümünü sen yazabilirsin.\nHangi alanda uzmanlaşmak istersin?"
  },
  customItems: []
};

const PHASES_KEY = "balsevenler_phases";

export async function getPhaseContent(): Promise<PhaseContent> {
  const redis = await getRedis();
  if (!redis.isOpen) return DEFAULT_PHASE_CONTENT;
  try {
    const data = await redis.get(PHASES_KEY);
    return data ? JSON.parse(data) : DEFAULT_PHASE_CONTENT;
  } catch (e) {
    return DEFAULT_PHASE_CONTENT;
  }
}

export async function updatePhaseContent(content: PhaseContent) {
  const redis = await getRedis();
  if (!redis.isOpen) return;
  await redis.set(PHASES_KEY, JSON.stringify(content));
  revalidatePath("/");
  revalidatePath("/admin");
}
