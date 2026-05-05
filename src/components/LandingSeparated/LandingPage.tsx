import './landing.css';
import PageEffects from './PageEffects';
import Nav from './Nav';
import Hero from './Hero';
import Marquee from './Marquee';
import TrustBar from './TrustBar';
import Categories from './Categories';
import Products from './Products';
import About from './About';
import Statement from './Statement';
import HScroll from './HScroll';
import Testimonials from './Testimonials';
import Process from './Process';
import FAQ from './FAQ';
import Newsletter from './Newsletter';
import Instagram from './Instagram';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="container">
      <PageEffects />
      <div id="cursor" className="cursor" />
      <div id="cursor-ring" className="cursor-ring" />
      <Nav />
      <Hero />
      <Marquee />
      <TrustBar />
      <Categories />
      <Products />
      <About />
      <Statement />
      <HScroll />
      <Testimonials />
      <Process />
      <FAQ />
      <Newsletter />
      <Instagram />
      <Footer />
    </div>
  );
}
