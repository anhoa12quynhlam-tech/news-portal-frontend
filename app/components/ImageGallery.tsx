/**
 * ImageGallery Component
 * Displays all images vertically in a gallery format
 * No carousel - all images visible at once
 * Hover effects: Scale up + Brightness
 */

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      {images.map((image, index) => (
        <div
          key={index}
          className="w-full overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
        >
          <img
            src={image}
            alt={`${title} - ${index + 1}`}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-100 group-hover:brightness-110"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
