"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────────── */
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  dark?: boolean;
  note: string;
};

const products: Product[] = [
  { id: "ceremonial", name: "Ceremonial Matcha", price: 29, image: "/images/ceremonial-cup.jpg", note: "First-harvest leaves sourced from Japan." },
  { id: "latte", name: "Matcha Latte Blend", price: 24, image: "/images/latte-cup.jpg", dark: true, note: "Stone-ground, silky and made for milk." },
  { id: "vanilla", name: "Vanilla Matcha", price: 26, image: "/images/vanilla-cup.jpg", note: "Soft vanilla notes with everyday energy." },
  { id: "coconut", name: "Coconut Matcha", price: 28, image: "/images/coconut-cup.jpg", note: "Creamy coconut finish, naturally refreshing." },
];

const heroRituals = ["Ceremonial", "Latte Blend", "Vanilla", "Strawberry", "Mango"];
const ritualNotes: Record<string, string> = {
  Ceremonial: "clean focus, first harvest",
  "Latte Blend": "creamy energy, café ritual",
  Vanilla: "soft sweetness, daily lift",
  Strawberry: "bright fruit, iced ritual",
  Mango: "tropical finish, cold whisked",
};

const benefits = [
  { title: "Steady Energy", copy: "A smoother lift designed for long mornings — focused, calm and without the crash.", icon: "spark" },
  { title: "Clear Focus", copy: "Natural L-theanine pairs with caffeine to support attention without the wired feeling.", icon: "focus" },
  { title: "Daily Wellness", copy: "Rich antioxidants and carefully sourced leaves make the ritual easy to return to every day.", icon: "heart" },
  { title: "Slow Ritual", copy: "Whisk, pour, reset. A small sensory ritual that turns a drink into a moment of pause.", icon: "dot" },
];

/* ─────────────────────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────────────────────── */
function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" style={diagonal ? { transform: "rotate(-45deg)", transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" } : undefined}>
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 16C8 14 6 8 7 4c5 0 10 2 11 9M16 16c8-2 10-8 9-12-5 0-10 2-11 9M16 16c-5 2-8 6-8 11 5 1 10-1 12-7M16 16c5 2 8 6 8 11-5 1-10-1-12-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialIcon({ type }: { type: "instagram" | "x" | "linkedin" | "facebook" }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M5 4l14 16M19 4L5 20" />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M6.2 9.5h2.9V19H6.2zM7.6 5a1.7 1.7 0 110 3.4 1.7 1.7 0 010-3.4zM10.9 9.5h2.8v1.3c.4-.8 1.4-1.5 2.9-1.5 3 0 3.6 2 3.6 4.6V19h-2.9v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M13.5 20v-6.6h2.2l.4-2.7h-2.6V9c0-.8.3-1.4 1.4-1.4h1.3V5.2c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.1H8.5v2.7h2.3V20z" />
    </svg>
  );
}

function BenefitIcon({ type }: { type: string }) {
  if (type === "heart") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-7-9.4C5 7.5 7 6 9.2 6c1.3 0 2.4.6 2.8 1.6C12.4 6.6 13.5 6 14.8 6 17 6 19 7.5 19 10.6 19 15.8 12 20 12 20Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
  }
  if (type === "focus") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  }
  if (type === "spark") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" fill="currentColor" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" /></svg>;
}

/** Text line wrapped in an overflow mask so GSAP can slide it up into view. */
function Line({ children, as: Tag = "span", className = "" }: { children: React.ReactNode; as?: "span" | "em"; className?: string }) {
  return (
    <Tag className={`mask ${className}`.trim()}>
      <span data-line>{children}</span>
    </Tag>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product, el: HTMLElement) => void }) {
  return (
    <article className={`product-card ${product.dark ? "product-card-dark" : ""}`}>
      <div className="product-topline">
        <h3>{product.name}</h3>
      </div>
      <div className="product-image-wrap">
        <Image src={product.image} alt={product.name} width={260} height={300} />
      </div>
      <div className="product-footer">
        <span>From — ${product.price}</span>
        <button type="button" onClick={(e) => onAdd(product, e.currentTarget)} aria-label={`Add ${product.name} to bag`}>+</button>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  const rootRef = useRef<HTMLElement | null>(null);
  const benefitRef = useRef<HTMLDivElement | null>(null);
  const ritualStatusRef = useRef<HTMLDivElement | null>(null);
  const cartOverlayRef = useRef<HTMLDivElement | null>(null);
  const cartDrawerRef = useRef<HTMLElement | null>(null);
  const cartBadgeRef = useRef<HTMLSpanElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [activeRitual, setActiveRitual] = useState("Ceremonial");
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  /* ── Page motion: one intro sequence + scroll-driven scenes ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        fine: "(hover: hover) and (pointer: fine)",
        desktop: "(min-width: 901px)",
      },
      (ctx) => {
        const { motion, fine, desktop } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;
        const cleanups: Array<() => void> = [];

        const q = gsap.utils.selector(root);

        /* Intro — a single orchestrated sequence */
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(q(".site-header"), { yPercent: -100, opacity: 0, duration: 0.8 })
          .from(q(".hero-word [data-line]"), { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out" }, "-=0.45")
          .from(q(".hero-copy > *"), { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.75")
          .fromTo(
            q(".hero-media"),
            { clipPath: "inset(14% 5% 14% 5% round 32px)", opacity: 0 },
            { clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1, duration: 1.3, ease: "expo.out", clearProps: "clipPath,opacity" },
            "-=0.55",
          )
          .from(q(".hero-photo-wrap"), { scale: 1.2, duration: 1.8, ease: "expo.out" }, "<")
          .from(q(".ritual-chips > *"), { y: 12, opacity: 0, duration: 0.5, stagger: 0.05 }, "-=1.1")
          .from([q(".ritual-status"), q(".hero-socials"), q(".hero-promo"), q(".hero-bottom-nav")].flat(), { y: 18, opacity: 0, duration: 0.6, stagger: 0.07 }, "-=0.95");

        /* Hero — photo parallax + the frame settling as it leaves */
        gsap.to(q(".hero-photo-wrap"), {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: q(".hero-media"), start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(q(".hero-media"), {
          scale: 0.95,
          borderRadius: "40px",
          ease: "none",
          scrollTrigger: { trigger: q(".hero-media"), start: "bottom 85%", end: "bottom 15%", scrub: true },
        });

        /* Headlines — line-by-line masked reveal */
        gsap.utils.toArray<HTMLElement>(q("[data-lines]")).forEach((el) => {
          gsap.from(el.querySelectorAll("[data-line]"), {
            yPercent: 110,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        /* Generic soft reveals for supporting copy */
        gsap.utils.toArray<HTMLElement>(q("[data-reveal]")).forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        /* Powder cards — two slightly different parallax speeds */
        q(".powder-cards > div").forEach((card, i) => {
          gsap.fromTo(
            card,
            { yPercent: 12 + i * 8 },
            { yPercent: -8 - i * 6, ease: "none", scrollTrigger: { trigger: q(".discover-strip"), start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        /* Experience card — unfolds from a smaller frame, ingredient image drifts */
        gsap.fromTo(
          q(".experience-card"),
          { clipPath: "inset(8% 5% 8% 5% round 32px)", scale: 0.97 },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            scale: 1,
            duration: 1.3,
            ease: "expo.out",
            clearProps: "clipPath,scale",
            scrollTrigger: { trigger: q(".experience-card"), start: "top 78%", once: true },
          },
        );
        gsap.fromTo(
          q(".ingredient-panel img"),
          { yPercent: -3, scale: 1.04 },
          { yPercent: 3, scale: 1.04, ease: "none", scrollTrigger: { trigger: q(".experience-card"), start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(q(".ingredient-note"), {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".experience-card"), start: "top 78%", once: true },
        });

        /* Product cards — staggered lift, cups settle in slightly after */
        gsap.from(q(".product-card"), {
          y: 56,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".collections-grid"), start: "top 82%", once: true },
        });
        gsap.from(q(".product-image-wrap"), {
          y: 24,
          scale: 0.92,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".collections-grid"), start: "top 82%", once: true },
        });
        gsap.from(q(".facts p"), {
          x: -16,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".facts"), start: "top 88%", once: true },
        });

        /* Closing banner — grid drifts, headline rises */
        gsap.fromTo(
          q(".grid-lines"),
          { scale: 1.35, opacity: 0 },
          { scale: 1, opacity: 0.12, ease: "none", scrollTrigger: { trigger: q(".closing-banner"), start: "top bottom", end: "center center", scrub: true } },
        );

        /* Header hides on scroll-down, returns on scroll-up (desktop only) */
        if (desktop) {
          const header = q(".site-header")[0];
          ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
              const hide = self.direction === 1 && self.scroll() > 320;
              gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
            },
          });
        }

        /* Magnetic buttons — pointer-driven, so only on fine pointers */
        if (fine) {
          q<HTMLElement>(".circle-button, .shop-button, .closing-banner .pill").forEach((btn) => {
            const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
            const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = btn.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
            };
            const leave = () => {
              gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
            };
            btn.addEventListener("pointermove", move);
            btn.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              btn.removeEventListener("pointermove", move);
              btn.removeEventListener("pointerleave", leave);
            });
          });
        }

        return () => cleanups.forEach((fn) => fn());
      },
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  /* ── Response motion: shows what changed after an action ── */
  useEffect(() => {
    const el = benefitRef.current;
    if (!el) return;
    gsap.fromTo(el.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out", overwrite: true });
  }, [activeBenefit]);

  useEffect(() => {
    const el = ritualStatusRef.current;
    if (!el) return;
    gsap.fromTo(el.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power3.out", overwrite: true });
  }, [activeRitual]);

  useLayoutEffect(() => {
    if (!cartOpen) return;
    const overlay = cartOverlayRef.current;
    const drawer = cartDrawerRef.current;
    if (!overlay || !drawer) return;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: "expo.out" });
    gsap.from(drawer.querySelectorAll(".cart-head, .cart-line, .empty-cart, .cart-total, .checkout-demo"), { y: 18, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.2, ease: "power3.out" });
  }, [cartOpen]);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const el = mobileMenuRef.current;
    if (!el) return;
    gsap.from(el.children, { y: 16, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!toast || !toastRef.current) return;
    gsap.fromTo(toastRef.current, { y: 18, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)", overwrite: true });
  }, [toast]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => {
      const el = toastRef.current;
      if (el) gsap.to(el, { y: 12, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => setToast("") });
      else setToast("");
    }, 2200);
  }, []);

  const closeCart = useCallback(() => {
    const overlay = cartOverlayRef.current;
    const drawer = cartDrawerRef.current;
    if (!overlay || !drawer) return setCartOpen(false);
    gsap.to(drawer, { xPercent: 100, duration: 0.5, ease: "power3.in" });
    gsap.to(overlay, { opacity: 0, duration: 0.45, ease: "power2.in", onComplete: () => setCartOpen(false) });
  }, []);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, closeCart]);

  const addToCart = (product: Product, source?: HTMLElement | null) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] ?? 0) + 1 }));
    showToast(`${product.name} added to your bag`);
    if (source) gsap.fromTo(source, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: true, clearProps: "transform" });
    if (cartBadgeRef.current) gsap.fromTo(cartBadgeRef.current, { scale: 1.5 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: true });
  };

  const removeOne = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = next[id] ?? 0;
      if (qty <= 1) delete next[id];
      else next[id] = qty - 1;
      return next;
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <main ref={rootRef} className="site-shell">
      <div className="page-frame">
        <header className="site-header">
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button type="button" className="eyebrow-link" onClick={() => scrollTo("collections")}>Our Matcha<sup>23</sup></button>
            <button type="button" className="eyebrow-link" onClick={() => scrollTo("experience")}>The Ritual<sup>23</sup></button>
            <button type="button" className="eyebrow-link" onClick={() => scrollTo("story")}>Our Story<sup>23</sup></button>
          </nav>

          <button type="button" className="brand" onClick={() => scrollTo("top")} aria-label="Back to top">
            <LeafIcon />
            <span>MATCHACHO™</span>
          </button>

          <div className="nav-actions">
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open bag with ${cartCount} items`}>
              Bag <span ref={cartBadgeRef}>{cartCount}</span>
            </button>
            <button type="button" className="pill shop-button" onClick={() => scrollTo("collections")}>
              Shop Matcha <span className="round-arrow"><ArrowIcon /></span>
            </button>
            <button type="button" className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle menu">
              <span /> <span />
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="mobile-menu" ref={mobileMenuRef} role="dialog" aria-label="Mobile navigation">
            <button type="button" onClick={() => scrollTo("collections")}>Our Matcha</button>
            <button type="button" onClick={() => scrollTo("experience")}>The Ritual</button>
            <button type="button" onClick={() => scrollTo("story")}>Our Story</button>
          </div>
        )}

        {/* ── Hero ── */}
        <section className="hero" id="top">
          <div className="hero-top">
            <h1 className="hero-heading" aria-label="Fresh Pressed Matcha">
              <span className="hero-word"><Line>Fresh</Line></span>
              <span className="hero-word hero-muted"><Line>Pressed</Line></span>
              <span className="hero-word"><Line>Matcha</Line></span>
            </h1>

            <div className="hero-copy">
              <div className="hero-links">
                <button type="button" className="eyebrow-link" onClick={() => scrollTo("story")}>About Us<sup>23</sup></button>
                <button type="button" className="eyebrow-link" onClick={() => scrollTo("experience")}>How It Works<sup>23</sup></button>
              </div>
              <div className="social-proof" aria-label="Over one hundred thousand customers">
                <div className="avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span></div>
                <strong>+100K</strong>
              </div>
              <p>Experience authentic Japanese matcha crafted from first-harvest tea leaves for sustained energy, focus, and daily wellness.</p>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-photo-wrap">
              <Image className="hero-photo" src="/images/hero-clean.jpg" alt="Two iced matcha drinks held up against a bright blue sky" fill priority sizes="(max-width: 900px) 100vw, 1240px" />
            </div>
            <div className="hero-shade" aria-hidden="true" />

            <div className="ritual-chips" aria-label="Choose a matcha ritual">
              {heroRituals.map((item, index) => (
                <Fragment key={item}>
                  <button type="button" className={activeRitual === item ? "active" : ""} aria-pressed={activeRitual === item} onClick={() => setActiveRitual(item)}>
                    {item}
                  </button>
                  {(index === 2 || index === heroRituals.length - 1) && (
                    <button type="button" className="chip-arrow" onClick={() => scrollTo("collections")} aria-label="Browse the collection"><ArrowIcon diagonal /></button>
                  )}
                </Fragment>
              ))}
            </div>

            <div className="ritual-status" ref={ritualStatusRef} aria-live="polite">
              <span>{activeRitual}</span>
              <small>{ritualNotes[activeRitual]}</small>
            </div>

            <div className="hero-socials" aria-label="Social links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon type="instagram" /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><SocialIcon type="x" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon type="linkedin" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><SocialIcon type="facebook" /></a>
            </div>

            <div className="hero-promo">
              <Image src="/images/powder-scoop.jpg" alt="Matcha powder and leaves" width={110} height={100} />
              <div>
                <strong>Drink Better. Focus Longer.</strong>
                <p>Meet your daily matcha ritual — clean energy and calm focus.</p>
                <b>$14.99</b>
              </div>
              <button type="button" onClick={(e) => addToCart(products[1], e.currentTarget)} aria-label="Add Matcha Latte Blend to bag">+</button>
            </div>

            <div className="hero-bottom-nav" aria-label="Collections">
              <button type="button" onClick={() => scrollTo("collections")}>Ceremonial Collection <ArrowIcon /></button>
              <button type="button" onClick={() => scrollTo("collections")}>Daily Ritual Collection <ArrowIcon /></button>
              <button type="button" onClick={() => scrollTo("collections")}>Limited Harvest Collection <ArrowIcon /></button>
            </div>
          </div>

          <div className="discover-strip" id="story">
            <div>
              <h2 data-lines>
                <Line>Discover Matcha</Line>
                <Line as="em">For Every Ritual</Line>
              </h2>
              <p data-reveal>From slow ceremonial mornings to fast iced lattes — one leaf, shaped around the way you live.</p>
            </div>
            <div className="powder-cards" aria-hidden="true">
              <div><Image src="/images/powder-scoop.jpg" alt="" width={220} height={220} /></div>
              <div><Image src="/images/powder-bowl.jpg" alt="" width={220} height={220} /></div>
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="experience-section" id="experience">
          <div className="experience-card">
            <div className="ingredient-panel">
              <Image src="/images/ingredients.jpg" alt="Layered matcha ingredient illustration with ceremonial grade powder, cream, matcha and tapioca" fill sizes="(max-width: 900px) 100vw, 48vw" />
              <div className="ingredient-note">
                <LeafIcon />
                <span>Steady energy, enhanced concentration, and a smooth taste crafted from Japan&apos;s finest tea leaves.</span>
              </div>
            </div>

            <div className="experience-copy">
              <h2 data-lines>
                <Line>The Matcha</Line>
                <Line>Experience <em>Refined</em></Line>
              </h2>
              <div className="benefit-tabs" role="tablist" aria-label="Matcha benefits">
                {benefits.map((benefit, index) => (
                  <button type="button" key={benefit.title} className={activeBenefit === index ? "active" : ""} aria-pressed={activeBenefit === index} onClick={() => setActiveBenefit(index)} title={benefit.title}>
                    <BenefitIcon type={benefit.icon} />
                  </button>
                ))}
              </div>

              <div className="benefit-copy" ref={benefitRef} aria-live="polite">
                <span>Crafted For</span>
                <h3>{benefits[activeBenefit].title}</h3>
                <p>{benefits[activeBenefit].copy}</p>
              </div>

              <div className="experience-footer" data-reveal>
                <button type="button" className="circle-button" onClick={() => scrollTo("collections")} aria-label="Explore the ritual"><ArrowIcon diagonal /></button>
                <div><span>Explore</span><strong>The Ritual</strong></div>
                <div className="lifestyle-thumb">
                  <Image src="/images/lifestyle.jpg" alt="Person enjoying an iced matcha drink" fill sizes="160px" />
                  <small>Daily Wellness</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Collections ── */}
        <section className="collections-section" id="collections">
          <div className="collection-title">
            <h2 data-lines>
              <Line>Discover Matcha</Line>
              <Line as="em">Collections For Every Ritual</Line>
            </h2>
          </div>

          <div className="collections-grid">
            {products.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}

            <aside className="collection-copy" data-reveal>
              <h3>Crafted For Modern Wellness</h3>
              <div className="facts">
                <p><span>Ceremonial grade, first-harvest leaves sourced from Japan.</span><b>2026</b></p>
                <p><span>Stone-ground the traditional way for exceptional texture.</span><b>2026</b></p>
                <p><span>Natural energy and sustained focus without the crash.</span><b>2026</b></p>
              </div>
            </aside>

            <aside className="collection-copy ritual-copy" data-reveal>
              <h4>Every Sip, A Better Ritual</h4>
              <div className="ritual-bottom">
                <p>Authentic Japanese matcha made to elevate your mornings, enhance focus, and support mindful living.</p>
                <button type="button" className="pill" onClick={(e) => addToCart(products[0], e.currentTarget)}>
                  Shop Collection <span className="round-arrow"><ArrowIcon /></span>
                </button>
              </div>
            </aside>

            {products.slice(2).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="closing-banner">
          <div className="grid-lines" aria-hidden="true" />
          <p data-lines>
            <Line>Ancient Tradition.</Line>
            <Line>Modern <em>Wellness.</em></Line>
          </p>
          <button type="button" className="pill pill-light" onClick={() => scrollTo("collections")}>Explore Collection <span className="round-arrow"><ArrowIcon /></span></button>
        </section>

        <footer className="footer">
          <div className="brand footer-brand"><LeafIcon /><span>MATCHACHO™</span></div>
          <p>Japanese matcha. Reimagined for the everyday ritual.</p>
          <button type="button" className="eyebrow-link" onClick={() => scrollTo("top")}>Back to top ↑</button>
        </footer>
      </div>

      {cartOpen && (
        <div className="cart-overlay" ref={cartOverlayRef} role="presentation" onMouseDown={closeCart}>
          <aside className="cart-drawer" ref={cartDrawerRef} role="dialog" aria-modal="true" aria-label="Shopping bag" onMouseDown={(e) => e.stopPropagation()}>
            <div className="cart-head">
              <div><small>Your ritual</small><h2>Shopping Bag</h2></div>
              <button type="button" onClick={closeCart} aria-label="Close bag">×</button>
            </div>
            {cartCount === 0 ? (
              <div className="empty-cart">
                <LeafIcon />
                <p>Your bag is empty. Pick a matcha to get started.</p>
                <button type="button" className="pill" onClick={() => { closeCart(); scrollTo("collections"); }}>Explore matcha <span className="round-arrow"><ArrowIcon /></span></button>
              </div>
            ) : (
              <>
                <div className="cart-lines">
                  {products.filter((p) => cart[p.id]).map((product) => (
                    <div className="cart-line" key={product.id}>
                      <Image src={product.image} alt="" width={62} height={72} />
                      <div><strong>{product.name}</strong><small>{cart[product.id]} × ${product.price}</small></div>
                      <button type="button" onClick={() => removeOne(product.id)} aria-label={`Remove one ${product.name}`}>−</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
                <button type="button" className="pill checkout-demo" onClick={() => showToast("Demo storefront — checkout is ready to connect to your backend.")}>Continue to checkout <span className="round-arrow"><ArrowIcon /></span></button>
              </>
            )}
          </aside>
        </div>
      )}

      {toast && <div className="toast" ref={toastRef} role="status"><CheckIcon />{toast}</div>}
    </main>
  );
}
