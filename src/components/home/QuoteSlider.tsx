"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { quoteSlides } from "@/lib/data/quoteSlides";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

function slideHref(slide: (typeof quoteSlides)[number]) {
  if (slide.href) return slide.href;
  if (!slide.projectType && !slide.message) return "/contact";
  const params = new URLSearchParams();
  if (slide.projectType) params.set("type", slide.projectType);
  if (slide.message) params.set("message", slide.message);
  return `/contact?${params.toString()}`;
}

// `duplicate` marks the second copy rendered only to make the loop seamless.
// It is hidden from screen readers and skipped by Tab, so each card is
// announced and focused once.
function SlideCard({ slide, duplicate = false }: { slide: (typeof quoteSlides)[number]; duplicate?: boolean }) {
  const Icon = slide.icon;
  const isFinal = slide.id === "get-a-quote";

  return (
    <Link
      href={slideHref(slide)}
      draggable={false}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      inert={duplicate || undefined}
      className={`group relative flex h-64 w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-transform duration-300 hover:-translate-y-1 sm:w-[340px] ${
        isFinal ? "border-red-500/40 bg-red-500/[0.06]" : "border-border bg-surface"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 90% 70% at 100% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 100% 0%, black, transparent)",
        }}
      />
      <Icon
        aria-hidden="true"
        size={140}
        strokeWidth={1}
        className={`pointer-events-none absolute -right-6 -top-6 ${isFinal ? "text-red-500/25" : "text-red-500/10"}`}
      />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
        <Icon size={20} className="text-red-500" />
      </div>

      <div className="relative">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{slide.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{slide.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-400 transition-colors group-hover:text-red-300">
          {isFinal ? "Ask for a quote" : "Request info"}
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function QuoteSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Explicit pause from the button (WCAG 2.2.2). Hover, drag and keyboard
  // focus pause it only temporarily; this one sticks until pressed again.
  const [stopped, setStopped] = useState(false);
  const stoppedRef = useRef(false);
  useEffect(() => {
    stoppedRef.current = stopped;
  }, [stopped]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = requestAnimationFrame(step);

    function step() {
      if (track && !stoppedRef.current && !pausedRef.current && !draggingRef.current) {
        const half = track.scrollWidth / 2;
        track.scrollLeft += 0.5;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(step);
    }

    function pause() {
      pausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    }
    function scheduleResume(delay = 1800) {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, delay);
    }

    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    function onPointerDown(e: PointerEvent) {
      if (!track) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      moved = false;
      startX = e.clientX;
      startScrollLeft = track!.scrollLeft;
      pause();
      track!.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current || !track) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startScrollLeft - dx;
    }

    function onPointerUp() {
      draggingRef.current = false;
      scheduleResume();
      if (moved) {
        const suppressClick = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
          track?.removeEventListener("click", suppressClick, true);
        };
        track?.addEventListener("click", suppressClick, true);
      }
    }

    function onWheel() {
      pause();
      scheduleResume();
    }

    function onEnter() {
      pause();
    }
    function onLeave() {
      if (!draggingRef.current) scheduleResume(400);
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("wheel", onWheel, { passive: true });
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("focusin", onEnter);
    track.addEventListener("focusout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("focusin", onEnter);
      track.removeEventListener("focusout", onLeave);
    };
  }, []);

  const doubled = [...quoteSlides, ...quoteSlides];

  return (
    <section className="border-t border-border py-16 sm:py-20">
      <Container className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="What we can build for you"
          title="Pick a lane, or ask us anything."
          description="Every card below opens a quote request pre-filled for that kind of work. Edit it before it sends, or start from scratch."
        />
        <button
          type="button"
          onClick={() => setStopped((v) => !v)}
          aria-pressed={stopped}
          className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-border px-4 text-sm text-foreground/80 transition-colors hover:border-red-500/50 hover:text-red-400 motion-reduce:hidden sm:self-auto"
        >
          {stopped ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {stopped ? "Play cards" : "Pause cards"}
        </button>
      </Container>

      <div className="quote-marquee-mask">
        <div ref={trackRef} className="quote-marquee-track flex touch-pan-y gap-5 overflow-x-auto px-6 lg:px-8">
          {doubled.map((slide, i) => (
            <SlideCard key={`${slide.id}-${i}`} slide={slide} duplicate={i >= quoteSlides.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
