import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>SkyFish Optimizer • Built for Hypixel SkyBlock players with React 18 & CSS Modules.</p>
      <p className={styles.subtext}>Not affiliated with Hypixel Inc., Mojang AB, or Microsoft.</p>
    </footer>
  );
}
