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

import clientJoao from '../assets/workers/clients/joao.jpg'
import clientSara from '../assets/workers/clients/sara.jpg'
import clientTomas from '../assets/workers/clients/tomas.jpg'
import clientLuisa from '../assets/workers/clients/luisa.jpg'
import clientPedro from '../assets/workers/clients/pedro.jpg'
import clientAna from '../assets/workers/clients/ana.jpg'

import actionHomeCleaning from '../assets/workers/action/action-home-cleaning.jpg'
import actionDeepCleaning from '../assets/workers/action/action-deep-cleaning.jpg'
import actionOfficeCleaning from '../assets/workers/action/action-office-cleaning.jpg'
import actionHousekeeping from '../assets/workers/action/action-housekeeping.jpg'
import actionMoveoutCleaning from '../assets/workers/action/action-moveout-cleaning.jpg'
import actionWindowCleaning from '../assets/workers/action/action-window-cleaning.jpg'
import actionCarpentry from '../assets/workers/action/action-carpentry.jpg'
import actionPlumbing from '../assets/workers/action/action-plumbing.jpg'
import actionFurnitureAssembly from '../assets/workers/action/action-furniture-assembly.jpg'
import actionElectrical from '../assets/workers/action/action-electrical.jpg'
import actionPainting from '../assets/workers/action/action-painting.jpg'
import actionPlumbing2 from '../assets/workers/action/action-plumbing-2.jpg'
import actionPhotography from '../assets/workers/action/action-photography.jpg'
import actionPersonalTraining from '../assets/workers/action/action-personal-training.jpg'
import actionChef from '../assets/workers/action/action-chef.jpg'
import actionHairStyling from '../assets/workers/action/action-hair-styling.jpg'
import actionMassage from '../assets/workers/action/action-massage.jpg'
import actionBabysitting from '../assets/workers/action/action-babysitting.jpg'

/**
 * Worker data — single source of truth for all worker information.
 *
 * IMAGE FIELDS (two distinct concepts):
 *
 *   worker.image     — The worker's PROFILE PHOTO (uploaded by the worker).
 *                      This is the single source for every circular avatar
 *                      in the app: listing cards, profile page, host row,
 *                      similar-workers grid. Render it via <WorkerAvatar>.
 *                      May be null/undefined if the worker hasn't uploaded one yet.
 *
 *   worker.heroImage — The worker's COVER PHOTO. Workers can upload their
 *                      own (e.g. a spotless kitchen, a finished tiling job,
 *                      a beautiful shot they took). Until they upload one,
 *                      we show a platform-provided category action photo.
 *                      Used as the main listing card image AND the hero
 *                      banner on the profile page — both pull from this
 *                      single field, so updating it updates everywhere.
 *
 * All other fields (name, specialty, rating, hourlyRate, bio, etc.) are
 * also authoritative here. Every UI surface reads from this module, so
 * updating a value here propagates everywhere automatically.
 */

export const PICKED_DATES = 'Aug 1 – Aug 3'

export const SUPPORTED_CITIES = {
  Porto: { lat: 41.1579, lng: -8.6291 },
  Lisbon: { lat: 38.7223, lng: -9.1393 },
  Faro: { lat: 37.0194, lng: -7.9304 },
}

export const DEFAULT_CITY = 'Porto'

export const CLEANERS = [
  {
    id: 'c1', name: 'Maria', specialty: 'Home Cleaner', rating: 5.0, hourlyRate: 28,
    image: cleaner1Image, heroImage: actionHomeCleaning,
    city: 'Porto', lat: 41.162, lng: -8.622, reviews: 47,
    tagline: 'Eco-friendly home cleaning services in Porto',
    bio: 'Professional home cleaner with 6 years of experience. I take pride in leaving every space spotless and fresh. Eco-friendly products only.',
    languages: ['Portuguese', 'English'],
    memberSince: '2021',
    serviceLocation: 'Service provided at client\'s home',
    packages: [
      { name: 'Quick Tidy', price: 45, duration: '1.5 hrs', priceType: 'visit', desc: 'Light cleaning of kitchen, bathrooms, and living areas. Perfect for weekly upkeep.' },
      { name: 'Standard Clean', price: 75, duration: '3 hrs', priceType: 'visit', desc: 'Full home cleaning including all rooms, floors, surfaces, and bathrooms.' },
      { name: 'Deep Clean', price: 120, duration: '5 hrs', priceType: 'visit', desc: 'Intensive cleaning with appliance interiors, baseboards, windows, and detailed scrubbing.' },
    ],
    qualifications: [
      { icon: 'clock', title: '6 years of experience', desc: 'Professional home cleaning since 2019. Trained in eco-friendly methods.' },
      { icon: 'award', title: 'Eco-certified products only', desc: 'I use only certified non-toxic, biodegradable cleaning products.' },
      { icon: 'shield', title: 'Fully insured', desc: 'Liability insurance covering accidental damage during service.' },
    ],
    gallery: [],
  },
  {
    id: 'c2', name: 'Ana', specialty: 'Deep Cleaner', rating: 4.9, hourlyRate: 32,
    image: cleaner2Image, heroImage: actionDeepCleaning,
    city: 'Porto', lat: 41.155, lng: -8.635, reviews: 63,
    tagline: 'Deep cleaning for homes and short-term rentals',
    bio: 'Specialized in deep cleaning for homes and short-term rentals. I bring my own professional-grade equipment and leave your space guest-ready.',
    languages: ['Portuguese', 'English', 'French'],
    memberSince: '2020',
    serviceLocation: 'Service provided at client\'s home',
    packages: [
      { name: 'Airbnb Turnover', price: 60, duration: '2 hrs', priceType: 'visit', desc: 'Fast, thorough clean between guest stays. Linen change included if provided.' },
      { name: 'Full Deep Clean', price: 110, duration: '4 hrs', priceType: 'visit', desc: 'Every surface, inside and out. Oven, fridge, cupboards, windows, and floors.' },
    ],
    qualifications: [
      { icon: 'clock', title: '5 years of experience', desc: 'Specializing in Airbnb and rental turnovers since 2020.' },
      { icon: 'star', title: 'Top-rated on Star', desc: 'Consistently rated 4.9+ by clients across 63 reviews.' },
    ],
    gallery: [],
  },
  {
    id: 'c3', name: 'Ricardo', specialty: 'Office Cleaner', rating: 4.9, hourlyRate: 25,
    image: cleaner3Image, heroImage: actionOfficeCleaning,
    city: 'Porto', lat: 41.150, lng: -8.610, reviews: 38,
    tagline: 'Professional office cleaning across Porto',
    bio: 'Experienced office cleaner serving businesses across Porto. Flexible scheduling, weekend availability, and consistent quality you can count on.',
    languages: ['Portuguese', 'English'],
    memberSince: '2022',
    serviceLocation: 'Service provided at client\'s office',
    packages: [],
    qualifications: [
      { icon: 'clock', title: '4 years of experience', desc: 'Servicing offices, coworking spaces, and commercial properties.' },
    ],
    gallery: [],
  },
  {
    id: 'c4', name: 'Patricia', specialty: 'Housekeeper', rating: 4.8, hourlyRate: 30,
    image: cleaner4Image, heroImage: actionHousekeeping,
    city: 'Porto', lat: 41.168, lng: -8.640, reviews: 52,
    tagline: 'Dedicated housekeeping with attention to detail',
    bio: 'Dedicated housekeeper with attention to every detail. I manage everything from daily tidying to laundry, ironing, and pantry organization.',
    languages: ['Portuguese'],
    memberSince: '2019',
    serviceLocation: 'Service provided at client\'s home',
    packages: [
      { name: 'Daily Tidy', price: 40, duration: '2 hrs', priceType: 'visit', desc: 'Light housekeeping — tidying, dishes, laundry folding, and surface wipe-down.' },
      { name: 'Full Housekeeping', price: 80, duration: '4 hrs', priceType: 'visit', desc: 'Complete home management including cleaning, laundry, ironing, and organisation.' },
    ],
    qualifications: [],
    gallery: [],
  },
  {
    id: 'c5', name: 'Helena', specialty: 'Move-out Cleaner', rating: 4.9, hourlyRate: 27,
    image: cleaner5Image, heroImage: actionMoveoutCleaning,
    city: 'Porto', lat: 41.145, lng: -8.618, reviews: 29,
    tagline: 'End-of-tenancy deep cleans that get your deposit back',
    bio: 'Move-out cleaning specialist. I make sure you get your deposit back with thorough, end-of-tenancy deep cleans that meet landlord standards.',
    languages: ['Portuguese', 'English', 'Mandarin'],
    memberSince: '2023',
    serviceLocation: 'Service provided at client\'s home',
    packages: [],
    qualifications: [],
    gallery: [],
  },
  {
    id: 'c6', name: 'André', specialty: 'Window Cleaner', rating: 4.7, hourlyRate: 29,
    image: cleaner6Image, heroImage: actionWindowCleaning,
    city: 'Porto', lat: 41.158, lng: -8.645, reviews: 34,
    tagline: 'Crystal-clear windows for homes and businesses',
    bio: 'Professional window cleaner for residential and commercial properties. Crystal-clear results every time, even on hard-to-reach glass.',
    languages: ['Portuguese', 'Spanish'],
    memberSince: '2021',
    serviceLocation: 'Service provided at client\'s location',
    packages: [],
    qualifications: [],
    gallery: [],
  },
]

export const HANDYMEN = [
  {
    id: 'h1', name: 'Joao', specialty: 'Carpenter', rating: 4.9, hourlyRate: 35,
    image: handyman1Image, heroImage: actionCarpentry,
    city: 'Porto', lat: 41.160, lng: -8.615, reviews: 71,
    tagline: 'Custom woodwork and furniture craftsmanship',
    bio: 'Master carpenter with 12 years of experience. Custom shelving, furniture repair, door fitting, and all woodwork. Quality craftsmanship guaranteed.',
    languages: ['Portuguese', 'English'], memberSince: '2018',
    serviceLocation: 'Service provided at client\'s home',
    packages: [
      { name: 'Small Repair', price: 50, duration: '1.5 hrs', priceType: 'visit', desc: 'Minor fixes — squeaky doors, loose handles, shelf brackets, small patches.' },
      { name: 'Custom Build', price: 150, duration: '5 hrs', priceType: 'visit', desc: 'Bespoke shelving, fitted wardrobes, or custom furniture pieces to your specification.' },
    ],
    qualifications: [
      { icon: 'clock', title: '12 years of experience', desc: 'Master carpenter since 2012. Custom shelving, furniture, and restoration.' },
      { icon: 'award', title: 'Guild-certified craftsman', desc: 'Certified by the Porto Woodworkers Guild for fine joinery and cabinet making.' },
      { icon: 'book', title: 'Apprenticeship trained', desc: '3-year apprenticeship under master furniture maker António Silva.' },
    ],
    gallery: [],
  },
  {
    id: 'h2', name: 'Miguel', specialty: 'Plumber', rating: 5.0, hourlyRate: 42,
    image: handyman2Image, heroImage: actionPlumbing,
    city: 'Porto', lat: 41.153, lng: -8.628, reviews: 89,
    tagline: 'Licensed plumber — from leaky taps to full installations',
    bio: 'Licensed plumber handling everything from leaky taps to full bathroom installations. Emergency callouts available. No job too big or too small.',
    languages: ['Portuguese', 'English', 'French'], memberSince: '2019',
    serviceLocation: 'Service provided at client\'s home',
    packages: [
      { name: 'Emergency Callout', price: 65, duration: '1 hr', priceType: 'visit', desc: 'Urgent repairs — burst pipes, blocked drains, boiler failures. Same-day response.' },
      { name: 'Standard Repair', price: 90, duration: '2 hrs', priceType: 'visit', desc: 'Tap replacement, toilet repair, pipe fixing, and general plumbing maintenance.' },
      { name: 'Bathroom Install', price: 350, duration: '8 hrs', priceType: 'visit', desc: 'Full bathroom fitting — toilet, sink, shower/tub, tiling consultation included.' },
    ],
    qualifications: [
      { icon: 'clock', title: '7 years of experience', desc: 'Licensed plumber specializing in residential and emergency work.' },
      { icon: 'shield', title: 'Fully licensed & insured', desc: 'Registered with the Portuguese plumbing authority. Full liability coverage.' },
    ],
    gallery: [],
  },
  {
    id: 'h3', name: 'Rui', specialty: 'Carpenter', rating: 4.8, hourlyRate: 38,
    image: handyman3Image, heroImage: actionFurnitureAssembly,
    city: 'Porto', lat: 41.165, lng: -8.605, reviews: 44,
    tagline: 'Bespoke furniture and vintage restoration',
    bio: 'Passionate woodworker specializing in bespoke furniture and restoration. From vintage chair repairs to building custom kitchen cabinets.',
    languages: ['Portuguese', 'German'], memberSince: '2020',
    serviceLocation: 'Service provided at client\'s home or my workshop',
    packages: [], qualifications: [], gallery: [],
  },
  {
    id: 'h4', name: 'Carlos', specialty: 'Electrician', rating: 4.9, hourlyRate: 40,
    image: handyman4Image, heroImage: actionElectrical,
    city: 'Porto', lat: 41.148, lng: -8.632, reviews: 56,
    tagline: 'Certified electrician for home and commercial projects',
    bio: 'Certified electrician for residential and commercial projects. Rewiring, lighting installation, fuse box upgrades, and safety inspections.',
    languages: ['Portuguese', 'English'], memberSince: '2019',
    serviceLocation: 'Service provided at client\'s location',
    packages: [
      { name: 'Safety Inspection', price: 60, duration: '1 hr', priceType: 'visit', desc: 'Full electrical safety audit with report. Fuse box check, earthing, and wiring review.' },
      { name: 'Light Install', price: 80, duration: '2 hrs', priceType: 'visit', desc: 'Installation of up to 4 light fixtures, including wiring and switch setup.' },
    ],
    qualifications: [
      { icon: 'shield', title: 'Nationally certified', desc: 'Certified by DGEG (Portuguese energy authority) for all electrical work.' },
      { icon: 'clock', title: '8 years of experience', desc: 'Residential and commercial electrical work since 2017.' },
    ],
    gallery: [],
  },
  {
    id: 'h5', name: 'Clara', specialty: 'Painter', rating: 4.8, hourlyRate: 37,
    image: handyman5Image, heroImage: actionPainting,
    city: 'Porto', lat: 41.170, lng: -8.620, reviews: 31,
    tagline: 'Interior and exterior painting with precision',
    bio: 'Interior and exterior painting specialist. Clean lines, smooth finishes, and colour consultations included. I transform spaces with precision.',
    languages: ['Portuguese', 'English', 'Spanish'], memberSince: '2022',
    serviceLocation: 'Service provided at client\'s home',
    packages: [], qualifications: [], gallery: [],
  },
  {
    id: 'h6', name: 'Bruno', specialty: 'Plumber', rating: 4.8, hourlyRate: 39,
    image: handyman6Image, heroImage: actionPlumbing2,
    city: 'Porto', lat: 41.155, lng: -8.650, reviews: 42,
    tagline: 'Heritage plumbing specialist for older buildings',
    bio: 'Experienced plumber specializing in older buildings and heritage properties. Pipe repair, water heater installation, and drain unblocking.',
    languages: ['Portuguese'], memberSince: '2020',
    serviceLocation: 'Service provided at client\'s home',
    packages: [], qualifications: [], gallery: [],
  },
]

export const SERVICES = [
  {
    id: 's1', name: 'Rita', specialty: 'Photographer', rating: 4.9, hourlyRate: 48,
    image: photographerImage, heroImage: actionPhotography,
    city: 'Porto', lat: 41.163, lng: -8.610, reviews: 67,
    tagline: 'Natural light photography for events, portraits, and properties',
    bio: 'Professional photographer for events, portraits, and real estate. Natural light specialist with a warm, editorial style.',
    languages: ['Portuguese', 'English', 'Italian'], memberSince: '2020',
    serviceLocation: 'Provided at client\'s location',
    packages: [
      { name: 'Portrait Express', price: 75, duration: '45 min', priceType: 'session', desc: 'Quick professional portrait session at one location. 10 edited photos delivered.' },
      { name: 'Event Coverage', price: 200, duration: '3 hrs', priceType: 'session', desc: 'Full event photography — parties, dinners, corporate. 50+ edited photos in a gallery.' },
      { name: 'Real Estate Shoot', price: 150, duration: '2 hrs', priceType: 'session', desc: 'Property photography for listings. HDR interiors, exteriors, drone shots available.' },
    ],
    qualifications: [
      { icon: 'clock', title: '9 years of experience', desc: 'Specializing in portraits, lifestyle, events, and real estate photography.' },
      { icon: 'award', title: 'Published photographer', desc: 'Work featured in TimeOut Porto and several Portuguese lifestyle magazines.' },
      { icon: 'book', title: 'Fine arts graduate', desc: 'BA in Photography from the Porto School of Arts (FBAUP).' },
    ],
    gallery: [],
  },
  {
    id: 's2', name: 'Marta', specialty: 'Personal Trainer', rating: 4.8, hourlyRate: 30,
    image: personalTrainerImage, heroImage: actionPersonalTraining,
    city: 'Porto', lat: 41.152, lng: -8.642, reviews: 45,
    tagline: 'In-home and outdoor fitness sessions for all levels',
    bio: 'Certified personal trainer offering in-home and outdoor sessions. Strength, HIIT, flexibility — tailored plans for every fitness level.',
    languages: ['Portuguese', 'English'], memberSince: '2021',
    serviceLocation: 'Provided at client\'s home or outdoors',
    packages: [
      { name: 'Single Session', price: 30, duration: '1 hr', priceType: 'session', desc: 'One-on-one training session tailored to your goals. All equipment provided.' },
      { name: 'Group Session', price: 50, duration: '1 hr', priceType: 'session', desc: 'Fun outdoor group workout for 2-4 people. HIIT, strength, or bootcamp style.' },
      { name: '10-Session Pack', price: 250, duration: '10 hrs', priceType: 'session', desc: 'Commit to your goals with a discounted 10-session package. Includes fitness assessment.' },
    ],
    qualifications: [
      { icon: 'shield', title: 'Nationally certified', desc: 'Certified personal trainer by the Portuguese Institute of Sport.' },
      { icon: 'clock', title: '5 years of experience', desc: 'Training clients in-home and outdoors since 2021.' },
    ],
    gallery: [],
  },
  {
    id: 's3', name: 'Tiago', specialty: 'Chef', rating: 4.8, hourlyRate: 44,
    image: chefImage, heroImage: actionChef,
    city: 'Porto', lat: 41.159, lng: -8.625, reviews: 53,
    tagline: 'Private chef for dinner parties and meal prep',
    bio: 'Private chef for dinner parties, meal prep, and special occasions. Portuguese and Mediterranean cuisine with locally sourced ingredients.',
    languages: ['Portuguese', 'English', 'French'], memberSince: '2019',
    serviceLocation: 'Provided at client\'s home',
    packages: [
      { name: 'Meal Prep (5 days)', price: 180, duration: '4 hrs', priceType: 'person', desc: 'Weekly meal prep — 5 days of balanced, home-cooked meals. Menu tailored to your diet.' },
      { name: 'Dinner Party (4 guests)', price: 250, duration: '4 hrs', priceType: 'person', desc: 'Full dinner experience — 3 courses, wine pairing suggestions, all cooking and cleanup.' },
    ],
    qualifications: [
      { icon: 'clock', title: '10 years of experience', desc: 'Professional chef since 2015. Portuguese and Mediterranean cuisine.' },
      { icon: 'book', title: 'Culinary school trained', desc: 'Graduate of the Escola de Hotelaria e Turismo do Porto.' },
    ],
    gallery: [],
  },
  {
    id: 's4', name: 'Luis', specialty: 'Hair Stylist', rating: 5.0, hourlyRate: 52,
    image: hairStylistImage, heroImage: actionHairStyling,
    city: 'Porto', lat: 41.167, lng: -8.630, reviews: 78,
    tagline: 'Mobile hair salon — cuts, colour, and styling at your door',
    bio: 'Mobile hair stylist with 8 years of salon experience. Cuts, colour, styling — I bring the salon to your door for men and women.',
    languages: ['Portuguese', 'English', 'Spanish'], memberSince: '2018',
    serviceLocation: 'Provided at client\'s home',
    packages: [
      { name: 'Cut & Style', price: 45, duration: '45 min', priceType: 'session', desc: 'Wash, cut, and blow-dry. Men\'s or women\'s styles.' },
      { name: 'Colour & Cut', price: 95, duration: '2 hrs', priceType: 'session', desc: 'Full colour treatment with cut and style. Consultation included.' },
    ],
    qualifications: [
      { icon: 'clock', title: '8 years of experience', desc: 'Former senior stylist at a top Porto salon. Mobile since 2020.' },
      { icon: 'award', title: 'Colour specialist', desc: 'Advanced colour certification from L\'Oréal Professionnel.' },
    ],
    gallery: [],
  },
  {
    id: 's5', name: 'Sofia', specialty: 'Massage Therapist', rating: 5.0, hourlyRate: 55,
    image: massageTherapistImage, heroImage: actionMassage,
    city: 'Porto', lat: 41.156, lng: -8.615, reviews: 61,
    tagline: 'Deep tissue, Swedish, and sports massage at your home',
    bio: 'Licensed massage therapist specializing in deep tissue, Swedish, and sports massage. I bring my own table, oils, and relaxing atmosphere.',
    languages: ['Portuguese', 'English'], memberSince: '2020',
    serviceLocation: 'Provided at client\'s home',
    packages: [
      { name: 'Relaxation Massage', price: 55, duration: '1 hr', priceType: 'session', desc: 'Swedish-style full-body massage. Calming oils and ambient music included.' },
      { name: 'Deep Tissue', price: 70, duration: '1 hr', priceType: 'session', desc: 'Targeted deep tissue work for chronic tension, sports recovery, or injury rehab.' },
      { name: 'Couples Massage', price: 120, duration: '1.5 hrs', priceType: 'session', desc: 'Side-by-side massage for two. Second therapist provided. Relaxation guaranteed.' },
    ],
    qualifications: [
      { icon: 'shield', title: 'Licensed therapist', desc: 'Licensed by the Portuguese Health Authority for therapeutic massage.' },
      { icon: 'clock', title: '6 years of experience', desc: 'Trained in deep tissue, Swedish, sports, and prenatal massage.' },
      { icon: 'book', title: 'Anatomy & kinesiology', desc: 'Diploma in anatomy and kinesiology from ISAVE health sciences institute.' },
    ],
    gallery: [],
  },
  {
    id: 's6', name: 'Ingrid', specialty: 'Babysitter', rating: 4.8, hourlyRate: 28,
    image: babysitterImage, heroImage: actionBabysitting,
    city: 'Porto', lat: 41.164, lng: -8.638, reviews: 36,
    tagline: 'Experienced, multilingual childcare for ages 0–12',
    bio: 'Experienced babysitter and nanny. CPR certified, speaks three languages, and loves arts & crafts. Ages 0–12, daytime and evening.',
    languages: ['Portuguese', 'English', 'Swedish'], memberSince: '2022',
    serviceLocation: 'Provided at client\'s home',
    packages: [],
    qualifications: [
      { icon: 'shield', title: 'CPR & first aid certified', desc: 'Pediatric CPR and first aid certification, renewed annually.' },
    ],
    gallery: [],
  },
]

export const ALL_WORKERS = [...CLEANERS, ...HANDYMEN, ...SERVICES]

/* ------------------------------------------------------------------ *
 *  CLIENT REVIEWS — mock data for development.                       *
 *  In production these come from the database after real bookings.   *
 *  The image field is optional: null → initial-letter badge.         *
 * ------------------------------------------------------------------ */
const _r1 = { author: 'João P.', image: clientJoao, location: 'Porto', rating: 5, timeAgo: '2 days ago', text: 'Absolutely fantastic work. Punctual, professional, and left everything perfect. Will book again without hesitation!' }
const _r2 = { author: 'Sara M.', image: clientSara, location: 'Porto', rating: 5, timeAgo: '6 days ago', text: 'So reliable and friendly. Exceeded my expectations. Highly recommend to anyone in Porto.' }
const _r3 = { author: 'Tomás R.', image: clientTomas, location: 'Vila Nova de Gaia', rating: 5, timeAgo: '1 week ago', text: 'Great communication from start to finish. Fair pricing and outstanding quality. The attention to detail was remarkable and I could tell they genuinely cared about doing an excellent job.' }
const _r4 = { author: 'Luísa F.', image: clientLuisa, location: 'Matosinhos', rating: 4, timeAgo: '1 week ago', text: 'Very good service overall. Arrived on time and did a thorough job. Would use again for sure.' }
const _r5 = { author: 'Pedro C.', image: clientPedro, location: 'Porto', rating: 5, timeAgo: '2 weeks ago', text: 'Incredible attention to detail. My apartment has never looked this good. Five stars well deserved!' }
const _r6 = { author: 'Ana L.', image: clientAna, location: 'Porto', rating: 5, timeAgo: '3 weeks ago', text: 'Professional, fast, and left my home spotless. Already booked a second session.' }

const MOCK_REVIEWS_BY_ID = {
  c1: [_r1, _r2, _r3, _r4, _r5, _r6],
  c2: [_r1, _r2, _r4, _r5],
  c3: [_r2, _r4, _r5],
  c4: [_r1, _r3, _r6],
  c5: [_r2, _r5, _r6],
  c6: [_r2, _r6],
  h1: [_r1, _r3, _r4, _r5, _r6],
  h2: [_r1, _r2, _r3, _r4, _r5, _r6],
  h3: [_r1, _r2, _r4],
  h4: [_r1, _r3, _r5],
  h5: [_r2, _r3, _r5],
  h6: [_r2, _r4],
  s1: [_r2, _r3, _r5, _r6],
  s2: [_r1, _r4, _r6],
  s3: [_r1, _r2, _r3, _r5],
  s4: [_r1, _r2, _r3, _r4, _r5],
  s5: [_r1, _r2, _r3, _r4, _r5, _r6],
  s6: [_r4, _r6],
}

/** Fallback portfolio when worker.gallery is empty — realistic job photos per vertical. */
const MOCK_GALLERY_POOL = {
  c: [actionHomeCleaning, actionDeepCleaning, actionOfficeCleaning, actionHousekeeping, actionMoveoutCleaning],
  h: [actionCarpentry, actionPlumbing, actionElectrical, actionPainting, actionFurnitureAssembly],
  s: [actionPhotography, actionPersonalTraining, actionChef, actionHairStyling, actionMassage],
}

ALL_WORKERS.forEach((w) => {
  w.clientReviews = MOCK_REVIEWS_BY_ID[w.id] || []
  if (w.clientReviews.length > 0) {
    w.reviews = w.clientReviews.length
    w.rating = +(w.clientReviews.reduce((sum, r) => sum + r.rating, 0) / w.clientReviews.length).toFixed(1)
  } else {
    w.reviews = 0
    w.rating = null
  }
})

ALL_WORKERS.forEach((w) => {
  if (w.gallery && w.gallery.length > 0) return
  const prefix = String(w.id)[0]
  const pool = MOCK_GALLERY_POOL[prefix] || [w.heroImage]
  const n = parseInt(String(w.id).slice(1), 10) || 1
  const picks = [
    w.heroImage,
    w.image,
    pool[n % pool.length],
    pool[(n + 1) % pool.length],
    pool[(n + 2) % pool.length],
  ].filter(Boolean)
  w.gallery = [...new Set(picks)]
})

export const CATEGORIES = [
  { id: 'cleaners', labelKey: 'home.categoryClean', workers: CLEANERS },
  { id: 'handymen', labelKey: 'home.categoryRepair', workers: HANDYMEN },
  { id: 'services', labelKey: 'home.categoryServices', workers: SERVICES },
]

export function getWorkerById(id) {
  if (id == null || id === '') return null
  const sid = String(id)
  return ALL_WORKERS.find((w) => String(w.id) === sid) || null
}

/** i18n key for top-level category: Cleaning / Repairs / Services (from worker id prefix c / h / s). */
export function getWorkerServiceCategoryLabelKey(worker) {
  if (!worker?.id) return 'home.categoryClean'
  const p = String(worker.id)[0]
  if (p === 'h') return 'home.categoryRepair'
  if (p === 's') return 'home.categoryServices'
  return 'home.categoryClean'
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
