import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import { showcaseAPI } from "../services/api";
import { getImageUrl } from "../utils/config";
import "./ShowcaseSlider.css";

interface Slide {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  order: number;
  isActive: boolean;
}

// Image cache to avoid re-loading
const imageCache = new Set<string>();

// Preload single image with caching
const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
};

function ShowcaseSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get indices to preload (current, prev, next)
  const getAdjacentIndices = useCallback(
    (index: number, total: number): number[] => {
      if (total <= 1) return [0];
      const prev = (index - 1 + total) % total;
      const next = (index + 1) % total;
      return [prev, index, next];
    },
    []
  );

  // Lazy load adjacent images only
  const preloadAdjacentImages = useCallback(
    async (index: number, slideData: Slide[]) => {
      if (slideData.length === 0) return;

      const indices = getAdjacentIndices(index, slideData.length);
      const toLoad = indices.filter((i) => !loadedImages.has(i));

      if (toLoad.length === 0) return;

      // Use requestIdleCallback for non-blocking preload
      const loadFn = async () => {
        await Promise.all(
          toLoad.map((i) => preloadImage(getImageUrl(slideData[i].image)))
        );
        setLoadedImages((prev) => {
          const next = new Set(prev);
          toLoad.forEach((i) => next.add(i));
          return next;
        });
      };

      if ("requestIdleCallback" in window) {
        (window as Window).requestIdleCallback(() => loadFn(), {
          timeout: 2000,
        });
      } else {
        setTimeout(loadFn, 100);
      }
    },
    [loadedImages, getAdjacentIndices]
  );

  // Intersection Observer for viewport detection
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Fetch data (no blocking preload)
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const response = await showcaseAPI.getAll();
        const data: Slide[] = response.data || [];

        if (isMounted) {
          setSlides(data);
          // Only preload first image before showing
          if (data.length > 0) {
            await preloadImage(getImageUrl(data[0].image));
            setLoadedImages(new Set([0]));
          }
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error loading slides:", error);
        if (isMounted) setIsReady(true);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Preload adjacent when index changes
  useEffect(() => {
    if (isReady && slides.length > 0 && isInView) {
      preloadAdjacentImages(currentIndex, slides);
    }
  }, [currentIndex, isReady, slides, isInView, preloadAdjacentImages]);

  // Auto-play only when in viewport
  useEffect(() => {
    if (!isReady || slides.length <= 1 || !isInView) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReady, slides.length, isInView]);

  // Memoized slide rendering
  const renderedSlides = useMemo(() => {
    return slides.map((slide, index) => {
      const isLoaded = loadedImages.has(index);
      const isActive = index === currentIndex;
      const shouldRender = isLoaded || isActive;

      return (
        <div
          key={slide._id}
          className={`showcase-slider__slide ${
            isActive ? "showcase-slider__slide--active" : ""
          }`}
          style={{ willChange: isActive ? "opacity, transform" : "auto" }}
        >
          {shouldRender && (
            <div
              className="showcase-slider__image"
              style={{
                backgroundImage: `url(${getImageUrl(slide.image)})`,
                willChange: "transform",
              }}
            />
          )}
          <div className="showcase-slider__overlay" />
          <div className="showcase-slider__content">
            <h2 className="showcase-slider__title">{slide.title}</h2>
            {slide.subtitle && (
              <p className="showcase-slider__subtitle">{slide.subtitle}</p>
            )}
          </div>
        </div>
      );
    });
  }, [slides, currentIndex, loadedImages]);

  // Loading placeholder (lightweight)
  if (!isReady) {
    return (
      <section className="showcase-slider__loading" ref={containerRef}>
        <div className="showcase-slider__spinner" />
      </section>
    );
  }

  // No slides
  if (slides.length === 0) return null;

  return (
    <section className="showcase-slider" ref={containerRef}>
      {renderedSlides}

      <div className="showcase-slider__progress-container">
        <div key={currentIndex} className="showcase-slider__progress-bar" />
      </div>
    </section>
  );
}

export default memo(ShowcaseSlider);
