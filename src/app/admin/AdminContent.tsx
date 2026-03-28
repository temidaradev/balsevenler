"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { verifyPassword, getArticles, addArticle, deleteArticle, DevUpdate } from "./actions";

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [updates, setUpdates] = useState<DevUpdate[]>([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });

  // Load from server on mount
  useEffect(() => {
    getArticles().then(setUpdates);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyPassword(password);
    if (isValid) {
      setIsLogged(true);
    } else {
      alert("Hatalı Erişim Anahtarı!");
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const update: DevUpdate = {
      date: new Date().toISOString().split("T")[0],
      title: newArticle.title,
      content: newArticle.content,
    };
    await addArticle(update);
    const refreshed = await getArticles();
    setUpdates(refreshed);
    setNewArticle({ title: "", content: "" });
  };

  const handleDelete = async (index: number) => {
    await deleteArticle(index);
    const refreshed = await getArticles();
    setUpdates(refreshed);
  };

  if (!isLogged) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
        <div className="glass-card" style={{ maxWidth: "450px", width: "100%", padding: "3rem", borderTop: "4px solid var(--accent)" }}>
          <h2 style={{ marginBottom: "2rem", textAlign: "center", fontFamily: "var(--font-outfit)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Güvenli Bağlantı</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Yetkilendirme Gerekli</div>
            <input 
              type="password" 
              placeholder="Erişim Anahtarını Girin..." 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>Bağlantıyı Başlat</button>
            <Link href="/" style={{ textAlign: "center", fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>İptal Et ve Gözlemevine Dön</Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "4rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
        <h1 className="title-glow" style={{ fontSize: "2rem", fontFamily: "var(--font-outfit)", letterSpacing: "0.2em" }}>Editoryal Kontrol</h1>
        <button onClick={() => setIsLogged(false)} className="btn-primary" style={{ borderColor: "var(--hazard)", color: "var(--hazard)" }}>Oturumu Sonlandır</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        {/* ADD FORM */}
        <div className="glass-card" style={{ borderTop: "2px solid var(--accent)" }}>
          <h2 style={{ marginBottom: "2rem", textTransform: "uppercase", fontSize: "1.2rem", letterSpacing: "0.1em" }}>Saha Raporu Taslağı</h2>
          <form onSubmit={handleAddArticle} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase" }}>Makale Başlığı</label>
              <input 
                className="input-field" 
                placeholder="Örn: Sektör 7'de Sismik Rezonans"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase" }}>Taslak İçeriği</label>
              <textarea 
                className="input-field" 
                style={{ resize: "none", height: "300px" }}
                placeholder="Makalenin tamamını buraya yazın..."
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Yayını Gerçekleştir</button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ marginBottom: "1rem", textTransform: "uppercase", fontSize: "1.2rem", letterSpacing: "0.1em" }}>Yayınlanan Raporlar</h2>
          {updates.length === 0 && <p style={{ color: "var(--text-dim)" }}>Henüz makale iletilmedi.</p>}
          {[...updates]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((upd, i) => (
            <div key={i} className="glass-card" style={{ padding: "1.5rem", position: "relative" }}>
              <div style={{ color: "var(--accent)", fontSize: "0.6rem", marginBottom: "0.5rem" }}>RAPOR #{i+1} | {upd.date}</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{upd.title}</h3>
              <p style={{ fontSize: "0.9rem" }}>{upd.content.substring(0, 80)}...</p>
              <button 
                onClick={() => handleDelete(updates.indexOf(upd))}
                style={{ 
                  position: "absolute", 
                  top: "1.5rem", 
                  right: "1.5rem", 
                  background: "transparent", 
                  border: "none", 
                  color: "var(--hazard)", 
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  fontWeight: 800
                }}
              >
                Geri Çek
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
