import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/global.css';
import { useFirebase } from './hooks/useFirebase';
import { useAdmin } from './hooks/useAdmin';
import { useReveal, useScramble } from './hooks/useReveal';

import Header from './components/Header';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import FeaturedBuild from './components/FeaturedBuild';
import Machines from './components/Machines';
import CivilWorks from './components/CivilWorks';
import Process from './components/Process';
import Band from './components/Band';
import Stats from './components/Stats';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import RequestForm from './components/RequestForm';
import Footer from './components/Footer';
import AdminDrawer from './components/AdminDrawer';
import Toast from './components/Toast';
import ImageLightbox from './components/ImageLightbox';
import WhatsAppButton from './components/WhatsAppButton';

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const {
    state, setState, stateRef,
    contentError, firebaseReady,
    loadFromFirebase, saveToFirebase,
    listenToFirebase, submitRequest, loadRequests,
  } = useFirebase();

  const { loggedIn, tryLogin, logout, adminUser } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [lightboxImage, setLightboxImage] = useState(null);
  const toastTimer = useRef(null);
  const appRef = useRef(null);

  // Reveal / scramble observers — re-run after every render so new content is picked up
  useReveal(appRef);
  useScramble(appRef);

  // Scroll: header + progress bar + parallax
  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const y = window.scrollY;
        setScrolled(y > 30);
        const h = document.documentElement;
        const prog = document.getElementById('prog');
        if (prog) prog.style.width = (y / (h.scrollHeight - window.innerHeight) * 100) + '%';
        if (!REDUCED) {
          document.querySelectorAll('[data-prl]').forEach(el => {
            const host = el.parentElement?.getBoundingClientRect();
            if (!host || host.bottom < 0 || host.top > window.innerHeight) return;
            el.style.transform = `translateY(${host.top * parseFloat(el.dataset.prl)}px)`;
          });
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard escape → close drawer or lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxImage]);

  // Firebase init
  useEffect(() => {
    loadFromFirebase().then(() => {
      const unsub = listenToFirebase();
      return () => { if (typeof unsub === 'function') unsub(); };
    });
  }, []);

  // Document title
  useEffect(() => {
    document.title = `${state.site?.name || 'KRS KING (PVT) LTD'} — Custom Machines & Civil Works, Built to Order`;
  }, [state.site?.name]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxImage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxImage]);

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2600);
  }, []);

  const handleSubmitRequest = async (form) => {
    const { ok } = await submitRequest(form);
    showToast(ok
      ? 'Request received ✓ Our workshop will contact you soon.'
      : 'Could not reach the server — your request is saved on this device.');
  };

  const whatsappNumber = state.contact?.whatsapp || state.contact?.phone || '+94761599289';

  return (
    <div ref={appRef}>
      <div id="prog"></div>

      <Header state={state} scrolled={scrolled} onAdminOpen={() => setDrawerOpen(true)} />

      <Hero state={state} />
      <Ticker state={state} />
      <FeaturedBuild state={state} onImageClick={setLightboxImage} />
      <Machines state={state} onImageClick={setLightboxImage} />
      <CivilWorks onImageClick={setLightboxImage} />
      <Process state={state} />
      <Band state={state} />
      <Stats state={state} />
      <Services state={state} />
      <About state={state} />
      <Testimonials state={state} />
      <Faq state={state} />
      <RequestForm state={state} onSubmit={handleSubmitRequest} onAdminOpen={() => setDrawerOpen(true)} />
      <Footer state={state} onAdminOpen={() => setDrawerOpen(true)} />

      {/* Floating action buttons */}
      <div className="fabs">
        {/* WhatsApp CTA button */}
        <WhatsAppButton phone={whatsappNumber} />

        {/* Admin gear button */}
        <button className="fab fab-gear" aria-label="Admin settings" title="Admin settings" onClick={() => setDrawerOpen(true)}>
          <svg viewBox="0 0 24 24">
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 5.2-2.1.4c-.1.5-.3 1-.5 1.4l1.2 1.8-1.7 1.7-1.8-1.2c-.4.2-.9.4-1.4.5l-.4 2.1h-2.4l-.4-2.1c-.5-.1-1-.3-1.4-.5L8.7 18.5 7 16.8l1.2-1.8c-.2-.4-.4-.9-.5-1.4l-2.1-.4v-2.4l2.1-.4c.1-.5.3-1 .5-1.4L7 7.2 8.7 5.5l1.8 1.2c.4-.2.9-.4 1.4-.5l.4-2.1h2.4l.4 2.1c.5.1 1 .3 1.4.5l1.8-1.2 1.7 1.7-1.2 1.8c.2.4.4.9.5 1.4l2.1.4v2.4z"/>
          </svg>
        </button>
      </div>

      <AdminDrawer
        open={drawerOpen}
        state={state}
        setState={setState}
        onClose={() => setDrawerOpen(false)}
        loggedIn={loggedIn}
        adminUser={adminUser}
        tryLogin={tryLogin}
        logout={logout}
        contentError={contentError}
        loadRequests={loadRequests}
        saveToFirebase={saveToFirebase}
        showToast={showToast}
      />

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}

      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  );
}
