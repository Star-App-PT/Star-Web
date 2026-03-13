import cleaner1Image from '../assets/workers/cleaners/cleaner-1.jpg'
import cleaner2Image from '../assets/workers/cleaners/cleaner-2.jpg'
import cleaner3Image from '../assets/workers/cleaners/cleaner-3.jpg'
import cleaner4Image from '../assets/workers/cleaners/cleaner-4.jpg'
import cleaner5Image from '../assets/workers/cleaners/cleaner-5.jpg'
import cleaner6Image from '../assets/workers/cleaners/cleaner-6.jpg'
import handyman1Image from '../assets/workers/handymen/handyman-1.jpg'
import handyman2Image from '../assets/workers/handymen/handyman-2.jpg'
import handyman3Image from '../assets/workers/handymen/handyman-3.jpg'
import handyman4Image from '../assets/workers/handymen/handyman-4.jpg'
import handyman5Image from '../assets/workers/handymen/handyman-5.jpg'
import handyman6Image from '../assets/workers/handymen/handyman-6.jpg'
import photographerImage from '../assets/workers/services/photographer.jpg'
import personalTrainerImage from '../assets/workers/services/personal-trainer.jpg'
import chefImage from '../assets/workers/services/chef.jpg'
import hairStylistImage from '../assets/workers/services/hair-stylist.jpg'
import massageTherapistImage from '../assets/workers/services/massage-therapist.jpg'
import babysitterImage from '../assets/workers/services/babysitter.jpg'

export const PICKED_DATES = 'Aug 1 – Aug 3'

export const SUPPORTED_CITIES = {
  Porto: { lat: 41.1579, lng: -8.6291 },
  Lisbon: { lat: 38.7223, lng: -9.1393 },
}

export const DEFAULT_CITY = 'Porto'

export const CLEANERS = [
  {
    id: 'c1', name: 'Maria', specialty: 'Home Cleaner', rating: 5.0, hourlyRate: 28, image: cleaner1Image,
    city: 'Porto', lat: 41.162, lng: -8.622, reviews: 47,
    bio: 'Professional home cleaner with 6 years of experience. I take pride in leaving every space spotless and fresh. Eco-friendly products only.',
    languages: ['Portuguese', 'English'],
    memberSince: '2021',
  },
  {
    id: 'c2', name: 'Ana', specialty: 'Deep Cleaner', rating: 4.9, hourlyRate: 32, image: cleaner2Image,
    city: 'Porto', lat: 41.155, lng: -8.635, reviews: 63,
    bio: 'Specialized in deep cleaning for homes and short-term rentals. I bring my own professional-grade equipment and leave your space guest-ready.',
    languages: ['Portuguese', 'English', 'French'],
    memberSince: '2020',
  },
  {
    id: 'c3', name: 'Ricardo', specialty: 'Office Cleaner', rating: 4.9, hourlyRate: 25, image: cleaner3Image,
    city: 'Porto', lat: 41.150, lng: -8.610, reviews: 38,
    bio: 'Experienced office cleaner serving businesses across Porto. Flexible scheduling, weekend availability, and consistent quality you can count on.',
    languages: ['Portuguese', 'English'],
    memberSince: '2022',
  },
  {
    id: 'c4', name: 'Patricia', specialty: 'Housekeeper', rating: 4.8, hourlyRate: 30, image: cleaner4Image,
    city: 'Porto', lat: 41.168, lng: -8.640, reviews: 52,
    bio: 'Dedicated housekeeper with attention to every detail. I manage everything from daily tidying to laundry, ironing, and pantry organization.',
    languages: ['Portuguese'],
    memberSince: '2019',
  },
  {
    id: 'c5', name: 'Helena', specialty: 'Move-out Cleaner', rating: 4.9, hourlyRate: 27, image: cleaner5Image,
    city: 'Porto', lat: 41.145, lng: -8.618, reviews: 29,
    bio: 'Move-out cleaning specialist. I make sure you get your deposit back with thorough, end-of-tenancy deep cleans that meet landlord standards.',
    languages: ['Portuguese', 'English', 'Mandarin'],
    memberSince: '2023',
  },
  {
    id: 'c6', name: 'André', specialty: 'Window Cleaner', rating: 4.7, hourlyRate: 29, image: cleaner6Image,
    city: 'Porto', lat: 41.158, lng: -8.645, reviews: 34,
    bio: 'Professional window cleaner for residential and commercial properties. Crystal-clear results every time, even on hard-to-reach glass.',
    languages: ['Portuguese', 'Spanish'],
    memberSince: '2021',
  },
]

export const HANDYMEN = [
  {
    id: 'h1', name: 'Joao', specialty: 'Carpenter', rating: 4.9, hourlyRate: 35, image: handyman1Image,
    city: 'Porto', lat: 41.160, lng: -8.615, reviews: 71,
    bio: 'Master carpenter with 12 years of experience. Custom shelving, furniture repair, door fitting, and all woodwork. Quality craftsmanship guaranteed.',
    languages: ['Portuguese', 'English'],
    memberSince: '2018',
  },
  {
    id: 'h2', name: 'Miguel', specialty: 'Plumber', rating: 5.0, hourlyRate: 42, image: handyman2Image,
    city: 'Porto', lat: 41.153, lng: -8.628, reviews: 89,
    bio: 'Licensed plumber handling everything from leaky taps to full bathroom installations. Emergency callouts available. No job too big or too small.',
    languages: ['Portuguese', 'English', 'French'],
    memberSince: '2019',
  },
  {
    id: 'h3', name: 'Rui', specialty: 'Carpenter', rating: 4.8, hourlyRate: 38, image: handyman3Image,
    city: 'Porto', lat: 41.165, lng: -8.605, reviews: 44,
    bio: 'Passionate woodworker specializing in bespoke furniture and restoration. From vintage chair repairs to building custom kitchen cabinets.',
    languages: ['Portuguese', 'German'],
    memberSince: '2020',
  },
  {
    id: 'h4', name: 'Carlos', specialty: 'Electrician', rating: 4.9, hourlyRate: 40, image: handyman4Image,
    city: 'Porto', lat: 41.148, lng: -8.632, reviews: 56,
    bio: 'Certified electrician for residential and commercial projects. Rewiring, lighting installation, fuse box upgrades, and safety inspections.',
    languages: ['Portuguese', 'English'],
    memberSince: '2019',
  },
  {
    id: 'h5', name: 'Clara', specialty: 'Painter', rating: 4.8, hourlyRate: 37, image: handyman5Image,
    city: 'Porto', lat: 41.170, lng: -8.620, reviews: 31,
    bio: 'Interior and exterior painting specialist. Clean lines, smooth finishes, and colour consultations included. I transform spaces with precision.',
    languages: ['Portuguese', 'English', 'Spanish'],
    memberSince: '2022',
  },
  {
    id: 'h6', name: 'Bruno', specialty: 'Plumber', rating: 4.8, hourlyRate: 39, image: handyman6Image,
    city: 'Porto', lat: 41.155, lng: -8.650, reviews: 42,
    bio: 'Experienced plumber specializing in older buildings and heritage properties. Pipe repair, water heater installation, and drain unblocking.',
    languages: ['Portuguese'],
    memberSince: '2020',
  },
]

export const SERVICES = [
  {
    id: 's1', name: 'Rita', specialty: 'Photographer', rating: 4.9, hourlyRate: 48, image: photographerImage,
    city: 'Porto', lat: 41.163, lng: -8.610, reviews: 67,
    bio: 'Professional photographer for events, portraits, and real estate. Natural light specialist with a warm, editorial style.',
    languages: ['Portuguese', 'English', 'Italian'],
    memberSince: '2020',
  },
  {
    id: 's2', name: 'Marta', specialty: 'Personal Trainer', rating: 4.8, hourlyRate: 30, image: personalTrainerImage,
    city: 'Porto', lat: 41.152, lng: -8.642, reviews: 45,
    bio: 'Certified personal trainer offering in-home and outdoor sessions. Strength, HIIT, flexibility — tailored plans for every fitness level.',
    languages: ['Portuguese', 'English'],
    memberSince: '2021',
  },
  {
    id: 's3', name: 'Tiago', specialty: 'Chef', rating: 4.8, hourlyRate: 44, image: chefImage,
    city: 'Porto', lat: 41.159, lng: -8.625, reviews: 53,
    bio: 'Private chef for dinner parties, meal prep, and special occasions. Portuguese and Mediterranean cuisine with locally sourced ingredients.',
    languages: ['Portuguese', 'English', 'French'],
    memberSince: '2019',
  },
  {
    id: 's4', name: 'Luis', specialty: 'Hair Stylist', rating: 5.0, hourlyRate: 52, image: hairStylistImage,
    city: 'Porto', lat: 41.167, lng: -8.630, reviews: 78,
    bio: 'Mobile hair stylist with 8 years of salon experience. Cuts, colour, styling — I bring the salon to your door for men and women.',
    languages: ['Portuguese', 'English', 'Spanish'],
    memberSince: '2018',
  },
  {
    id: 's5', name: 'Sofia', specialty: 'Massage Therapist', rating: 5.0, hourlyRate: 55, image: massageTherapistImage,
    city: 'Porto', lat: 41.156, lng: -8.615, reviews: 61,
    bio: 'Licensed massage therapist specializing in deep tissue, Swedish, and sports massage. I bring my own table, oils, and relaxing atmosphere.',
    languages: ['Portuguese', 'English'],
    memberSince: '2020',
  },
  {
    id: 's6', name: 'Ingrid', specialty: 'Babysitter', rating: 4.8, hourlyRate: 28, image: babysitterImage,
    city: 'Porto', lat: 41.164, lng: -8.638, reviews: 36,
    bio: 'Experienced babysitter and nanny. CPR certified, speaks three languages, and loves arts & crafts. Ages 0–12, daytime and evening.',
    languages: ['Portuguese', 'English', 'Swedish'],
    memberSince: '2022',
  },
]

export const ALL_WORKERS = [...CLEANERS, ...HANDYMEN, ...SERVICES]

export const CATEGORIES = [
  { id: 'cleaners', labelKey: 'home.categoryClean', workers: CLEANERS },
  { id: 'handymen', labelKey: 'home.categoryRepair', workers: HANDYMEN },
  { id: 'services', labelKey: 'home.categoryServices', workers: SERVICES },
]

export function getWorkerById(id) {
  return ALL_WORKERS.find((w) => w.id === id) || null
}

export function getSimilarWorkers(worker, limit = 4) {
  return ALL_WORKERS
    .filter((w) => w.id !== worker.id && w.city === worker.city && w.specialty === worker.specialty)
    .concat(
      ALL_WORKERS.filter((w) => w.id !== worker.id && w.city === worker.city && w.specialty !== worker.specialty)
    )
    .slice(0, limit)
}

export function getWorkersInCity(city) {
  return ALL_WORKERS.filter((w) => w.city === city)
}

export function isCitySupported(city) {
  return city in SUPPORTED_CITIES
}
