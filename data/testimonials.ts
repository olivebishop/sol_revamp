export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  tripType: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah & James Mitchell",
    location: "London, UK",
    rating: 5,
    text: "Our 10-day Kenyan safari exceeded all expectations! The guides were incredibly knowledgeable, and we witnessed the Great Migration up close. The Sol made our dream vacation a reality. Every detail was perfectly planned.",
    image: "/images/gallery/a.jpg",
    tripType: "Safari Adventure",
    date: "October 2024",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, USA",
    rating: 5,
    text: "From the pristine beaches of Zanzibar to the wildlife in Serengeti, every moment was magical. The Sol's attention to detail and personalized service made this trip unforgettable. Highly recommend!",
    image: "/images/gallery/c.jpg",
    tripType: "Beach & Safari Combo",
    date: "September 2024",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    rating: 5,
    text: "An absolutely phenomenal experience! The cultural immersion with Maasai communities was eye-opening, and the wildlife encounters were breathtaking. The Sol's team went above and beyond at every turn.",
    image: "/images/gallery/e.jpg",
    tripType: "Cultural Safari",
    date: "November 2024",
  },
  {
    id: 4,
    name: "David & Lisa Thompson",
    location: "Sydney, Australia",
    rating: 5,
    text: "We've traveled extensively, but this was our best trip yet! The accommodations were luxurious, the food exceptional, and seeing gorillas in Uganda was a once-in-a-lifetime experience. Thank you, The Sol!",
    image: "/images/gallery/buffalo.jpg",
    tripType: "Luxury Safari",
    date: "August 2024",
  },
];

export const stats = [
  {
    id: 1,
    number: "15+",
    label: "Years Experience",
  },
  {
    id: 2,
    number: "5000+",
    label: "Happy Travelers",
  },
  {
    id: 3,
    number: "50+",
    label: "Destinations",
  },
  {
    id: 4,
    number: "98%",
    label: "Satisfaction Rate",
  },
];
