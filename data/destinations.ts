export interface DestinationData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  images: string[];
  location: {
    country: string;
    region: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  overview: {
    title: string;
    content: string;
  };
  wildlife: {
    title: string;
    description: string;
    animals: {
      name: string;
      icon: string;
      description: string;
    }[];
  };
  bestTimeToVisit: {
    title: string;
    description: string;
    seasons: {
      period: string;
      weather: string;
      highlights: string;
      recommendation: "best" | "good" | "okay";
    }[];
  };
  thingsToKnow: {
    title: string;
    items: {
      category: string;
      tips: string[];
    }[];
  };
  whatToPack: {
    title: string;
    categories: {
      name: string;
      items: string[];
    }[];
  };
  accommodation: {
    title: string;
    description: string;
    types: {
      name: string;
      description: string;
      priceRange: string;
    }[];
  };
  activities: {
    title: string;
    list: {
      name: string;
      description: string;
      duration: string;
    }[];
  };
  highlights: string[];
  funFacts: string[];
}

export const destinations: DestinationData[] = [
  {
    id: "dest_001",
    name: "Maasai Mara",
    slug: "maasai-mara",
    tagline: "Where the Wild Things Roam",
    description:
      "Experience the world's most spectacular wildlife sanctuary, home to the Great Migration and Africa's iconic Big Five. The Maasai Mara offers unparalleled game viewing year-round in one of the continent's most diverse ecosystems.",
    heroImage: "/images/lion.png",
    images: [
      "/images/lion.png",
      "/images/elephant.png",
      "/images/giraffe.png",
      "/images/zebra.png",
    ],
    location: {
      country: "Kenya",
      region: "Rift Valley",
      coordinates: {
        lat: -1.5,
        lng: 35.14,
      },
    },
    overview: {
      title: "The Crown Jewel of African Safari",
      content:
        "The Maasai Mara National Reserve is Kenya's most famous safari destination and one of Africa's greatest wildlife reserves. Covering 1,510 square kilometers of pristine savannah, this incredible ecosystem is renowned for its exceptional population of lions, leopards, cheetahs, and the annual migration of zebra, Thomson's gazelle, and wildebeest from the Serengeti. The reserve is a photographer's paradise, offering stunning landscapes of rolling grasslands, acacia-dotted plains, and the winding Mara River. Beyond wildlife, the Maasai Mara provides a unique opportunity to experience the rich culture of the Maasai people, who have lived in harmony with nature for centuries.",
    },
    wildlife: {
      title: "Incredible Wildlife Encounters",
      description:
        "The Maasai Mara is home to an extraordinary array of wildlife. Here are some of the magnificent creatures you'll encounter:",
      animals: [
        {
          name: "African Lion",
          icon: "🦁",
          description:
            "The Mara has one of the highest concentrations of lions in Africa. Watch prides lounging in the shade or witness thrilling hunts across the plains.",
        },
        {
          name: "African Elephant",
          icon: "🐘",
          description:
            "Majestic elephant herds roam the reserve, often seen near the Mara River or browsing on acacia trees.",
        },
        {
          name: "Leopard",
          icon: "🐆",
          description:
            "These elusive cats are frequently spotted in the reserve's numerous acacia trees, especially during early morning and late evening drives.",
        },
        {
          name: "Cheetah",
          icon: "🐆",
          description:
            "The Mara's open plains provide perfect hunting grounds for the world's fastest land animal. Watch them sprint at incredible speeds.",
        },
        {
          name: "Black Rhino",
          icon: "🦏",
          description:
            "While rare, the Mara is one of the best places in East Africa to spot these critically endangered giants.",
        },
        {
          name: "Wildebeest",
          icon: "🦌",
          description:
            "Star of the Great Migration, over 1.5 million wildebeest cross the Mara River annually in one of nature's most dramatic spectacles.",
        },
        {
          name: "Zebra",
          icon: "🦓",
          description:
            "Hundreds of thousands of zebras accompany the wildebeest migration, creating stunning black and white patterns across the plains.",
        },
        {
          name: "Giraffe",
          icon: "🦒",
          description:
            "Graceful Masai giraffes browse on acacia trees throughout the reserve, their distinctive pattern making them easy to identify.",
        },
      ],
    },
    bestTimeToVisit: {
      title: "When to Visit Maasai Mara",
      description:
        "The Maasai Mara offers exceptional wildlife viewing year-round, but each season brings unique experiences:",
      seasons: [
        {
          period: "July - October",
          weather: "Dry season, warm days (25-28°C), cool nights",
          highlights:
            "The Great Migration river crossings, peak wildlife viewing, minimal rainfall, excellent photography conditions",
          recommendation: "best",
        },
        {
          period: "January - March",
          weather: "Dry and warm (26-30°C), occasional light rains",
          highlights:
            "Calving season for wildebeest, fewer tourists, lush green landscapes, great birding",
          recommendation: "good",
        },
        {
          period: "June & November",
          weather: "Transitional periods, mild temperatures",
          highlights:
            "Good wildlife viewing, reasonable prices, moderate crowds, pleasant weather",
          recommendation: "good",
        },
        {
          period: "April - May",
          weather: "Long rains, heavy afternoon showers (23-26°C)",
          highlights:
            "Lowest prices, dramatic skies, newborn animals, vibrant vegetation, serious photographers love this time",
          recommendation: "okay",
        },
      ],
    },
    thingsToKnow: {
      title: "Essential Tips for Your Safari",
      items: [
        {
          category: "Health & Safety",
          tips: [
            "Yellow fever vaccination is required if coming from endemic areas",
            "Malaria prophylaxis is recommended - consult your doctor",
            "Bring sunscreen (SPF 50+) and insect repellent with DEET",
            "Stay in your vehicle during game drives unless authorized by your guide",
            "Maintain a safe distance from all wildlife",
            "Travel insurance with medical evacuation coverage is highly recommended",
          ],
        },
        {
          category: "Cultural Etiquette",
          tips: [
            "Always ask permission before photographing Maasai people",
            "Dress modestly when visiting Maasai villages (covered shoulders and knees)",
            "Remove shoes when entering traditional Maasai homes",
            "Negotiate prices for souvenirs respectfully",
            "A small gift or tip is appreciated when visiting communities",
          ],
        },
        {
          category: "Photography Tips",
          tips: [
            "Bring a telephoto lens (200-400mm minimum) for wildlife shots",
            "Early morning (6-9am) and late afternoon (4-7pm) offer the best light",
            "Bring extra batteries and memory cards - you'll need them!",
            "A bean bag or window mount helps stabilize shots from vehicles",
            "Avoid flash photography as it disturbs wildlife",
          ],
        },
        {
          category: "Money & Costs",
          tips: [
            "US dollars and Kenyan Shillings are widely accepted",
            "Credit cards work in lodges but bring cash for tips and souvenirs",
            "Budget $20-30 per day for tips (guides, drivers, lodge staff)",
            "ATMs are available in nearby towns but not in the reserve",
            "Expect to pay conservation fees at entry points",
          ],
        },
      ],
    },
    whatToPack: {
      title: "Safari Packing Essentials",
      categories: [
        {
          name: "Clothing",
          items: [
            "Neutral-colored clothing (khaki, olive, brown - avoid bright colors and black/blue that attract tsetse flies)",
            "Long-sleeved shirts and pants for sun and insect protection",
            "Warm fleece or jacket for early morning drives",
            "Wide-brimmed hat or cap",
            "Comfortable walking shoes and sandals",
            "Swimsuit (many lodges have pools)",
            "Light rain jacket (especially April-May and November)",
          ],
        },
        {
          name: "Photography & Electronics",
          items: [
            "Camera with telephoto lens and extra batteries",
            "Binoculars (8x42 or 10x42 recommended)",
            "Smartphone for casual shots",
            "Power bank and universal adapter (UK-style plugs)",
            "Memory cards (bring more than you think you need)",
            "Dust-proof camera bag",
          ],
        },
        {
          name: "Health & Safety",
          items: [
            "Sunscreen (SPF 50+) and lip balm",
            "Insect repellent with DEET",
            "Personal medications and prescriptions",
            "Basic first aid kit",
            "Anti-malarial medication",
            "Hand sanitizer and wet wipes",
            "Reusable water bottle",
          ],
        },
        {
          name: "Accessories",
          items: [
            "Sunglasses with UV protection",
            "Headlamp or small flashlight",
            "Day pack for game drives",
            "Ziplock bags to protect electronics from dust",
            "Travel pillow for long drives",
            "Field guide to African mammals and birds",
          ],
        },
      ],
    },
    accommodation: {
      title: "Where to Stay",
      description:
        "The Maasai Mara offers accommodation options ranging from luxury lodges to authentic tented camps, each providing unique safari experiences:",
      types: [
        {
          name: "Luxury Lodges",
          description:
            "Five-star comfort with spacious rooms, gourmet dining, infinity pools, spas, and exceptional service. Perfect for those seeking ultimate comfort.",
          priceRange: "$500-1500 per person/night",
        },
        {
          name: "Tented Camps",
          description:
            "The classic safari experience with comfortable canvas tents, en-suite bathrooms, and authentic bush atmosphere. Wake to the sounds of wildlife.",
          priceRange: "$300-700 per person/night",
        },
        {
          name: "Mid-Range Lodges",
          description:
            "Comfortable accommodations with good amenities, quality food, and experienced guides at more accessible prices.",
          priceRange: "$150-300 per person/night",
        },
        {
          name: "Budget Camps",
          description:
            "Basic but clean camping options outside the reserve boundaries. Great for adventurous travelers on a budget.",
          priceRange: "$50-150 per person/night",
        },
      ],
    },
    activities: {
      title: "Safari Activities & Experiences",
      list: [
        {
          name: "Game Drives",
          description:
            "Morning and evening drives through the reserve with expert guides to spot the Big Five and other incredible wildlife.",
          duration: "3-4 hours per drive",
        },
        {
          name: "Hot Air Balloon Safari",
          description:
            "Float silently over the Mara at dawn, watching wildlife from above, followed by champagne breakfast in the bush.",
          duration: "3-4 hours including breakfast",
        },
        {
          name: "Maasai Village Visit",
          description:
            "Experience traditional Maasai culture, learn about their customs, watch traditional dances, and support local communities.",
          duration: "2-3 hours",
        },
        {
          name: "Bush Walks",
          description:
            "Guided walking safaris to learn about smaller creatures, tracks, plants, and the ecosystem's intricate details.",
          duration: "1-2 hours",
        },
        {
          name: "Night Game Drives",
          description:
            "Spot nocturnal animals like leopards, hyenas, bush babies, and more with spotlights (available in conservancies).",
          duration: "2-3 hours",
        },
        {
          name: "Photography Safari",
          description:
            "Specialized tours with extended stops and expert guidance for capturing the perfect wildlife shots.",
          duration: "Full day available",
        },
      ],
    },
    highlights: [
      "Witness the Great Wildebeest Migration (July-October)",
      "See the highest concentration of lions in Africa",
      "Experience dramatic Mara River crossings",
      "Spot all of Africa's Big Five in one location",
      "Enjoy hot air balloon safaris at sunrise",
      "Visit authentic Maasai villages and communities",
      "World-class photography opportunities year-round",
      "Over 450 bird species including 57 raptors",
    ],
    funFacts: [
      "The Maasai Mara covers 1,510 km² (583 sq mi) - about the size of London",
      "Over 1.5 million wildebeest migrate through the Mara annually",
      "The reserve has one of the highest lion densities in the world",
      "Maasai Mara means 'spotted land' in the Maa language",
      "The reserve was established in 1961 as a wildlife sanctuary",
      "95 species of mammals and 450+ bird species call the Mara home",
      "The Mara River is home to large populations of hippos and crocodiles",
      "Hot air ballooning started here in the 1980s - it was Africa's first balloon safari",
    ],
  },
  {
    id: "dest_002",
    name: "Amboseli National Park",
    slug: "amboseli-national-park",
    tagline: "Where Elephants Walk with Kilimanjaro",
    description:
      "Famous for its large elephant herds and stunning views of Mount Kilimanjaro, Amboseli offers a unique safari experience where wildlife roams against the backdrop of Africa's highest peak.",
    heroImage: "/images/elephant.png",
    images: ["/images/elephant.png", "/images/giraffe.png", "/images/lion.png"],
    location: {
      country: "Kenya",
      region: "Kajiado County",
      coordinates: {
        lat: -2.65,
        lng: 37.26,
      },
    },
    overview: {
      title: "The Elephant Paradise",
      content:
        "Amboseli National Park, situated at the foot of Mount Kilimanjaro, is one of Kenya's most iconic safari destinations. The park covers 392 square kilometers and is renowned for its large elephant populations - some of the biggest tuskers in Africa roam these plains. The park's diverse ecosystem includes wetlands, savannah, and woodlands, all set against the spectacular backdrop of Kilimanjaro. Amboseli's relatively small size means excellent wildlife concentration, and the open terrain makes for superb game viewing and photography.",
    },
    wildlife: {
      title: "Wildlife of Amboseli",
      description:
        "While elephants are the stars, Amboseli hosts incredible biodiversity:",
      animals: [
        {
          name: "African Elephant",
          icon: "🐘",
          description:
            "Amboseli's elephants are among the most studied in the world. Watch huge herds with massive tusks against Kilimanjaro's backdrop.",
        },
        {
          name: "Lion",
          icon: "🦁",
          description:
            "Several prides inhabit the park, often seen hunting in the open plains or resting under acacia trees.",
        },
        {
          name: "Cheetah",
          icon: "🐆",
          description:
            "The open terrain provides excellent cheetah habitat. These swift predators are regularly spotted.",
        },
        {
          name: "Buffalo",
          icon: "🐃",
          description:
            "Large herds of cape buffalo frequent the swamps and grasslands, particularly during the dry season.",
        },
        {
          name: "Giraffe",
          icon: "🦒",
          description:
            "Masai giraffes gracefully browse on acacia trees throughout the park.",
        },
        {
          name: "Zebra",
          icon: "🦓",
          description:
            "Large herds of plains zebra are a common sight in Amboseli's grasslands.",
        },
      ],
    },
    bestTimeToVisit: {
      title: "Best Time to Visit",
      description: "Amboseli offers different experiences throughout the year:",
      seasons: [
        {
          period: "June - October & January - February",
          weather: "Dry season, clear skies",
          highlights:
            "Best Kilimanjaro views, concentrated wildlife around water sources, excellent game viewing",
          recommendation: "best",
        },
        {
          period: "November - December",
          weather: "Short rains, occasional showers",
          highlights:
            "Green landscapes, baby animals, fewer crowds, good photography",
          recommendation: "good",
        },
        {
          period: "March - May",
          weather: "Long rains, heavy showers",
          highlights:
            "Lush vegetation, dramatic skies, lowest prices, challenging game viewing",
          recommendation: "okay",
        },
      ],
    },
    thingsToKnow: {
      title: "Important Information",
      items: [
        {
          category: "Getting There",
          tips: [
            "240 km from Nairobi (4-5 hour drive)",
            "Airstrip available for charter flights",
            "Road conditions can be challenging during rains",
            "Park entry fees payable in Kenyan Shillings or USD",
          ],
        },
        {
          category: "Best Practices",
          tips: [
            "Early morning offers best Kilimanjaro views before clouds form",
            "Respect the 25km/h speed limit",
            "Stay on designated tracks to protect the fragile ecosystem",
            "Avoid disturbing elephants - give them right of way",
          ],
        },
      ],
    },
    whatToPack: {
      title: "What to Bring",
      categories: [
        {
          name: "Essentials",
          items: [
            "Long lens for photography (300mm+)",
            "Warm layers for early mornings",
            "Dust protection for camera equipment",
            "Sunscreen and hat",
            "Binoculars",
          ],
        },
      ],
    },
    accommodation: {
      title: "Accommodation Options",
      description: "Stay inside or near the park:",
      types: [
        {
          name: "Park Lodges",
          description:
            "Luxury lodges with Kilimanjaro views and spa facilities.",
          priceRange: "$400-900 per person/night",
        },
        {
          name: "Tented Camps",
          description: "Authentic safari camps close to wildlife areas.",
          priceRange: "$200-500 per person/night",
        },
      ],
    },
    activities: {
      title: "Activities",
      list: [
        {
          name: "Game Drives",
          description:
            "Morning and afternoon drives to spot elephants and other wildlife.",
          duration: "3-4 hours",
        },
        {
          name: "Photography Tours",
          description:
            "Specialized tours for capturing Kilimanjaro backdrop shots.",
          duration: "Full day",
        },
        {
          name: "Bird Watching",
          description:
            "Over 400 bird species including flamingos in the wetlands.",
          duration: "2-3 hours",
        },
      ],
    },
    highlights: [
      "Best elephant viewing in Kenya",
      "Stunning Mount Kilimanjaro backdrop",
      "Over 400 bird species",
      "Observation Hill for panoramic views",
      "Permanent swamps support year-round wildlife",
    ],
    funFacts: [
      "Amboseli's elephants have been studied for over 40 years",
      "The park was once part of a larger Maasai ecosystem",
      "Kilimanjaro is best viewed before 9am when clouds gather",
      "The park's name comes from Maasai word 'Empusel' meaning 'salty dust'",
    ],
  },
];
