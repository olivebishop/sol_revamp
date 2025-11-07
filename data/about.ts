import { Globe, Users, Award, MapPin, Compass, Star, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface WhyChooseUs {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export const stats: Stat[] = [
  { icon: Globe, value: "10+", label: "Countries" },
  { icon: Users, value: "1000+", label: "Happy Travelers" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: MapPin, value: "50+", label: "Destinations" },
];

export const whyChooseUs: WhyChooseUs[] = [
  {
    title: "Local Expertise",
    description: "Deep knowledge of Africa's hidden gems and authentic experiences",
    image: "/images/elephant.png",
    icon: Compass,
  },
  {
    title: "Premium Service",
    description: "Luxury accommodations and personalized attention to detail",
    image: "/images/beach.png",
    icon: Star,
  },
  {
    title: "Cultural Connection",
    description: "Meaningful interactions with local communities and traditions",
    image: "/images/birds.png",
    icon: Heart,
  },
];

export const team: TeamMember[] = [
  {
    name: "Michael Kisangi",
    role: "Founder & Lead Guide",
    quote: "Bringing Africa's magic to life through unforgettable journeys.",
    image: "/images/mike.jpg",
  },
  {
    name: "Nelson Pere",
    role: "Driver/Guide",
    quote: "Creating seamless experiences across the African continent.",
    image: "/images/elephant.png",
  },
  {
    name: "Jennifer Brubaker",
    role: "Client Relations",
    quote: "Every safari tells a unique story of Africa's wilderness.",
    image: "/images/jeniffer.jpg",
  },
];

