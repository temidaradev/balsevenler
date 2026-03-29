import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles } from "../../admin/actions";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allArticles = await getArticles();
  const articles = allArticles.filter(a => a.category === id);
  
  const categories: Record<string, { title: string, desc: string, icon: string, color: string }> = {
    "astrofizik": { title: "ASTROFİZİK", desc: "Evrenin ötesindeki karanlık maddeyi ve ışığı inceleyenlerin yolu.", icon: "🌌", color: "#00f0ff" },
    "uzay-madenciligi": { title: "UZAY MADENCİLİĞİ", desc: "Asteroitlerdeki nadir metalleri arayan kozmik madencilerin yolu.", icon: "⛏️", color: "#ffae00" },
    "uzay-tibbi": { title: "UZAY TIBBI", desc: "Sıfır yerçekiminde insan hayatını ve biyolojiyi koruyanların yolu.", icon: "🧬", color: "#4ade80" }
  };

  const category = categories[id];
  if (!category) {
    notFound();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020408",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      padding: "2rem",
      overflow: "hidden",
      fontFamily: "var(--font-inter)"
    }}>
      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 150 }, (_, i) => (
          <div key={`star-${i}`} style={{
            position: "absolute",
            left: `${((i * 13 + 7) * 17) % 100}%`, top: `${((i * 11 + 5) * 23) % 100}%`,
            width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
            background: "#fff", borderRadius: "50%",
            opacity: 0.1 + (i % 5) * 0.1,
            animation: `cat-twinkle ${3 + (i % 4)}s infinite ${(i%7)*0.5}s alternate`
          }} />
        ))}
      </div>

      {/* Header Bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2, 4, 8, 0.8)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${category.color}30`,
        width: "100%", padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)",
          fontSize: "0.8rem", textDecoration: "none", textTransform: "uppercase",
          transition: "color 0.3s"
        }}>
          <span>← DÜNYAYA DÖN</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem", filter: `drop-shadow(0 0 10px ${category.color})` }}>{category.icon}</span>
          <span style={{ fontFamily: "var(--font-display)", color: category.color, letterSpacing: "0.2em", fontSize: "0.8rem", textTransform: "uppercase" }}>
            {category.title} VERİTABANI
          </span>
        </div>
      </header>

      {/* Main Content Area optimized for long-form reading */}
      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: "800px", width: "100%", margin: "0 auto",
        padding: "4rem 1.5rem", flex: 1
      }}>
        {/* Category Intro */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h1 style={{
            fontFamily: "var(--font-outfit)", fontSize: "3rem", fontWeight: 800,
            letterSpacing: "0.1em", color: "#fff", marginBottom: "1rem"
          }}>
            {category.title}
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: category.color, opacity: 0.8, lineHeight: 1.6 }}>
            {category.desc}
          </p>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)",
            padding: "4rem", borderRadius: "16px", textAlign: "center", marginTop: "2rem"
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
              // BU KATEGORİDE HENÜZ KAYIT BULUNAMADI //
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
            {articles.map((article, idx) => (
              <article key={idx} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-2rem", top: "10px", bottom: "10px", width: "2px", background: `linear-gradient(to bottom, transparent, ${category.color}40, transparent)` }} />
                <time style={{
                  display: "block", fontFamily: "var(--font-display)", fontSize: "0.75rem",
                  letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: "1rem"
                }}>
                  📡 KAYIT: {article.date}
                </time>
                <h2 style={{
                  fontFamily: "var(--font-outfit)", fontSize: "2rem",
                  lineHeight: 1.3, color: "#fff", marginBottom: "2rem"
                }}>
                  {article.title}
                </h2>
                <div style={{
                  fontFamily: "var(--font-inter)", fontSize: "1.1rem",
                  lineHeight: 1.9, color: "rgba(255,255,255,0.85)",
                  whiteSpace: "pre-wrap", textRendering: "optimizeLegibility"
                }}>
                  {article.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>


      <style>{`
        @keyframes cat-twinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
