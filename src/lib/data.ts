"use client";

import { useState, useEffect } from "react";

export interface DevUpdate {
  date: string;
  title: string;
  content: string;
}

const DEFAULT_UPDATES: DevUpdate[] = [
  { date: "2024-03-25", title: "Sektör 4-B Sismik Analiz Tamamlandı", content: "Yapay zeka modellerimiz, uydudan gelen son verileri işleyerek Sektör 4-B bölgesindeki bina çökme oranlarını %95 hassasiyetle tespit etti." },
  { date: "2024-03-28", title: "BKZS Entegrasyonu ve Güvenli Rota Planlama", content: "Kurtarma ekipleri için gerçek zamanlı coğrafi engelleri aşan en güvenli rota hesaplama algoritması BKZS altyapısına başarıyla dahil edildi." },
];

export function useDevUpdates() {
  const [updates, setUpdates] = useState<DevUpdate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("balsevenler_updates");
    if (saved) {
      setUpdates(JSON.parse(saved));
    } else {
      setUpdates(DEFAULT_UPDATES);
    }
  }, []);

  const addUpdate = (newUpdate: DevUpdate) => {
    const updated = [newUpdate, ...updates];
    setUpdates(updated);
    localStorage.setItem("balsevenler_updates", JSON.stringify(updated));
  };

  const removeUpdate = (index: number) => {
    const updated = updates.filter((_, i) => i !== index);
    setUpdates(updated);
    localStorage.setItem("balsevenler_updates", JSON.stringify(updated));
  };

  return { updates, addUpdate, removeUpdate };
}
