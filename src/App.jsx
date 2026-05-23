import React, { useEffect } from 'react';

function App() {


  useEffect(() => {
    // Reveal on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-parallax-wrapper">
          {/* Desktop background image */}
          <img src="/images/hero.webp" alt="Hero background" className="hero-bg desktop-only" fetchpriority="high" />
          {/* Mobile background image */}
          <img src="/images/mobileHero.webp" alt="Mobile Hero background" className="hero-bg mobile-only hero-bg-mobile" fetchpriority="high" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Happy Birthday Saumi</h1>
          <p className="hero-subtext">HBD to the most special person, stay blessed, keep being fun, caring, grateful to have you.</p>
        </div>
      </section>

      {/* As Seen On Section */}
      <section className="as-seen-on reveal">
        <div className="as-seen-header">
          <div className="as-seen-line"></div>
          <p className="as-seen-title">As Seen on</p>
          <div className="as-seen-line"></div>
        </div>
        <div className="logos-group">
          <img src="/images/flopshop.webp" alt="Flopshop" className="as-seen-img" loading="lazy" decoding="async" />
          <img src="/images/guts.webp" alt="Guts" className="as-seen-img" loading="lazy" decoding="async" />
          <img src="/images/pattepack.webp" alt="Pattepack" className="as-seen-img" loading="lazy" decoding="async" />
          <img src="/images/timepass.webp" alt="Timepass" className="as-seen-img" loading="lazy" decoding="async" />
          <img src="/images/windup.webp" alt="Windup" className="as-seen-img" loading="lazy" decoding="async" />
          <img src="/images/zipit.webp" alt="Zipit" className="as-seen-img" loading="lazy" decoding="async" />
        </div>
      </section>

      {/* Dear Saumi Section */}
      <section className="dear-saumi reveal">
        <div className="dear-saumi-text">
          <p className="dear-saumi-heading">Dear Saumi,</p>
          <p>
            You're the most good looking, beautiful person I know, everything about you feels like art.
          </p>
          <p>
            Three months with you in Delhi were the best time of my life, and I keep going back to them more than I admit. The way you can be so fun and crazy in one moment, and so strong and focused the next, it honestly inspires me. Watching you chase your dreams in New York, even when things could be easier, makes me respect you even more.
          </p>
          <p>
            Even the simplest things with you, just being on FaceTime while you cook, sleep, acting, style, your presence alone feels like a blessing.
          </p>
          <p>
            I love you, grateful for you, just the way you are.
          </p>
          <p className="ds-thanks">
            Thanks for being you.
          </p>
        </div>
        <div className="dear-saumi-images">
          <img src="/images/dearSaumi1.svg" alt="Saumi 1" className="ds-img ds-img-1" loading="lazy" decoding="async" />
          <img src="/images/dearSaumi2.svg" alt="Saumi 2" className="ds-img ds-img-2" loading="lazy" decoding="async" />
          <img src="/images/dearSaumi3.svg" alt="Saumi 3" className="ds-img ds-img-3" loading="lazy" decoding="async" />
          <img src="/images/dearSaumi4.svg" alt="Saumi 4" className="ds-img ds-img-4" loading="lazy" decoding="async" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials reveal">
        <h2 className="section-title">Testimonials</h2>
        <div className="testimonials-grid">
          <div className="test-card">
            <img src="/images/testimonial1.webp" alt="Simran Jain" loading="lazy" decoding="async" />
            <p className="test-quote">“Isko kaise jhel lete ho” is my best dialogue since birth. Jk chote, Watching you grow into a b’ful, independent, person is the best feeling. You’ll always be my baby, my soul</p>
          </div>
          <div className="test-card">
            <img src="/images/testimonial2.webp" alt="Mammi Pappa" loading="lazy" decoding="async" />
            <p className="test-quote">My late night tv partner, darling daughter, sunny <span className="basic-amp">&</span> biggest rondu, proud of you <span className="basic-amp">&</span> LY</p>
          </div>
          <div className="test-card">
            <img src="/images/testimonial3.webp" alt="Apurv Budhraja" loading="lazy" decoding="async" />
            <p className="test-quote">Khud kuch kaam karle Thanks for lifetime memories, and now for some space, best sister</p>
          </div>
        </div>
      </section>

      {/* Media Recognition Section */}
      <section className="media-recognition reveal">
        <h2 className="section-title">Media Recognition</h2>
        <div className="media-body">
          <p>
            222lab.in founder Saumya Jain has been featured across media for her sharp UI/UX, world class taste <span className="basic-amp">&</span> harkate
          </p>
          <p>
            She runs a full-time job, advisor to PeakPals, loves hard, hypes her people, sips matcha <span className="basic-amp">&</span> overthinks everything<br />(I'm going insane)
          </p>
          <p>
            But somehow, is a huge inspiration.
          </p>
        </div>
      </section>

      {/* Magazine Covers Section */}
      <section className="magazines reveal">
        <div className="magazines-grid">
          <div className="mag-item">
            <img src="/images/media1.webp" alt="The Chicken Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media2.webp" alt="R. Republic Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media3.webp" alt="Femina Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media4.webp" alt="Fortune Time Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media5.webp" alt="Vogue Edition Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media6.webp" alt="GQ Style Magazine" loading="lazy" decoding="async" />
          </div>
          <div className="mag-item">
            <img src="/images/media8.webp" alt="Time Spotlight Magazine" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section reveal">
        <div className="footer-inner">
          <div className="footer-left">
            <img src="/images/logo.webp" alt="SAUMPALS Logo" className="footer-logo" loading="lazy" decoding="async" />
            <div className="footer-copyright-block">
              <p className="footer-copyright"><span className="footer-underline">222lab.in</span> 2026</p>
              <p className="footer-copyright">Copyright @saumyajain.design</p>
              <p className="footer-copyright">Anashirinbrainrot pvt ltd.</p>
            </div>
          </div>
          <div className="footer-right">
            <p className="footer-tagline">No returns. No exchanges. You're stuck with me.</p>
            <p className="footer-secondary">Started with facetime, and rest is history</p>
            <p className="footer-credits">Built with alot of love <span className="basic-amp">&</span> efforts by Team PeakPals,<br />hope you love it, God bless!</p>
          </div>
        </div>
        <div className="footer-divider"></div>
      </footer>
    </div>
  );
}

export default App;
