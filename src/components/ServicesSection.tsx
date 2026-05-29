import Image from "next/image";
import styles from "./ServicesSection.module.css";
import ScrollReveal from "./animations/ScrollReveal";
import StaggerReveal from "./animations/StaggerReveal";

const services = [
  {
    id: 1,
    title: "Strength Training",
    description: "Build muscle and increase your power with our state-of-the-art free weights and resistance machines.",
    image: "/service-strength.png"
  },
  {
    id: 2,
    title: "High-Intensity Interval Training",
    description: "Burn fat fast and improve your cardiovascular health in our high-energy HIIT classes.",
    image: "/service-hiit.png"
  },
  {
    id: 3,
    title: "Yoga & Flexibility",
    description: "Enhance your mobility and find your zen in our dedicated, dimly lit yoga studio.",
    image: "/service-yoga.png"
  },
  {
    id: 4,
    title: "Personal Training",
    description: "Get 1-on-1 guidance from our expert coaches tailored strictly to your personal goals.",
    image: "/service-pt.png"
  }
];

export default function ServicesSection() {
  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">OUR <span>SERVICES</span></h2>
        </ScrollReveal>
        <StaggerReveal className={styles.grid}>
          {services.map((service) => (
            <div key={service.id} className={`glass ${styles.card}`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
