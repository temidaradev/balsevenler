import Link from "next/link";
import ArticleList from "@/components/UpdatesList";

const team = [
  { name: "temidaradev" },
  { name: "Sami" },
  { name: "Yusuf" },
  { name: "Enes" },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section & Primary Intel */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '12rem 2rem 5rem 2rem',
        position: 'relative'
      }}>
        {/* Environment - Removed Glow as requested */}
        
        <div className="hazard-badge" style={{ marginBottom: '1.5rem' }}>BKZS Durumu: Aktif Gözlem</div>
        <h1 className="glitch" data-text="BALSEVENLER" style={{ fontSize: 'clamp(3.5rem, 12vw, 8.5rem)', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', letterSpacing: '0.15em', color: '#fff' }}>
          BALSEVENLER
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '850px', marginBottom: '4rem', opacity: 0.8, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1.6 }}>
          Uydu Verisi Entegrasyonu ile Afet Yönetimi: <br />
          Yapay Zeka Destekli Görüntü Analizi ve Kurtarma Ekipleri İçin Güvenli Rota Planlama Sistemi.
        </p>

        {/* Global Control Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '8rem' }}>
          <button className="btn-primary">Rota Telemetrisi</button>
          <Link href="/admin">
            <button className="glass-card" style={{ padding: '1rem 3rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--accent-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              BKZS GÖREV MERKEZİ
            </button>
          </Link>
        </div>

        {/* Primary Broadcast Feed (Articles) */}
        <div className="container" style={{ width: '100%', textAlign: 'left', borderTop: '1px solid var(--card-border)', paddingTop: '6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5em', color: 'var(--accent)', fontWeight: 800 }}>ANALİZ RAPORLARI VE SAHA VERİLERİ</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--card-border), transparent)' }}></div>
          </div>
          <ArticleList />
        </div>
      </section>

      {/* Crew Section - Names Only */}
      <section className="container" style={{ paddingBottom: '12rem', borderTop: '1px solid var(--card-border)', paddingTop: '10rem' }}>
        <h2 className="seismic-border" style={{ fontSize: '2rem', marginBottom: '5rem', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
          Sistem Operatörleri
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem' 
        }}>
          {team.map((member) => (
            <div key={member.name} className="glass-card" style={{ borderLeft: '3px solid var(--accent)', padding: '1.5rem' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.5rem', textTransform: 'uppercase', margin: 0 }}>{member.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '8rem', 
        borderTop: '1px solid var(--card-border)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,174,0,0.02) 100%)'
      }}>
        © 2024 Balsevenler | Uydu Entegrasyonu ve BKZS Analiz Grubu.
      </footer>
    </main>
  );
}
