import Footer from "@/components/Footer";
import Image from "next/image";
import headerStyles from "../classes/page.module.css"; 
import styles from "./page.module.css";

export const metadata = {
  title: "Trainers | ExtraLife GYM",
  description: "Meet our expert trainers and find the right coach for your fitness journey.",
};

const trainers = [
  { name: "John Doe", specialty: "Head Coach & Strength", bio: "10+ years of experience transforming lives through heavy lifting.", image: "/trainer-john.png" },
  { name: "Jane Smith", specialty: "Yoga & Mobility", bio: "Former gymnast helping you find balance, flexibility, and inner peace.", image: "/trainer-jane.png" },
  { name: "Mike Johnson", specialty: "HIIT & Cardio", bio: "High energy, high intensity. Mike will push you to your absolute limits.", image: "/trainer-mike.png" },
];

export default function TrainersPage() {
  return (
    <main>
      <div className={headerStyles.header}>
        <div className="container">
          <h1>Meet The <span>Trainers</span></h1>
          <p>The experts behind your transformation.</p>
        </div>
      </div>
      
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <div className={styles.trainersGrid}>
          {trainers.map((trainer, index) => (
            <div key={index} className={`glass ${styles.trainerCard}`}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageInner}>
                  <Image 
                    src={trainer.image} 
                    alt={`${trainer.name} - ${trainer.specialty}`} 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <h3 className={styles.trainerName}>{trainer.name}</h3>
              <p className={styles.trainerSpecialty}>{trainer.specialty}</p>
              <p className={styles.trainerBio}>{trainer.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
