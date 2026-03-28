"use client";

import { useDevUpdates } from "@/lib/data";

export default function ArticleList() {
  const { updates } = useDevUpdates();

  if (!updates || updates.length === 0) {
    return <p style={{ color: "var(--text-dim)", fontStyle: "italic" }}>Saha raporlarının iletilmesi bekleniyor...</p>;
  }

  // Sort by date ascending (oldest first)
  const articles = [...updates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
      {articles.map((article, i) => (
        <article key={i} className="glass-card" style={{ 
          padding: "3rem", 
          borderLeft: "4px solid var(--accent)",
          background: "linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(1, 4, 9, 0.95) 100%)",
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1.5rem",
            fontSize: "0.75rem",
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.2em"
          }}>
            <span>Yörünge Tarihi: {article.date}</span>
            <span style={{ color: "var(--hazard)" }}>// Saha Raporu {i + 1}</span>
          </div>
          <h3 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "1.5rem", 
            lineHeight: "1.1",
            fontFamily: "var(--font-outfit)",
            color: "#fff",
            textTransform: "uppercase"
          }}>
            {article.title}
          </h3>
          <div style={{ 
            lineHeight: "1.8", 
            color: "rgba(255,255,255,0.85)", 
            fontSize: "1.1rem",
            whiteSpace: "pre-wrap"
          }}>
            {article.content}
          </div>
          <div style={{ 
            marginTop: "2.5rem", 
            paddingTop: "1.5rem", 
            borderTop: "1px solid var(--card-border)",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <button style={{ 
              background: "transparent", 
              border: "none", 
              color: "var(--accent)", 
              textTransform: "uppercase", 
              fontSize: "0.8rem", 
              letterSpacing: "0.1em",
              cursor: "pointer",
              fontWeight: 700
            }}>
              Sinyal Senkronizasyonu Tamamlandı
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
