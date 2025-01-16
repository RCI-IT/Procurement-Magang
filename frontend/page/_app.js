import '../styles/globals.css'; // Import CSS global

export default function MyApp({ component, pageProps }) {
  return <component {...pageProps} />;
}
import styles from '../styles/home.module.css';

export default function Home() {
  return <div className={styles.container}>Welcome</div>;
}
import styles from '../styles/home.module.css'; // Sesuaikan nama file CSS
export default function Footer() {
  return <footer className={styles.footer}>Footer Content</footer>;
}

