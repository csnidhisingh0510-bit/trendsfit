import React, { useState, useEffect } from "react";
import Logo from "./components/Logo";
import { 
  Sparkles, 
  Heart, 
  Grid, 
  LogOut, 
  X, 
  Check, 
  Calendar, 
  User as UserIcon, 
  Trash2, 
  Star, 
  ArrowRight, 
  ChevronRight,
  Search,
  Bot,
  Wand2,
  Lightbulb,
  Shirt,
  Palette,
  Compass,
  Camera
} from "lucide-react";
import { CURATED_OUTFITS, Outfit } from "./data/outfits";
import { BodyShapeGuide } from "./components/BodyShapeGuide";
import { BodyPostureScanner } from "./components/BodyPostureScanner";

// Curated aesthetic avatar photo presets
const AVATAR_PRESETS = [
  {
    name: "Classic Elegance",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350"
  },
  {
    name: "Minimalist Studio",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350"
  },
  {
    name: "Couture Vision",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=350"
  },
  {
    name: "Artistic Contrast",
    url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=350"
  }
];

// Months list for dropdown
const MONTHS = [
  { value: "01", label: "January (01)" },
  { value: "02", label: "February (02)" },
  { value: "03", label: "March (03)" },
  { value: "04", label: "April (04)" },
  { value: "05", label: "May (05)" },
  { value: "06", label: "June (06)" },
  { value: "07", label: "July (07)" },
  { value: "08", label: "August (08)" },
  { value: "09", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

// Generates years from 2000 down to 1900 (covering all 1900s to 2000)
const YEARS_1900_TO_2000 = Array.from({ length: 101 }, (_, i) => (2000 - i).toString());

// Aesthetic Background Atmospheres
export interface AestheticAtmosphere {
  id: "champagne" | "rosequartz" | "sage" | "dusk";
  name: string;
  badge: string;
  canvasGradient: string;
  orbPrimary: string;
  orbSecondary: string;
  orbTertiary: string;
  accentBorder: string;
}

const AESTHETIC_ATMOSPHERES: AestheticAtmosphere[] = [
  {
    id: "champagne",
    name: "Champagne Silk",
    badge: "✨ Champagne Silk",
    canvasGradient: "from-[#FAF6F0] via-[#F4ECE1] to-[#FAF7F2]",
    orbPrimary: "bg-[#E6C994]/35",
    orbSecondary: "bg-[#E8C5C8]/30",
    orbTertiary: "bg-[#D8E6DE]/30",
    accentBorder: "border-[#AF905F]/30"
  },
  {
    id: "rosequartz",
    name: "Rose Quartz",
    badge: "🌸 Rose Quartz",
    canvasGradient: "from-[#FAF3F5] via-[#F7E8EC] to-[#FCF8F9]",
    orbPrimary: "bg-[#F3C4D0]/40",
    orbSecondary: "bg-[#E4C994]/28",
    orbTertiary: "bg-[#E4D5EC]/35",
    accentBorder: "border-[#D88A9E]/30"
  },
  {
    id: "sage",
    name: "Sage Botanica",
    badge: "🌿 Sage Botanica",
    canvasGradient: "from-[#F4F8F5] via-[#E8F1EB] to-[#F7FAF8]",
    orbPrimary: "bg-[#C2DFC9]/40",
    orbSecondary: "bg-[#E8DFC8]/35",
    orbTertiary: "bg-[#BFE2DD]/30",
    accentBorder: "border-[#7EA889]/30"
  },
  {
    id: "dusk",
    name: "Dusk Lavender",
    badge: "🔮 Dusk Iris",
    canvasGradient: "from-[#F6F4FA] via-[#ECE7F5] to-[#FAF8FD]",
    orbPrimary: "bg-[#D5C8EE]/40",
    orbSecondary: "bg-[#EBCFC2]/35",
    orbTertiary: "bg-[#C4D9F0]/30",
    accentBorder: "border-[#9E86C8]/30"
  }
];

// Days list (01 to 31)
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1 < 10 ? `0${i + 1}` : `${i + 1}`));

// Helper to determine Zodiac Sign & fashion advice
function getZodiacSign(dateString: string): { sign: string; element: string; fashionAdvice: string } {
  if (!dateString) return { sign: "Libra", element: "Air", fashionAdvice: "Emphasize fluid cuts and lightweight textures." };
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) 
    return { sign: "Aries", element: "Fire", fashionAdvice: "Opt for bold, structured silhouettes and fiery statement coats." };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) 
    return { sign: "Taurus", element: "Earth", fashionAdvice: "Embrace premium organic textiles, deep forest shades, and classic tailoring." };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) 
    return { sign: "Gemini", element: "Air", fashionAdvice: "Dynamic, reversible layering and eclectic accessory pairings suit your dual vibe." };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) 
    return { sign: "Cancer", element: "Water", fashionAdvice: "Soft, flowing satin gowns, cream hues, and nostalgic accessories capture your soul." };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) 
    return { sign: "Leo", element: "Fire", fashionAdvice: "Unleash dramatic velvet blazers, bold gold embellishments, and attention-grabbing necklines." };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) 
    return { sign: "Virgo", element: "Earth", fashionAdvice: "Sharp minimalist tailoring, monochromatic cream & charcoal, and perfect geometric lines." };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) 
    return { sign: "Libra", element: "Air", fashionAdvice: "Aesthetically balanced silhouettes, pastel silks, and perfectly coordinated luxury coordinates." };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) 
    return { sign: "Scorpio", element: "Water", fashionAdvice: "All-black leather, deep burgundy velvet, mysterious asymmetrical cuts, and sheer paneling." };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) 
    return { sign: "Sagittarius", element: "Fire", fashionAdvice: "Sporty yet sophisticated trench coats, travel-friendly linen, and bold adventurer aesthetics." };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) 
    return { sign: "Capricorn", element: "Earth", fashionAdvice: "Timeless heritage checks, structured corporate blazers, and high-end vintage leather footwear." };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) 
    return { sign: "Aquarius", element: "Air", fashionAdvice: "Avant-garde futuristic technical shells, vibrant colors, and unique materials like metallic Lurex." };
  return { sign: "Pisces", element: "Water", fashionAdvice: "Ethereal floral prints, dreamy draped georgette, and shimmering seafoam & lilac tones." };
}

export default function App() {
  // Navigation & Page State
  // "splash" -> "birthday" -> "dashboard"
  const [appState, setAppState] = useState<"splash" | "birthday" | "dashboard">(() => {
    const cachedUser = localStorage.getItem("trendfits_user_profile");
    return cachedUser ? "dashboard" : "splash";
  });

  // Active Tab within Dashboard
  const [activeTab, setActiveTab] = useState<"home" | "categories" | "wishlist" | "profile">("home");

  // Onboarding & Profile State
  const [userName, setUserName] = useState(() => {
    const cached = localStorage.getItem("trendfits_user_profile");
    if (cached) {
      try {
        return JSON.parse(cached).name || "Nidhi";
      } catch (e) {}
    }
    return "Nidhi";
  });

  const [birthday, setBirthday] = useState(() => {
    const cached = localStorage.getItem("trendfits_user_profile");
    if (cached) {
      try {
        return JSON.parse(cached).birthday || "";
      } catch (e) {}
    }
    return "";
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    const cached = localStorage.getItem("trendfits_user_profile");
    if (cached) {
      try {
        return JSON.parse(cached).photoUrl || AVATAR_PRESETS[0].url;
      } catch (e) {}
    }
    return AVATAR_PRESETS[0].url;
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [birthdayError, setBirthdayError] = useState("");

  // Wishlist State (stored as array of Outfit IDs)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const cached = localStorage.getItem("trendfits_wishlist");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return ["men-1", "women-2"]; // Elegant pre-population for great UX
  });

  // Selected Category filter (expanded categories)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "men" | "women" | "shoes" | "accessories" | "sports" | "party wear">("all");

  // Selected Occasion filter
  const [selectedOccasion, setSelectedOccasion] = useState<"all" | "party" | "office" | "college" | "wedding" | "vacation" | "date night">("all");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Base Color Suggestion State
  const [selectedBaseColor, setSelectedBaseColor] = useState<"Cream" | "Charcoal" | "Navy" | "Bordeaux" | "Sage" | "Gold">("Cream");
  const [showColorCombo, setShowColorCombo] = useState(false);
  const [showMixMatch, setShowMixMatch] = useState(false);
  const [spotlightFilter, setSpotlightFilter] = useState<"all" | "party" | "office" | "college" | "vacation" | "date night">("all");

  // Seasonal Recommendations State
  const [selectedSeason, setSelectedSeason] = useState<"summer" | "autumn" | "winter" | "spring">("summer");
  const [showSeasonalModal, setShowSeasonalModal] = useState(false);

  // Body Shape Guide State
  const [selectedBodyShape, setSelectedBodyShape] = useState<string>("all");
  const [showBodyShapeModal, setShowBodyShapeModal] = useState(false);
  const [showPostureScannerModal, setShowPostureScannerModal] = useState(false);

  // Aesthetic Background Atmosphere Theme
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<"champagne" | "rosequartz" | "sage" | "dusk">("champagne");
  const currentAtmosphere = AESTHETIC_ATMOSPHERES.find(a => a.id === selectedAtmosphere) || AESTHETIC_ATMOSPHERES[0];

  // Mix & Match state
  const [mixUpperId, setMixUpperId] = useState<string>("men-1");
  const [mixLowerId, setMixLowerId] = useState<string>("shoes-1");

  // AI Stylist Agent State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const [aiStylistResult, setAiStylistResult] = useState<{
    title: string;
    analysis: string;
    upperGarment: Outfit;
    lowerGarment: Outfit;
    colorHarmonyTip: string;
    matchScore: number;
  } | null>(null);

  // AI Stylist Query Handler
  const handleAskAiStylist = (query: string) => {
    if (!query.trim()) return;
    setAiIsThinking(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let upper = CURATED_OUTFITS[0];
      let lower = CURATED_OUTFITS[3];
      let title = "Custom Couture Blend";
      let analysis = "A balanced mix of textures and silhouettes tailored to your specific styling request.";
      let colorTip = "Combine neutral undertones with one gold or metallic accent piece for high visual appeal.";
      let score = 96;

      if (q.includes("party") || q.includes("night") || q.includes("gown") || q.includes("club") || q.includes("wedding") || q.includes("glam")) {
        upper = CURATED_OUTFITS.find(o => o.id === "women-2") || CURATED_OUTFITS[1];
        lower = CURATED_OUTFITS.find(o => o.id === "shoes-2") || CURATED_OUTFITS[3];
        title = "Enchanted Evening & Party Glamour";
        analysis = "Pairing a rich velvet gown with high-shine stiletto heels creates an alluring, dramatic evening silhouette.";
        colorTip = "Deep jewel tones (Bordeaux or Midnight Obsidian) require minimal jewelry—let the fabric sheen shine.";
        score = 98;
      } else if (q.includes("office") || q.includes("work") || q.includes("blazer") || q.includes("executive") || q.includes("suit") || q.includes("formal")) {
        upper = CURATED_OUTFITS.find(o => o.id === "men-1") || CURATED_OUTFITS[0];
        lower = CURATED_OUTFITS.find(o => o.id === "shoes-1") || CURATED_OUTFITS[2];
        title = "Power Executive & Office Symmetry";
        analysis = "Structured tailoring coupled with handcrafted leather oxfords commands confidence and professional poise.";
        colorTip = "Ensure shoe leather shade strictly matches your belt and watch strap for pristine symmetry.";
        score = 99;
      } else if (q.includes("summer") || q.includes("beach") || q.includes("breeze") || q.includes("linen") || q.includes("vacation")) {
        upper = CURATED_OUTFITS.find(o => o.id === "women-1") || CURATED_OUTFITS[0];
        lower = CURATED_OUTFITS.find(o => o.id === "acc-1") || CURATED_OUTFITS[4];
        title = "Breezy Riviera Summer Ensemble";
        analysis = "Lightweight fluid draping meets functional leather goods, perfect for warm weather retreats and strolls.";
        colorTip = "Wear light alabaster and cream shades to reflect solar rays while exuding effortless luxury.";
        score = 95;
      } else if (q.includes("casual") || q.includes("college") || q.includes("street") || q.includes("denim") || q.includes("sport")) {
        upper = CURATED_OUTFITS.find(o => o.id === "men-2") || CURATED_OUTFITS[5];
        lower = CURATED_OUTFITS.find(o => o.id === "shoes-3") || CURATED_OUTFITS[2];
        title = "Relaxed Luxe & Contemporary Streetwear";
        analysis = "Soft cashmere knits elevated with clean leather low-tops deliver effortless urban sophistication.";
        colorTip = "Keep the sneakers box-fresh white to contrast sharply with warm earth-toned knits.";
        score = 97;
      } else {
        const foundUpper = CURATED_OUTFITS.find(o => q.split(" ").some(w => w.length > 3 && (o.name.toLowerCase().includes(w) || o.description.toLowerCase().includes(w))));
        if (foundUpper) upper = foundUpper;
        title = `Tailored AI Mix: "${query.substring(0, 32)}..."`;
      }

      setAiStylistResult({
        title,
        analysis,
        upperGarment: upper,
        lowerGarment: lower,
        colorHarmonyTip: colorTip,
        matchScore: score
      });
      setAiIsThinking(false);
    }, 550);
  };

  // Selected product details modal
  const [selectedProduct, setSelectedProduct] = useState<Outfit | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Splash auto-transition timer
  useEffect(() => {
    if (appState === "splash") {
      const timer = setTimeout(() => {
        setAppState("birthday");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Derived birthdate parts for Year (1900-2000), Month, and Day selectors
  const birthParts = birthday ? birthday.split("-") : ["2000", "01", "01"];
  const birthYear = birthParts[0] || "2000";
  const birthMonth = birthParts[1] || "01";
  const birthDay = birthParts[2] || "01";

  const updateBirthdayParts = (year: string, month: string, day: string) => {
    setBirthday(`${year}-${month}-${day}`);
  };

  // Sync wishlist to local storage
  useEffect(() => {
    localStorage.setItem("trendfits_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle Birthday profile submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBirthday = birthday || `${birthYear}-${birthMonth}-${birthDay}`;
    if (!finalBirthday) {
      setBirthdayError("Please select your date of birth.");
      return;
    }

    const finalName = userName.trim() || "Nidhi";
    const finalPhoto = customPhotoUrl.trim() || profilePhoto || AVATAR_PRESETS[0].url;

    const profile = {
      name: finalName,
      birthday: finalBirthday,
      photoUrl: finalPhoto
    };

    localStorage.setItem("trendfits_user_profile", JSON.stringify(profile));
    setBirthday(finalBirthday);
    setBirthdayError("");
    setAppState("dashboard");
    setActiveTab("home");
  };

  // Toggle wishlist item
  const toggleWishlist = (id: string) => {
    let msg = "";
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      msg = "Removed from your custom Wishlist.";
    } else {
      setWishlist((prev) => [...prev, id]);
      msg = "Added to your curated Wishlist.";
    }
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Logout / Reset
  const handleLogout = () => {
    localStorage.removeItem("trendfits_user_profile");
    setUserName("");
    setBirthday("");
    setProfilePhoto(AVATAR_PRESETS[0].url);
    setCustomPhotoUrl("");
    setAppState("splash");
  };

  // Compute astrology details
  const zodiac = getZodiacSign(birthday);

  // Splash Screen View
  if (appState === "splash") {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-[#FAF6F0] via-[#F5ECE1] to-[#FAF8F5] flex flex-col items-center justify-between py-16 px-6 relative overflow-hidden text-[#1A1A1A]" 
        id="splash-screen"
      >
        {/* Aesthetic background atmospheric color orbs */}
        <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-[#E6C994]/35 rounded-full blur-[90px] pointer-events-none animate-float-slow"></div>
        <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] bg-[#E8C5C8]/30 rounded-full blur-[90px] pointer-events-none animate-float-reverse"></div>
        <div className="absolute -bottom-20 left-1/4 w-[480px] h-[480px] bg-[#D5C8EE]/25 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] bg-[#C2DFC9]/25 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-fade-in relative z-10">
          {/* Animated Large Logo with custom tagline */}
          <Logo size="xl" tagline="Find your Perfect Style" />

          {/* Luxury loading transition */}
          <div className="flex items-center gap-1.5 pt-4">
            <span className="w-1.5 h-1.5 bg-[#AF905F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-[#AF905F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-[#AF905F] rounded-full animate-bounce"></span>
          </div>
        </div>

        {/* Action Skip Button at bottom */}
        <button
          onClick={() => setAppState("birthday")}
          className="group relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1A1A1A] hover:text-[#AF905F] transition z-10 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-[#1A1A1A]/10 hover:border-[#AF905F] shadow-xs cursor-pointer"
          id="splash-skip-btn"
        >
          <span>Enter Atelier</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#AF905F]" />
        </button>
      </div>
    );
  }

  // Birthday Page View
  if (appState === "birthday") {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-[#FAF6F0] via-[#F4EDE4] to-[#FAF8F6] flex flex-col justify-between py-12 px-6 relative overflow-hidden text-[#1A1A1A]" 
        id="birthday-screen"
      >
        {/* Aesthetic Atmospheric Color Orbs */}
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-[#E6C994]/30 rounded-full blur-[90px] pointer-events-none animate-float-slow"></div>
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-[#E8C5C8]/30 rounded-full blur-[90px] pointer-events-none animate-float-reverse"></div>
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-[#C2DFC9]/25 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>

        <header className="max-w-md mx-auto w-full flex justify-center pb-4 relative z-10">
          <Logo size="sm" showTagline={false} />
        </header>

        <main className="flex-1 flex items-center justify-center max-w-md mx-auto w-full py-12 relative z-10">
          <div className="bg-white/90 backdrop-blur-md border border-[#1A1A1A]/10 p-8 sm:p-10 shadow-sm w-full relative">
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 text-left">
              <div className="text-center space-y-2 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AF905F]">Personalized Atelier</span>
                <h2 className="font-serif text-2xl font-light text-[#1A1A1A] italic">
                  Profile Onboarding
                </h2>
              </div>

              {birthdayError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-mono uppercase tracking-wider text-center">
                  {birthdayError}
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60 font-mono text-center">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/15 px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#AF905F] transition font-sans text-center"
                />
              </div>

              {/* Birthday Picker with Year Selector (1900s to 2000) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 font-mono">
                    Birthdate
                  </label>
                  <span className="text-[9px] font-mono text-[#AF905F] font-bold uppercase tracking-wider">Year: 1900 – 2000</span>
                </div>

                {/* 3 Select Dropdowns: Month, Day, Year */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Month Dropdown */}
                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 mb-1">Month</label>
                    <select
                      value={birthMonth}
                      onChange={(e) => updateBirthdayParts(birthYear, e.target.value, birthDay)}
                      className="w-full bg-white border border-[#1A1A1A]/20 px-2 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#AF905F] transition font-mono cursor-pointer"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Day Dropdown */}
                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 mb-1">Day</label>
                    <select
                      value={birthDay}
                      onChange={(e) => updateBirthdayParts(birthYear, birthMonth, e.target.value)}
                      className="w-full bg-white border border-[#1A1A1A]/20 px-2 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#AF905F] transition font-mono cursor-pointer"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Dropdown (1900s to 2000) */}
                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 mb-1">Year</label>
                    <select
                      value={birthYear}
                      onChange={(e) => updateBirthdayParts(e.target.value, birthMonth, birthDay)}
                      className="w-full bg-white border border-[#1A1A1A]/25 px-2 py-2.5 text-xs font-bold text-[#AF905F] focus:outline-none focus:border-[#AF905F] transition font-mono cursor-pointer shadow-2xs"
                    >
                      {YEARS_1900_TO_2000.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calendar Input Option */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1">
                    <span>Or pick date calendar:</span>
                    <span className="text-[#AF905F] font-bold">{birthday || `${birthYear}-${birthMonth}-${birthDay}`}</span>
                  </div>
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2000-12-31"
                    value={birthday || `${birthYear}-${birthMonth}-${birthDay}`}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-gray-50/60 border border-[#1A1A1A]/15 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#AF905F] transition font-mono text-center rounded-xs"
                  />
                </div>
              </div>

              {/* Submit Onboarding */}
              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#AF905F] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] transition duration-300 flex items-center justify-center gap-2"
              >
                <span>Find My Perfect Style</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </main>

        <footer className="text-center text-[10px] text-gray-400 font-mono uppercase tracking-widest">
          TrendFits Luxury Atelier &bull; Astrological Styling
        </footer>
      </div>
    );
  }

  // Active user details
  const activeUserProfile = {
    name: userName || "Style Enthusiast",
    photoUrl: customPhotoUrl.trim() || profilePhoto,
    birthday: birthday || "2000-01-01"
  };

  // Wishlist outfits resolver
  const wishlistOutfits = CURATED_OUTFITS.filter(outfit => wishlist.includes(outfit.id));

  // Dashboard / Home View Router
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentAtmosphere.canvasGradient} relative flex flex-col justify-between text-[#1A1A1A] font-sans transition-colors duration-700 overflow-x-hidden`} id="app-root">
      
      {/* Aesthetic Atmospheric Ambient Glowing Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-28 -left-28 w-[540px] h-[540px] ${currentAtmosphere.orbPrimary} rounded-full blur-[110px] animate-float-slow transition-all duration-700`}></div>
        <div className={`absolute top-[28%] -right-28 w-[500px] h-[500px] ${currentAtmosphere.orbSecondary} rounded-full blur-[100px] animate-float-reverse transition-all duration-700`}></div>
        <div className={`absolute -bottom-24 left-[18%] w-[550px] h-[550px] ${currentAtmosphere.orbTertiary} rounded-full blur-[115px] animate-pulse-glow transition-all duration-700`}></div>
        <div className="absolute top-[65%] -left-20 w-[400px] h-[400px] bg-[#EAE2D5]/35 rounded-full blur-[95px] animate-float-slow"></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-6 py-3 shadow-lg flex items-center gap-2 animate-slide-in text-xs font-mono uppercase tracking-wider">
          <Check className="h-4 w-4 text-[#AF905F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#1A1A1A]/10 sticky top-0 z-40 shadow-xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Main Navigation Tabs with Brand Logo */}
          <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 text-[10px] font-bold uppercase tracking-[0.18em]">
            {/* BRAND LOGO SYMBOL */}
            <div 
              onClick={() => setActiveTab("home")}
              className="cursor-pointer hover:opacity-85 transition flex items-center shrink-0"
              title="TrendFits Home"
            >
              <div className="h-7 w-7 bg-[#1A1A1A] text-[#AF905F] rounded-full flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                TF
              </div>
            </div>

            <button
              onClick={() => setActiveTab("home")}
              className={`pb-1 transition-all border-b-2 cursor-pointer ${
                activeTab === "home"
                  ? "border-[#1A1A1A] text-[#1A1A1A]"
                  : "border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`pb-1 transition-all border-b-2 cursor-pointer ${
                activeTab === "categories"
                  ? "border-[#1A1A1A] text-[#1A1A1A]"
                  : "border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
              }`}
            >
              Categories
            </button>
          </nav>

          {/* Right Section: Aesthetic Atmosphere Selector, Posture AI, Seasonal Recs, Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end md:flex-initial">

            {/* Aesthetic Background Color Palette Selector */}
            <div className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-xs p-1 rounded-full border border-[#1A1A1A]/10 shadow-2xs">
              <Palette className="h-3 w-3 text-[#1A1A1A]/50 ml-1.5 mr-0.5" />
              {AESTHETIC_ATMOSPHERES.map((atm) => (
                <button
                  key={atm.id}
                  onClick={() => setSelectedAtmosphere(atm.id)}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded-full transition-all cursor-pointer ${
                    selectedAtmosphere === atm.id
                      ? "bg-[#1A1A1A] text-[#FAF6F0] font-bold shadow-2xs"
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5"
                  }`}
                  title={`Switch to ${atm.name} aesthetic background`}
                >
                  {atm.badge.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* AI BODY POSTURE SCANNER BUTTON */}
            <button
              onClick={() => setShowPostureScannerModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#AF905F] text-white hover:text-[#1A1A1A] rounded-full transition group cursor-pointer shadow-2xs shrink-0"
              title="AI Body Posture & Morphology Scanner"
              id="posture-scanner-nav-btn"
            >
              <Camera className="h-3.5 w-3.5 text-[#AF905F] group-hover:text-[#1A1A1A]" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider hidden sm:inline">
                Posture AI
              </span>
            </button>

            {/* SEASONAL RECOMMENDATIONS LOGO / BUTTON */}
            <button
              onClick={() => setShowSeasonalModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#FAF6F0] hover:bg-[#AF905F]/15 border border-[#AF905F]/30 text-[#1A1A1A] rounded-full transition group cursor-pointer shadow-2xs shrink-0"
              title="Seasonal Recommendations"
              id="seasonal-recs-nav-btn"
            >
              <div className="h-5 w-5 bg-[#AF905F] text-white rounded-full flex items-center justify-center text-[10px] shadow-2xs font-serif font-bold group-hover:rotate-12 transition-transform">
                🍂
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#AF905F] hidden lg:inline">
                Seasonal Recs
              </span>
            </button>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-[140px] sm:max-w-[200px] md:max-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Search outfits..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "categories" && activeTab !== "home") {
                    setActiveTab("categories");
                  }
                }}
                className="w-full bg-white/90 backdrop-blur-xs border border-[#1A1A1A]/10 pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/35 focus:outline-none focus:border-[#AF905F] transition font-sans rounded-full"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

          </div>

        </div>

      </header>

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-12 py-10 relative z-10">
        
        {/* VIEW: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fade-in" id="tab-home">
            
            {/* Elegant Editorial Banner & AI Body Posture Scanner Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 relative bg-white border border-[#1A1A1A]/10 p-8 sm:p-10 overflow-hidden flex flex-col justify-between text-left">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#AF905F]/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 text-[#AF905F]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Curated Editorial</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight leading-tight text-[#1A1A1A] italic">
                    Find your Perfect Style
                  </h2>
                  <p className="text-xs text-gray-500 font-serif italic max-w-md">
                    Explore haute couture recommendations, bespoke mix & match styling, and precision garment pairings for every occasion.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveTab("categories")}
                      className="bg-[#1A1A1A] hover:bg-[#AF905F] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition duration-300 cursor-pointer"
                    >
                      Explore Curated Collections
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Body Posture Scanner Feature Card */}
              <div className="lg:col-span-5 bg-[#1A1A1A] text-white border border-[#AF905F]/30 p-8 sm:p-10 flex flex-col justify-between text-left relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#AF905F]/15 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#AF905F]">
                      <Camera className="h-4 w-4" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                        Gemini Vision Atelier
                      </span>
                    </div>
                    <span className="bg-[#AF905F]/20 text-[#AF905F] text-[8px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#AF905F]/40">
                      NEW AI FEATURE
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-light italic text-white leading-tight">
                    Body Posture & Shape AI Scan
                  </h3>

                  <p className="text-xs text-white/70 font-serif italic leading-relaxed">
                    Upload a photo of your body posture. Our AI measures your spinal balance, shoulder-to-hip ratio, and curates clothes tailored to your silhouette.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setShowPostureScannerModal(true)}
                    className="w-full bg-[#AF905F] hover:bg-white text-[#1A1A1A] py-3 px-5 text-[10px] font-mono font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    id="home-posture-scan-cta"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload Posture Photo & Get Outfits</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SPOTLIGHT LOOKBOOK & FASHION RADAR SECTION */}
            <div className="space-y-6 text-left pt-4" id="whats-trending-section">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#AF905F] block mb-1">Live Style Meter</span>
                  <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Spotlight Lookbook & Style Radar</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#AF905F]/10 text-[#AF905F] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] border border-[#AF905F]/20 flex items-center gap-1.5 rounded-full">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Atelier Spotlight • 99% Precision
                  </span>
                </div>
              </div>

              {/* OCCASION / STYLE RADAR FILTER PILLS */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold mr-1">Radar Filter:</span>
                {[
                  { code: "all", label: "✨ All Featured" },
                  { code: "party", label: "🎉 Party & Gala" },
                  { code: "office", label: "💼 Executive Office" },
                  { code: "college", label: "🎓 College Vibe" },
                  { code: "vacation", label: "✈️ Riviera Vacation" },
                  { code: "date night", label: "🍷 Date Night Glam" }
                ].map((pill) => {
                  const isActive = spotlightFilter === pill.code;
                  return (
                    <button
                      key={`spotlight-${pill.code}`}
                      type="button"
                      onClick={() => setSpotlightFilter(pill.code as any)}
                      className={`px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer border ${
                        isActive
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-2xs"
                          : "bg-white text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:border-[#AF905F] hover:text-[#1A1A1A]"
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* SPOTLIGHT OUTFITS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {CURATED_OUTFITS.filter(o => {
                  if (!o.trending) return false;
                  if (spotlightFilter === "all") return true;
                  return o.occasions.includes(spotlightFilter as any);
                }).map((outfit, index) => {
                  const isWishlisted = wishlist.includes(outfit.id);
                  return (
                    <div
                      key={`spotlight-${outfit.id}`}
                      className="bg-white border border-[#1A1A1A]/10 p-3 sm:p-4 flex flex-col justify-between cursor-pointer hover:border-[#AF905F]/60 hover:shadow-lg transition-all duration-300 relative group"
                      onClick={() => {
                        setSelectedProduct(outfit);
                        setSelectedSize(outfit.sizes[0]);
                        setSelectedColor(outfit.colors[0].name);
                      }}
                    >
                      {/* Top Badges & Wishlist Button */}
                      <div className="absolute top-5 left-5 z-10 flex items-center gap-1">
                        <span className="bg-[#1A1A1A] text-[#AF905F] font-mono font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 shadow-xs rounded-xs border border-[#AF905F]/30">
                          #{index + 1} Spotlight
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWishlist(prev => isWishlisted ? prev.filter(id => id !== outfit.id) : [...prev, outfit.id]);
                        }}
                        className={`absolute top-5 right-5 z-20 p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
                          isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-white text-white" : ""}`} />
                      </button>

                      {/* Image Container */}
                      <div className="aspect-[3/4] overflow-hidden relative border border-[#1A1A1A]/5 bg-gray-50">
                        <img 
                          src={outfit.imageUrl} 
                          alt={outfit.name} 
                          className="object-cover h-full w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 font-serif italic"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-[#AF905F] px-2.5 py-1 rounded-full shadow-xs w-full text-center">
                            Inspect Atelier Piece →
                          </span>
                        </div>
                      </div>

                      {/* Details Footer */}
                      <div className="pt-3 space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">{outfit.brand}</span>
                          <span className="text-[8px] font-mono text-[#AF905F] uppercase font-bold tracking-wider">{outfit.category}</span>
                        </div>
                        <h4 className="text-xs font-serif font-bold italic text-[#1A1A1A] truncate group-hover:text-[#AF905F] transition-colors">{outfit.name}</h4>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-[#1A1A1A] text-[9px]">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-bold font-mono">{outfit.rating}</span>
                          </div>
                          <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">
                            {outfit.occasions[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DEDICATED FASHION TIPS DECK WITH LOGO / SMALL DESIGN AT RIGHT UPPER CORNER */}
            <div className="bg-[#FAF6F0] border border-[#1A1A1A]/10 p-8 sm:p-10 space-y-6 text-left relative overflow-hidden" id="fashion-tips-registry">
              
              {/* Right Upper Corner Fashion Tips Logo Badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 bg-[#AF905F]/15 border border-[#AF905F]/30 px-3 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#AF905F] animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#AF905F]">
                  ✨ Fashion Tips Atelier
                </span>
              </div>

              <div className="text-left space-y-1.5 max-w-md">
                <span className="text-[9px] font-mono text-[#AF905F] uppercase tracking-[0.25em] font-bold block">La Mode Commandements</span>
                <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Fashion Tips</h3>
                <div className="h-0.5 w-12 bg-[#AF905F]/40 mt-2"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#AF905F]/40 transition">
                  <div className="absolute top-0 right-0 p-2 text-3xl font-mono text-gray-100 font-bold select-none leading-none">01</div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#AF905F] font-mono">Summer Rule</span>
                    <p className="font-serif italic text-gray-800 text-xs leading-relaxed font-bold">
                      "Wear light colors in summer"
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-serif italic pt-2 border-t border-gray-100">
                    Lighter hues reflect heat waves and maintain an airy, breathable luxury during warm seasons.
                  </p>
                </div>

                <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#AF905F]/40 transition">
                  <div className="absolute top-0 right-0 p-2 text-3xl font-mono text-gray-100 font-bold select-none leading-none">02</div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#AF905F] font-mono font-bold">Symmetry Rule</span>
                    <p className="font-serif italic text-gray-800 text-xs leading-relaxed font-bold">
                      "Match shoes with ur belt"
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-serif italic pt-2 border-t border-gray-100">
                    Harmonizing leather shades anchors your ensemble, establishing immediate high-fashion symmetry.
                  </p>
                </div>

                <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#AF905F]/40 transition">
                  <div className="absolute top-0 right-0 p-2 text-3xl font-mono text-gray-100 font-bold select-none leading-none">03</div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#AF905F] font-mono">Smart Layering</span>
                    <p className="font-serif italic text-gray-800 text-xs leading-relaxed font-bold">
                      "Layer jackets for a smart casual look"
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-serif italic pt-2 border-t border-gray-100">
                    Adds rich structural depth and tailored contours without compromising executive elegance.
                  </p>
                </div>
              </div>
            </div>



          </div>
        )}

        {/* VIEW: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-12 animate-fade-in" id="tab-categories">
            
            {/* Category selection banner */}
            <div className="text-left space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#AF905F] block mb-1">Catalog Registry & Style Intelligence</span>
              <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Explore Categories & AI Styling</h3>
            </div>

            {/* CATEGORIES HORIZONTAL SCROLL BAR */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/60">categories</span>
              <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                <div className="flex gap-3 min-w-max">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition duration-300 border ${
                      selectedCategory === "all" 
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                        : "bg-white border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                    }`}
                  >
                    ✨ All Categories
                  </button>
                  {([
                    { code: "men", label: "🤵 Men" },
                    { code: "women", label: "👗 Women" },
                    { code: "shoes", label: "👞 Shoes" },
                    { code: "accessories", label: "👜 Accessories" },
                    { code: "sports", label: "👟 Sports" },
                    { code: "party wear", label: "✨ Party Wear" }
                  ] as const).map((cat) => {
                    const isActive = selectedCategory === cat.code;
                    return (
                      <button
                        key={cat.code}
                        onClick={() => setSelectedCategory(cat.code)}
                        className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition duration-300 border ${
                          isActive 
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                            : "bg-white border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ATELIER TOGGLE BUTTONS BELOW CATEGORIES OPTION */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#1A1A1A]/5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowColorCombo(!showColorCombo)}
                    className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition duration-300 border flex items-center gap-2 rounded-full cursor-pointer shadow-2xs ${
                      showColorCombo
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-[#FAF6F0] text-[#1A1A1A] border-[#AF905F]/40 hover:bg-[#AF905F]/15"
                    }`}
                    id="color-combinations-toggle-btn"
                  >
                    <Palette className="h-3.5 w-3.5 text-[#AF905F]" />
                    <span>Color Combinations</span>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${showColorCombo ? "bg-[#AF905F] text-white" : "bg-[#AF905F]/20 text-[#AF905F]"}`}>
                      {showColorCombo ? "Hide Guide" : "View Color Tips"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMixMatch(!showMixMatch)}
                    className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition duration-300 border flex items-center gap-2 rounded-full cursor-pointer shadow-2xs ${
                      showMixMatch
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-[#FAF6F0] text-[#1A1A1A] border-[#AF905F]/40 hover:bg-[#AF905F]/15"
                    }`}
                    id="mix-match-toggle-btn"
                  >
                    <Bot className="h-3.5 w-3.5 text-[#AF905F]" />
                    <span>Mix & Match Studio</span>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${showMixMatch ? "bg-[#AF905F] text-white" : "bg-[#AF905F]/20 text-[#AF905F]"}`}>
                      {showMixMatch ? "Hide Agent" : "Try AI Stylist"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLOR COMBINATION SUGGESTIONS DRAWER */}
            {showColorCombo && (
              <div className="text-left border-t border-[#1A1A1A]/10 pt-6 animate-fade-in" id="color-and-seasonal-categories">
                
                {/* Color Combination Suggestions */}
                <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#AF905F] block mb-1">Color Theory Atelier</span>
                        <h4 className="font-serif text-2xl font-light text-[#1A1A1A] italic">Chic Color Combinations</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowColorCombo(false)}
                        className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-[#1A1A1A] underline cursor-pointer"
                      >
                        Close Palette
                      </button>
                    </div>


                    {/* Swatches buttons */}
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {[
                        { name: "Cream", hex: "#E5DDC8", label: "Cream" },
                        { name: "Charcoal", hex: "#1A1A1A", label: "Charcoal" },
                        { name: "Navy", hex: "#1D283F", label: "Midnight Navy" },
                        { name: "Bordeaux", hex: "#4E1222", label: "Burgundy" },
                        { name: "Sage", hex: "#8A9A86", label: "Sage Green" },
                        { name: "Gold", hex: "#AF905F", label: "Mustard Gold" }
                      ].map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedBaseColor(color.name as any)}
                          style={{ backgroundColor: color.hex }}
                          className={`h-8 w-8 rounded-full border transition-transform relative ${
                            selectedBaseColor === color.name 
                              ? "ring-2 ring-[#AF905F] scale-110 z-10 border-white shadow-xs" 
                              : "border-black/10 hover:scale-105"
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>

                    {/* Dynamic suggestion card */}
                    <div className="p-4 bg-[#FAF6F0] border border-[#1A1A1A]/10 space-y-3 mt-4">
                      {selectedBaseColor === "Cream" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Cream pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#E5DDC8] border border-black/10" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#556B2F] border border-black/10" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#C5A880] border border-black/10" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Olive Green & Warm Tan</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            Warm, earthy organic luxury. Evokes a relaxed summer countryside feel, bringing an effortless sophistication to daily linen and knit pieces.
                          </p>
                        </>
                      )}
                      {selectedBaseColor === "Charcoal" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Charcoal pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#1A1A1A]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#DC2626]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#FFFFFF] border border-black/10" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Crimson Red & Chalk White</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            High-contrast modernist architectural palette. Highly bold, architectural, and confident. A signature choice for sophisticated tailoring.
                          </p>
                        </>
                      )}
                      {selectedBaseColor === "Navy" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Navy pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#1D283F]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#D97706]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#E5E7EB] border border-black/10" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Burnt Orange & Soft Taupe</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            Sophisticated contrasting complementary spectrum. Elevates standard navy tailoring with a vibrant, warming solar pop. Timeless smart casual elegance.
                          </p>
                        </>
                      )}
                      {selectedBaseColor === "Bordeaux" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Bordeaux pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#4E1222]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#F3F4F6] border border-black/10" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#111111]" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Champagne & Deep Onyx</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            Seductive evening twilight glamour. Rich wine shades paired with champagne silk and dark leather evoke royal European vintage atmospheres.
                          </p>
                        </>
                      )}
                      {selectedBaseColor === "Sage" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Sage pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#8A9A86]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#E5DDC8] border border-black/10" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#B45309]" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Sandstone Beige & Terracotta</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            Vibrant bohemian botanical. Brings a refreshed natural perspective. Pairs exceptionally well with gold jewelry, suede bags, and lightweight knits.
                          </p>
                        </>
                      )}
                      {selectedBaseColor === "Gold" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60">Gold pairings</span>
                            <div className="flex gap-1">
                              <span className="h-3.5 w-3.5 rounded-full bg-[#AF905F]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#1D283F]" />
                              <span className="h-3.5 w-3.5 rounded-full bg-[#4B5563] border border-black/10" />
                            </div>
                          </div>
                          <h5 className="font-serif text-sm font-bold italic text-[#1A1A1A]">Midnight Blue & Slate Gray</h5>
                          <p className="text-xs font-serif text-gray-600 italic leading-relaxed">
                            Rich retro tailoring. Warm, deeply textured vintage luxury. Evokes a sense of bespoke 1970s heritage styling, ideal for statement blazers or bags.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* DROPDOWN DRAWER: MIX & MATCH CLOTHING IDEAS WITH AI AGENT */}
            {showMixMatch && (
              <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-10 space-y-8 text-left animate-fade-in shadow-xs my-4" id="mix-and-match-ai-agent">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2 text-[#AF905F] mb-1">
                      <Bot className="h-4 w-4" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Intelligent Closet Agent</span>
                    </div>
                    <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Mix and Match Clothing Ideas</h3>
                    <p className="text-xs text-gray-500 font-serif italic mt-1">
                      Ask our AI Stylist Agent or select garments manually to discover bespoke outfit combinations and harmony scores.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#AF905F]/10 border border-[#AF905F]/30 px-3.5 py-1.5 rounded-full w-fit">
                      <Wand2 className="h-3.5 w-3.5 text-[#AF905F] animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#AF905F]">AI Agent Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMixMatch(false)}
                      className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 hover:text-[#1A1A1A] underline cursor-pointer"
                    >
                      Close Agent
                    </button>
                  </div>
                </div>

              {/* Interactive AI Agent Prompt Interface */}
              <div className="bg-[#FAF6F0] border border-[#1A1A1A]/10 p-5 sm:p-6 space-y-4">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-[#AF905F]" /> Ask AI Agent for Outfit Suggestions
                </span>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Suggest a chic outfit for a summer date night or beach party..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAskAiStylist(aiPrompt);
                    }}
                    className="flex-grow bg-white border border-[#1A1A1A]/15 px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#AF905F] font-sans"
                  />
                  <button
                    onClick={() => handleAskAiStylist(aiPrompt)}
                    disabled={aiIsThinking || !aiPrompt.trim()}
                    className="bg-[#1A1A1A] hover:bg-[#AF905F] disabled:opacity-50 text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shrink-0"
                  >
                    {aiIsThinking ? (
                      <>
                        <Wand2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Styling...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-[#AF905F]" />
                        <span>Ask AI Stylist</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block">Quick AI Agent Queries:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "🍷 Date Night Look",
                      "💼 Executive Office Mix",
                      "☀️ Summer Riviera Breeze",
                      "🎉 Party Night Glamour",
                      "👟 Relaxed College Streetwear"
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setAiPrompt(chip);
                          handleAskAiStylist(chip);
                        }}
                        className="bg-white border border-[#1A1A1A]/10 hover:border-[#AF905F] hover:text-[#AF905F] text-[#1A1A1A] px-3 py-1 text-[9px] font-mono uppercase tracking-wider transition rounded-full"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Stylist Generated Response Card */}
                {aiStylistResult && (
                  <div className="mt-4 p-5 bg-white border-2 border-[#AF905F]/40 shadow-xs space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-[#1A1A1A] text-[#AF905F] rounded-full flex items-center justify-center font-mono text-xs font-bold">
                          AI
                        </div>
                        <h4 className="font-serif text-base font-bold italic text-[#1A1A1A]">{aiStylistResult.title}</h4>
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {aiStylistResult.matchScore}% Harmony Score
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-center">
                          <img src={aiStylistResult.upperGarment.imageUrl} className="h-28 w-full object-cover border border-[#1A1A1A]/10 grayscale" alt="Upper" />
                          <span className="text-[8px] font-mono uppercase font-bold text-gray-500 block truncate">{aiStylistResult.upperGarment.name}</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <img src={aiStylistResult.lowerGarment.imageUrl} className="h-28 w-full object-cover border border-[#1A1A1A]/10 grayscale" alt="Lower" />
                          <span className="text-[8px] font-mono uppercase font-bold text-gray-500 block truncate">{aiStylistResult.lowerGarment.name}</span>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-2.5 text-left">
                        <p className="text-xs font-serif text-gray-800 italic leading-relaxed">
                          "{aiStylistResult.analysis}"
                        </p>
                        <div className="p-2.5 bg-[#FAF6F0] border border-[#AF905F]/20 text-[11px] font-serif italic text-[#1A1A1A]">
                          <strong>✨ Color Harmony Advice:</strong> {aiStylistResult.colorHarmonyTip}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Selection Dropdowns for Mix & Match */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/60 block">Or Manual Garment Assembly:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A]/60 font-bold">Select Top / Drape</label>
                    <select
                      value={mixUpperId}
                      onChange={(e) => setMixUpperId(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#1A1A1A]/15 px-3 py-2 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#AF905F]"
                    >
                      {CURATED_OUTFITS.filter(o => ["men", "women", "party wear"].includes(o.category)).map((outfit) => (
                        <option key={outfit.id} value={outfit.id}>{outfit.brand} - {outfit.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A]/60 font-bold">Select Footwear / Accent</label>
                    <select
                      value={mixLowerId}
                      onChange={(e) => setMixLowerId(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#1A1A1A]/15 px-3 py-2 text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#AF905F]"
                    >
                      {CURATED_OUTFITS.filter(o => ["shoes", "accessories", "sports"].includes(o.category)).map((outfit) => (
                        <option key={outfit.id} value={outfit.id}>{outfit.brand} - {outfit.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Polaroid Preview */}
                {(() => {
                  const upper = CURATED_OUTFITS.find(o => o.id === mixUpperId);
                  const lower = CURATED_OUTFITS.find(o => o.id === mixLowerId);
                  if (!upper || !lower) return null;

                  let score = 94;
                  if (upper.brand === lower.brand) score += 3;
                  if (upper.category === "women" && lower.id === "shoes-2") score += 2;
                  if (upper.category === "men" && lower.id === "acc-2") score += 2;
                  if (score > 100) score = 100;

                  return (
                    <div className="p-4 bg-[#FAF6F0] border border-[#1A1A1A]/10 shadow-xs space-y-3">
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <img src={upper.imageUrl} className="h-32 w-full object-cover border border-[#1A1A1A]/10 grayscale" alt="Upper" />
                        <img src={lower.imageUrl} className="h-32 w-full object-cover border border-[#1A1A1A]/10 grayscale" alt="Lower" />
                      </div>
                      <div className="text-center space-y-1 border-t border-[#1A1A1A]/10 pt-3">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                          <span className="font-mono text-[10px] uppercase text-[#AF905F] font-bold">Manual Mix Assembly</span>
                          <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">{score}% Cohesion Match</span>
                        </div>
                        <p className="text-xs font-serif text-gray-600 italic leading-normal max-w-md mx-auto text-left pt-1">
                          The bespoke styling of the {upper.name} aligns gracefully with the {lower.name}, creating a high-fashion statement.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
            )}

            {/* Category filtered list (COMPACT 4-IMAGE GRID, NO PRICE DISPLAY) */}
            <div className="w-full border-t border-[#1A1A1A]/10 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 text-left">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#AF905F]">Curated Catalog</span>
                  <h4 className="font-serif text-2xl font-light text-[#1A1A1A] italic">Outfits & Wardrobe Selections</h4>
                </div>
                {selectedBodyShape !== "all" && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                    ✨ Filtered for {selectedBodyShape.replace("_", " ")}
                  </span>
                )}
              </div>

              {(() => {
                const items = CURATED_OUTFITS.filter(outfit => {
                  const matchesSearch = !searchQuery ? true : (
                    outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    outfit.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    outfit.category.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  
                  const matchesCategory = selectedCategory === "all" ? true : outfit.category === selectedCategory;
                  const matchesOccasion = selectedOccasion === "all" ? true : outfit.occasions.includes(selectedOccasion as any);
                  const matchesBodyShape = selectedBodyShape === "all" ? true : (
                    outfit.bodyShapes ? outfit.bodyShapes.includes(selectedBodyShape as any) : true
                  );

                  return matchesSearch && matchesCategory && matchesOccasion && matchesBodyShape;
                });

                if (items.length === 0) {
                  return (
                    <div className="text-center py-16 bg-white border border-dashed border-[#1A1A1A]/10 p-8 space-y-4">
                      <p className="text-xs text-gray-400 italic font-serif">No custom curations match your active category, occasion, or body shape filters.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedOccasion("all");
                          setSelectedBodyShape("all");
                        }}
                        className="border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 text-left">
                    {items.map((outfit) => (
                      <div
                        key={outfit.id}
                        onClick={() => {
                          setSelectedProduct(outfit);
                          setSelectedSize(outfit.sizes[0]);
                          setSelectedColor(outfit.colors[0].name);
                        }}
                        className="group bg-white border border-[#1A1A1A]/10 p-2 sm:p-2.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 relative"
                      >
                        <div className="aspect-[3/4] overflow-hidden relative border border-[#1A1A1A]/5 bg-[#FAF6F0]">
                          <img 
                            src={outfit.imageUrl} 
                            alt={outfit.name} 
                            className="object-cover h-full w-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                          />

                          {/* Body shape match badge if filter active */}
                          {selectedBodyShape !== "all" && outfit.bodyShapes?.includes(selectedBodyShape as any) && (
                            <span className="absolute top-1.5 left-1.5 bg-[#1A1A1A]/90 backdrop-blur-xs text-[#AF905F] text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 border border-[#AF905F]/40 rounded-xs shadow-xs">
                              ✨ Shape Match
                            </span>
                          )}

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(outfit.id);
                            }}
                            className="absolute bottom-1.5 right-1.5 h-6 w-6 bg-white/90 backdrop-blur-xs border border-[#1A1A1A]/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-2xs rounded-full cursor-pointer"
                          >
                            <Heart className={`h-3 w-3 ${wishlist.includes(outfit.id) ? "fill-red-500 text-red-500" : ""}`} />
                          </button>
                        </div>

                        <div className="pt-2 pb-0.5 space-y-1">
                          <span className="text-[7.5px] font-mono text-gray-400 uppercase tracking-widest font-bold block truncate">{outfit.brand}</span>
                          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1A1A1A] line-clamp-1 group-hover:text-[#AF905F] transition">{outfit.name}</h4>
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[8px] font-mono text-[#AF905F] uppercase font-bold tracking-wider">{outfit.category}</span>
                            <div className="flex items-center gap-0.5 text-yellow-500 text-[9px]">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold font-mono">{outfit.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* VIEW: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="space-y-10 animate-fade-in" id="tab-wishlist">
            
            <div className="text-left space-y-2 border-b border-[#1A1A1A]/10 pb-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#AF905F] block mb-1">Your Virtual Wardrobe Drawer</span>
              <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Saved Outfits</h3>
              <p className="text-xs text-gray-500 font-serif italic">
                You have {wishlistOutfits.length} custom outfits saved inside your styling closet registry.
              </p>
            </div>

            {wishlistOutfits.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-[#1A1A1A]/10 p-8 space-y-4">
                <div className="h-12 w-12 bg-[#FAF6F0] border border-[#1A1A1A]/10 flex items-center justify-center mx-auto text-gray-400">
                  <Heart className="h-6 w-6 text-[#AF905F]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-medium text-gray-900 uppercase tracking-wide">Wishlist is empty</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed font-serif italic">
                    Start curating your boutique today. Save items from Home and Categories to customize your luxury wardrobe checklist.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("categories")}
                  className="bg-[#1A1A1A] hover:bg-[#AF905F] text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 text-left">
                {wishlistOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    onClick={() => {
                      setSelectedProduct(outfit);
                      setSelectedSize(outfit.sizes[0]);
                      setSelectedColor(outfit.colors[0].name);
                    }}
                    className="group bg-white border border-[#1A1A1A]/10 p-2 sm:p-2.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 relative"
                  >
                    <div className="aspect-[3/4] overflow-hidden relative border border-[#1A1A1A]/5 bg-[#FAF6F0]">
                      <img 
                        src={outfit.imageUrl} 
                        alt={outfit.name} 
                        className="object-cover h-full w-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-1.5 left-1.5 flex gap-1">
                        <span className="bg-[#1A1A1A]/90 backdrop-blur-xs text-white text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-xs">
                          {outfit.category}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(outfit.id);
                        }}
                        className="absolute bottom-1.5 right-1.5 h-6 w-6 bg-white/90 backdrop-blur-xs border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow-2xs rounded-full cursor-pointer"
                        title="Remove outfit"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="pt-2 pb-0.5 space-y-1">
                      <span className="text-[7.5px] font-mono text-gray-400 uppercase tracking-widest font-bold block truncate">{outfit.brand}</span>
                      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1A1A1A] line-clamp-1 group-hover:text-[#AF905F] transition">{outfit.name}</h4>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[8px] font-mono text-[#AF905F] uppercase font-bold tracking-wider">{outfit.category}</span>
                        <div className="flex items-center gap-0.5 text-yellow-500 text-[9px]">
                          <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                          <span className="font-bold font-mono">{outfit.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-10 animate-fade-in" id="tab-profile">
            
            <div className="bg-white border border-[#1A1A1A]/10 p-8 sm:p-12 text-left space-y-8 relative overflow-hidden max-w-2xl mx-auto">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#AF905F]/5 rounded-full blur-[60px] pointer-events-none"></div>

              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#1A1A1A]/10">
                <img 
                  src={activeUserProfile.photoUrl} 
                  alt={activeUserProfile.name} 
                  className="h-28 w-28 object-cover border-2 border-[#AF905F] grayscale shadow-xs"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <span className="px-2.5 py-0.5 text-[8px] font-mono tracking-widest uppercase font-bold bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10">
                    Premium Member
                  </span>
                  <h3 className="font-serif text-3xl font-light text-[#1A1A1A]">{activeUserProfile.name}</h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    Member ID: #TF-{activeUserProfile.name.substring(0,3).toUpperCase()}-2026
                  </p>
                </div>
              </div>

              {/* Astro Horoscope details (computed from Birthday) */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[#AF905F] mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Fashion Star Chart</span>
                  </div>
                  <h4 className="font-serif text-xl font-light text-[#1A1A1A] italic">Zodiac Alignment: {zodiac.sign} ({zodiac.element})</h4>
                </div>

                <div className="p-4 bg-[#FAF6F0] border-l-2 border-[#AF905F] space-y-1 text-xs">
                  <span className="font-mono text-[9px] text-[#1A1A1A]/50 uppercase tracking-wider block">Astrological Stylist advice:</span>
                  <p className="font-serif italic text-gray-600 leading-relaxed">
                    {zodiac.fashionAdvice}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-[#1A1A1A]/5 p-3 font-mono text-[10px] uppercase bg-white/70">
                    <span className="text-gray-400 block mb-1">Birthdate</span>
                    <span className="font-bold">{new Date(activeUserProfile.birthday).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                  </div>
                  <div className="border border-[#1A1A1A]/5 p-3 font-mono text-[10px] uppercase bg-white/70">
                    <span className="text-gray-400 block mb-1">Wishlist Outfits</span>
                    <span className="font-bold text-[#AF905F]">{wishlist.length} Designs saved</span>
                  </div>
                </div>

                {/* Aesthetic Background Atmosphere Customizer */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#AF905F]">
                      <Palette className="h-4 w-4" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Aesthetic Canvas Atmosphere</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Background Glow</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AESTHETIC_ATMOSPHERES.map((atm) => (
                      <button
                        key={atm.id}
                        onClick={() => {
                          setSelectedAtmosphere(atm.id);
                          setToastMessage(`Atmosphere changed to ${atm.name}!`);
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                        className={`p-3 text-left border transition-all cursor-pointer rounded-sm ${
                          selectedAtmosphere === atm.id
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs"
                            : "bg-white/80 hover:bg-white text-[#1A1A1A] border-[#1A1A1A]/15"
                        }`}
                      >
                        <div className="text-xs mb-1">{atm.badge.split(" ")[0]}</div>
                        <div className="text-[10px] font-bold tracking-tight">{atm.name}</div>
                        <div className="text-[8px] font-mono opacity-70 mt-0.5">Aura Palette</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end pt-4 gap-3">
                <button
                  onClick={() => {
                    setAppState("birthday");
                  }}
                  className="border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#1A1A1A] hover:bg-red-600 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* SEASONAL RECOMMENDATIONS OVERLAY MODAL */}
      {showSeasonalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#1A1A1A]/15 shadow-2xl relative p-6 sm:p-8 space-y-6 text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setShowSeasonalModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] p-2 rounded-full transition z-10"
              id="seasonal-modal-close-btn"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-[#AF905F] mb-1">
                <Compass className="h-4 w-4" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Seasonal Wardrobe Compass</span>
              </div>
              <h3 className="font-serif text-3xl font-light text-[#1A1A1A] italic">Seasonal Recommendations</h3>
              <p className="text-xs text-gray-500 font-serif leading-relaxed italic mt-1">
                Select your current climate or season to review curated textile recommendations, color spectrums, and stylist suggestions.
              </p>
            </div>

            {/* Season Selectors */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { code: "spring", icon: "🌸", label: "Spring" },
                { code: "summer", icon: "☀️", label: "Summer" },
                { code: "autumn", icon: "🍂", label: "Autumn" },
                { code: "winter", icon: "❄️", label: "Winter" }
              ].map((season) => (
                <button
                  key={season.code}
                  type="button"
                  onClick={() => setSelectedSeason(season.code as any)}
                  className={`py-3 text-[9px] font-bold uppercase tracking-wider transition-all border flex flex-col items-center gap-1.5 rounded-xs cursor-pointer ${
                    selectedSeason === season.code 
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs scale-105" 
                      : "bg-[#FAF6F0] border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                  }`}
                >
                  <span className="text-lg">{season.icon}</span>
                  <span>{season.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Seasonal Advice Box */}
            <div className="p-5 bg-[#FAF6F0] border border-[#1A1A1A]/10 space-y-4">
              {selectedSeason === "spring" && (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#AF905F] flex items-center gap-1.5">
                    🌸 Spring Renewal Wardrobe
                  </span>
                  <div className="space-y-1 font-mono text-[9px] text-[#1A1A1A]/70 uppercase">
                    <div><strong className="text-[#1A1A1A]">RECOMMENDED FABRICS:</strong> Cotton Knit, Raw Silk, Tencel, Light Linen</div>
                    <div><strong className="text-[#1A1A1A]">COLOR SPECTRUM:</strong> Sage Green, Peach, Wheat Gold, Pastel Cream</div>
                  </div>
                  <p className="text-xs font-serif text-gray-700 italic leading-relaxed">
                    Intertwine structured silhouettes with lightweight drapings to mirror spring’s balance. Pastels pair nicely with dark accessories or tailored blazers.
                  </p>
                </>
              )}
              {selectedSeason === "summer" && (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#AF905F] flex items-center gap-1.5">
                    ☀️ Summer Solstice Riviera
                  </span>
                  <div className="space-y-1 font-mono text-[9px] text-[#1A1A1A]/70 uppercase">
                    <div><strong className="text-[#1A1A1A]">RECOMMENDED FABRICS:</strong> Flax Linen, Voile, Light Satin, Breathable Cotton</div>
                    <div><strong className="text-[#1A1A1A]">COLOR SPECTRUM:</strong> Alabaster, Chalk White, Coral Sand, Light Sage</div>
                  </div>
                  <p className="text-xs font-serif text-[#1A1A1A] leading-relaxed font-bold italic">
                    💡 Stylist Tip: wear light alabaster and white shades in summer to keep cool, reflect solar rays, and project breezy, effortless luxury.
                  </p>
                </>
              )}
              {selectedSeason === "autumn" && (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#AF905F] flex items-center gap-1.5">
                    🍂 Harvest Equinox Tailoring
                  </span>
                  <div className="space-y-1 font-mono text-[9px] text-[#1A1A1A]/70 uppercase">
                    <div><strong className="text-[#1A1A1A]">RECOMMENDED FABRICS:</strong> Gabardine, Tweed, Soft Suede, Wool Blends</div>
                    <div><strong className="text-[#1A1A1A]">COLOR SPECTRUM:</strong> Bordeaux Burgundy, Cognac Leather, Mustard Gold</div>
                  </div>
                  <p className="text-xs font-serif text-[#1A1A1A] leading-relaxed font-bold italic">
                    💡 Stylist Tip: match your shoe shade with your belt or watch strap to anchor heavy autumn layers and establish pristine structural symmetry.
                  </p>
                </>
              )}
              {selectedSeason === "winter" && (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#AF905F] flex items-center gap-1.5">
                    ❄️ Winter Solstice Frost & Glamour
                  </span>
                  <div className="space-y-1 font-mono text-[9px] text-[#1A1A1A]/70 uppercase">
                    <div><strong className="text-[#1A1A1A]">RECOMMENDED FABRICS:</strong> Heavy Wool, Velvet, Cashmere, Shimmer Lurex</div>
                    <div><strong className="text-[#1A1A1A]">COLOR SPECTRUM:</strong> Obsidian Black, Midnight Navy, Deep Burgundy, Champagne</div>
                  </div>
                  <p className="text-xs font-serif text-[#1A1A1A] leading-relaxed font-bold italic">
                    💡 Stylist Tip: layer tailored velvet blazers or wool shackets over sleek knits for a smart casual look that preserves elegant tailoring while beating the cold.
                  </p>
                </>
              )}
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowSeasonalModal(false);
                  setActiveTab("categories");
                }}
                className="bg-[#1A1A1A] hover:bg-[#AF905F] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Outfits for Categories</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRODUCT DETAILS OVERLAY MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#1A1A1A]/15 shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] p-2 rounded-full border border-[#1A1A1A]/10 transition z-10"
              id="details-close-btn"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left: Large Image */}
            <div className="w-full md:w-1/2 aspect-[3/4] bg-gray-50 relative">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#1A1A1A] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* Right: Details Form */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                
                {/* Brand and rating */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#AF905F] uppercase tracking-widest font-bold">
                    {selectedProduct.brand}
                  </span>
                  <div className="flex items-center gap-0.5 text-yellow-500 text-[11px]">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold font-mono">{selectedProduct.rating} / 5.0</span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-light text-[#1A1A1A] leading-tight">
                    {selectedProduct.name}
                  </h3>
                </div>

              </div>

              {/* Add/Remove from Wishlist button */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    toggleWishlist(selectedProduct.id);
                  }}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition duration-300 flex items-center justify-center gap-2 ${
                    wishlist.includes(selectedProduct.id)
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "bg-[#1A1A1A] hover:bg-[#AF905F] text-white"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlist.includes(selectedProduct.id) ? "fill-red-600 text-red-600" : ""}`} />
                  <span>
                    {wishlist.includes(selectedProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Body Shape Finder Overlay Modal */}
      {showBodyShapeModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-[#1A1A1A] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowBodyShapeModal(false)}
              className="absolute top-4 right-4 z-10 h-8 w-8 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#AF905F] transition rounded-full cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-2 sm:p-4">
              <BodyShapeGuide
                selectedShape={selectedBodyShape}
                onSelectShape={(shape) => {
                  setSelectedBodyShape(shape);
                  setActiveTab("categories");
                }}
                onOpenPostureScanner={() => {
                  setShowBodyShapeModal(false);
                  setShowPostureScannerModal(true);
                }}
                onClose={() => setShowBodyShapeModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Body Posture & Morphology Scanner Overlay Modal */}
      {showPostureScannerModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#FAF6F0] border-2 border-[#AF905F] max-w-5xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowPostureScannerModal(false)}
              className="absolute top-4 right-4 z-20 h-8 w-8 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#AF905F] hover:text-[#1A1A1A] transition rounded-full cursor-pointer shadow-md"
              title="Close Scanner"
            >
              <X className="h-4 w-4" />
            </button>
            
            <BodyPostureScanner
              onSelectBodyShape={(shape) => {
                setSelectedBodyShape(shape);
                setActiveTab("categories");
                setShowPostureScannerModal(false);
                setToastMessage(`Catalog filtered for ${shape.replace("_", " ")} body shape!`);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3500);
              }}
              onSelectOutfit={(outfit) => {
                setSelectedProduct(outfit);
                setSelectedSize(outfit.sizes[0]);
                setSelectedColor(outfit.colors[0].name);
                setShowPostureScannerModal(false);
              }}
              onToggleWishlist={(outfit) => {
                toggleWishlist(outfit.id);
              }}
              wishlist={wishlistOutfits}
              onClose={() => setShowPostureScannerModal(false)}
            />
          </div>
        </div>
      )}

      {/* Luxury Brand Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-12 mb-16 text-center text-xs text-gray-400 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold tracking-wide text-gray-800">TrendFits</span>
            <span className="text-gray-300">|</span>
            <span>Handcrafted Couture Directory</span>
          </div>

          <div>
            <span>Astrology Matrix Engine &bull; Wear Your Style</span>
          </div>
        </div>
      </footer>

      {/* Instagram-style Fixed Bottom Navigation Bar (Always visible at viewport bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-around text-center">
          
          {/* HOME */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 group cursor-pointer transition"
            id="bottom-nav-home"
            title="Home"
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center transition ${
              activeTab === "home" ? "bg-[#1A1A1A] text-[#AF905F]" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            }`}>
              <span className="text-xs">🏠</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              activeTab === "home" ? "text-[#1A1A1A] font-extrabold" : "text-gray-500 group-hover:text-gray-800"
            }`}>
              Home
            </span>
          </button>

          {/* BODY SHAPE GUIDE */}
          <button
            onClick={() => setShowBodyShapeModal(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 group cursor-pointer transition"
            id="bottom-nav-bodyshape"
            title="Body Shape Finder"
          >
            <div className="h-7 w-7 bg-[#1A1A1A] text-[#AF905F] rounded-full flex items-center justify-center text-xs font-serif font-bold shadow-2xs group-hover:scale-105 transition-transform">
              ⏳
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 group-hover:text-gray-900">
              Body Shape
            </span>
          </button>

          {/* FAVOURITE */}
          <button
            onClick={() => setActiveTab("wishlist")}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 group cursor-pointer transition relative"
            id="bottom-nav-favourite"
            title="Favourites / Wishlist"
          >
            <div className={`h-7 w-7 rounded-full flex items-center justify-center transition ${
              activeTab === "wishlist" ? "bg-[#AF905F] text-white" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            }`}>
              <Heart className={`h-4 w-4 ${activeTab === "wishlist" ? "fill-white text-white" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 right-2 bg-[#AF905F] text-white text-[8px] h-3.5 w-3.5 flex items-center justify-center rounded-full font-mono font-bold border border-white">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              activeTab === "wishlist" ? "text-[#AF905F] font-extrabold" : "text-gray-500 group-hover:text-gray-800"
            }`}>
              Favourite
            </span>
          </button>

          {/* PROFILE */}
          <button
            onClick={() => setActiveTab("profile")}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 group cursor-pointer transition"
            id="bottom-nav-profile"
            title="User Profile"
          >
            <div className={`h-7 w-7 rounded-full overflow-hidden border transition ${
              activeTab === "profile" ? "border-[#1A1A1A] ring-2 ring-[#AF905F]" : "border-gray-300 group-hover:border-gray-500"
            }`}>
              <img
                src={activeUserProfile.photoUrl}
                alt={activeUserProfile.name}
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              activeTab === "profile" ? "text-[#1A1A1A] font-extrabold" : "text-gray-500 group-hover:text-gray-800"
            }`}>
              Profile
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}
