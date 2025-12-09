import { useState, useEffect, useRef, memo } from "react";
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

// Preload single image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
};

function ShowcaseSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch and preload
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const response = await showcaseAPI.getAll();
        const data: Slide[] = response.data || [];

        if (data.length === 0) {
          if (isMounted) setIsReady(true);
          return;
        }

        // Preload all images
        await Promise.all(
          data.map((slide) => preloadImage(getImageUrl(slide.image)))
        );

        if (isMounted) {
          setSlides(data);
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

  // Auto-play
  useEffect(() => {
    if (!isReady || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReady, slides.length]);

  // Loading
  if (!isReady) {
    return (
      <section className="showcase-slider__loading">
        <div className="showcase-slider__spinner" />
      </section>
    );
  }

  // No slides
  if (slides.length === 0) return null;

  return (
    <section className="showcase-slider">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`showcase-slider__slide ${
            index === currentIndex ? "showcase-slider__slide--active" : ""
          }`}
        >
          <div
            className="showcase-slider__image"
            style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
          />
          <div className="showcase-slider__overlay" />
          <div className="showcase-slider__content">
            <h2 className="showcase-slider__title">{slide.title}</h2>
            {slide.subtitle && (
              <p className="showcase-slider__subtitle">{slide.subtitle}</p>
            )}
          </div>
        </div>
      ))}

      <div className="showcase-slider__progress-container">
        <div key={currentIndex} className="showcase-slider__progress-bar" />
      </div>
    </section>
  );
}

export default memo(ShowcaseSlider);
