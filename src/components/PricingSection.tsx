import styles from "./PricingSection.module.css";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    features: ["Access to gym equipment", "Locker room access", "1 Group class/month"],
    isPopular: false
  },
  {
    name: "Pro",
    price: "$59",
    period: "/month",
    features: ["Unlimited gym access", "All group classes", "Sauna & Spa", "1 PT Session/month"],
    isPopular: true
  },
  {
    name: "Elite",
    price: "$99",
    period: "/month",
    features: ["24/7 Unlimited Access", "Priority class booking", "Unlimited PT Sessions", "Nutrition Plan"],
    isPopular: false
  }
];

export default function PricingSection() {
  return (
    <section className={styles.pricingSection}>
      <div className="container">
        <h2 className="section-title">MEMBERSHIP <span>PLANS</span></h2>
        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div key={index} className={`glass ${styles.card} ${plan.isPopular ? styles.popular : ""}`}>
              {plan.isPopular && <div className={styles.badge}>Most Popular</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>
              <ul className={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className={plan.isPopular ? "btn-primary" : "btn-secondary"}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
