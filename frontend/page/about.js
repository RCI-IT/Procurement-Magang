import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Tentang Kami</h1>
        <p>Ini adalah halaman tentang.</p>
      </main>
      <Footer />
    </div>
  );
}
