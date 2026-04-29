import React, { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Loader2,
  Download,
  CheckCircle2,
  Coffee,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useImageSplitter } from "@/hooks/use-image-splitter";

/* ─── Background doodles ─── */
function Doodles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none" aria-hidden>
      {/* Scissors — top left */}
      <svg className="absolute top-[6%] left-[4%] w-14 h-14 text-primary opacity-[0.13] doodle-float-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>

      {/* Star — top right */}
      <svg className="absolute top-[8%] right-[6%] w-10 h-10 text-primary opacity-[0.15] doodle-float-fast" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>

      {/* Sparkle — mid left */}
      <svg className="absolute top-[35%] left-[2%] w-8 h-8 text-primary opacity-[0.12] doodle-spin-slow" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/>
      </svg>

      {/* Instagram square — top center-right */}
      <svg className="absolute top-[4%] left-[58%] w-12 h-12 text-primary opacity-[0.10] doodle-float-med" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>

      {/* Arrow doodle — bottom left */}
      <svg className="absolute bottom-[18%] left-[3%] w-10 h-10 text-primary opacity-[0.12] doodle-float-slow" style={{animationDelay:'1.2s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>

      {/* Wavy lines — bottom right */}
      <svg className="absolute bottom-[25%] right-[4%] w-16 h-10 text-primary opacity-[0.10] doodle-float-med" style={{animationDelay:'0.8s'}} viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 8 C12 2, 20 14, 28 8 C36 2, 44 14, 52 8 C60 2, 62 8, 64 8"/>
        <path d="M4 20 C12 14, 20 26, 28 20 C36 14, 44 26, 52 20 C60 14, 62 20, 64 20"/>
      </svg>

      {/* Small dot cluster — mid right */}
      <svg className="absolute top-[55%] right-[3%] w-12 h-12 text-primary opacity-[0.14] doodle-pulse" viewBox="0 0 40 40" fill="currentColor">
        <circle cx="8" cy="8" r="3"/><circle cx="20" cy="5" r="2"/><circle cx="32" cy="10" r="3.5"/>
        <circle cx="6" cy="22" r="2.5"/><circle cx="20" cy="20" r="4"/><circle cx="34" cy="24" r="2"/>
        <circle cx="10" cy="33" r="2"/><circle cx="22" cy="35" r="3"/><circle cx="34" cy="34" r="2.5"/>
      </svg>

      {/* Big dashed circle — far left, low */}
      <svg className="absolute bottom-[30%] left-[-3%] w-32 h-32 text-primary opacity-[0.07] doodle-spin-slow" style={{animationDuration:'20s'}} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6">
        <circle cx="50" cy="50" r="46"/>
      </svg>

      {/* Big dashed circle — far right top */}
      <svg className="absolute top-[-5%] right-[-4%] w-40 h-40 text-primary opacity-[0.06] doodle-spin-slow" style={{animationDuration:'28s', animationDirection:'reverse'}} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5">
        <circle cx="50" cy="50" r="46"/>
      </svg>

      {/* Heart — bottom center */}
      <svg className="absolute bottom-[10%] left-[48%] w-9 h-9 text-primary opacity-[0.13] doodle-float-fast" style={{animationDelay:'2s'}} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>

      {/* Scissors small — bottom right area */}
      <svg className="absolute bottom-[40%] right-[8%] w-8 h-8 text-primary opacity-[0.12] doodle-float-med" style={{animationDelay:'1.5s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    </div>
  );
}

/* ─── Step indicator ─── */
const steps = [
  { num: 1, label: "Drop your image" },
  { num: 2, label: "Pick slide count" },
  { num: 3, label: "Hit Slice it" },
  { num: 4, label: "Download & post" },
];

export default function Home() {
  const {
    file,
    imageUrl,
    dimensions,
    splitCount,
    setSplitCount,
    isProcessing,
    hasSliced,
    handleUpload,
    clear,
    downloadZip,
    downloadSlide,
  } = useImageSplitter();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) handleUpload(acceptedFiles[0]);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const activeStep = !imageUrl ? 1 : isProcessing ? 3 : hasSliced ? 4 : 2;

  // Auto-scroll to the templates showcase the moment slicing finishes
  const templatesRef = useRef<HTMLDivElement>(null);
  const justSlicedRef = useRef(false);
  useEffect(() => {
    if (hasSliced && !justSlicedRef.current) {
      justSlicedRef.current = true;
      // wait for the section's mount animation to start, then scroll
      setTimeout(() => {
        templatesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
    }
    if (!hasSliced) justSlicedRef.current = false;
  }, [hasSliced]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      <Doodles />

      {/* Header */}
      <header className="w-full pt-8 pb-4 px-6 sm:px-10 flex flex-col items-center justify-center relative z-10">
        {/* Sticker badge */}
        <div className="inline-flex flex-col items-center bg-white border-[3px] border-foreground rounded-[1.6rem] px-7 py-3 shadow-[4px_4px_0px_0px_rgba(74,44,26,0.85)] rotate-[-1.5deg] select-none">
          <div className="flex items-center">
            <span className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">Koefo</span>
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-primary mt-0.5">
            by sumincreates
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-[860px] mx-auto px-4 sm:px-8 pb-24 relative z-10">

        {/* Step Indicator */}
        <div className="w-full max-w-2xl mx-auto mb-12 sm:mb-16 mt-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-4 w-full border-t-2 border-dashed border-border z-0" />
            {steps.map((step) => {
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300",
                    isActive  ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                    : isPast  ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground"
                  )}>
                    {isPast && !isActive ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold hidden sm:block absolute top-10 w-max text-center transition-colors duration-300",
                    isActive ? "text-foreground" : isPast ? "text-foreground/70" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!imageUrl ? (
            /* ─── Phase 1: Upload ─── */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-10">
                <h2 className="text-5xl sm:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tighter">
                  Neatly sliced,<br />
                  <span className="text-primary">Perfectly posted.</span>
                </h2>
                <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg mx-auto mt-6 leading-relaxed">
                  Drop your image, pick your slides, download & post. No signup. No nonsense. Just clean cuts.
                </p>
              </div>

              <div
                {...getRootProps()}
                className={cn(
                  "relative group w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-10 sm:p-24 text-center transition-all duration-300 ease-out bg-card shadow-sm",
                  isDragActive  ? "border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10"
                                : "border-border hover:border-primary hover:shadow-xl",
                  isDragReject && "border-destructive bg-destructive/5"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                  <h3 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
                    {isDragActive ? "Drop it!" : "Drop your image here"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    Exported from Canva? Drop it straight in.
                  </p>
                  <div className="mt-4 pointer-events-none">
                    <span className="inline-block bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-transform group-hover:scale-105 group-active:scale-95 text-sm sm:text-base">
                      Choose File
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    {["JPG", "PNG", "WEBP", "up to 50MB"].map((badge) => (
                      <span key={badge} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold tracking-wider">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── Phase 2: Editor ─── */
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col gap-10"
            >
              {/* Start over */}
              <div className="flex justify-start">
                <button onClick={clear} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Start over
                </button>
              </div>

              {/* Step 2: Panel Picker */}
              <div className="bg-card rounded-[2rem] p-6 sm:p-10 shadow-sm border border-border flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-display font-bold text-xl shrink-0">02</div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Pick your slide count</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSplitCount(num)}
                        className={cn(
                          "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-display font-bold text-lg sm:text-xl transition-all duration-200 flex items-center justify-center border-2",
                          splitCount === num
                            ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/25 z-10"
                            : "bg-transparent border-border text-foreground hover:border-primary/40 hover:bg-muted"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {dimensions && (
                    <p className="text-sm font-semibold text-muted-foreground pl-1">
                      Each slide: {Math.round(dimensions.width / splitCount)} × {dimensions.height}px
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl border border-border/50">
                  <div className="w-16 h-16 rounded-xl bg-background overflow-hidden shrink-0 shadow-sm">
                    <img src={imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate text-sm sm:text-base">{file?.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">
                      {file ? formatBytes(file.size) : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Slice it */}
              <div className="bg-card rounded-[2rem] p-6 sm:p-10 shadow-sm border border-border flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-display font-bold text-xl shrink-0">03</div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Slice it</h2>
                </div>

                <button
                  onClick={downloadZip}
                  disabled={isProcessing}
                  className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl sm:text-2xl uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-7 h-7 animate-spin" />Slicing...</>
                  ) : hasSliced ? (
                    <><Download className="w-7 h-7" strokeWidth={2.5} />Download ZIP again</>
                  ) : (
                    <><Scissors className="w-7 h-7" strokeWidth={2.5} />Slice it</>
                  )}
                </button>

                {/* Step 4: confirmation + Buy Me a Coffee */}
                <AnimatePresence>
                  {hasSliced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden flex flex-col gap-4"
                    >
                      {/* Step 4 confirmation banner */}
                      <div className="flex items-start gap-4 bg-primary/10 border border-primary/25 rounded-2xl p-5">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-base shrink-0 mt-0.5">04</div>
                        <div>
                          <p className="font-display font-bold text-foreground text-lg">Download & post!</p>
                          <p className="text-sm text-muted-foreground font-medium mt-1">
                            Your ZIP downloaded automatically. Tap any slide below to save it individually too.
                          </p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1 ml-auto" />
                      </div>

                      {/* Buy Me a Coffee */}
                      <motion.a
                        href="https://ko-fi.com/L4L518O0RM"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="group flex items-center justify-between gap-4 bg-[#FFDD00] hover:bg-[#F5D300] active:scale-[0.98] border-2 border-[#E5C800] rounded-2xl p-5 transition-all duration-200 hover:shadow-lg cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0 shadow-sm">
                            <Coffee className="w-6 h-6 text-[#1a1a1a]" strokeWidth={2} />
                          </div>
                          <div>
                            <p className="font-display font-bold text-[#1a1a1a] text-base leading-tight">
                              Enjoying Koefo? Buy Sumin a coffee ☕
                            </p>
                            <p className="text-[#555] text-xs font-semibold mt-0.5">
                              Free forever — but a coffee keeps the tools coming!
                            </p>
                          </div>
                        </div>
                        <span className="font-display font-bold text-[#1a1a1a] text-sm uppercase tracking-wide shrink-0 group-hover:translate-x-1 transition-transform">
                          Support →
                        </span>
                      </motion.a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview + per-slide download */}
              <div className="flex flex-col gap-6 mt-2">
                <h3 className="text-xl font-display font-bold text-foreground px-1">
                  Preview your slides
                  {!hasSliced && (
                    <span className="ml-3 text-sm font-semibold text-muted-foreground font-sans">
                      — tap any slide to download it individually
                    </span>
                  )}
                </h3>

                <div className="w-full overflow-hidden">
                  <div className="w-full overflow-x-auto hide-scrollbar pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory">
                    <div className="flex gap-5 sm:gap-7 min-w-max">
                      {Array.from({ length: splitCount }).map((_, i) => {
                        const percentage = splitCount > 1 ? (i / (splitCount - 1)) * 100 : 0;
                        const aspect = dimensions ? dimensions.width / splitCount / dimensions.height : 1;

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            className="relative shrink-0 snap-center flex flex-col gap-3"
                            style={{ maxWidth: "85vw" }}
                          >
                            {/* Card */}
                            <div
                              className="relative overflow-hidden rounded-[1.5rem] border border-black/8 shadow-md bg-card group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                              style={{ height: "300px", aspectRatio: aspect }}
                              onClick={() => downloadSlide(i)}
                              title={`Download Slide ${i + 1}`}
                            >
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundImage: `url(${imageUrl})`,
                                  backgroundSize: `${splitCount * 100}% 100%`,
                                  backgroundPosition: `${percentage}% 0`,
                                  backgroundRepeat: "no-repeat",
                                }}
                              />
                              {/* Slide badge */}
                              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                                Slide {i + 1}
                              </div>
                              {/* Hover overlay — pointer-events-none so clicks reach the parent card */}
                              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-foreground rounded-2xl px-5 py-3 font-display font-bold text-sm flex items-center gap-2 shadow-xl translate-y-2 group-hover:translate-y-0">
                                  <Download className="w-4 h-4" />
                                  Download
                                </div>
                              </div>
                            </div>

                            {/* Persistent download button — visible after slicing */}
                            <AnimatePresence>
                              {hasSliced && (
                                <motion.button
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.3, delay: i * 0.05 }}
                                  onClick={() => downloadSlide(i)}
                                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary/25"
                                >
                                  <Download className="w-4 h-4" strokeWidth={2.5} />
                                  Save slide {i + 1}
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Template showcase (only after slicing) */}
              <AnimatePresence>
                {hasSliced && (
                  <motion.div
                    ref={templatesRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-4 bg-card rounded-[2rem] p-6 sm:p-10 shadow-sm border border-border flex flex-col gap-8 scroll-mt-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
                          ✨ Loved your slices? Try these next
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                          Aesthetic carousel templates,<br className="hidden sm:block" /> made by Sumin
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium mt-2 max-w-md">
                          Plug-and-play Canva templates so your next post looks just as good as it slices.
                        </p>
                      </div>
                      <a
                        href="https://sumincreates.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap underline decoration-2 underline-offset-4"
                      >
                        See all templates →
                      </a>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {[
                        { title: "Life Lately", subtitle: "Scrapbook Carousel", image: "https://sumincreates.com/cdn/shop/files/3_f6171ff9-1c01-4ad9-8f70-c52cb1725b21.png?v=1753083296", href: "https://sumincreates.com/products/life-lately-instagram-scrapbook-carousel-canva-template" },
                        { title: "Photo Dump", subtitle: "Scrapbook Carousel", image: "https://sumincreates.com/cdn/shop/files/4_07e614de-8fc2-4032-a500-14ab90aae983.png?v=1753083317", href: "https://sumincreates.com/products/photo-dump-instagram-scrapbook-carousel-post-canva-template" },
                        { title: "Seamless Minimal", subtitle: "Clean Carousel", image: "https://sumincreates.com/cdn/shop/files/kofi_cover.png?v=1758342050", href: "https://sumincreates.com/products/seamless-minimal-instagram-carousel" },
                        { title: "Cozy Aesthetic", subtitle: "20 Story Bundle", image: "https://sumincreates.com/cdn/shop/files/minimalretro-17.png?v=1771678066", href: "https://sumincreates.com/products/20-instagram-story-templates-cozy-aesthetic-bundle-soft-tones-clean-layouts" },
                        { title: "Pink Aesthetic", subtitle: "Scrapbook Carousel", image: "https://sumincreates.com/cdn/shop/files/2_acf7c346-c803-4657-a8e8-ff2b9175ed66.png?v=1753083259", href: "https://sumincreates.com/products/pink-aesthetic-scrapbook-carousel-canva" },
                        { title: "Clean White Frame", subtitle: "Carousel Template", image: "https://sumincreates.com/cdn/shop/files/Clean_White_Frame_Carousel.jpg?v=1758685319", href: "https://sumincreates.com/products/clean-white-frame-instagram-carousel-template" },
                      ].map((tpl, i) => (
                        <motion.a
                          key={tpl.title}
                          href={tpl.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                          className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 active:scale-[0.98] flex flex-col"
                        >
                          {/* Product image */}
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            <img
                              src={tpl.image}
                              alt={tpl.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Text */}
                          <div className="p-4 sm:p-5 flex flex-col gap-2 bg-card">
                            <h3 className="font-display font-bold text-foreground text-base sm:text-lg leading-tight">
                              {tpl.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                              {tpl.subtitle}
                            </p>
                            <span className="self-start inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white border-2 border-foreground rounded-full text-[11px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_rgba(74,44,26,0.85)] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_rgba(74,44,26,0.85)]">
                              Buy now
                              <span className="text-primary">→</span>
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 border-t border-border mt-auto text-center flex flex-col items-center gap-6 z-10 relative bg-background">
        <p className="font-medium text-foreground max-w-md">
          Made by Sumin. More free tools, templates & content over at{" "}
          <a href="https://sumincreates.com" target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-2 underline-offset-4 hover:text-primary transition-colors">
            sumincreates
          </a>{" "}
          — come hang out.
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold text-muted-foreground">
          {[
            { label: "Instagram", href: "https://www.instagram.com/sumincreates" },
            { label: "YouTube", href: "https://www.youtube.com/@sumincreates" },
            { label: "sumincreates.com", href: "https://sumincreates.com" },
            { label: "Pinterest", href: "https://www.pinterest.com/sumincreates" },
            { label: "Buy me a coffee", href: "https://ko-fi.com/L4L518O0RM" },
          ].map((link, i, arr) => (
            <React.Fragment key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                {link.label}
              </a>
              {i < arr.length - 1 && <span>·</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs font-semibold text-muted-foreground/70 tracking-wide mt-4">
          © Koefo by sumincreates · Free forever · No uploads · No data stored
        </p>
      </footer>
    </div>
  );
}
