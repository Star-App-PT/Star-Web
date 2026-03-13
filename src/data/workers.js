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

export const CITY = 'Porto'
export const PICKED_DATES = 'Aug 1 – Aug 3'

export const CLEANERS = [
  { id: 'c1', name: 'Maria', specialty: 'Home Cleaner', rating: 5.0, hourlyRate: 28, image: cleaner1Image },
  { id: 'c2', name: 'Ana', specialty: 'Deep Cleaner', rating: 4.9, hourlyRate: 32, image: cleaner2Image },
  { id: 'c3', name: 'Ricardo', specialty: 'Office Cleaner', rating: 4.9, hourlyRate: 25, image: cleaner3Image },
  { id: 'c4', name: 'Patricia', specialty: 'Housekeeper', rating: 4.8, hourlyRate: 30, image: cleaner4Image },
  { id: 'c5', name: 'Helena', specialty: 'Move-out Cleaner', rating: 4.9, hourlyRate: 27, image: cleaner5Image },
  { id: 'c6', name: 'André', specialty: 'Window Cleaner', rating: 4.7, hourlyRate: 29, image: cleaner6Image },
]

export const HANDYMEN = [
  { id: 'h1', name: 'Joao', specialty: 'Carpenter', rating: 4.9, hourlyRate: 35, image: handyman1Image },
  { id: 'h2', name: 'Miguel', specialty: 'Plumber', rating: 5.0, hourlyRate: 42, image: handyman2Image },
  { id: 'h3', name: 'Rui', specialty: 'Carpenter', rating: 4.8, hourlyRate: 38, image: handyman3Image },
  { id: 'h4', name: 'Carlos', specialty: 'Electrician', rating: 4.9, hourlyRate: 40, image: handyman4Image },
  { id: 'h5', name: 'Clara', specialty: 'Painter', rating: 4.8, hourlyRate: 37, image: handyman5Image },
  { id: 'h6', name: 'Bruno', specialty: 'Plumber', rating: 4.8, hourlyRate: 39, image: handyman6Image },
]

export const SERVICES = [
  { id: 's1', name: 'Rita', specialty: 'Photographer', rating: 4.9, hourlyRate: 48, image: photographerImage },
  { id: 's2', name: 'Marta', specialty: 'Personal Trainer', rating: 4.8, hourlyRate: 30, image: personalTrainerImage },
  { id: 's3', name: 'Tiago', specialty: 'Chef', rating: 4.8, hourlyRate: 44, image: chefImage },
  { id: 's4', name: 'Luis', specialty: 'Hair Stylist', rating: 5.0, hourlyRate: 52, image: hairStylistImage },
  { id: 's5', name: 'Sofia', specialty: 'Massage Therapist', rating: 5.0, hourlyRate: 55, image: massageTherapistImage },
  { id: 's6', name: 'Ingrid', specialty: 'Babysitter', rating: 4.8, hourlyRate: 28, image: babysitterImage },
]

export const CATEGORIES = [
  { id: 'cleaners', labelKey: 'home.categoryClean', workers: CLEANERS },
  { id: 'handymen', labelKey: 'home.categoryRepair', workers: HANDYMEN },
  { id: 'services', labelKey: 'home.categoryServices', workers: SERVICES },
]
