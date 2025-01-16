import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1>Selamat Datang di Next.js</h1>
        <p>Ini adalah halaman utama sederhana.</p>
      </main>
      <Footer />
    </div>
  );
}
