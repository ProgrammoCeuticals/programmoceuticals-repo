// ─── CONTACT ─────────────────────────────────────────────────────────────────
export const CONTACT = {
  phone: "09014319141",
  email: "info@housingfirstholdings.com",
  address: "House 11-13, S.Zakari Close, NAF Valley Estate, Asokoro, Abuja",
  hours: "Mon – Fri, 9:00 AM – 6:00 PM",
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
};

// ─── COLORS ───────────────────────────────────────────────────────────────────
export const C = {
  navy: "#0F172A",
  navySoft: "#16213B",
  gold: "#C9A227",
  goldSoft: "#E4C766",
  white: "#FFFFFF",
  lightGray: "#F8FAFC",
  text: "#1E293B",
  success: "#22C55E",
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
import {
  Building2, TrendingUp, ShieldCheck, Briefcase, Hammer,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Home", key: "home" },
  { label: "About", key: "about" },
  {
    label: "Services", key: "services",
    mega: [
      { label: "Real Estate Development", desc: "Residential, commercial & infrastructure", icon: Building2 },
      { label: "Property Investment", desc: "Advisory, ROI planning & acquisition", icon: TrendingUp },
      { label: "Property Management", desc: "Facility, tenant & maintenance care", icon: ShieldCheck },
      { label: "Outsourcing", desc: "Workforce & operations support", icon: Briefcase },
      { label: "General Contracts", desc: "Construction & civil works", icon: Hammer },
    ],
  },
  { label: "Properties", key: "properties" },
  { label: "Investments", key: "investments" },
  { label: "Projects", key: "projects" },
  { label: "Contact", key: "contact" },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
export const STATS = [
  { label: "Properties Sold", value: 1280, suffix: "+" },
  { label: "Projects Completed", value: 96, suffix: "" },
  { label: "Happy Clients", value: 4200, suffix: "+" },
  { label: "Years of Experience", value: 18, suffix: "" },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    icon: Building2, title: "Real Estate Development",
    desc: "Luxury residential developments, commercial developments, estate planning and infrastructure delivered end to end.",
    points: ["Luxury residential developments", "Commercial developments", "Estate planning", "Infrastructure"],
  },
  {
    icon: TrendingUp, title: "Property Investment",
    desc: "Investment advisory, ROI planning, property acquisition and long-term asset growth strategy.",
    points: ["Investment advisory", "ROI planning", "Property acquisition", "Asset growth"],
  },
  {
    icon: ShieldCheck, title: "Property Management",
    desc: "Facility management, maintenance, tenant management, valuation and rent collection under one roof.",
    points: ["Facility management", "Maintenance", "Tenant management", "Property valuation", "Rent collection"],
  },
  {
    icon: Briefcase, title: "Outsourcing",
    desc: "Corporate outsourcing, facility staffing, estate workforce and operations support for developers and owners.",
    points: ["Corporate outsourcing", "Facility staffing", "Estate workforce", "Operations support"],
  },
  {
    icon: Hammer, title: "General Contracts",
    desc: "Construction, civil works, renovation, procurement and project management from a single accountable team.",
    points: ["Construction", "Civil works", "Renovation", "Procurement", "Project management"],
  },
];

// ─── PROPERTIES ───────────────────────────────────────────────────────────────
export const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Retail"];
export const LOCATIONS = ["Maitama", "Asokoro", "Jabi", "Guzape", "Katampe", "Wuse II"];

const IMG = {
  // Hero — grand gated estate entrance, warm African sky
  hero: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80",

  // Luxury homes — warm-toned, tropical-context villas & residences
  luxHome1: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=900&q=80",
  luxHome2: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80",

  // Apartments — clean modern blocks with warm light
  apt1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
  apt2: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80",

  // Commercial — contemporary African office/commercial building
  commercial1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",

  // Interiors — warm, high-end African home interiors
  interior1: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
  interior2: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",

  // Office — modern Nigerian corporate space
  office1: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80",

  // People — Black African professionals & families
  team: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80",
  family: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",

  // Projects — gated estate & development shots
  p1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  p2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
  p3: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
  p4: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80",
};

export { IMG };

const NAMES = [
  "The Meridian Residence", "Skyline Penthouse", "Palm Court Villa", "Azure Heights Apartment",
  "Camden Business Suites", "Ivory Terrace Townhouse", "The Regency Villa", "Horizon View Apartment",
  "Cedar Grove Residence", "Solstice Office Park", "Marble Bay Retail Plaza", "The Oakwood Estate",
];
const PRICES = [185000, 420000, 950000, 265000, 1200000, 340000, 780000, 210000, 560000, 1450000, 610000, 890000];
const BEDS   = [2, 4, 5, 3, 0, 4, 5, 2, 3, 0, 0, 4];
const BATHS  = [2, 3, 5, 2, 4, 3, 5, 2, 3, 6, 3, 4];
const SIZES  = [1450, 3200, 5400, 1800, 8200, 2600, 4900, 1600, 2900, 9600, 5200, 4200];
const IMGS   = [IMG.luxHome1, IMG.luxHome2, IMG.apt1, IMG.apt2, IMG.commercial1, IMG.interior1, IMG.interior2, IMG.office1];

export const PROPERTIES = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  image: IMGS[i % IMGS.length],
  price: PRICES[i],
  location: LOCATIONS[i % LOCATIONS.length],
  type: PROPERTY_TYPES[i % PROPERTY_TYPES.length],
  beds: BEDS[i],
  baths: BATHS[i],
  size: SIZES[i],
  featured: i < 6,
}));

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const PROJECTS = [
  { id: 1, title: "Meridian Gardens", status: "Completed", image: IMG.p1, year: 2023, desc: "A 240-unit residential enclave with landscaped courtyards and resident amenities." },
  { id: 2, title: "Camden Business District", status: "Ongoing", image: IMG.p2, year: 2026, desc: "A mixed-use commercial hub delivering 12 office floors and ground-level retail." },
  { id: 3, title: "Palm Court Estates", status: "Completed", image: IMG.p3, year: 2022, desc: "Gated villa community with private gardens and a central clubhouse." },
  { id: 4, title: "Horizon Waterfront", status: "Upcoming", image: IMG.p4, year: 2027, desc: "Waterfront apartments with retail promenade, breaking ground next quarter." },
  { id: 5, title: "Ivory Terrace", status: "Completed", image: IMG.interior1, year: 2021, desc: "Boutique townhouse development in the heart of the city." },
  { id: 6, title: "Solstice Office Park", status: "Ongoing", image: IMG.office1, year: 2026, desc: "A LEED-aligned corporate campus across three interconnected towers." },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { name: "Adaeze Okafor", role: "Homeowner, Meridian Residence", quote: "HousingFirst guided us from first viewing to move-in with a level of care that made the process feel effortless.", rating: 5, img: IMG.family },
  { name: "David Bello", role: "Investor, Camden Business Suites", quote: "Their investment team laid out realistic projections and delivered above what we expected within two years.", rating: 5, img: IMG.team },
  { name: "Grace Ibe", role: "Landlord, Property Management Client", quote: "Rent collection and maintenance used to be a headache. Now it is completely off our plate.", rating: 4, img: IMG.family },
];

// ─── PARTNERS ─────────────────────────────────────────────────────────────────
export const PARTNERS = ["Northstar Capital", "Bellview Construction", "Prime Legal Partners", "Atlas Materials", "Summit Insurance", "Meridian Bank"];

// ─── LEADERSHIP ───────────────────────────────────────────────────────────────
export const LEADERSHIP = [
  { name: "Chidi Anazor", role: "Chief Executive Officer", img: IMG.team },
  { name: "Fatima Yusuf", role: "Chief Investment Officer", img: IMG.family },
  { name: "Emeka Nwosu", role: "Head of Development", img: IMG.team },
  { name: "Sarah Nkemdirim", role: "Head of Property Management", img: IMG.family },
];

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const TIMELINE = [
  { year: "2008", text: "HousingFirst founded with a single residential project in the capital." },
  { year: "2013", text: "Expanded into commercial development and property management." },
  { year: "2017", text: "Launched our investment advisory arm for local and diaspora investors." },
  { year: "2021", text: "Crossed 1,000 units delivered across residential and mixed-use projects." },
  { year: "2026", text: "Operating across six districts with 96 projects completed to date." },
];

// ─── INVESTMENT DATA ──────────────────────────────────────────────────────────
export const FAQS_INVEST = [
  { q: "What is the minimum investment amount?", a: "Entry points start from ₦25,000,000 for fractional units in select developments, with full-unit acquisitions varying by project." },
  { q: "What returns can I expect?", a: "Historical portfolio returns have ranged from 12% to 19% annually, depending on asset class and holding period. Past performance does not guarantee future results." },
  { q: "How is my investment secured?", a: "Every investment is backed by a registered title, an independent valuation, and a legal agreement reviewed by our in-house counsel." },
  { q: "Can foreign or diaspora investors participate?", a: "Yes. We support diaspora and foreign investors with remote onboarding, virtual tours, and repatriation-friendly payment structures." },
];

export const ROI_DATA = [
  { year: "Yr 1", value: 12 }, { year: "Yr 2", value: 15 }, { year: "Yr 3", value: 14 },
  { year: "Yr 4", value: 18 }, { year: "Yr 5", value: 19 },
];

export const SALES_DATA = [
  { q: "Q1", units: 62 }, { q: "Q2", units: 84 }, { q: "Q3", units: 71 }, { q: "Q4", units: 103 },
];
