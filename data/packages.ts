export interface PackageData {
  id: string;
  name: string;
  slug: string;
  packageType:
    | "safari"
    | "beach"
    | "cultural"
    | "adventure"
    | "luxury"
    | "mixed";
  description: string;
  pricing: number;
  daysOfTravel: number;
  images: string[];
  availability: "open" | "booked";
  maxCapacity: number;
  currentBookings: number;
  isActive: boolean;
  destination: {
    id: string;
    name: string;
    slug: string;
    bestTime: string;
  };
}

export const packages: PackageData[] = [
  {
    id: "pkg_001",
    name: "Ultimate Wildlife Safari Experience",
    slug: "ultimate-wildlife-safari-experience",
    packageType: "safari",
    description:
      "Embark on an unforgettable journey through the savannah, witnessing the majestic Big Five in their natural habitat. This comprehensive safari package includes game drives at dawn and dusk, expert guides, luxury tented accommodation, and all meals.",
    pricing: 3499,
    daysOfTravel: 7,
    images: ["/images/lion.png", "/images/elephant.png", "/images/giraffe.png"],
    availability: "open",
    maxCapacity: 12,
    currentBookings: 8,
    isActive: true,
    destination: {
      id: "dest_001",
      name: "Maasai Mara",
      slug: "maasai-mara",
      bestTime: "July - October",
    },
  },
  {
    id: "pkg_002",
    name: "Coastal Paradise Getaway",
    slug: "coastal-paradise-getaway",
    packageType: "beach",
    description:
      "Relax on pristine white sandy beaches with crystal-clear turquoise waters and explore vibrant coral reefs. This beach escape includes snorkeling excursions, sunset dhow cruises, beachfront accommodation, and authentic Swahili cuisine.",
    pricing: 1899,
    daysOfTravel: 5,
    images: ["/images/beach.png", "/images/sea.png"],
    availability: "open",
    maxCapacity: 8,
    currentBookings: 3,
    isActive: true,
    destination: {
      id: "dest_002",
      name: "Zanzibar",
      slug: "zanzibar",
      bestTime: "June - October, December - February",
    },
  },
  {
    id: "pkg_003",
    name: "Majestic Elephant Sanctuary Tour",
    slug: "majestic-elephant-sanctuary-tour",
    packageType: "safari",
    description:
      "Get up close with gentle giants and learn about elephant conservation efforts in their protected habitat. This intimate experience includes guided walks with elephant herds, visits to conservation centers, and photographic opportunities.",
    pricing: 2299,
    daysOfTravel: 4,
    images: ["/images/elephant.png", "/images/giraffe.png"],
    availability: "open",
    maxCapacity: 10,
    currentBookings: 6,
    isActive: true,
    destination: {
      id: "dest_003",
      name: "Amboseli National Park",
      slug: "amboseli-national-park",
      bestTime: "June - October, January - February",
    },
  },
  {
    id: "pkg_004",
    name: "Serengeti Great Migration",
    slug: "serengeti-great-migration",
    packageType: "luxury",
    description:
      "Witness nature's greatest spectacle as millions of wildebeest and zebra cross the plains in their annual migration. This premium package offers exclusive game drives, hot air balloon safaris, luxury lodge accommodation, and gourmet dining.",
    pricing: 5499,
    daysOfTravel: 10,
    images: ["/images/giraffe.png", "/images/elephant.png", "/images/lion.png"],
    availability: "open",
    maxCapacity: 15,
    currentBookings: 12,
    isActive: true,
    destination: {
      id: "dest_004",
      name: "Serengeti National Park",
      slug: "serengeti-national-park",
      bestTime: "December - July (Migration varies)",
    },
  },
  {
    id: "pkg_005",
    name: "Underwater Adventure Diving",
    slug: "underwater-adventure-diving",
    packageType: "adventure",
    description:
      "Explore vibrant coral reefs and swim alongside tropical fish, turtles, and dolphins in crystal-clear Indian Ocean waters. This diving package includes PADI certification options, multiple dive sites, equipment rental, and beachfront accommodation.",
    pricing: 1299,
    daysOfTravel: 3,
    images: ["/images/sea.png", "/images/beach.png"],
    availability: "open",
    maxCapacity: 6,
    currentBookings: 2,
    isActive: true,
    destination: {
      id: "dest_005",
      name: "Mombasa Marine Park",
      slug: "mombasa-marine-park",
      bestTime: "October - March",
    },
  },
  {
    id: "pkg_006",
    name: "Birdwatching Paradise",
    slug: "birdwatching-paradise",
    packageType: "safari",
    description:
      "Discover hundreds of exotic bird species in lush wetlands and forests with expert ornithologist guides. This specialized tour includes visits to multiple birding hotspots, professional photography guidance, and comfortable lodge stays.",
    pricing: 1799,
    daysOfTravel: 5,
    images: ["/images/birds.png", "/images/giraffe.png"],
    availability: "open",
    maxCapacity: 8,
    currentBookings: 5,
    isActive: true,
    destination: {
      id: "dest_006",
      name: "Lake Nakuru National Park",
      slug: "lake-nakuru-national-park",
      bestTime: "November - April",
    },
  },
  {
    id: "pkg_007",
    name: "Luxury Safari & Beach Combo",
    slug: "luxury-safari-beach-combo",
    packageType: "mixed",
    description:
      "Experience the best of both worlds with thrilling game drives followed by beachside relaxation. This ultimate combination package includes 7 days of safari adventure followed by 7 days of beach bliss with luxury accommodations throughout.",
    pricing: 6999,
    daysOfTravel: 14,
    images: ["/images/lion.png", "/images/beach.png", "/images/elephant.png"],
    availability: "open",
    maxCapacity: 10,
    currentBookings: 7,
    isActive: true,
    destination: {
      id: "dest_007",
      name: "Kenya & Tanzania Multi-Destination",
      slug: "kenya-tanzania-multi",
      bestTime: "Year-round (varies by component)",
    },
  },
  {
    id: "pkg_008",
    name: "Mountain Trekking Adventure",
    slug: "mountain-trekking-adventure",
    packageType: "adventure",
    description:
      "Challenge yourself with guided treks through stunning mountain landscapes and diverse ecosystems. This adventure package includes acclimatization hikes, summit attempts, experienced mountain guides, and mountain huts accommodation.",
    pricing: 2799,
    daysOfTravel: 6,
    images: ["/images/giraffe.png", "/images/elephant.png"],
    availability: "open",
    maxCapacity: 12,
    currentBookings: 4,
    isActive: true,
    destination: {
      id: "dest_008",
      name: "Mount Kenya",
      slug: "mount-kenya",
      bestTime: "January - February, August - September",
    },
  },
  {
    id: "pkg_009",
    name: "Cultural Heritage Experience",
    slug: "cultural-heritage-experience",
    packageType: "cultural",
    description:
      "Immerse yourself in local traditions, visit authentic villages, and learn ancient customs from Maasai elders. This cultural journey includes traditional ceremonies, craft workshops, homestay experiences, and storytelling sessions.",
    pricing: 1499,
    daysOfTravel: 4,
    images: ["/images/elephant.png", "/images/giraffe.png"],
    availability: "open",
    maxCapacity: 15,
    currentBookings: 9,
    isActive: true,
    destination: {
      id: "dest_009",
      name: "Maasai Villages",
      slug: "maasai-villages",
      bestTime: "Year-round",
    },
  },
  {
    id: "pkg_010",
    name: "Photography Safari Masterclass",
    slug: "photography-safari-masterclass",
    packageType: "luxury",
    description:
      "Capture stunning wildlife moments with professional photography instruction in prime safari locations. This specialized package includes professional photographer guides, golden hour game drives, photo editing workshops, and luxury tented camps.",
    pricing: 4299,
    daysOfTravel: 8,
    images: ["/images/lion.png", "/images/giraffe.png", "/images/birds.png"],
    availability: "open",
    maxCapacity: 8,
    currentBookings: 5,
    isActive: true,
    destination: {
      id: "dest_001",
      name: "Maasai Mara",
      slug: "maasai-mara",
      bestTime: "July - October",
    },
  },
  {
    id: "pkg_011",
    name: "Family Safari Adventure",
    slug: "family-safari-adventure",
    packageType: "safari",
    description:
      "A family-friendly safari designed for all ages with child-focused activities and educational experiences. This package includes kid-friendly game drives, junior ranger programs, family suites, and cultural visits.",
    pricing: 2899,
    daysOfTravel: 6,
    images: ["/images/elephant.png", "/images/lion.png"],
    availability: "open",
    maxCapacity: 20,
    currentBookings: 14,
    isActive: true,
    destination: {
      id: "dest_003",
      name: "Amboseli National Park",
      slug: "amboseli-national-park",
      bestTime: "June - October, January - February",
    },
  },
  {
    id: "pkg_012",
    name: "Honeymoon Romance Safari",
    slug: "honeymoon-romance-safari",
    packageType: "luxury",
    description:
      "Celebrate your love with an intimate safari experience designed for couples. This romantic package includes private game drives, bush dinners under the stars, couples spa treatments, luxury accommodations, and champagne sundowners.",
    pricing: 5899,
    daysOfTravel: 9,
    images: ["/images/beach.png", "/images/lion.png", "/images/sea.png"],
    availability: "open",
    maxCapacity: 4,
    currentBookings: 2,
    isActive: true,
    destination: {
      id: "dest_007",
      name: "Kenya & Tanzania Multi-Destination",
      slug: "kenya-tanzania-multi",
      bestTime: "Year-round",
    },
  },
];

// Helper functions for filtering
export const getPackagesByType = (type: PackageData["packageType"]) => {
  return packages.filter((pkg) => pkg.packageType === type);
};

export const getAvailablePackages = () => {
  return packages.filter((pkg) => pkg.availability === "open" && pkg.isActive);
};

export const getPackageBySlug = (slug: string) => {
  return packages.find((pkg) => pkg.slug === slug);
};

export const getPackagesByPriceRange = (min: number, max: number) => {
  return packages.filter((pkg) => pkg.pricing >= min && pkg.pricing <= max);
};

export const getPackagesByDuration = (minDays: number, maxDays: number) => {
  return packages.filter(
    (pkg) => pkg.daysOfTravel >= minDays && pkg.daysOfTravel <= maxDays,
  );
};
