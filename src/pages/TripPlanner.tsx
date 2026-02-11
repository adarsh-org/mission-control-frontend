import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Plane, Sun, CloudSnow, AlertTriangle, 
  ChevronDown, ChevronUp, Check, X, Sparkles, Clock, IndianRupee,
  Train, Car, Ship, ArrowLeft, Star, Info, Sunrise, Sunset, Mountain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

type PriceTier = 'budget' | 'mid' | 'premium';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type OriginCity = 'Mumbai' | 'Pune' | 'Indore';

interface Activity {
  time: TimeOfDay;
  title: string;
  description: string;
  duration: string;
  cost: { budget: number; mid: number; premium: number };
  mustDo?: boolean;
  canSkip?: boolean;
  transport?: string;
  tip?: string;
}

interface DayItinerary {
  day: number;
  date?: string;
  title: string;
  activities: Activity[];
}

interface Destination {
  id: string;
  name: string;
  country: string;
  heroImage: string;
  recommendation: 'recommended' | 'rushed' | 'unavailable';
  recommendationText: string;
  weather: { temp: string; condition: string; icon: 'sun' | 'cloud-snow' | 'alert' };
  priceRange: { budget: number; mid: number; premium: number };
  flightCosts: { [key in OriginCity]: number };
  stayCost: string;
  duration: string;
  highlights: string[];
  itinerary: DayItinerary[];
  notes?: string[];
  seasonInfo?: string;
}

const destinations: Destination[] = [
  {
    id: 'varkala',
    name: 'Varkala',
    country: 'Kerala, India',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    recommendation: 'recommended',
    recommendationText: 'Perfect for 5 days',
    weather: { temp: '28-32°C', condition: 'Sunny & Warm', icon: 'sun' },
    priceRange: { budget: 25000, mid: 32000, premium: 45000 },
    flightCosts: { Mumbai: 8000, Pune: 9500, Indore: 13000 },
    stayCost: '₹4K/night/room',
    duration: '5 Days',
    highlights: ['Cliff-top cafes', 'Ayurveda spa', 'Edava Beach', 'Surfing'],
    notes: ['Best time: Oct-Mar', 'Peaceful beach vibes', '3 rooms needed for 6 people'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Cliff Sunset',
        activities: [
          { time: 'morning', title: 'Fly to Trivandrum (TRV)', description: 'Arrival & Transfer (1.5 hrs). Prepaid taxi from airport is reliable.', duration: '3 hrs', cost: { budget: 8000, mid: 10000, premium: 15000 }, transport: 'Flight', mustDo: true },
          { time: 'afternoon', title: 'Transfer to Varkala', description: 'Scenic 1.5-hour drive to Varkala North Cliff. Check into resort (e.g., Clafouti or Krishnatheeram).', duration: '2 hrs', cost: { budget: 1500, mid: 1800, premium: 2500 }, transport: 'Taxi/Cab', tip: 'Book hotel on North Cliff for direct sea views' },
          { time: 'evening', title: 'Sunset at Cafe del Mar', description: 'Watch spectacular sunset from the cliff. Dinner at Cafe del Mar or Darjeeling Cafe.', duration: '3 hrs', cost: { budget: 500, mid: 1000, premium: 2000 }, mustDo: true, tip: 'Try the seafood platter and momos' }
        ]
      },
      {
        day: 2,
        title: 'Beach Day & North Cliff',
        activities: [
          { time: 'morning', title: 'Papanasam Beach', description: 'Relax at the holy Papanasam Beach. Early morning is best for swimming.', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true, tip: 'Beach is less crowded before 10 AM' },
          { time: 'afternoon', title: 'North Cliff Shopping', description: 'Walk along the cliff path. Shop for Tibetan artifacts and spices. Lunch at Abba Restaurant (Swedish bakery).', duration: '3 hrs', cost: { budget: 800, mid: 1500, premium: 2500 }, tip: 'Great cinnamon rolls at Abba' },
          { time: 'evening', title: 'Beach Sunset Yoga', description: 'Join a drop-in yoga session at Soul & Surf or local shala.', duration: '2 hrs', cost: { budget: 300, mid: 500, premium: 1000 }, canSkip: true }
        ]
      },
      {
        day: 3,
        title: 'Ayurveda & Relaxation',
        activities: [
          { time: 'morning', title: 'Ayurveda Spa Session', description: 'Traditional Kerala Ayurvedic massage. Try scientifically verified centers like AyurSoul.', duration: '3 hrs', cost: { budget: 1500, mid: 3000, premium: 6000 }, mustDo: true, tip: 'Opt for Abhyanga (oil massage)' },
          { time: 'afternoon', title: 'Chill at Kappil Beach', description: 'Drive 15 mins to Kappil. Where backwaters meet the sea. Kayaking available.', duration: '3 hrs', cost: { budget: 400, mid: 800, premium: 1500 }, transport: 'Auto' },
          { time: 'evening', title: 'Dinner at Darjeeling Cafe', description: 'Chill vibe with live music often available.', duration: '2 hrs', cost: { budget: 600, mid: 1200, premium: 2000 }, canSkip: true }
        ]
      },
      {
        day: 4,
        title: 'Back to Varkala & Papanasam',
        activities: [
          { time: 'morning', title: 'Leisure Morning', description: 'Sleep in or enjoy a slow breakfast at a cliff cafe overlooking the sea.', duration: '3 hrs', cost: { budget: 300, mid: 600, premium: 1000 }, tip: 'Try the Tibetan breakfast at Tibeits' },
          { time: 'afternoon', title: 'Surfing & Beach Time', description: 'Take a surfing lesson (beginner friendly!) with Soul & Surf or Moon Waves.', duration: '4 hrs', cost: { budget: 1500, mid: 2500, premium: 4000 }, mustDo: true, tip: 'Best swell usually in morning/late afternoon' },
          { time: 'evening', title: 'Sunset at Edava Beach', description: 'Short auto ride to Edava. Quieter beach with beautiful blue lagoon.', duration: '3 hrs', cost: { budget: 200, mid: 400, premium: 800 }, transport: 'Auto/Taxi', mustDo: true }
        ]
      },
      {
        day: 5,
        title: 'Kovalam & Departure',
        activities: [
          { time: 'morning', title: 'Checkout & Kovalam', description: 'Check out, drive to Kovalam (1 hr). Visit the iconic lighthouse.', duration: '3 hrs', cost: { budget: 1500, mid: 2000, premium: 2500 }, transport: 'Taxi', tip: 'Climb lighthouse for panoramic views (₹50)' },
          { time: 'afternoon', title: 'Lunch at German Bakery', description: 'Famous spot in Kovalam for seafood and pastries.', duration: '2 hrs', cost: { budget: 600, mid: 1200, premium: 2000 }, canSkip: true },
          { time: 'evening', title: 'Fly Home', description: 'Transfer to Trivandrum airport (30 mins from Kovalam). Evening flight.', duration: '3 hrs', cost: { budget: 8000, mid: 10000, premium: 15000 }, transport: 'Flight', mustDo: true }
        ]
      }
    ]
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka (South Coast)',
    country: 'South Asia',
    heroImage: 'https://images.unsplash.com/photo-1586394461970-e7f9d0c0541b?w=800&q=80',
    recommendation: 'rushed',
    recommendationText: 'Optimized for 5 Days',
    weather: { temp: '25-30°C', condition: 'Tropical', icon: 'sun' },
    priceRange: { budget: 45000, mid: 52000, premium: 70000 },
    flightCosts: { Mumbai: 18000, Pune: 22000, Indore: 25000 },
    stayCost: '₹3-5K/night/room',
    duration: '5 Days',
    highlights: ['Hiriketiya Beach', 'Galle Fort', 'Whale watching', 'Mirissa Vibes'],
    notes: ['Route optimized: South Coast Only', 'Skipping Kandy/Ella to save 10+ hrs travel', 'Best beaches in March'],
    itinerary: [
      {
        day: 1,
        title: 'Colombo Arrival -> Hiriketiya',
        activities: [
          { time: 'morning', title: 'Fly to Colombo (CMB)', description: 'Arrival. Visa on arrival. Direct transfer to South Coast via Expressway.', duration: '4 hrs', cost: { budget: 15000, mid: 18000, premium: 25000 }, transport: 'Flight', mustDo: true },
          { time: 'afternoon', title: 'Drive to Hiriketiya', description: '3-hour drive via highway to Hiriketiya (horseshoe bay). Much faster than hill country.', duration: '3 hrs', cost: { budget: 8000, mid: 10000, premium: 15000 }, transport: 'Private Van', tip: 'Hire a van for the whole trip (~$50-60/day)' },
          { time: 'evening', title: 'Hiriketiya Chill', description: 'Relax at the horseshoe bay. Surfer vibe, great cafes like Dots Bay House.', duration: '3 hrs', cost: { budget: 1000, mid: 2000, premium: 3000 }, mustDo: true }
        ]
      },
      {
        day: 2,
        title: 'Hiriketiya & Tangalle',
        activities: [
          { time: 'morning', title: 'Surf/Swim at Hiri', description: 'Morning surf lesson or swim. Water is calm in the corner.', duration: '3 hrs', cost: { budget: 2000, mid: 3000, premium: 5000 }, mustDo: true },
          { time: 'afternoon', title: 'Silent Beach (Tangalle)', description: 'Short drive to Amanwella/Silent Beach. Stunning, empty stretch.', duration: '3 hrs', cost: { budget: 500, mid: 1000, premium: 2000 }, tip: 'Coconut tree rope swing spot nearby' },
          { time: 'evening', title: 'Dinner at Smoke & Bitters', description: 'Rated among Asia\'s 50 Best Bars. Amazing cocktails and food.', duration: '3 hrs', cost: { budget: 2000, mid: 4000, premium: 6000 }, mustDo: true, tip: 'Book in advance!' }
        ]
      },
      {
        day: 3,
        title: 'Mirissa & Whales',
        activities: [
          { time: 'morning', title: 'Drive to Mirissa', description: '1-hour coastal drive. Check into hotel near Mirissa Beach.', duration: '1 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: 'Van' },
          { time: 'afternoon', title: 'Coconut Tree Hill', description: 'Iconic photo spot. Walk along the coast.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true },
          { time: 'evening', title: 'Mirissa Beach Party', description: 'Lively beach vibes. Fresh seafood on the sand. Zephyr or Petti Petti.', duration: '4 hrs', cost: { budget: 1500, mid: 3000, premium: 5000 }, tip: 'Pick your fish fresh from the display' }
        ]
      },
      {
        day: 4,
        title: 'Galle Fort History',
        activities: [
          { time: 'morning', title: 'Whale Watching (Optional)', description: 'Early morning boat. Blue whales common in March.', duration: '4 hrs', cost: { budget: 4000, mid: 6000, premium: 9000 }, canSkip: true },
          { time: 'afternoon', title: 'Drive to Galle', description: '45-min drive. Explore the UNESCO Galle Fort. Colonial architecture.', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true, tip: 'Walk the ramparts at sunset' },
          { time: 'evening', title: 'Dinner in the Fort', description: 'Charming streets with boutique shops and cafes. Pedlar\'s Inn or Fort Printers.', duration: '3 hrs', cost: { budget: 1500, mid: 3000, premium: 5000 } }
        ]
      },
      {
        day: 5,
        title: 'Departure',
        activities: [
          { time: 'morning', title: 'Last Shop & Drive', description: 'Buy Ceylon tea/spices. Drive to Colombo Airport via highway (2 hrs).', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: 'Van' },
          { time: 'afternoon', title: 'Airport Check-in', description: 'Arrive 3 hours before flight.', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 } },
          { time: 'evening', title: 'Fly Home', description: 'Evening flight back to India.', duration: '4 hrs', cost: { budget: 18000, mid: 20000, premium: 28000 }, transport: 'Flight', mustDo: true }
        ]
      }
    ]
  },
  {
    id: 'oman',
    name: 'Oman',
    country: 'Middle East',
    heroImage: 'https://images.unsplash.com/photo-1590076215667-273397949021?w=800&q=80',
    recommendation: 'recommended',
    recommendationText: 'Adventure & Luxury',
    weather: { temp: '25-30°C', condition: 'Sunny & Dry', icon: 'sun' },
    priceRange: { budget: 50000, mid: 70000, premium: 100000 },
    flightCosts: { Mumbai: 16000, Pune: 19500, Indore: 20000 },
    stayCost: '₹5-10K/night',
    duration: '6 Days',
    highlights: ['Wadi Shab', 'Wahiba Sands', 'Nizwa Fort', 'Jebel Shams'],
    seasonInfo: 'Best: Oct-Mar',
    notes: [
      '🚙 4x4 Rental Essential (~₹5k/day)',
      '⛺ Desert Camping is a MUST',
      '🏊‍♂️ Wadis are perfect for swimming',
      'Visa: eVisa required (Easy)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Muscat',
        activities: [
          { time: 'morning', title: 'Fly to Muscat (MCT)', description: 'Direct from Mumbai/Delhi. Pick up 4x4 rental at airport.', duration: '3 hrs', cost: { budget: 16000, mid: 20000, premium: 30000 }, transport: 'Flight', mustDo: true },
          { time: 'afternoon', title: 'Mutrah Souq & Corniche', description: 'Explore the traditional market. Buy frankincense. Walk the corniche.', duration: '3 hrs', cost: { budget: 500, mid: 1000, premium: 2000 } },
          { time: 'evening', title: 'Sultan Qaboos Mosque', description: 'View from outside (open morning only for tourists) or dinner at Kargeen.', duration: '2 hrs', cost: { budget: 1000, mid: 2000, premium: 4000 }, mustDo: true }
        ]
      },
      {
        day: 2,
        title: 'Bimmah Sinkhole & Wadi Shab',
        activities: [
          { time: 'morning', title: 'Bimmah Sinkhole', description: 'Drive south (1.5 hrs). Swim in the turquoise sinkhole.', duration: '1 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: '4x4' },
          { time: 'afternoon', title: 'Wadi Shab Hike & Swim', description: 'Boat across river -> Hike 45 mins -> Swim through caves to hidden waterfall.', duration: '4 hrs', cost: { budget: 100, mid: 100, premium: 100 }, mustDo: true, tip: 'Water shoes essential!' },
          { time: 'evening', title: 'Drive to Sur/Ras Al Jinz', description: 'Stay in Sur or Turtle Reserve.', duration: '2 hrs', cost: { budget: 3000, mid: 5000, premium: 8000 } }
        ]
      },
      {
        day: 3,
        title: 'Wadi Bani Khalid & Desert',
        activities: [
          { time: 'morning', title: 'Wadi Bani Khalid', description: 'Emerald pools in the desert. Easy swimming, no hiking needed.', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true },
          { time: 'afternoon', title: 'Enter Wahiba Sands', description: 'Deflate tires! Drive into the dunes for 40km to your camp.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: '4x4', mustDo: true },
          { time: 'evening', title: 'Desert Sunset & Camping', description: 'Sunset on dunes. BBQ dinner under stars. Stay at Thousand Nights or Desert Nights.', duration: '12 hrs', cost: { budget: 5000, mid: 10000, premium: 20000 }, mustDo: true }
        ]
      },
      {
        day: 4,
        title: 'Nizwa & History',
        activities: [
          { time: 'morning', title: 'Drive to Nizwa', description: 'Exit desert, drive to the ancient capital (2.5 hrs).', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: '4x4' },
          { time: 'afternoon', title: 'Nizwa Fort & Souq', description: 'Explore the massive circular fort. Buy Omani dates and pottery.', duration: '2 hrs', cost: { budget: 1000, mid: 1000, premium: 1000 }, mustDo: true },
          { time: 'evening', title: 'Misfat Al Abriyeen', description: 'Visit the mud-brick village built into the mountain.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 }, canSkip: true }
        ]
      },
      {
        day: 5,
        title: 'Grand Canyon (Jebel Shams)',
        activities: [
          { time: 'morning', title: 'Drive up Jebel Shams', description: 'Off-road drive to Oman\'s highest mountain.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 }, transport: '4x4' },
          { time: 'afternoon', title: 'Balcony Walk', description: 'Spectacular rim walk overlooking the "Grand Canyon of Arabia".', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true },
          { time: 'evening', title: 'Return to Muscat', description: 'Drive back to Muscat (3 hrs). Farewell dinner.', duration: '3 hrs', cost: { budget: 1500, mid: 3000, premium: 5000 } }
        ]
      },
      {
        day: 6,
        title: 'Departure',
        activities: [
          { time: 'morning', title: 'Sultan Qaboos Grand Mosque', description: 'Visit inside (8-11 AM only). Stunning chandelier and carpet.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true, tip: 'Strict dress code' },
          { time: 'afternoon', title: 'Opera House & Beach', description: 'Quick photo stop at Royal Opera House. Lunch at Qurum Beach.', duration: '2 hrs', cost: { budget: 1000, mid: 2000, premium: 3000 } },
          { time: 'evening', title: 'Fly Home', description: 'Drop rental car. Flight back.', duration: '3 hrs', cost: { budget: 16000, mid: 20000, premium: 30000 }, transport: 'Flight' }
        ]
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    recommendation: 'rushed',
    recommendationText: 'March: Risky but possible',
    weather: { temp: '-10 to -20°C', condition: 'Extreme Cold', icon: 'cloud-snow' },
    priceRange: { budget: 35000, mid: 45000, premium: 65000 },
    flightCosts: { Mumbai: 15000, Pune: 18000, Indore: 22000 },
    stayCost: '₹3-6K/night',
    duration: '6 Days',
    highlights: ['Frozen Pangong', 'Snowy Passes', 'Monasteries', 'Winter Vibes'],
    seasonInfo: 'Season: June - September',
    notes: [
      '⚠️ March Reality: Pangong Lake is FROZEN solid.',
      '❄️ Roads (Chang La/Khardung La) can close anytime due to snow.',
      '🌡️ Temp drops to -20°C at night. Hotels might not have running water (buckets used).',
      '🏍️ Biking: Expert ONLY. Black ice risk is high.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Acclimatization',
        activities: [
          { time: 'morning', title: 'Fly to Leh', description: 'Arrival in Leh (11,500ft). Spectacular landing.', duration: '2 hrs', cost: { budget: 10000, mid: 12000, premium: 18000 }, transport: 'Flight', mustDo: true },
          { time: 'afternoon', title: 'Strict Bed Rest', description: 'Do NOT sleep, but stay in bed. Body needs to adjust to low oxygen.', duration: '5 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true, tip: 'Diamondox usually not needed if you rest properly' },
          { time: 'evening', title: 'Light Dinner', description: 'Soup and light food. Avoid alcohol completely.', duration: '1 hrs', cost: { budget: 300, mid: 500, premium: 1000 } }
        ]
      },
      {
        day: 2,
        title: 'Local Sightseeing (Acclimatization)',
        activities: [
          { time: 'morning', title: 'Hall of Fame', description: 'War museum run by Indian Army. Very moving.', duration: '2 hrs', cost: { budget: 100, mid: 100, premium: 100 }, mustDo: true },
          { time: 'afternoon', title: 'Leh Palace & Shanti Stupa', description: 'Short drives. Don\'t climb too many stairs yet.', duration: '3 hrs', cost: { budget: 200, mid: 200, premium: 500 }, mustDo: true },
          { time: 'evening', title: 'Leh Market', description: 'Buy winter gear if you forgot anything. It will be COLD.', duration: '2 hrs', cost: { budget: 0, mid: 0, premium: 0 } }
        ]
      },
      {
        day: 3,
        title: 'Nubra Valley (If Road Open)',
        activities: [
          { time: 'morning', title: 'Khardung La Pass', description: 'Drive to world\'s highest pass. Likely covered in snow.', duration: '5 hrs', cost: { budget: 4000, mid: 5000, premium: 8000 }, transport: 'Innova (Heated)', mustDo: true, tip: 'Don\'t stay more than 15 mins at top' },
          { time: 'afternoon', title: 'Diskit Monastery', description: 'Big Maitreya Buddha statue facing the valley.', duration: '2 hrs', cost: { budget: 100, mid: 100, premium: 100 } },
          { time: 'evening', title: 'Hunder Stay', description: 'Stay in heated guest house. Camps usually closed in March.', duration: '12 hrs', cost: { budget: 2000, mid: 3000, premium: 5000 }, tip: 'Ensure heating is available' }
        ]
      },
      {
        day: 4,
        title: 'Frozen Pangong Lake',
        activities: [
          { time: 'morning', title: 'Drive to Pangong (Shyok Route)', description: 'If Shyok route open (check with driver). 5-6 hrs drive.', duration: '6 hrs', cost: { budget: 5000, mid: 6000, premium: 10000 }, transport: 'Innova', mustDo: true },
          { time: 'afternoon', title: 'Walk on Frozen Lake', description: 'In March, the lake is a solid sheet of ice. You can walk/drive on it!', duration: '3 hrs', cost: { budget: 0, mid: 0, premium: 0 }, mustDo: true, tip: 'Unique winter experience' },
          { time: 'evening', title: 'Homestay in Spangmik', description: 'Basic wooden cottages with heaters. Luxury camps are closed.', duration: '12 hrs', cost: { budget: 2000, mid: 3000, premium: 4000 } }
        ]
      },
      {
        day: 5,
        title: 'Return to Leh via Chang La',
        activities: [
          { time: 'morning', title: 'Drive back to Leh', description: 'Crossing Chang La pass (very snowy).', duration: '5 hrs', cost: { budget: 5000, mid: 6000, premium: 10000 }, transport: 'Innova' },
          { time: 'afternoon', title: 'Thiksey Monastery', description: 'Visit on the way back. Beautiful architecture.', duration: '2 hrs', cost: { budget: 100, mid: 100, premium: 100 } },
          { time: 'evening', title: 'Farewell Dinner', description: 'Celebration dinner at The Tibetan Kitchen (if open) or hotel.', duration: '3 hrs', cost: { budget: 1000, mid: 2000, premium: 3000 } }
        ]
      },
      {
        day: 6,
        title: 'Departure',
        activities: [
          { time: 'morning', title: 'Airport Transfer', description: 'Early morning flights are standard.', duration: '1 hrs', cost: { budget: 500, mid: 800, premium: 1000 }, transport: 'Taxi' },
          { time: 'afternoon', title: 'Fly Out', description: 'Views of snowy Himalayas one last time.', duration: '3 hrs', cost: { budget: 10000, mid: 12000, premium: 18000 }, transport: 'Flight' },
          { time: 'evening', title: 'Home', description: 'Back to sea level!', duration: '0 hrs', cost: { budget: 0, mid: 0, premium: 0 } }
        ]
      }
    ]
  }
];

const WeatherIcon = ({ type }: { type: 'sun' | 'cloud-snow' | 'alert' }) => {
  switch (type) {
    case 'sun': return <Sun className="w-5 h-5 text-amber-400" />;
    case 'cloud-snow': return <CloudSnow className="w-5 h-5 text-blue-400" />;
    case 'alert': return <AlertTriangle className="w-5 h-5 text-red-400" />;
  }
};

const RecommendationBadge = ({ type }: { type: 'recommended' | 'rushed' | 'unavailable' }) => {
  const styles = {
    recommended: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rushed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    unavailable: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  const icons = {
    recommended: <Check className="w-3.5 h-3.5" />,
    rushed: <AlertTriangle className="w-3.5 h-3.5" />,
    unavailable: <X className="w-3.5 h-3.5" />
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[type]}`}>
      {icons[type]}
      {type === 'recommended' ? 'Recommended' : type === 'rushed' ? 'Rushed' : 'Unavailable'}
    </span>
  );
};

const TimeIcon = ({ time }: { time: TimeOfDay }) => {
  switch (time) {
    case 'morning': return <Sunrise className="w-4 h-4 text-amber-400" />;
    case 'afternoon': return <Sun className="w-4 h-4 text-orange-400" />;
    case 'evening': return <Sunset className="w-4 h-4 text-purple-400" />;
  }
};

const TransportIcon = ({ type }: { type?: string }) => {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes('flight')) return <Plane className="w-3.5 h-3.5" />;
  if (t.includes('train')) return <Train className="w-3.5 h-3.5" />;
  if (t.includes('taxi') || t.includes('car') || t.includes('suv') || t.includes('van')) return <Car className="w-3.5 h-3.5" />;
  if (t.includes('boat')) return <Ship className="w-3.5 h-3.5" />;
  return null;
};

interface DestinationCardProps {
  destination: Destination;
  priceTier: PriceTier;
  isExpanded: boolean;
  onToggle: () => void;
  onCompare: () => void;
  isComparing: boolean;
  originCity: OriginCity;
}

function DestinationCard({ destination, priceTier, isExpanded, onToggle, onCompare, isComparing, originCity }: DestinationCardProps) {
  const isUnavailable = destination.recommendation === 'unavailable';
  
  return (
    <Card className={`overflow-hidden bg-claw-surface border-white/10 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-accent-primary/50' : 'hover:border-white/20'
    } ${isComparing ? 'ring-2 ring-cyan-500/50' : ''} ${isUnavailable ? 'opacity-80' : ''}`}>
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={destination.heroImage} 
          alt={destination.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${isUnavailable ? 'grayscale' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-claw-surface via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <RecommendationBadge type={destination.recommendation} />
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <WeatherIcon type={destination.weather.icon} />
            <span className="text-xs font-medium text-white">{destination.weather.temp}</span>
          </div>
        </div>
        
        {isUnavailable && destination.seasonInfo && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-red-500/90 backdrop-blur-sm px-3 py-2 rounded-lg text-center">
              <span className="text-sm font-bold text-white">{destination.seasonInfo}</span>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-primary" />
              {destination.name}
            </CardTitle>
            <p className="text-sm text-accent-muted mt-1">{destination.country}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-primary">
              ₹{(destination.priceRange[priceTier] / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-accent-muted">per person</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <Calendar className="w-4 h-4 mx-auto text-accent-secondary mb-1" />
            <p className="text-xs font-medium text-white">{destination.duration}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <Plane className="w-4 h-4 mx-auto text-accent-secondary mb-1" />
            <p className="text-xs font-medium text-white">₹{(destination.flightCosts[originCity]/1000).toFixed(1)}K</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <Users className="w-4 h-4 mx-auto text-accent-secondary mb-1" />
            <p className="text-xs font-medium text-white">6 ppl</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {destination.highlights.map((h, i) => (
            <Badge key={i} variant="secondary" className="bg-white/5 text-accent-muted text-xs">
              {h}
            </Badge>
          ))}
        </div>

        {isUnavailable && destination.notes && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-1">
            {destination.notes.map((note, i) => (
              <p key={i} className="text-xs text-red-300">{note}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onToggle}
            className="flex-1 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-accent-primary/30"
          >
            {isExpanded ? (
              <>Hide Itinerary <ChevronUp className="w-4 h-4 ml-1" /></>
            ) : (
              <>View Itinerary <ChevronDown className="w-4 h-4 ml-1" /></>
            )}
          </Button>
          <Button 
            onClick={onCompare}
            variant="outline"
            className={`${isComparing ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10'}`}
          >
            {isComparing ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpandedItinerary({ destination, priceTier, withMotorcycle = false, originCity }: { destination: Destination; priceTier: PriceTier; withMotorcycle?: boolean; originCity: OriginCity }) {
  const isLadakh = destination.id === 'ladakh';
  
  // Start date: March 21st, 2026
  const getDayDate = (dayNum: number) => {
    const date = new Date(2026, 2, 21); // March is month 2 (0-indexed)
    date.setDate(date.getDate() + (dayNum - 1));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-claw-surface/30 border-t border-b border-white/5 mt-4"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLadakh && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <Mountain className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">⚠️ March Travel Warning</h3>
              <p className="text-sm text-amber-300/80">Ladakh in March is risky - roads are closed, only flight access (weather-dependent). Extreme cold (-10 to -20°C). Consider June-September for motorcycle adventure!</p>
              {withMotorcycle && <p className="text-sm text-amber-300 mt-2 font-medium">🏍️ Motorcycle rental added (~₹1,500/day for Royal Enfield)</p>}
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{destination.name} Itinerary</h3>
              <p className="text-sm text-accent-muted">{destination.duration} • {destination.itinerary.length} Days • From {originCity}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destination.itinerary.map((day) => (
            <Card key={day.day} className="bg-claw-surface/50 border-white/5 h-full">
              <CardHeader className="pb-2 border-b border-white/5">
                <CardTitle className="text-base font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center text-accent-primary text-sm font-bold">
                      {day.day}
                    </span>
                    <span>{day.title}</span>
                  </div>
                  <span className="text-xs font-normal text-accent-muted bg-white/5 px-2 py-1 rounded">
                    {getDayDate(day.day)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {day.activities.map((activity, idx) => {
                  // Adjust costs for motorcycle toggle in Ladakh
                  let displayCost = activity.cost[priceTier];
                  let displayTransport = activity.transport;
                  
                  if (isLadakh && withMotorcycle && activity.transport && 
                     (activity.transport.includes('Taxi') || activity.transport.includes('Car'))) {
                      displayTransport = 'Motorcycle';
                      // Motorcycle might be cheaper than Taxi per person if sharing, but fuel is extra.
                      // Let's assume renting 3 bikes for 6 people. 
                      // Rent ~1500/day. Fuel ~500/day. Total 2000/day per bike.
                      // 3 bikes = 6000/day. Per person = 1000/day.
                      // Taxi for 6 (Innova) ~5000-8000/day. Per person ~1000-1300.
                      // Costs are similar, maybe slightly cheaper or same.
                      // Let's just adjust the text for now.
                  }

                  return (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 border-l-2 border-accent-primary/30 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <TimeIcon time={activity.time} />
                            <h4 className="font-medium text-white text-sm truncate">{activity.title}</h4>
                            {activity.mustDo && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 flex-shrink-0">
                                Must Do
                              </Badge>
                            )}
                            {activity.canSkip && (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-[10px] px-1.5 flex-shrink-0">
                                Can Skip
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-accent-muted mb-2 line-clamp-3">{activity.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-[10px]">
                            <span className="flex items-center gap-1 text-accent-secondary">
                              <Clock className="w-3 h-3" />
                              {activity.duration}
                            </span>
                            {displayTransport && (
                              <span className="flex items-center gap-1 text-accent-secondary">
                                <TransportIcon type={displayTransport} />
                                {displayTransport}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-accent-primary font-semibold">
                              <IndianRupee className="w-3 h-3" />
                              {displayCost.toLocaleString()}
                            </span>
                          </div>
                          
                          {activity.tip && (
                            <div className="mt-2 flex items-start gap-1.5 bg-amber-500/10 rounded px-2 py-1">
                              <Info className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span className="text-[10px] text-amber-300 italic">{activity.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CompareModal({ destinations: dests, priceTier, onClose, originCity }: { destinations: Destination[]; priceTier: PriceTier; onClose: () => void; originCity: OriginCity }) {
  if (dests.length < 2) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-claw-surface border border-white/10 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-claw-surface border-b border-white/10 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-primary" />
            Comparison
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-accent-muted font-medium">Feature</th>
                {dests.map(d => (<th key={d.id} className="text-center py-3 px-2 text-white font-semibold">{d.name}</th>))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Status</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center"><RecommendationBadge type={d.recommendation} /></td>))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Total Cost (approx)</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center text-accent-primary font-semibold">₹{(d.priceRange[priceTier]/1000).toFixed(0)}K/person</td>))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Flight from {originCity}</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center text-white">₹{(d.flightCosts[originCity]/1000).toFixed(1)}K RT</td>))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Duration</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center text-white">{d.duration}</td>))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Weather</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center"><div className="flex items-center justify-center gap-1"><WeatherIcon type={d.weather.icon} /><span className="text-white">{d.weather.temp}</span></div></td>))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-2 text-accent-muted">Highlights</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center text-white text-xs">{d.highlights.slice(0, 3).join(', ')}</td>))}
              </tr>
              <tr>
                <td className="py-3 px-2 text-accent-muted">Group Cost (6 ppl)</td>
                {dests.map(d => (<td key={d.id} className="py-3 px-2 text-center text-emerald-400 font-bold">₹{((d.priceRange[priceTier] * 6)/1000).toFixed(0)}K total</td>))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TripPlanner() {
  const [priceTier, setPriceTier] = useState<PriceTier>('mid');
  const [originCity, setOriginCity] = useState<OriginCity>('Mumbai');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [withMotorcycle, setWithMotorcycle] = useState(false);

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);
  const toggleCompare = (id: string) => setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev);
  const compareDestinations = destinations.filter(d => compareIds.includes(d.id));
  const expandedDestination = destinations.find(d => d.id === expandedId);

  return (
    <div className="flex-1 overflow-y-auto bg-claw-bg relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-claw-surface/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link to="/"><Button variant="ghost" size="sm" className="text-accent-muted hover:text-white"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2"><Plane className="w-5 h-5 text-accent-primary" />Trip Planner</h1>
                <p className="text-xs text-accent-muted">Mar 21, 2026 • 6 People • 3 Couples</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Origin City Selector */}
              <div className="relative">
                 <select 
                   value={originCity}
                   onChange={(e) => setOriginCity(e.target.value as OriginCity)}
                   className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent-primary"
                 >
                   <option value="Mumbai">From Mumbai</option>
                   <option value="Pune">From Pune</option>
                   <option value="Indore">From Indore</option>
                 </select>
                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-muted pointer-events-none" />
              </div>

              {/* Price Tier Toggle */}
              <div className="flex bg-white/5 rounded-lg p-1">
                {(['budget', 'mid', 'premium'] as PriceTier[]).map((tier) => (
                  <button key={tier} onClick={() => setPriceTier(tier)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${priceTier === tier ? 'bg-accent-primary text-white' : 'text-accent-muted hover:text-white'}`}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
              
              {compareIds.length >= 2 && (
                <Button onClick={() => setShowCompare(true)} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4 mr-2" />Compare ({compareIds.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8 bg-gradient-to-r from-accent-primary/10 to-cyan-500/10 border border-accent-primary/20 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">March 2026 Trip Options</h2>
              <p className="text-sm text-accent-muted">Starts March 21st • 5-6 Days • {originCity} Departure</p>
            </div>
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-accent-primary" /><span className="text-white">6 Travelers</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent-primary" /><span className="text-white">Mar 21 - Mar 26</span></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /><span className="text-white">Varkala Recommended</span></div>
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              priceTier={priceTier}
              isExpanded={expandedId === destination.id}
              onToggle={() => toggleExpand(destination.id)}
              onCompare={() => toggleCompare(destination.id)}
              isComparing={compareIds.includes(destination.id)}
              originCity={originCity}
            />
          ))}
        </div>

        {/* Full Width Expanded Itinerary Section */}
        {/* We render this OUTSIDE the grid so it takes full width naturally */}
        <AnimatePresence>
          {expandedDestination && (
            <div className="mt-8 relative z-10">
              <div className="absolute inset-0 bg-claw-bg/80 backdrop-blur-sm -z-10" onClick={() => setExpandedId(null)} />
              
              {expandedDestination.id === 'ladakh' && (
                <div className="max-w-7xl mx-auto px-4 mb-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏍️</span>
                      <div>
                        <p className="text-amber-400 font-medium">Motorcycle Rental (Optional)</p>
                        <p className="text-xs text-amber-300/70">Add Royal Enfield adventure to your Ladakh trip</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setWithMotorcycle(!withMotorcycle)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        withMotorcycle 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {withMotorcycle ? '✓ With Motorcycle' : 'Without Motorcycle'}
                    </button>
                  </div>
                </div>
              )}
              
              <ExpandedItinerary 
                destination={expandedDestination} 
                priceTier={priceTier} 
                withMotorcycle={withMotorcycle}
                originCity={originCity}
              />
              
              <div className="flex justify-center mt-6">
                 <Button onClick={() => setExpandedId(null)} variant="outline" className="border-white/10 hover:bg-white/5">
                    Close Itinerary <ChevronUp className="w-4 h-4 ml-2" />
                 </Button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Summary Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Recommendation: Varkala, Kerala — Perfect balance of beaches, culture & relaxation!</span>
          </div>
        </div>
      </main>

      <AnimatePresence>{showCompare && <CompareModal destinations={compareDestinations} priceTier={priceTier} onClose={() => setShowCompare(false)} originCity={originCity} />}</AnimatePresence>
    </div>
  );
}
