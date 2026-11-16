import React, { useState } from "react";
import { User, Sparkles, Check, Info, ArrowRight, Calculator, Ruler, Camera } from "lucide-react";

export interface BodyShapeGuideProps {
  selectedShape: string;
  onSelectShape: (shape: string) => void;
  onOpenPostureScanner?: () => void;
  onClose?: () => void;
}

export const FEMALE_SHAPES = [
  {
    id: "hourglass",
    name: "Hourglass",
    icon: "⏳",
    tagline: "Balanced bust & hips with defined waist",
    description: "Your bust and hip measurements are nearly equal, and you have a well-defined waistline that curves inward.",
    doList: ["Belted trench coats & wrap dresses", "High-waisted wide-leg trousers", "Fitted blazers & tailored knits"],
    avoidList: ["Boxy oversized sack dresses", "Unstructured shapeless tunics"]
  },
  {
    id: "pear",
    name: "Pear / Triangle",
    icon: "🍐",
    tagline: "Hips wider than shoulders & bust",
    description: "Your hips and thighs are broader than your shoulders, with a defined waistline and delicate upper frame.",
    doList: ["Statement varsity & structured jackets", "Boatneck & off-shoulder tops", "Dark-wash straight or wide-leg pants"],
    avoidList: ["Skinny pants with heavy hip pocket details", "Clutter around hip area"]
  },
  {
    id: "inverted_triangle",
    name: "Inverted Triangle",
    icon: "🔻",
    tagline: "Broad shoulders/bust with narrower hips",
    description: "Your shoulders and bust are visibly wider than your hips and waist.",
    doList: ["V-neck & scoop neck silhouettes", "A-line skirts & pleated trousers", "Cargo pants with side pockets"],
    avoidList: ["Heavy shoulder pads", "Exaggerated puffed sleeve tops"]
  },
  {
    id: "rectangle",
    name: "Rectangle / Athletic",
    icon: "▮",
    tagline: "Balanced shoulders, waist & hips",
    description: "Your bust, waist, and hips are aligned with similar width, creating a sleek athletic silhouette.",
    doList: ["Oversized cardigans layered over cropped tops", "Belts to define waist cinch", "Chikankari tiered dresses & ruffles"],
    avoidList: ["Rigid vertical rectangle cuts with no waist detailing"]
  },
  {
    id: "apple",
    name: "Apple / Oval",
    icon: "🍎",
    tagline: "Fuller torso with slender legs",
    description: "Weight is carried around the midsection and chest, while legs and arms remain relatively slender.",
    doList: ["Monochromatic open trench coats", "V-neck tunics & flowy anarkalis", "Straight-leg denim & structured blazers"],
    avoidList: ["Tight belts around midsection", "Clinging crop tops"]
  }
];

export const MALE_SHAPES = [
  {
    id: "trapezoid",
    name: "Trapezoid",
    icon: "📐",
    tagline: "Broad shoulders & chest with slightly tapered waist",
    description: "The classic well-proportioned male frame where shoulders taper smoothly into a slightly narrow waist.",
    doList: ["Tailored 2-button suits & blazers", "Crewneck sweaters with slim chinos", "Leather Chelsea boots & fitted denim"],
    avoidList: ["Baggy oversized suits that hide natural proportion"]
  },
  {
    id: "inverted_triangle",
    name: "Inverted Triangle",
    icon: "🔻",
    tagline: "Very broad chest/shoulders with narrow waist",
    description: "Athletic frame with broad upper torso and significantly narrow waist and hips.",
    doList: ["Unstructured soft-shoulder blazers", "V-neck knits & classic polo shirts", "Slim cargo joggers & straight denim"],
    avoidList: ["Heavy shoulder padding", "Skinny jeans that make top look disproportionate"]
  },
  {
    id: "rectangle",
    name: "Rectangle",
    icon: "▮",
    tagline: "Shoulders, chest & waist equal width",
    description: "Straight up-and-down torso structure without significant shoulder tapering.",
    doList: ["Layered varsity jackets & shackets", "Crewneck fleece over oxford collars", "Structured coats with defined lapels"],
    avoidList: ["Single-layer plain fitted t-shirts without layering"]
  },
  {
    id: "triangle",
    name: "Triangle",
    icon: "🔺",
    tagline: "Waist & hips broader than shoulders",
    description: "Lower torso is wider than chest and shoulders.",
    doList: ["Structured shoulder pads in blazers", "Dark straight-leg chinos", "Layered open jackets & vertical stripe shirts"],
    avoidList: ["Tapered pants", "Horizontal chest stripes that accentuate lower waist"]
  },
  {
    id: "oval",
    name: "Oval",
    icon: "🔴",
    tagline: "Fuller midsection with narrower limbs",
    description: "Torso curves outward at the center around abdomen.",
    doList: ["Monochromatic dark tailoring & navy suits", "Vertical seams & open blazers", "Straight-leg trousers"],
    avoidList: ["Tight horizontal stripes", "Belts buckled too tightly below stomach"]
  }
];

export const BodyShapeGuide: React.FC<BodyShapeGuideProps> = ({
  selectedShape,
  onSelectShape,
  onOpenPostureScanner,
  onClose
}) => {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [showCalculator, setShowCalculator] = useState(false);

  // Measurements for calculator (in inches)
  const [shoulders, setShoulders] = useState<number>(36);
  const [bustChest, setBustChest] = useState<number>(36);
  const [waist, setWaist] = useState<number>(30);
  const [hips, setHips] = useState<number>(38);
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const activeShapes = gender === "female" ? FEMALE_SHAPES : MALE_SHAPES;

  const handleCalculate = () => {
    if (gender === "female") {
      // Female logic
      const waistToHip = waist / hips;
      const waistToBust = waist / bustChest;
      const bustToHip = bustChest / hips;

      if (bustToHip >= 0.95 && bustToHip <= 1.05 && waistToHip <= 0.75) {
        setCalcResult("hourglass");
      } else if (hips / bustChest >= 1.05) {
        setCalcResult("pear");
      } else if (bustChest / hips >= 1.05) {
        setCalcResult("inverted_triangle");
      } else if (waistToHip >= 0.85) {
        setCalcResult("apple");
      } else {
        setCalcResult("rectangle");
      }
    } else {
      // Male logic
      const shoulderToWaist = shoulders / waist;
      const chestToWaist = bustChest / waist;

      if (chestToWaist >= 1.2 && shoulderToWaist >= 1.25) {
        setCalcResult("inverted_triangle");
      } else if (chestToWaist >= 1.1) {
        setCalcResult("trapezoid");
      } else if (waist / bustChest >= 1.05) {
        setCalcResult("triangle");
      } else if (waist / shoulders >= 1.0) {
        setCalcResult("oval");
      } else {
        setCalcResult("rectangle");
      }
    }
  };

  return (
    <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 space-y-6 text-left shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#AF905F] mb-1">
            <User className="h-4 w-4" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Personal Morphology Atelier</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A1A] italic">
            Body Shape Guide & Outfit Calculator
          </h3>
          <p className="text-xs text-gray-500 font-serif italic mt-1">
            Discover your unique body proportion profile to unlock custom garment recommendations tailored to your frame.
          </p>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1 border border-[#1A1A1A]/10 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => {
              setGender("female");
              setCalcResult(null);
            }}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
              gender === "female"
                ? "bg-[#1A1A1A] text-white shadow-xs"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            👗 Women
          </button>
          <button
            type="button"
            onClick={() => {
              setGender("male");
              setCalcResult(null);
            }}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
              gender === "male"
                ? "bg-[#1A1A1A] text-white shadow-xs"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            🤵 Men
          </button>
        </div>
      </div>

      {/* Mode Switcher: Click Shape vs Measure vs Posture Scan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF6F0] p-3.5 border border-[#1A1A1A]/10 text-xs">
        <span className="font-mono text-[10px] uppercase font-bold text-[#1A1A1A]/70 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#AF905F]" />
          Select a Body Shape below or use AI Vision Posture Scanner
        </span>
        <div className="flex items-center gap-3">
          {onOpenPostureScanner && (
            <button
              onClick={onOpenPostureScanner}
              className="bg-[#1A1A1A] hover:bg-[#AF905F] text-white hover:text-[#1A1A1A] px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 rounded-xs cursor-pointer shadow-2xs"
            >
              <Camera className="h-3.5 w-3.5 text-[#AF905F]" />
              <span>AI Photo Posture Scan</span>
            </button>
          )}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#AF905F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Calculator className="h-3.5 w-3.5" />
            {showCalculator ? "Hide Calculator" : "Manual Calculator"}
          </button>
        </div>
      </div>

      {/* Interactive Measurement Calculator Drawer */}
      {showCalculator && (
        <div className="p-5 bg-[#FAF6F0] border-2 border-[#AF905F]/30 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 border-b border-[#1A1A1A]/10 pb-2">
            <Ruler className="h-4 w-4 text-[#AF905F]" />
            <h4 className="font-serif text-sm font-bold italic text-[#1A1A1A]">
              Quick Body Shape Calculator ({gender === "female" ? "Female Proportions" : "Male Proportions"})
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/70 font-bold mb-1">Shoulder (in)</label>
              <input
                type="number"
                value={shoulders}
                onChange={(e) => setShoulders(Number(e.target.value))}
                className="w-full bg-white border border-[#1A1A1A]/15 p-2 text-xs font-mono text-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/70 font-bold mb-1">
                {gender === "female" ? "Bust (in)" : "Chest (in)"}
              </label>
              <input
                type="number"
                value={bustChest}
                onChange={(e) => setBustChest(Number(e.target.value))}
                className="w-full bg-white border border-[#1A1A1A]/15 p-2 text-xs font-mono text-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/70 font-bold mb-1">Waist (in)</label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className="w-full bg-white border border-[#1A1A1A]/15 p-2 text-xs font-mono text-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/70 font-bold mb-1">Hips (in)</label>
              <input
                type="number"
                value={hips}
                onChange={(e) => setHips(Number(e.target.value))}
                className="w-full bg-white border border-[#1A1A1A]/15 p-2 text-xs font-mono text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCalculate}
              className="bg-[#1A1A1A] hover:bg-[#AF905F] text-white px-5 py-2 text-[9.5px] font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Calculate My Shape</span>
              <Calculator className="h-3.5 w-3.5 text-[#AF905F]" />
            </button>

            {calcResult && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 font-serif italic">
                <span>Calculated Shape: <strong>{activeShapes.find(s => s.id === calcResult)?.name}</strong></span>
                <button
                  onClick={() => onSelectShape(calcResult)}
                  className="bg-emerald-700 text-white text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs hover:bg-emerald-800 ml-2 cursor-pointer"
                >
                  Apply & Filter Catalog
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Body Shapes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {activeShapes.map((shape) => {
          const isSelected = selectedShape === shape.id;
          return (
            <div
              key={shape.id}
              onClick={() => onSelectShape(shape.id)}
              className={`p-4 border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02] z-10"
                  : "bg-[#FAF6F0] border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-[#AF905F] text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{shape.icon}</span>
                  <h4 className={`font-serif text-sm font-bold italic ${isSelected ? "text-white" : "text-[#1A1A1A]"}`}>
                    {shape.name}
                  </h4>
                </div>
                <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? "text-[#AF905F]" : "text-[#1A1A1A]/60"}`}>
                  {shape.tagline}
                </p>
                <p className={`text-[11px] font-serif italic leading-snug line-clamp-2 ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
                  {shape.description}
                </p>
              </div>

              <div className="pt-3 border-t border-current/10 mt-3 flex items-center justify-between">
                <span className={`text-[8px] font-mono uppercase font-bold tracking-widest ${isSelected ? "text-[#AF905F]" : "text-gray-400"}`}>
                  {isSelected ? "Active Match Filter" : "Select Shape"}
                </span>
                <ArrowRight className={`h-3 w-3 ${isSelected ? "text-[#AF905F]" : "text-gray-400"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Shape Detailed Styling Tips Banner */}
      {selectedShape !== "all" && (() => {
        const shapeInfo = [...FEMALE_SHAPES, ...MALE_SHAPES].find(s => s.id === selectedShape);
        if (!shapeInfo) return null;

        return (
          <div className="p-5 bg-[#FAF6F0] border-2 border-[#AF905F]/40 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{shapeInfo.icon}</span>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#AF905F] font-bold block">Selected Body Profile</span>
                  <h4 className="font-serif text-xl font-bold italic text-[#1A1A1A]">{shapeInfo.name} Golden Styling Rules</h4>
                </div>
              </div>
              <button
                onClick={() => onSelectShape("all")}
                className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-[#1A1A1A] underline cursor-pointer"
              >
                Clear Shape Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif italic">
              <div className="space-y-2 bg-emerald-50/70 border border-emerald-200/80 p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1">
                  ✨ Perfect Garments & Silhouettes to Wear:
                </span>
                <ul className="space-y-1 text-emerald-950 text-[11px] list-disc list-inside">
                  {shapeInfo.doList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 bg-rose-50/70 border border-rose-200/80 p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-rose-800 flex items-center gap-1">
                  ⚠️ Silhouettes to Avoid or Balance:
                </span>
                <ul className="space-y-1 text-rose-950 text-[11px] list-disc list-inside">
                  {shapeInfo.avoidList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#AF905F] font-bold uppercase tracking-wider pt-1">
              <span>Catalog filtered below for {shapeInfo.name} suitability</span>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-[#1A1A1A] text-white px-4 py-1.5 rounded-xs hover:bg-[#AF905F] transition"
                >
                  View Outfits Below
                </button>
              )}
            </div>
          </div>
        );
      })()}

    </div>
  );
};
