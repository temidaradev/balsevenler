"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { verifyPassword, getArticles, addArticle, editArticle, deleteArticle, reorderArticles, DevUpdate, getPhaseContent, updatePhaseContent, PhaseContent, CustomPhaseItem } from "./actions";

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 10000,
      padding: "1rem 2rem", borderRadius: "12px",
      background: type === "success"
        ? "linear-gradient(135deg, rgba(0,240,100,0.15), rgba(0,240,255,0.1))"
        : "linear-gradient(135deg, rgba(255,60,60,0.15), rgba(255,100,60,0.1))",
      border: `1px solid ${type === "success" ? "rgba(0,240,100,0.3)" : "rgba(255,60,60,0.3)"}`,
      backdropFilter: "blur(20px)",
      color: type === "success" ? "#4ade80" : "#ff6b6b",
      fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.05em",
      boxShadow: `0 8px 32px ${type === "success" ? "rgba(0,240,100,0.1)" : "rgba(255,60,60,0.1)"}`,
      animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      {type === "success" ? "✓" : "✗"} {message}
    </div>
  );
}

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [updates, setUpdates] = useState<DevUpdate[]>([]);
  const [phases, setPhases] = useState<PhaseContent>({
    hyperspace: { title: "", text: "" },
    debris: { text: "" },
    tankDetach: { text1: "", text2: "", text3: "" },
    nebula: { star1: "", star2: "" },
    surface: { text: "" },
    customItems: []
  });
  const [activeTab, setActiveTab] = useState<"reports" | "phases">("reports");
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", date: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getArticles().then(setUpdates);
    getPhaseContent().then(setPhases);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyPassword(password);
    if (isValid) {
      setIsLogged(true);
      showToast("Bağlantı başarılı");
    } else {
      showToast("Hatalı Erişim Anahtarı!", "error");
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const update: DevUpdate = {
      date: new Date().toISOString().split("T")[0],
      title: newArticle.title,
      content: newArticle.content,
    };
    await addArticle(update);
    const refreshed = await getArticles();
    setUpdates(refreshed);
    setNewArticle({ title: "", content: "" });
    setIsSubmitting(false);
    showToast("Rapor başarıyla yayınlandı");
  };

  const handleStartEdit = (index: number) => {
    const article = updates[index];
    setEditingIndex(index);
    setEditForm({ title: article.title, content: article.content, date: article.date });
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    setIsSubmitting(true);
    await editArticle(editingIndex, {
      date: editForm.date,
      title: editForm.title,
      content: editForm.content,
    });
    const refreshed = await getArticles();
    setUpdates(refreshed);
    setEditingIndex(null);
    setIsSubmitting(false);
    showToast("Rapor güncellendi");
  };

  const handleDelete = async (index: number) => {
    await deleteArticle(index);
    const refreshed = await getArticles();
    setUpdates(refreshed);
    setConfirmDelete(null);
    showToast("Rapor geri çekildi");
  };

  const handleMove = async (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= updates.length) return;
    await reorderArticles(fromIndex, toIndex);
    const refreshed = await getArticles();
    setUpdates(refreshed);
    showToast("Sıralama güncellendi");
  };

  const handleSavePhases = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updatePhaseContent(phases);
    setIsSubmitting(false);
    showToast("Sahne içerikleri başarıyla güncellendi!");
  };

  const handleAddCustomItem = () => {
    setPhases(prev => ({
      ...prev,
      customItems: [
        ...(prev.customItems || []),
        { id: Math.random().toString(36).substring(7), title: "", text: "", startScroll: 0.5, endScroll: 0.6 }
      ]
    }));
  };

  const handleUpdateCustomItem = (index: number, field: keyof CustomPhaseItem, value: string | number) => {
    setPhases(prev => {
      const items = [...(prev.customItems || [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, customItems: items };
    });
  };

  const handleDeleteCustomItem = (index: number) => {
    setPhases(prev => {
      const items = [...(prev.customItems || [])];
      items.splice(index, 1);
      return { ...prev, customItems: items };
    });
  };

  // Login Screen
  if (!isLogged) {
    return (
      <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div style={{
          height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
          padding: "1rem", position: "relative", overflow: "hidden",
        }}>
          {/* Animated background */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,174,0,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,240,255,0.04) 0%, transparent 60%)" }} />

          {/* Floating particles */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`p-${i}`} style={{
              position: "absolute",
              left: `${((i * 17 + 5) * 13) % 100}%`,
              top: `${((i * 23 + 7) * 11) % 100}%`,
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              background: "#fff",
              borderRadius: "50%",
              opacity: 0.15 + (i % 5) * 0.05,
              animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite ${(i % 7) * 0.5}s`,
            }} />
          ))}

          <div style={{
            maxWidth: "480px", width: "100%", padding: "3rem",
            background: "rgba(8, 12, 20, 0.85)",
            border: "1px solid rgba(255,174,0,0.15)",
            borderRadius: "20px",
            backdropFilter: "blur(30px)",
            boxShadow: "0 0 60px rgba(255,174,0,0.05), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative", overflow: "hidden", zIndex: 1,
          }}>
            {/* Top gradient line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />

            {/* Lock icon */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                width: "60px", height: "60px", margin: "0 auto 1.5rem",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,174,0,0.08)", border: "1px solid rgba(255,174,0,0.2)",
                fontSize: "1.5rem",
              }}>
                🔐
              </div>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "0.9rem",
                letterSpacing: "0.4em", textTransform: "uppercase",
                background: "linear-gradient(135deg, #fff, var(--accent))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Güvenli Bağlantı
              </h2>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem", letterSpacing: "0.15em" }}>
                EDİTÖRYAL KONTROL PANELİ
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "var(--font-display)" }}>
                  Erişim Anahtarı
                </label>
                <input
                  type="password"
                  placeholder="Anahtarınızı girin..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "1rem 1.2rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px", color: "#fff",
                    fontFamily: "var(--font-mono)", fontSize: "0.9rem",
                    outline: "none", transition: "all 0.3s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 20px rgba(255,174,0,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "1rem",
                background: "linear-gradient(135deg, rgba(255,174,0,0.15), rgba(255,174,0,0.08))",
                border: "1px solid rgba(255,174,0,0.3)",
                borderRadius: "10px", color: "var(--accent)",
                fontFamily: "var(--font-display)", fontSize: "0.75rem",
                letterSpacing: "0.25em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.3s",
              }}
                onMouseOver={e => { (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(255,174,0,0.25), rgba(255,174,0,0.15))"; (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(255,174,0,0.15)"; }}
                onMouseOut={e => { (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(255,174,0,0.15), rgba(255,174,0,0.08))"; (e.target as HTMLElement).style.boxShadow = "none"; }}
              >
                Bağlantıyı Başlat
              </button>
              <Link href="/" style={{
                textAlign: "center", fontSize: "0.7rem", opacity: 0.4,
                textTransform: "uppercase", letterSpacing: "0.1em",
                color: "#fff", textDecoration: "none", transition: "opacity 0.3s",
              }}>
                ← Ana Sayfaya Dön
              </Link>
            </form>
          </div>
        </div>
      </>
    );
  }

  // Main Dashboard
  const sortedUpdates = [...updates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        minHeight: "100vh", padding: "2rem",
        background: "radial-gradient(ellipse at 20% 10%, rgba(255,174,0,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(0,240,255,0.02) 0%, transparent 50%)",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Header */}
          <header style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "3rem", paddingBottom: "2rem",
            borderBottom: "1px solid rgba(255,174,0,0.1)",
          }}>
            <div>
              <h1 style={{
                fontSize: "1.6rem", fontFamily: "var(--font-display)",
                letterSpacing: "0.3em", textTransform: "uppercase",
                background: "linear-gradient(135deg, #fff, var(--accent))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Editoryal Kontrol
              </h1>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.3rem", letterSpacing: "0.1em" }}>
                Saha raporlarını yönet · {new Date().toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Link href="/" style={{
                padding: "0.7rem 1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-display)", fontSize: "0.65rem",
                letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase",
                transition: "all 0.3s",
              }}>
                👁 Ön İzleme
              </Link>
              <button onClick={() => setIsLogged(false)} style={{
                padding: "0.7rem 1.5rem",
                background: "rgba(255,60,60,0.08)",
                border: "1px solid rgba(255,60,60,0.2)",
                borderRadius: "8px", color: "#ff6b6b",
                fontFamily: "var(--font-display)", fontSize: "0.65rem",
                letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase",
                transition: "all 0.3s",
              }}>
                Çıkış
              </button>
            </div>
          </header>

          {/* Stats Bar */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem",
            marginBottom: "3rem",
          }}>
            {[
              { label: "TOPLAM RAPOR", value: updates.length.toString(), icon: "📄", color: "#ffae00" },
              { label: "SON GÜNCELLEME", value: updates.length > 0 ? updates[0]?.date : "—", icon: "📅", color: "#00f0ff" },
              { label: "TOPLAM KELİME", value: updates.reduce((acc, u) => acc + u.content.split(" ").length, 0).toString(), icon: "📝", color: "#a78bfa" },
              { label: "SİSTEM DURUMU", value: "AKTİF", icon: "🟢", color: "#4ade80" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: "1.5rem",
                background: "rgba(8, 12, 20, 0.6)",
                border: `1px solid ${stat.color}15`,
                borderRadius: "14px",
                backdropFilter: "blur(10px)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)` }} />
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  {stat.icon} {stat.label}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <button onClick={() => setActiveTab("reports")} style={{
              padding: "1rem 2rem", background: "none", border: "none",
              borderBottom: activeTab === "reports" ? "2px solid var(--accent)" : "2px solid transparent",
              color: activeTab === "reports" ? "var(--accent)" : "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-display)", letterSpacing: "0.2em", textTransform: "uppercase",
              fontSize: "0.8rem", cursor: "pointer", transition: "all 0.3s"
            }}>Saha Raporları</button>
            <button onClick={() => setActiveTab("phases")} style={{
              padding: "1rem 2rem", background: "none", border: "none",
              borderBottom: activeTab === "phases" ? "2px solid var(--accent2)" : "2px solid transparent",
              color: activeTab === "phases" ? "var(--accent2)" : "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-display)", letterSpacing: "0.2em", textTransform: "uppercase",
              fontSize: "0.8rem", cursor: "pointer", transition: "all 0.3s"
            }}>Sahne Kaydırma Metinleri</button>
          </div>

          {activeTab === "reports" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

            {/* ADD FORM */}
            <div style={{
              padding: "2.5rem",
              background: "rgba(8, 12, 20, 0.7)",
              border: "1px solid rgba(255,174,0,0.1)",
              borderRadius: "16px",
              backdropFilter: "blur(15px)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />

              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "0.8rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "var(--accent)", marginBottom: "2rem",
              }}>
                ✦ Yeni Saha Raporu
              </h2>

              <form onSubmit={handleAddArticle} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "var(--font-display)" }}>
                    Başlık
                  </label>
                  <input
                    placeholder="Örn: Sektör 7'de Sismik Rezonans"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                    style={{
                      width: "100%", padding: "0.9rem 1.2rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px", color: "#fff",
                      fontFamily: "var(--font-mono)", fontSize: "0.85rem",
                      outline: "none", transition: "all 0.3s",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,174,0,0.3)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <label style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "var(--font-display)" }}>
                      İçerik
                    </label>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-mono)" }}>
                      {newArticle.content.length} karakter
                    </span>
                  </div>
                  <textarea
                    placeholder="Makalenin tamamını buraya yazın..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    required
                    style={{
                      width: "100%", height: "280px", resize: "none",
                      padding: "1rem 1.2rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px", color: "#fff",
                      fontFamily: "var(--font-mono)", fontSize: "0.85rem",
                      lineHeight: 1.8, outline: "none", transition: "all 0.3s",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,174,0,0.3)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} style={{
                  padding: "1rem",
                  background: isSubmitting
                    ? "rgba(255,174,0,0.05)"
                    : "linear-gradient(135deg, rgba(255,174,0,0.12), rgba(255,174,0,0.06))",
                  border: "1px solid rgba(255,174,0,0.25)",
                  borderRadius: "10px", color: "var(--accent)",
                  fontFamily: "var(--font-display)", fontSize: "0.7rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  cursor: isSubmitting ? "wait" : "pointer", transition: "all 0.3s",
                  opacity: isSubmitting ? 0.5 : 1,
                }}>
                  {isSubmitting ? "Yayınlanıyor..." : "🚀 Yayını Gerçekleştir"}
                </button>
              </form>
            </div>

            {/* ARTICLES LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: "0.8rem",
                  letterSpacing: "0.3em", textTransform: "uppercase",
                  color: "var(--accent2)",
                }}>
                  ✦ Yayınlanan Raporlar
                </h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
                  {updates.length} kayıt
                </span>
              </div>

              {updates.length === 0 && (
                <div style={{
                  padding: "3rem", textAlign: "center",
                  background: "rgba(8, 12, 20, 0.5)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                    Henüz rapor iletilmedi
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", marginTop: "0.5rem" }}>
                    İlk raporunuzu soldaki formdan oluşturun
                  </p>
                </div>
              )}

              {sortedUpdates.map((upd, sortedIndex) => {
                const realIndex = updates.indexOf(upd);
                const isEditing = editingIndex === realIndex;

                return (
                  <div key={sortedIndex} style={{
                    padding: "1.8rem",
                    background: isEditing
                      ? "rgba(255,174,0,0.05)"
                      : "rgba(8, 12, 20, 0.6)",
                    border: `1px solid ${isEditing ? "rgba(255,174,0,0.2)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "14px",
                    backdropFilter: "blur(10px)",
                    position: "relative", overflow: "hidden",
                    transition: "all 0.3s",
                  }}>
                    {/* Gradient top line */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                      background: `linear-gradient(90deg, transparent, ${isEditing ? "var(--accent)" : "rgba(0,240,255,0.3)"}, transparent)`,
                    }} />

                    {isEditing ? (
                      // Edit Mode
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          style={{
                            width: "100%", padding: "0.8rem",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,174,0,0.2)",
                            borderRadius: "6px", color: "#fff",
                            fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none",
                          }}
                        />
                        <textarea
                          value={editForm.content}
                          onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                          style={{
                            width: "100%", height: "150px", resize: "vertical",
                            padding: "0.8rem",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,174,0,0.2)",
                            borderRadius: "6px", color: "#fff",
                            fontFamily: "var(--font-mono)", fontSize: "0.8rem",
                            lineHeight: 1.7, outline: "none",
                          }}
                        />
                        <div style={{ display: "flex", gap: "0.8rem" }}>
                          <button onClick={handleSaveEdit} disabled={isSubmitting} style={{
                            flex: 1, padding: "0.7rem",
                            background: "rgba(0,240,100,0.1)",
                            border: "1px solid rgba(0,240,100,0.3)",
                            borderRadius: "6px", color: "#4ade80",
                            fontFamily: "var(--font-display)", fontSize: "0.6rem",
                            letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase",
                          }}>
                            ✓ Kaydet
                          </button>
                          <button onClick={() => setEditingIndex(null)} style={{
                            flex: 1, padding: "0.7rem",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px", color: "rgba(255,255,255,0.5)",
                            fontFamily: "var(--font-display)", fontSize: "0.6rem",
                            letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase",
                          }}>
                            ✗ İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          marginBottom: "0.8rem",
                        }}>
                          <span style={{
                            fontFamily: "var(--font-display)", fontSize: "0.55rem",
                            letterSpacing: "0.2em", color: "var(--accent)",
                            textTransform: "uppercase",
                          }}>
                            📡 Rapor #{sortedIndex + 1} · {upd.date}
                          </span>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {/* Reorder buttons */}
                            <button
                              onClick={() => handleMove(realIndex, "up")}
                              disabled={realIndex === 0}
                              title="Yukarı Taşı"
                              style={{
                                width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px", color: "rgba(255,255,255,0.4)",
                                fontSize: "0.7rem", cursor: "pointer", transition: "all 0.2s",
                                opacity: realIndex === 0 ? 0.3 : 1,
                              }}
                            >↑</button>
                            <button
                              onClick={() => handleMove(realIndex, "down")}
                              disabled={realIndex === updates.length - 1}
                              title="Aşağı Taşı"
                              style={{
                                width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px", color: "rgba(255,255,255,0.4)",
                                fontSize: "0.7rem", cursor: "pointer", transition: "all 0.2s",
                                opacity: realIndex === updates.length - 1 ? 0.3 : 1,
                              }}
                            >↓</button>
                            {/* Edit button */}
                            <button
                              onClick={() => handleStartEdit(realIndex)}
                              title="Düzenle"
                              style={{
                                width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(0,240,255,0.05)", border: "1px solid rgba(0,240,255,0.15)",
                                borderRadius: "6px", color: "var(--accent2)",
                                fontSize: "0.7rem", cursor: "pointer", transition: "all 0.2s",
                              }}
                            >✎</button>
                            {/* Delete button */}
                            <button
                              onClick={() => confirmDelete === realIndex ? handleDelete(realIndex) : setConfirmDelete(realIndex)}
                              title={confirmDelete === realIndex ? "Silmeyi Onayla" : "Sil"}
                              style={{
                                width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                                background: confirmDelete === realIndex ? "rgba(255,60,60,0.15)" : "rgba(255,60,60,0.05)",
                                border: `1px solid ${confirmDelete === realIndex ? "rgba(255,60,60,0.4)" : "rgba(255,60,60,0.15)"}`,
                                borderRadius: "6px", color: "#ff6b6b",
                                fontSize: "0.7rem", cursor: "pointer", transition: "all 0.2s",
                              }}
                            >{confirmDelete === realIndex ? "!" : "×"}</button>
                          </div>
                        </div>
                        <h3 style={{
                          fontSize: "1rem", marginBottom: "0.5rem",
                          fontFamily: "var(--font-outfit)", color: "#fff",
                          lineHeight: 1.3,
                        }}>
                          {upd.title}
                        </h3>
                        <p style={{
                          fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
                          fontFamily: "var(--font-mono)", lineHeight: 1.6,
                          display: "-webkit-box", WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                        }}>
                          {upd.content}
                        </p>
                        {confirmDelete === realIndex && (
                          <p style={{
                            marginTop: "0.8rem", fontSize: "0.65rem",
                            color: "#ff6b6b", fontFamily: "var(--font-mono)",
                            letterSpacing: "0.1em",
                          }}>
                            ⚠ Silmek için tekrar tıklayın · <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}>İptal</button>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          ) : (
            <form onSubmit={handleSavePhases} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "1.5rem" }}>
                    🚀 Ay Rotası (Translunar Coasting)
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input value={phases.hyperspace.title} onChange={e => setPhases({ ...phases, hyperspace: { ...phases.hyperspace, title: e.target.value } })} placeholder="Başlık" style={{ width: "100%", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none" }} />
                    <textarea value={phases.hyperspace.text} onChange={e => setPhases({ ...phases, hyperspace: { ...phases.hyperspace, text: e.target.value } })} placeholder="Metin" style={{ width: "100%", height: "120px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                  </div>
                </div>

                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "1.5rem" }}>
                    🛰️ Uzay Çöplüğü Evresi
                  </h2>
                  <textarea value={phases.debris.text} onChange={e => setPhases({ ...phases, debris: { text: e.target.value } })} placeholder="Metin" style={{ width: "100%", height: "120px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                </div>
                
                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "1.5rem" }}>
                    🌕 Ay Yüzeyi Evresi
                  </h2>
                  <textarea value={phases.surface.text} onChange={e => setPhases({ ...phases, surface: { text: e.target.value } })} placeholder="Metin" style={{ width: "100%", height: "120px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", position: "relative" }}>
                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "1.5rem" }}>
                    ⛽ Tank Ayrılma Evresi
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <textarea value={phases.tankDetach.text1} onChange={e => setPhases({ ...phases, tankDetach: { ...phases.tankDetach, text1: e.target.value } })} placeholder="Tank 1" style={{ width: "100%", height: "80px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                    <textarea value={phases.tankDetach.text2} onChange={e => setPhases({ ...phases, tankDetach: { ...phases.tankDetach, text2: e.target.value } })} placeholder="Tank 2" style={{ width: "100%", height: "80px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                    <textarea value={phases.tankDetach.text3} onChange={e => setPhases({ ...phases, tankDetach: { ...phases.tankDetach, text3: e.target.value } })} placeholder="Tank 3" style={{ width: "100%", height: "80px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                  </div>
                </div>

                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)", marginBottom: "1.5rem" }}>
                    ✨ Yıldız / Nebula Gözlem Evresi
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <textarea value={phases.nebula.star1} onChange={e => setPhases({ ...phases, nebula: { ...phases.nebula, star1: e.target.value } })} placeholder="Yıldız 1 Bilgisi" style={{ width: "100%", height: "120px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                    <textarea value={phases.nebula.star2} onChange={e => setPhases({ ...phases, nebula: { ...phases.nebula, star2: e.target.value } })} placeholder="Yıldız 2 Bilgisi" style={{ width: "100%", height: "200px", resize: "none", padding: "0.9rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontFamily: "var(--font-mono)", outline: "none", lineHeight: 1.6 }} />
                  </div>
                </div>

                <div style={{ padding: "2.5rem", background: "rgba(8, 12, 20, 0.7)", border: "1px solid rgba(0,240,255,0.1)", borderRadius: "16px", backdropFilter: "blur(15px)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent2)" }}>
                      📌 Özel Eklentiler (Markers)
                    </h2>
                    <button type="button" onClick={handleAddCustomItem} style={{
                      padding: "0.5rem 1rem", background: "rgba(0,240,100,0.1)", border: "1px solid rgba(0,240,100,0.3)", borderRadius: "6px", color: "#4ade80",
                      fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase"
                    }}>+ Yeni Ekle</button>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {(phases.customItems || []).length === 0 && (
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                        Hiç özel eklenti yok. İstenen bir scroll yüzdesine yeni bir metin eklemek için tıklayın.
                      </p>
                    )}
                    {(phases.customItems || []).map((item, index) => (
                      <div key={item.id} style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", position: "relative" }}>
                        <button type="button" onClick={() => handleDeleteCustomItem(index)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", color: "#ff6b6b", width: "24px", height: "24px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.5)", marginBottom: "0.3rem" }}>Başlangıç Scroll (0-1)</label>
                            <input type="number" step="0.01" min="0" max="1" value={item.startScroll} onChange={e => handleUpdateCustomItem(index, 'startScroll', parseFloat(e.target.value))} style={{ width: "100%", padding: "0.7rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "var(--font-mono)" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.6rem", fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.5)", marginBottom: "0.3rem" }}>Bitiş Scroll (0-1)</label>
                            <input type="number" step="0.01" min="0" max="1" value={item.endScroll} onChange={e => handleUpdateCustomItem(index, 'endScroll', parseFloat(e.target.value))} style={{ width: "100%", padding: "0.7rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "var(--font-mono)" }} />
                          </div>
                        </div>
                        <input value={item.title} onChange={e => handleUpdateCustomItem(index, 'title', e.target.value)} placeholder="Eklenti Başlığı" style={{ width: "100%", padding: "0.7rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "var(--font-mono)", marginBottom: "1rem" }} />
                        <textarea value={item.text} onChange={e => handleUpdateCustomItem(index, 'text', e.target.value)} placeholder="Görünecek metin yazısı..." style={{ width: "100%", height: "80px", resize: "none", padding: "0.7rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "var(--font-mono)", lineHeight: 1.5 }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ position: "sticky", bottom: "2rem", zIndex: 100 }}>
                  <button type="submit" disabled={isSubmitting} style={{
                    width: "100%", padding: "1.5rem",
                    background: isSubmitting ? "rgba(0,240,255,0.05)" : "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.08))",
                    border: "1px solid rgba(0,240,255,0.3)", borderRadius: "10px", color: "var(--accent2)",
                    fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase",
                    cursor: isSubmitting ? "wait" : "pointer", transition: "all 0.3s",
                    opacity: isSubmitting ? 0.5 : 1, boxShadow: "0 0 30px rgba(0,240,255,0.15)"
                  }}
                    onMouseOver={e => { if(!isSubmitting) { (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(0,240,255,0.25), rgba(0,240,255,0.15))"; } }}
                    onMouseOut={e => { if(!isSubmitting) { (e.target as HTMLElement).style.background = "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.08))"; } }}
                  >
                    {isSubmitting ? "Güncelleniyor..." : "💾 Metinleri Kaydet"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
