import { useState } from "react";
import { User } from "../types";
import { UserCheck, Sparkles, Tag, Layers, Check } from "lucide-react";

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const STYLE_OPTIONS = [
  {
    name: "Minimalist",
    description: "Neutral tones, clean cuts, versatile basics, and simple architectural profiles.",
    example: "White linen shirts, tailored dark trousers, minimalist clean sneakers.",
  },
  {
    name: "Casual",
    description: "Comfortable, effortless everyday attire emphasizing fit and utility.",
    example: "Jeans, knit sweaters, denim jackets, cotton crewnecks.",
  },
  {
    name: "Elegant",
    description: "Highly sophisticated, structured evening look, tailored outerwear, and silk materials.",
    example: "Champagne silk blouses, double-breasted trench coats, leather loafers.",
  },
  {
    name: "Athletic",
    description: "Performance sportswear blended with modern street style elements.",
    example: "Dry-fit active tees, premium joggers, high-performance trainers.",
  },
];

export default function Profile({ user, onUpdateUser }: ProfileProps) {
  const [selectedPreference, setSelectedPreference] = useState(user.stylePreference);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          stylePreference: selectedPreference,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile preferences");
      }

      onUpdateUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 animate-fade-in">
      {/* Profile Overview Card */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-[#1A1A1A] text-[#F5F2EF] flex items-center justify-center font-serif text-3xl font-light">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">{user.email}</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase font-bold bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/10 rounded-none">
                {user.role}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-mono mt-1 uppercase tracking-wider">Member ID: #{user.id} • Secure Cloud Node</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-1.5 text-xs text-[#8B4513] bg-[#8B4513]/5 px-3 py-1.5 rounded-none border border-[#8B4513]/10 font-mono uppercase tracking-wider font-bold">
          <UserCheck className="h-4 w-4" />
          <span>Active Profile</span>
        </div>
      </div>

      {/* Style Preference Selector */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-[#8B4513] mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Aesthetic Direction</span>
          </div>
          <h3 className="font-serif text-3xl font-light italic text-[#1A1A1A]">
            Style Persona
          </h3>
          <p className="text-[11px] text-[#1A1A1A]/50 font-mono mt-2 uppercase tracking-wide">
            Your personal preference drives the scoring engine and custom stylist evaluations.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-none">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-none flex items-center gap-1.5 uppercase tracking-wider font-mono">
            <Check className="h-4 w-4" />
            Style preferences updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedPreference === style.name;
            return (
              <div
                key={style.name}
                onClick={() => setSelectedPreference(style.name)}
                className={`cursor-pointer p-4 border transition-all duration-200 text-left rounded-none ${
                  isSelected
                    ? "border-[#1A1A1A] bg-[#1A1A1A]/5 ring-1 ring-[#1A1A1A]"
                    : "border-[#1A1A1A]/10 hover:border-[#1A1A1A] bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs uppercase tracking-widest text-[#1A1A1A]">{style.name}</span>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-none bg-[#1A1A1A] text-white flex items-center justify-center p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 font-serif italic">{style.description}</p>
                <div className="border-t border-dashed border-gray-100 pt-2 flex items-start gap-1">
                  <Tag className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-[10px] text-gray-400 font-mono leading-relaxed italic">
                    Key items: {style.example}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition duration-150 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
