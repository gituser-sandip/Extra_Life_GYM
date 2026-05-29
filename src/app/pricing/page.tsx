import Footer from "@/components/Footer";
import styles from "../classes/page.module.css"; // Reuse header styles
import PricingSection from "@/components/PricingSection";

export const metadata = {
  title: "Pricing | ExtraLife GYM",
  description: "Choose the membership plan that fits your goals and schedule.",
};

export default function PricingPage() {
  return (
    <main>
      <div className={styles.header}>
        <div className="container">
          <h1>Membership <span>Pricing</span></h1>
          <p>Invest in yourself with our flexible plans.</p>
        </div>
      </div>
      <PricingSection />
      <Footer />
    </main>
  );
}
