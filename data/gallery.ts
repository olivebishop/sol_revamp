export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "wildlife" | "landscapes" | "culture" | "adventure" | "beaches";
  title: string;
  location: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/gallery/buffalo.jpg",
    alt: "African Buffalo in the wild",
    category: "wildlife",
    title: "Majestic Buffalo",
    location: "Masai Mara, Kenya",
  },
  {
    id: 2,
    src: "/images/gallery/one.webp",
    alt: "Safari adventure scene",
    category: "adventure",
    title: "Safari Experience",
    location: "Tanzania",
  },
  {
    id: 3,
    src: "/images/gallery/two.webp",
    alt: "Wildlife encounter",
    category: "wildlife",
    title: "Wildlife Encounter",
    location: "Serengeti",
  },
  {
    id: 4,
    src: "/images/gallery/three.webp",
    alt: "African landscape",
    category: "landscapes",
    title: "Stunning Landscapes",
    location: "East Africa",
  },
  {
    id: 5,
    src: "/images/gallery/ambolife.jpg",
    alt: "Wildlife at Amboseli",
    category: "wildlife",
    title: "Amboseli Wildlife",
    location: "Amboseli, Kenya",
  },
  {
    id: 6,
    src: "/images/gallery/a.jpg",
    alt: "African scenery",
    category: "landscapes",
    title: "Natural Beauty",
    location: "Kenya",
  },
  {
    id: 7,
    src: "/images/gallery/c.jpg",
    alt: "Adventure moment",
    category: "adventure",
    title: "Adventure Awaits",
    location: "East Africa",
  },
  {
    id: 8,
    src: "/images/gallery/e.jpg",
    alt: "Beautiful landscape",
    category: "landscapes",
    title: "Breathtaking Views",
    location: "Tanzania",
  },
];

export const categories = [
  { id: "all", label: "All" },
  { id: "wildlife", label: "Wildlife" },
  { id: "landscapes", label: "Landscapes" },
  { id: "adventure", label: "Adventure" },
  { id: "culture", label: "Culture" },
  { id: "beaches", label: "Beaches" },
] as const;
