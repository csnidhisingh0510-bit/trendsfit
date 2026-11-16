import { useState, useEffect } from "react";
import { Sparkles, Heart, RefreshCw, Sun, Snowflake, CloudRain, Thermometer, Briefcase, PartyPopper, Coffee, Dumbbell, Star, HelpCircle } from "lucide-react";
import { User, OutfitRecommendation, WardrobeItem } from "../types";

interface RecommenderProps {
  user: User;
  onSavedChange?: () => void;
}

const OCCASIONS = [
  { id: "casual", name: "Casual", icon: Coffee, desc: "Relaxed daily wear, brunch, or errands." },
  { id: "work", name: "Work / Professional", icon: Briefcase, desc: "Smart-casual, business-casual or office attire." },
  { id: "party", name: "Party / Special", icon: PartyPopper, desc: "Dressed-up evening look, birthdays, and nights out." },
  { id: "workout", name: "Workout", icon: Dumbbell, desc: "Performance fabrics, trainers, and athletic sets." },
];

const WEATHER_OPTIONS = [
  { id: "hot", name: "Hot / Summer", icon: Sun, color: "text-amber-500 bg-amber-50" },
  { id: "cold", name: "Cold / Winter", icon: Snowflake, color: "text-blue-500 bg-blue-50" },
  { id: "rainy", name: "Rainy Season", icon: CloudRain, color: "text-teal-500 bg-teal-50" },
  { id: "moderate", name: "Moderate / Mild", icon: Thermometer, color: "text-emerald-500 bg-emerald-50" },
];

export default function Recommender({ user, onSavedChange }: RecommenderProps) {
  const [occasion, setOccasion] = useState("casual");
  const [weather, setWeather] = useState("moderate");
  const [useAI, setUseAI] = useState(true);

  const [loading, setLoading] = useState(false);
  const [combinations, setCombinations] = useState<OutfitRecommendation[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [emptyMsg, setEmptyMsg] = useState("");
  const [error, setError] = useState("");
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const generateRecommendations = async () => {
    setLoading(true);
    setError("");
    setEmptyMsg("");
    setAiAdvice(null);
    try {
      const response = await fetch(
        `/api/recommendations/recommend?userId=${user.id}&occasion=${occasion}&weather=${weather}&useAI=${useAI}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to match outfit styles");
      }

      if (data.combinations.length === 0) {
        setEmptyMsg(data.message || "No matches can be found. Try expanding your digital wardrobe!");
        setCombinations([]);
      } else {
        setCombinations(data.combinations);
        setAiAdvice(data.aiAdvice);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while styling outfits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [occasion, weather, user.id]);

  const handleSaveFavourite = async (combo: OutfitRecommendation) => {
    try {
      const response = await fetch("/api/wardrobe/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          topId: combo.top.id,
          bottomId: combo.bottom.id,
          footwearId: combo.footwear.id,
          outerwearId: combo.outerwear?.id || null,
          occasion: combo.occasion,
          weather: combo.weather,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not save outfit combination");
      }

      setSavedStatus((prev) => ({ ...prev, [combo.id]: true }));
      if (onSavedChange) onSavedChange();
    } catch (err: any) {
      alert(err.message || "Failed to save combination");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in">
      
      {/* Filters Left Sidebar - 4 columns */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 space-y-6">
          
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B4513] mb-2">Contextual Engine</p>
            <h2 className="text-3xl font-light leading-tight serif font-serif italic text-[#1A1A1A]">Set your<br/>Intent.</h2>
            <p className="text-[11px] text-[#1A1A1A]/50 mt-2 font-mono">Select your occasion and current conditions to match items.</p>
          </div>

          {/* Occasion Selection */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">
              1. Occasion
            </span>
            <div className="space-y-2">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = occasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setOccasion(occ.id)}
                    className={`w-full text-left p-3 border transition flex items-start gap-3 rounded-none ${
                      isSelected
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-[#1A1A1A]/10 hover:border-[#1A1A1A] bg-white text-[#1A1A1A]"
                    }`}
                  >
                    <div className={`p-1.5 rounded-none ${isSelected ? "bg-white text-[#1A1A1A]" : "bg-gray-100 text-gray-500"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold leading-tight uppercase tracking-wider ${isSelected ? "text-white" : "text-[#1A1A1A]"}`}>{occ.name}</h4>
                      <p className={`text-[10px] mt-0.5 leading-snug ${isSelected ? "text-white/60" : "text-gray-400"}`}>{occ.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weather Selection */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">
              2. Weather
            </span>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_OPTIONS.map((w) => {
                const Icon = w.icon;
                const isSelected = weather === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setWeather(w.id)}
                    className={`p-3 border transition text-left flex flex-col justify-between gap-3 h-20 rounded-none ${
                      isSelected
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-[#1A1A1A]/10 hover:border-[#1A1A1A] bg-white text-[#1A1A1A]"
                    }`}
                  >
                    <div className={`p-1 w-fit rounded-none ${isSelected ? "bg-white text-[#1A1A1A]" : w.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider">{w.name.split(" / ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Stylist Upgrade Option */}
          <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#8B4513]" />
                Gemini AI Stylist
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#1A1A1A]"></div>
              </label>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Enables real-time creative evaluation of curated outfits from your closet using artificial intelligence.
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Combos
          </button>
        </div>
      </div>

      {/* Outfit Recommendations Stream - 8 columns */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Gemini Stylist Consultation Bubble */}
        {useAI && (aiAdvice || loading) && (
          <div className="bg-[#FAF6F0] border-t-4 border-[#1A1A1A] rounded-none p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8B4513]">
              <Sparkles className="h-4 w-4 text-[#8B4513]" />
              <span>Style AI Suggestion</span>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200/50 rounded-md animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200/50 rounded-md animate-pulse w-5/6"></div>
              </div>
            ) : (
              <p className="text-xs text-[#1A1A1A]/80 leading-relaxed italic font-serif">
                "{aiAdvice}"
              </p>
            )}
          </div>
        )}

        {/* Outfit Combination display */}
        {loading && combinations.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#8C7853]" />
            <p className="text-sm font-mono text-gray-400">Curating the finest matches from your digital racks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-center text-sm">
            {error}
          </div>
        ) : emptyMsg ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400 border border-gray-100">
              <HelpCircle className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-medium text-gray-900">Insufficient Wardrobe Items</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {emptyMsg}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2">
              <span className="font-serif text-sm font-semibold tracking-wider uppercase text-[#1A1A1A]/60">
                Found {combinations.length} Curated Looks
              </span>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                Scored by Intent & Compatibility
              </span>
            </div>

            {combinations.map((combo, comboIndex) => (
              <div
                key={combo.id}
                className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow duration-200 relative"
              >
                {/* Outfit card header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 bg-[#1A1A1A] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                      {comboIndex + 1}
                    </span>
                    <h4 className="font-serif text-2xl font-light italic text-[#1A1A1A] tracking-tight">
                      {combo.occasion === "work" ? "The Modern Professional" : combo.occasion === "party" ? "The Gallery Opening" : combo.occasion === "workout" ? "The Active Set" : "The Effortless Classic"}
                    </h4>
                    <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-white" />
                      {combo.matchScore}% Score
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveFavourite(combo)}
                    disabled={savedStatus[combo.id]}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition rounded-none ${
                      savedStatus[combo.id]
                        ? "bg-rose-50 text-rose-500 border border-rose-100"
                        : "bg-white border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A]"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${savedStatus[combo.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                    {savedStatus[combo.id] ? "Saved" : "Heart Look"}
                  </button>
                </div>

                {/* Grid of the matched garments */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Top card */}
                  <div className="border border-[#1A1A1A]/5 bg-white rounded-none p-3 text-left space-y-3 shadow-none">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={combo.top.imageUrl}
                        alt={combo.top.name}
                        referrerPolicy="no-referrer"
                        className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest font-mono bg-[#1A1A1A] text-white px-2 py-0.5">
                        Top Layer
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] truncate" title={combo.top.name}>
                        {combo.top.name}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Color: {combo.top.color}</span>
                    </div>
                  </div>

                  {/* Bottom card */}
                  <div className="border border-[#1A1A1A]/5 bg-white rounded-none p-3 text-left space-y-3 shadow-none">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={combo.bottom.imageUrl}
                        alt={combo.bottom.name}
                        referrerPolicy="no-referrer"
                        className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest font-mono bg-[#1A1A1A] text-white px-2 py-0.5">
                        Base Lower
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] truncate" title={combo.bottom.name}>
                        {combo.bottom.name}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Color: {combo.bottom.color}</span>
                    </div>
                  </div>

                  {/* Footwear card */}
                  <div className="border border-[#1A1A1A]/5 bg-white rounded-none p-3 text-left space-y-3 shadow-none">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={combo.footwear.imageUrl}
                        alt={combo.footwear.name}
                        referrerPolicy="no-referrer"
                        className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest font-mono bg-[#1A1A1A] text-white px-2 py-0.5">
                        Footwear
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] truncate" title={combo.footwear.name}>
                        {combo.footwear.name}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Color: {combo.footwear.color}</span>
                    </div>
                  </div>

                  {/* Outerwear card (Conditional) */}
                  {combo.outerwear ? (
                    <div className="border border-[#1A1A1A]/5 bg-white rounded-none p-3 text-left space-y-3 shadow-none">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img
                          src={combo.outerwear.imageUrl}
                          alt={combo.outerwear.name}
                          referrerPolicy="no-referrer"
                          className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300"
                        />
                        <span className="absolute top-2 left-2 text-[8px] uppercase tracking-widest font-mono bg-[#8B4513] text-white px-2 py-0.5">
                          Outer Coat
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] truncate" title={combo.outerwear.name}>
                          {combo.outerwear.name}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Color: {combo.outerwear.color}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#1A1A1A]/10 rounded-none flex flex-col items-center justify-center p-4 text-center space-y-1.5 bg-[#F5F2EF]/50">
                      <Sun className="h-6 w-6 text-gray-400" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 block leading-tight">No Outer Layer</span>
                        <p className="text-[9px] text-gray-400 mt-1 leading-snug">Omitted for warmer settings</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Combinations details / reasoning note */}
                <div className="bg-[#F5F2EF] border border-[#1A1A1A]/10 p-4 rounded-none text-xs text-[#1A1A1A]/80 leading-relaxed font-serif italic flex items-start gap-2.5">
                  <span className="text-[#8B4513] mt-0.5 flex-shrink-0 font-bold">✦</span>
                  <p>{combo.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
