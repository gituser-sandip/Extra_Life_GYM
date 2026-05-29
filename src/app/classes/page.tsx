import Footer from "@/components/Footer";
import styles from "./page.module.css";
import ServicesSection from "@/components/ServicesSection";

export const metadata = {
  title: "Classes | ExtraLife GYM",
  description: "Discover our range of classes, from strength training to yoga and cardio.",
};

export default function ClassesPage() {
  return (
    <main>
      <div className={styles.header}>
        <div className="container">
          <h1>Our <span>Classes</span></h1>
          <p>Find the perfect class to push your limits.</p>
        </div>
      </div>
      <ServicesSection />
      <Footer />
    </main>
  );
}
