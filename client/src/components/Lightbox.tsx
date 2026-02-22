import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@/hooks/useContent";

interface LightboxProps {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  isOpen,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNext();
      if (e.key === "ArrowRight") onPrevious();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`גלריית תמונות - ${currentImage.alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Main content */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 animate-in scale-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container */}
        <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="סגור גלריה"
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 transition-all duration-300"
          onClick={onClose}
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </Button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="תמונה קודמת"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 transition-all duration-300"
              onClick={onPrevious}
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="תמונה הבאה"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 transition-all duration-300"
              onClick={onNext}
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </Button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium" aria-live="polite" aria-atomic="true">
          <span className="sr-only">תמונה </span>{currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
