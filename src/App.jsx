import React, { useEffect, useRef } from 'react';

function App() {
  const heroBgRef = useRef(null);
  const cursorRef = useRef(null);
  const scrollProgressRef = useRef(null);

  // Scroll: parallax + progress bar with dynamic will-change
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    let rafId = null;
    let idleTimer = null;
    let willChangeActive = false;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (!isMobile && heroBgRef.current) {
          if (!willChangeActive) {
            heroBgRef.current.style.willChange = 'transform';
            willChangeActive = true;
          }
          heroBgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
        }

        if (scrollProgressRef.current) {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgressRef.current.style.width = `${(scrollY / total) * 100}%`;
        }

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!isMobile && heroBgRef.current && willChangeActive) {
            heroBgRef.current.style.willChange = 'auto';
            willChangeActive = false;
          }
        }, 300);

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
    };
  }, []);

  // Reveal on scroll — unobserve after visible to save memory
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor — desktop/pointer devices only
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let cx = 0, cy = 0, mx = 0, my = 0, rafId;
    let entered = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!entered) {
        cursor.style.opacity = '1';
        entered = true;
      }
    };

    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.transform = `translate(${cx - 10}px, ${cy - 10}px)`;
      rafId = requestAnimationFrame(tick);
    };

    const addHover = () => cursor.classList.add('cursor-hover');
    const rmHover = () => cursor.classList.remove('cursor-hover');

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    const targets = document.querySelectorAll('.mag-item, .test-card, .footer-logo, .as-seen-img');
    targets.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      targets.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', rmHover);
      });
    };
  }, []);

  // Magazine 3D perspective tilt via event delegation
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const grid = document.querySelector('.magazines-grid');
    if (!grid) return;

    let rafId = null;

    const onMove = (e) => {
      const item = e.target.closest('.mag-item');
      if (!item) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = item.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        item.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-10px) scale(1.04)`;
        item.style.boxShadow = `${-x * 28}px ${10 + (-y * 18)}px 50px rgba(0,0,0,0.22)`;
        item.style.filter = 'grayscale(0%)';
        item.style.zIndex = '10';
        rafId = null;
      });
    };

    const onLeave = (e) => {
      const item = e.target.closest('.mag-item');
      if (!item) return;
      item.style.cssText = '';
    };

    grid.addEventListener('mousemove', onMove);
    grid.addEventListener('mouseleave', onLeave, true);
    return () => {
      grid.removeEventListener('mousemove', onMove);
      grid.removeEventListener('mouseleave', onLeave, true);
    };
  }, []);

  // Magnetic logo handlers
  const onLogoMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 14;
    e.currentTarget.style.setProperty('--mx', `${x}px`);
    e.currentTarget.style.setProperty('--my', `${y}px`);
  };

  const onLogoLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', '0px');
    e.currentTarget.style.setProperty('--my', '0px');
  };

  return (
    <div className="app-container">
      <div ref={scrollProgressRef} className="scroll-progress" aria-hidden="true" />
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />

      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div ref={heroBgRef} className="hero-parallax-wrapper">
          <picture>
            <source media="(max-width: 600px)" srcSet="/images/mobileHero.webp" type="image/webp" />
            <img
              src="/images/hero.webp"
              alt=""
              className="hero-bg"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Happy Birthday Saumi</h1>
          <p className="hero-subtext">HBD to the most special person, stay blessed, keep being fun, caring, grateful to have you.</p>
        </div>
      </section>

      {/* As Seen On */}
      <section className="as-seen-on reveal">
        <div className="as-seen-header">
          <div className="as-seen-line" />
          <p className="as-seen-title">As Seen on</p>
          <div className="as-seen-line" />
        </div>
        <div className="logos-group">
          {['flopshop', 'guts', 'pattepack', 'timepass', 'windup', 'zipit'].map(name => (
            <img
              key={name}
              src={`/images/${name}.webp`}
              alt={name.charAt(0).toUpperCase() + name.slice(1)}
              className="as-seen-img"
              loading="lazy"
              decoding="async"
              onMouseMove={onLogoMove}
              onMouseLeave={onLogoLeave}
            />
          ))}
        </div>
      </section>

      {/* Dear Saumi */}
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

      {/* Testimonials */}
      <section className="testimonials reveal">
        <h2 className="section-title">Testimonials</h2>
        <div className="testimonials-grid">
          <div className="test-card">
            <img src="/images/testimonial1.webp" alt="Simran Jain" loading="lazy" decoding="async" />
            <p className="test-quote">"Isko kaise jhel lete ho" is my best dialogue since birth. Jk chote, Watching you grow into a b'ful, independent, person is the best feeling. You'll always be my baby, my soul</p>
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

      {/* Media Recognition */}
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

      {/* Magazines */}
      <section className="magazines reveal">
        <div className="magazines-grid">
          {[
            ['media1.webp', 'The Chicken Magazine'],
            ['media2.webp', 'R. Republic Magazine'],
            ['media3.webp', 'Femina Magazine'],
            ['media4.webp', 'Fortune Time Magazine'],
            ['media5.webp', 'Vogue Edition Magazine'],
            ['media6.webp', 'GQ Style Magazine'],
            ['media8.webp', 'Time Spotlight Magazine'],
          ].map(([src, alt]) => (
            <div key={src} className="mag-item">
              <img src={`/images/${src}`} alt={alt} loading="lazy" decoding="async" />
            </div>
          ))}
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
        <div className="footer-divider" />
      </footer>
    </div>
  );
}

export default App;
