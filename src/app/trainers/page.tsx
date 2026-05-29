import Footer from "@/components/Footer";
import styles from "../classes/page.module.css"; 

export const metadata = {
  title: "Trainers | ExtraLife GYM",
  description: "Meet our expert trainers and find the right coach for your fitness journey.",
};

const trainers = [
  { name: "John Doe", specialty: "Head Coach & Strength", bio: "10+ years of experience transforming lives through heavy lifting." },
  { name: "Jane Smith", specialty: "Yoga & Mobility", bio: "Former gymnast helping you find balance, flexibility, and inner peace." },
  { name: "Mike Johnson", specialty: "HIIT & Cardio", bio: "High energy, high intensity. Mike will push you to your absolute limits." },
];

export default function TrainersPage() {
  return (
    <main>
      <div className={styles.header}>
        <div className="container">
          <h1>Meet The <span>Trainers</span></h1>
          <p>The experts behind your transformation.</p>
        </div>
      </div>
      
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
          {trainers.map((trainer, index) => (
            <div key={index} className="glass" style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255, 0, 60, 0.2)", margin: "0 auto 2rem", border: "2px solid var(--accent-color)" }}></div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{trainer.name}</h3>
              <p style={{ color: "var(--accent-color)", fontWeight: "600", marginBottom: "1rem" }}>{trainer.specialty}</p>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{trainer.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
