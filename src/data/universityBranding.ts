import { getUniversityLogoUrl } from './universityLogos';

export interface UniversityBranding {
  name: string;
  abbreviation: string;
  primaryHsl: string; // e.g. "0 100% 25%" (for tailwind variable override)
  primaryGlowHsl: string;
  secondaryHex: string;
  coverImage: string;
  motto: string;
  /** Google S2 favicon CDN URL (256 px) for the university's official logo, or '' */
  logoUrl: string;
}

// Curated pool of high-res Unsplash college campus photos
const campusCovers = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop", // Classic Ivy brick facade
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1000&auto=format&fit=crop", // Large modern college library
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop", // Lecture hall & graduation plaza
  "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop", // Modern university campus path
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1000&auto=format&fit=crop", // Historic sandstone college courtyard
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop"  // Collaborative student study halls
];

// Specific official details for top Nigerian universities
const officialBranding: Record<string, Omit<UniversityBranding, 'name'>> = {
  "University of Lagos": {
    abbreviation: "UNILAG",
    primaryHsl: "348 100% 20%", // Maroon #660011
    primaryGlowHsl: "348 100% 32%",
    secondaryHex: "#D4AC0D", // Gold
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop",
    motto: "In Deed and in Truth"
  },
  "University of Ibadan": {
    abbreviation: "UI",
    primaryHsl: "215 100% 16%", // Deep Navy #001f4d
    primaryGlowHsl: "215 100% 28%",
    secondaryHex: "#FFD700", // Yellow Gold
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop",
    motto: "Recte Sapere Fons"
  },
  "Obafemi Awolowo University": {
    abbreviation: "OAU",
    primaryHsl: "220 90% 18%", // Royal Blue #002266
    primaryGlowHsl: "220 90% 30%",
    secondaryHex: "#F1C40F", // Bright Gold
    coverImage: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1000&auto=format&fit=crop",
    motto: "For Learning and Culture"
  },
  "Covenant University": {
    abbreviation: "Covenant",
    primaryHsl: "145 70% 20%", // Forest Green #0f5231
    primaryGlowHsl: "145 70% 32%",
    secondaryHex: "#C5A059", // Vintage Bronze Gold
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop",
    motto: "A Covenant of Excellence"
  },
  "University of Benin": {
    abbreviation: "UNIBEN",
    primaryHsl: "280 65% 22%", // Deep Purple #3d1452
    primaryGlowHsl: "280 65% 34%",
    secondaryHex: "#F5B041", // Bright Gold
    coverImage: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1000&auto=format&fit=crop",
    motto: "Knowledge for Service"
  },
  "University of Nigeria, Nsukka": {
    abbreviation: "UNN",
    primaryHsl: "135 100% 15%", // Dark Green #004d00
    primaryGlowHsl: "135 100% 25%",
    secondaryHex: "#FFD700", // Yellow
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop",
    motto: "To Restore the Dignity of Man"
  },
  "Lagos State University": {
    abbreviation: "LASU",
    primaryHsl: "205 85% 22%", // Teal Blue #083c61
    primaryGlowHsl: "205 85% 34%",
    secondaryHex: "#FFC300", // Gold
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop",
    motto: "Truth and Service"
  },
  "Federal University of Technology Akure": {
    abbreviation: "FUTA",
    primaryHsl: "210 90% 20%", // Dark Blue #002e66
    primaryGlowHsl: "210 90% 32%",
    secondaryHex: "#E67E22", // Deep Orange
    coverImage: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1000&auto=format&fit=crop",
    motto: "Technology for Self-Reliance"
  },
  "University of Ilorin": {
    abbreviation: "UNILORIN",
    primaryHsl: "212 95% 18%", // Royal Navy #002654
    primaryGlowHsl: "212 95% 30%",
    secondaryHex: "#3498DB", // Sky Blue
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop",
    motto: "Character and Learning"
  }
};

// Deterministic string hashing function to generate stable fallback parameters
function nameToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Generate fallback abbreviation from name
function makeAbbreviation(name: string): string {
  const parts = name.split(" ");
  if (parts.length <= 1) return name.substring(0, 4).toUpperCase();
  
  // Extract capitals or first letters of keywords
  return parts
    .filter(p => !["of", "and", "in", "at", "for"].includes(p.toLowerCase()))
    .map(p => p.charAt(0))
    .join("")
    .toUpperCase();
}

export function getUniversityBranding(universityName: string | undefined): UniversityBranding {
  if (!universityName) {
    return {
      name: "Default University",
      abbreviation: "CAMPUS",
      primaryHsl: "211 100% 50%", // Unikonet default blue
      primaryGlowHsl: "211 100% 65%",
      secondaryHex: "#007AFF",
      coverImage: campusCovers[0],
      motto: "Striving for academic brilliance",
      logoUrl: ""
    };
  }

  // Check if we have official branding registered
  const official = officialBranding[universityName];
  if (official) {
    return {
      name: universityName,
      logoUrl: getUniversityLogoUrl(universityName),
      ...official
    };
  }

  // Otherwise, deterministically generate a beautiful brand theme
  const hash = nameToHash(universityName);
  
  // Hue ranges from 0 to 360. Skip muddy greenish yellows by mapping
  let hue = hash % 360;
  if (hue >= 50 && hue <= 75) hue = (hue + 45) % 360; // Shift to orange or green
  
  const saturation = 65 + (hash % 15); // 65% to 80%
  const lightness = 20 + (hash % 10);  // 20% to 30% (keep it dark/readable for white text)
  
  const primaryHsl = `${hue} ${saturation}% ${lightness}%`;
  const primaryGlowHsl = `${hue} ${saturation}% ${lightness + 12}%`;
  
  // Secondary color is complementary color (180 degrees shift or gold)
  const secHue = (hue + 140) % 360;
  const secondaryHex = `hsl(${secHue}, 80%, 55%)`; // We can use direct CSS color or convert to string

  // Deterministically choose a cover image from the pool
  const coverImage = campusCovers[hash % campusCovers.length];
  const abbreviation = makeAbbreviation(universityName);
  
  const mottos = [
    "Knowledge, Character and Service",
    "Excellence, Truth and Honor",
    "Innovation and Leadership",
    "To Learn, Succeed and Build",
    "Advancing Knowledge for Society",
    "Commitment to Truth and Innovation"
  ];
  const motto = mottos[hash % mottos.length];

  return {
    name: universityName,
    abbreviation,
    primaryHsl,
    primaryGlowHsl,
    secondaryHex,
    coverImage,
    motto,
    logoUrl: getUniversityLogoUrl(universityName)
  };
}
