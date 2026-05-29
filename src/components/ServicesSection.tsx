import styles from "./ServicesSection.module.css";

const services = [
  {
    id: 1,
    title: "Strength Training",
    description: "Build muscle and increase your power with our state-of-the-art free weights and resistance machines.",
    icon: "💪"
  },
  {
    id: 2,
    title: "High-Intensity Interval Training",
    description: "Burn fat fast and improve your cardiovascular health in our high-energy HIIT classes.",
    icon: "🔥"
  },
  {
    id: 3,
    title: "Yoga & Flexibility",
    description: "Enhance your mobility and find your zen in our dedicated, dimly lit yoga studio.",
    icon: "🧘"
  },
  {
    id: 4,
    title: "Personal Training",
    description: "Get 1-on-1 guidance from our expert coaches tailored strictly to your personal goals.",
    icon: "🏆"
  }
];

export default function ServicesSection() {
  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <h2 className="section-title">OUR <span>SERVICES</span></h2>
        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service.id} className={`glass ${styles.card}`}>
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
