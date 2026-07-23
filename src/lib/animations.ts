// Gemeinsame GSAP-Animationen (clientseitig). Alle Effekte sind fail-safe:
// Läuft kein JS/GSAP, bleiben Texte/Zahlen im finalen, sichtbaren Zustand.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Hero-Überschrift: Wörter steigen beim Laden dezent gestaffelt ein. */
export function initHeroReveal() {
  const h1 = document.querySelector<HTMLElement>(".hero h1");
  if (!h1 || prefersReduced()) return;

  // Erst splitten, wenn die Schrift geladen ist (verhindert falsche Umbrüche).
  document.fonts.ready.then(() => {
    const split = new SplitText(h1, {
      type: "words",
      wordsClass: "reveal-word",
      aria: "auto",
    });
    gsap.from(split.words, {
      yPercent: 60,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.06,
    });
  });
}

/** Kennzahlen: führende Zahl zählt beim Ins-Bild-Scrollen von 0 hoch. */
export function initCountUp() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(".kennzahlen__value")
  );
  if (!els.length) return;

  const parse = (txt: string) => {
    const m = txt.match(/^\s*(\d[\d.]*)(.*)$/s);
    if (!m) return null;
    return { target: parseInt(m[1].replace(/\./g, ""), 10), suffix: m[2] };
  };

  els.forEach((el) => {
    const p = parse(el.textContent || "");
    if (!p) return; // rein textliche Werte ("Mehrere Baufelder") bleiben statisch
    if (prefersReduced()) return; // Endwert steht bereits im HTML

    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: p.target,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(state.v) + p.suffix;
          },
          onComplete: () => {
            el.textContent = p.target + p.suffix;
          },
        }),
    });
  });
}

/** Standortvorteile: die Nummern (01–04) zählen beim Ins-Bild-Scrollen
 *  von 00 auf ihren Wert hoch, mit erhaltener führender Null. */
export function initStandortCount() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(".standort-card__num")
  );
  if (!els.length || prefersReduced()) return;

  els.forEach((el) => {
    const target = parseInt((el.textContent || "").trim(), 10);
    if (Number.isNaN(target)) return;
    const digits = (el.textContent || "").trim().length;

    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.v)).padStart(digits, "0");
          },
          onComplete: () => {
            el.textContent = String(target).padStart(digits, "0");
          },
        }),
    });
  });
}

/** Timeline „Unsere Geschichte": Linie füllt sich beim Scrollen (scrub),
 *  jeder Punkt wird blau, sobald die Fülllinie ihn erreicht. */
export function initTimeline() {
  const timeline = document.querySelector<HTMLElement>(".timeline");
  if (!timeline) return;
  const items = Array.from(
    timeline.querySelectorAll<HTMLElement>(".timeline__item")
  );

  if (prefersReduced()) {
    timeline.style.setProperty("--tl-progress", "1");
    items.forEach((it) => it.classList.add("is-active"));
    return;
  }

  const state = { p: 0 };
  gsap.to(state, {
    p: 1,
    ease: "none",
    scrollTrigger: {
      trigger: timeline,
      start: "top 55%",
      end: "bottom 55%",
      scrub: 0.4,
      onUpdate: (self) =>
        timeline.style.setProperty("--tl-progress", String(self.progress)),
    },
  });

  items.forEach((it) => {
    ScrollTrigger.create({
      trigger: it,
      start: "top 55%",
      onEnter: () => it.classList.add("is-active"),
      onLeaveBack: () => it.classList.remove("is-active"),
    });
  });
}
