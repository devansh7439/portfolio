'use client';

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Project } from "@/lib/projects";
import { ChevronLeft, ChevronRight, X, Github } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideElementsRef = useRef<HTMLElement[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const totalSlides = projects.length + 1;

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const nextCanScrollLeft = scrollLeft > 10;
      const nextCanScrollRight = scrollLeft < scrollWidth - clientWidth - 10;
      setCanScrollLeft((prev) => (prev === nextCanScrollLeft ? prev : nextCanScrollLeft));
      setCanScrollRight((prev) => (prev === nextCanScrollRight ? prev : nextCanScrollRight));
    }
  }, []);

  const refreshSlidesCache = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    slideElementsRef.current = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slide-index]')
    );
  }, []);

  const getClosestSlideIndex = useCallback((container: HTMLDivElement, slides: HTMLElement[]) => {
    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const slide of slides) {
      const slideIndex = Number(slide.dataset.slideIndex ?? -1);
      if (Number.isNaN(slideIndex) || slideIndex < 0) continue;

      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const distance = Math.abs(slideCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = slideIndex;
      }
    }

    return closestIndex;
  }, []);

  const updateActiveSlide = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slides = slideElementsRef.current;
    if (slides.length === 0) return;

    const closestIndex = getClosestSlideIndex(container, slides);
    setActiveSlide((prev) => (prev === closestIndex ? prev : closestIndex));
  }, [getClosestSlideIndex]);

  const scrollToSlide = useCallback((slideIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const clampedIndex = Math.max(0, Math.min(totalSlides - 1, slideIndex));
    const slide =
      slideElementsRef.current[clampedIndex] ??
      container.querySelector<HTMLElement>(`[data-slide-index="${clampedIndex}"]`);
    if (!slide) return;

    const centeredLeft = slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const targetLeft = Math.max(0, Math.min(centeredLeft, maxScrollLeft));

    container.scrollTo({ left: targetLeft, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [shouldReduceMotion, totalSlides]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        checkScrollability();
        updateActiveSlide();
        frame = 0;
      });
    };

    const handleResize = () => {
      refreshSlidesCache();
      checkScrollability();
      updateActiveSlide();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    refreshSlidesCache();
    handleResize();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [checkScrollability, updateActiveSlide, refreshSlidesCache]);

  const scrollLeft = useCallback(() => {
    scrollToSlide(activeSlide - 1);
  }, [activeSlide, scrollToSlide]);

  const scrollRight = useCallback(() => {
    scrollToSlide(activeSlide + 1);
  }, [activeSlide, scrollToSlide]);
  const openProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);
  const closeProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    window.lenis?.stop?.();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape') {
        event.preventDefault();
        closeProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      window.lenis?.start?.();
    };
  }, [selectedProject, closeProject]);

  if (projects.length === 0) {
    return (
      <section className="min-h-screen w-full py-20 overflow-hidden">
        <div className="px-5 md:px-10 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "var(--font-gravitas-one)" }}
            className={`text-4xl md:text-5xl font-bold tracking-tight max-w-7xl mx-auto text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <span className={`about-heading-aurora ${isDark ? "about-heading-aurora--dark" : "about-heading-aurora--light"}`}>
              <span className="about-heading-aurora__text">Projects</span>
            </span>
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`w-16 h-px mx-auto mt-6 ${isDark ? 'bg-white/30' : 'bg-black/30'}`}
          />
        </div>
        <div className={`text-center py-20 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          <p className="text-2xl font-light tracking-widest uppercase">Coming Soon</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full py-20 overflow-hidden" style={{ fontFamily: "var(--font-poppins)" }}>
      <div id="projects" className="px-5 md:px-10 mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "var(--font-gravitas-one)" }}
          className={`text-4xl md:text-5xl font-bold tracking-tight max-w-7xl mx-auto text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          <span className={`about-heading-aurora ${isDark ? "about-heading-aurora--dark" : "about-heading-aurora--light"}`}>
            <span className="about-heading-aurora__text">Projects</span>
          </span>
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-16 h-px mx-auto mt-6 ${isDark ? 'bg-white/30' : 'bg-black/30'}`}
        />
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow - Water Drop Effect - Aligned with project cards */}
        {/* Left Arrow - Glassmorphism */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: canScrollLeft ? 1 : 0, x: canScrollLeft ? 0 : -20 }}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-2 md:left-8 top-[150px] md:top-[175px] -translate-y-1/2 z-20 p-3 md:p-4 rounded-full 
            backdrop-blur-md
            transition-all duration-300 ease-out
            disabled:opacity-0 disabled:cursor-default 
            group/arrow
            ${
              isDark 
                ? 'bg-white/10 border border-white/20 hover:bg-white/20 text-white shadow-lg' 
                : 'bg-black/5 border border-black/10 hover:bg-black/10 text-gray-900 shadow-lg'
            } hover:scale-110 active:scale-95`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>

        {/* Right Arrow - Water Drop Effect - Aligned with project cards */}
        {/* Right Arrow - Glassmorphism */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: canScrollRight ? 1 : 0, x: canScrollRight ? 0 : 20 }}
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute right-2 md:right-8 top-[150px] md:top-[175px] -translate-y-1/2 z-20 p-3 md:p-4 rounded-full 
            backdrop-blur-md
            transition-all duration-300 ease-out
            disabled:opacity-0 disabled:cursor-default 
            group/arrow
            ${
              isDark 
                ? 'bg-white/10 border border-white/20 hover:bg-white/20 text-white shadow-lg' 
                : 'bg-black/5 border border-black/10 hover:bg-black/10 text-gray-900 shadow-lg'
            } hover:scale-110 active:scale-95`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 px-5 md:px-10 overflow-x-auto overflow-y-hidden pb-8 snap-x snap-proximity scroll-smooth"
          style={{ 
            overscrollBehaviorX: 'contain',
            WebkitOverflowScrolling: 'touch',
            contain: 'layout paint style',
            willChange: 'scroll-position',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug}
              data-slide-index={index}
              onClick={() => openProject(project)}
              className="group/card relative flex-shrink-0 w-[85vw] md:w-[500px] h-[300px] md:h-[350px] rounded-2xl overflow-hidden snap-center transition-all duration-500 hover:scale-[1.02] cursor-pointer transform-gpu will-change-transform"
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* Liquid Glass Card Background */}
              <div className={`absolute inset-0 backdrop-blur-md md:backdrop-blur-xl rounded-2xl transition-all duration-500 ${
                isDark 
                ? 'card-surface-pulse bg-gradient-to-br from-white/[0.15] via-white/[0.05] to-transparent border border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.15),0_6px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1)]' 
                : 'card-surface-pulse bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/60'
            }`} />
              
              {/* Inner gradient shine */}
              <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
                isDark 
                ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-transparent' 
                : 'bg-gradient-to-br from-white/40 via-white/10 to-transparent'
              }`} />
              <div className={`absolute inset-0 rounded-2xl pointer-events-none card-sheen-loop ${
                isDark
                  ? 'bg-gradient-to-r from-transparent via-white/[0.16] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-white/[0.38] to-transparent'
              }`} />
              
              {/* Background Image */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 rounded-2xl ${
                  isDark 
                    ? 'opacity-50 group-hover/card:opacity-30' 
                    : 'opacity-70 group-hover/card:opacity-50'
                }`}
                style={{ backgroundImage: `url(${project.image})` }}
              />
              
              {/* Subtle Gradient Overlay */}
              <div className={`absolute inset-0 rounded-2xl ${
                isDark 
                  ? 'bg-gradient-to-t from-black/90 via-black/60 to-transparent' 
                  : 'bg-gradient-to-t from-white/70 via-white/40 to-transparent'
              }`} />
              
              {/* Content */}
              <div className="relative h-full p-8 grid content-end grid-rows-[14px_minmax(2.75rem,auto)_minmax(2.75rem,auto)_minmax(2.25rem,auto)] gap-y-2">
                <span className={`block w-full text-center text-[10px] uppercase tracking-[0.2em] leading-[14px] truncate ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                  {project.category}
                </span>
                <h3 className={`w-full text-center font-medium text-2xl md:text-3xl tracking-tight leading-tight min-h-[2.75rem] md:min-h-[3.25rem] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="block overflow-hidden max-h-[3.4rem]">
                    {project.title}
                  </span>
                </h3>
                <p
                  className={`text-sm leading-relaxed text-center min-h-[2.75rem] max-h-[2.9rem] overflow-hidden opacity-100 ${isDark ? 'text-white/80' : 'text-gray-900'}`}
                >
                  {project.description}
                </p>
                
                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap items-start justify-center gap-2 min-h-[2.25rem] opacity-90 group-hover/card:opacity-100 transition-opacity duration-300">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={`text-[10px] px-2 py-1 rounded-full card-chip-pulse ${
                        isDark 
                          ? 'bg-white/10 text-white/70' 
                          : 'bg-black/10 text-gray-800'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(!project.tags || project.tags.length === 0) && <div className="min-h-[2.25rem]" />}
              </div>
              
              {/* Liquid bottom line animation */}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700 origin-center ${
                isDark ? 'via-white/30' : 'via-black/30'
              }`} />
            </div>
          ))}
          
          {/* Project Coming Soon Title Card - At the End */}
          <motion.div
            data-slide-index={projects.length}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            viewport={{ once: true }}
            className="group/card relative flex-shrink-0 w-[85vw] md:w-[500px] h-[300px] md:h-[350px] rounded-2xl overflow-hidden snap-center transition-all duration-500 transform-gpu will-change-transform"
            style={{ scrollSnapAlign: 'center' }}
          >
            {/* Liquid Glass Card Background */}
            <div className={`absolute inset-0 backdrop-blur-md md:backdrop-blur-xl rounded-2xl transition-all duration-500 ${
              isDark 
                ? 'card-surface-pulse bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36)] group-hover/card:border-white/[0.15] group-hover/card:shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
                : 'card-surface-pulse bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover/card:border-white/80 group-hover/card:shadow-[0_12px_40px_rgba(0,0,0,0.15)] group-hover/card:bg-white/70'
            }`} />
            
            {/* Inner gradient shine */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
              isDark 
                ? 'bg-gradient-to-br from-white/[0.05] via-transparent to-transparent' 
                : 'bg-gradient-to-br from-white/40 via-white/10 to-transparent'
            }`} />
            <div className={`absolute inset-0 rounded-2xl pointer-events-none card-sheen-loop ${
              isDark
                ? 'bg-gradient-to-r from-transparent via-white/[0.16] to-transparent'
                : 'bg-gradient-to-r from-transparent via-white/[0.38] to-transparent'
            }`} />
            
            {/* Animated gradient background */}
            <div className={`absolute inset-0 rounded-2xl opacity-50 group-hover/card:opacity-80 transition-opacity duration-700 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10' 
                : 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5'
            }`} />
            
            {/* Subtle Gradient Overlay */}
            <div className={`absolute inset-0 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-t from-black/90 via-black/60 to-transparent' 
                : 'bg-gradient-to-t from-white/90 via-white/60 to-transparent'
            }`} />
            
            {/* Content */}
            <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
              <span className={`text-[10px] uppercase tracking-[0.3em] mb-4 ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                Stay Tuned
              </span>
              <h3 className={`font-bold text-4xl md:text-5xl mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${
                isDark 
                  ? 'from-purple-300 via-white to-pink-300' 
                  : 'from-purple-600 via-gray-900 to-pink-600'
              }`}>
                Project
              </h3>
              <h3 className={`font-bold text-4xl md:text-5xl mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${
                isDark 
                  ? 'from-purple-300 via-white to-pink-300' 
                  : 'from-purple-600 via-gray-900 to-pink-600'
              }`}>
                Coming Soon
              </h3>
              <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                More exciting projects are on the way. Stay tuned for updates!
              </p>
              
              {/* Animated dots */}
              <div className="flex gap-2 mt-8">
                <motion.div 
                  className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/30'}`}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/30'}`}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/30'}`}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
            
            {/* Liquid bottom line animation */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700 origin-center ${
              isDark 
                ? 'from-purple-500/50 via-white/30 to-pink-500/50' 
                : 'from-purple-500/30 via-black/20 to-pink-500/30'
            }`} />
          </motion.div>
          
          {/* Spacer for last item */}
          <div className="flex-shrink-0 w-5 md:w-20" />
        </div>

        {/* Slide indicator dots (mobile) */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-4 px-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? `w-6 h-2 ${isDark ? 'bg-white/80' : 'bg-black/70'}`
                  : `w-2 h-2 ${isDark ? 'bg-white/25' : 'bg-black/20'}`
              }`}
            />
          ))}
        </div>

      </div>

      {/* Project Modal */}
      <AnimatePresence mode="wait" initial={false}>
        {selectedProject && (
          <motion.div
            key={selectedProject.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close project modal"
              onClick={closeProject}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10, scale: shouldReduceMotion ? 1 : 0.99 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 34,
                mass: 0.7,
              }}
              onClick={(event) => event.stopPropagation()}
              style={{ willChange: 'transform, opacity' }}
              className={`relative w-full max-w-6xl max-h-[95dvh] md:max-h-[90vh] min-h-0 overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row transform-gpu ${
                isDark ? 'bg-[#0a0a0a] border border-white/10' : 'bg-white border border-black/10'
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                aria-label="Close popup"
                onClick={closeProject}
                className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-colors ${
                  isDark
                    ? 'bg-black/50 text-white hover:bg-white/20'
                    : 'bg-white/50 text-black hover:bg-black/10'
                }`}
              >
                <X size={24} />
              </button>

              {/* Media Section (Left/Top) */}
              <div className="w-full md:w-3/5 flex-shrink-0 h-[28vh] sm:h-[32vh] md:h-auto relative bg-black flex items-center justify-center overflow-hidden">
                {selectedProject.video ? (
                  <div className="relative w-full h-full">
                    <iframe
                      src={selectedProject.video}
                      className="w-full h-full absolute inset-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={selectedProject.title}
                    />
                  </div>
                ) : (
                  <motion.img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay Gradient on image/video */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Details Section (Right/Bottom) */}
              <div className={`flex-1 min-h-0 w-full md:w-2/5 p-5 sm:p-8 md:p-12 flex flex-col overflow-y-auto overscroll-contain ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: shouldReduceMotion ? 0 : 0.2 }}
                  className="flex min-h-0 h-full flex-col"
                >
                  <div
                    className="flex flex-col"
                  >
                    <span className={`text-xs font-bold tracking-widest uppercase mb-3 block ${
                      isDark ? 'text-violet-400' : 'text-violet-600'
                    }`}>
                      {selectedProject.category}
                    </span>

                    <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                      {selectedProject.title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5 mb-4 md:mb-8">
                      {selectedProject.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                            isDark
                              ? 'bg-white/10 text-white/80 border border-white/10'
                              : 'bg-black/5 text-gray-700 border border-black/5'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
                      isDark ? 'text-white/70' : 'text-gray-600'
                    }`}>
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* GitHub Button */}
                  {selectedProject.github && (
                    <div className={`mt-4 pt-4 border-t shrink-0 ${
                      isDark ? 'border-white/10' : 'border-black/10'
                    }`}>
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold border transition-all duration-300 ${
                          isDark
                            ? 'border-white/20 hover:bg-white/10 text-white'
                            : 'border-black/10 hover:bg-black/5 text-gray-900'
                        }`}
                      >
                        <Github size={20} />
                        <span>Source Code</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

