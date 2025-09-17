import React, { useState, useEffect, useContext } from "react";
import { AppContext } from '../../contexts/AppContext.js';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slides, loading } = useContext(AppContext);

  // Fallback slides
  const fallbackSlides = [
    { 
      image: "/images/slide1.png", 
      alt: "BioEkleel Hero 1"
    },
    { 
      image: "/images/slide2.png", 
      alt: "BioEkleel Hero 2"
    },
  ];

  const displaySlides = slides && slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displaySlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return React.createElement(
    'section',
    { className: 'relative w-full hero-section overflow-hidden' },
    React.createElement(
      'div',
      { className: 'relative w-full h-full' },
      displaySlides.map((slide, index) =>
        React.createElement(
          'div',
          {
            key: index,
            className: `hero-slide ${index === currentSlide ? "opacity-100" : "opacity-0"}`
          },
          React.createElement('img', {
            src: slide.image || "/placeholder.svg",
            alt: slide.alt || "BioEkleel Hero",
            className: "w-full h-full object-cover",
            loading: "eager"
          })
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'hero-dots' },
      displaySlides.map((_, index) =>
        React.createElement('button', {
          key: index,
          onClick: () => goToSlide(index),
          className: `hero-dot ${index === currentSlide ? 'active' : ''}`,
          'aria-label': `Go to slide ${index + 1}`
        })
      )
    )
  );
}