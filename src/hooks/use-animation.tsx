
import { useEffect, useState } from "react";

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getScrollAnimation = (threshold = 100) => {
    return {
      opacity: scrollY > threshold ? 1 : 0,
      y: scrollY > threshold ? 0 : 20,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    };
  };

  return { scrollY, getScrollAnimation };
}

export function useIntersectionAnimation(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, isVisible };
}
