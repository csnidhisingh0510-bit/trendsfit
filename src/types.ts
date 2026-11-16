export interface User {
  id: number;
  email: string;
  role: "registered" | "guest";
  stylePreference: string;
}

export interface WardrobeItem {
  id: number;
  userId: number;
  name: string;
  category: "top" | "bottom" | "footwear" | "outerwear" | "accessory";
  color: string;
  season: "spring" | "summer" | "autumn" | "winter" | "all_season";
  occasion: "casual" | "work" | "party" | "workout";
  imageUrl: string;
  createdAt: string;
}

export interface SavedFavourite {
  id: number;
  userId: number;
  topId: number;
  bottomId: number;
  footwearId: number;
  outerwearId: number | null;
  occasion: "casual" | "work" | "party" | "workout";
  weather: "hot" | "cold" | "rainy" | "moderate";
  createdAt: string;
  
  // Joint fields
  top?: WardrobeItem;
  bottom?: WardrobeItem;
  footwear?: WardrobeItem;
  outerwear?: WardrobeItem | null;
}

export interface OutfitRecommendation {
  id: string;
  top: WardrobeItem;
  bottom: WardrobeItem;
  footwear: WardrobeItem;
  outerwear: WardrobeItem | null;
  occasion: "casual" | "work" | "party" | "workout";
  weather: "hot" | "cold" | "rainy" | "moderate";
  explanation: string;
  matchScore: number;
}
