import { useState, useEffect } from "react";
import { HeartCrack, Trash2, Tag, Calendar, Sparkles, FolderHeart } from "lucide-react";
import { User, SavedFavourite } from "../types";

interface FavouritesProps {
  user: User;
  refreshTrigger: number;
}

export default function Favourites({ user, refreshTrigger }: FavouritesProps) {
  const [favourites, setFavourites] = useState<SavedFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavourites = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/wardrobe/favourites?userId=${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load saved lookbooks");
      }
      setFavourites(data.favourites);
    } catch (err: any) {
      setError(err.message || "Failed to fetch favourite outfits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [user.id, refreshTrigger]);

  const handleRemove = async (favId: number) => {
    if (!confirm("Are you sure you want to remove this combination from your favourites?")) return;
    try {
      const response = await fetch(`/api/wardrobe/favourites/${favId}?userId=${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove favourite");
      }

      fetchFavourites();
    } catch (err: any) {
      alert(err.message || "Could not delete combination");
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FolderHeart className="h-5 w-5 text-[#8B4513]" />
          <div>
            <h3 className="font-serif text-3xl font-light italic text-[#1A1A1A]">Curated Looks</h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40 mt-1 block">
              ALBUM OF {favourites.length} DESIGNER COMBINATIONS
            </span>
          </div>
        </div>
        <p className="hidden md:block text-[11px] text-gray-400 font-mono uppercase tracking-wider">
          Bespoke high-contrast collection lookbooks
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 space-y-2">
          <div className="h-6 w-6 border-2 border-[#1A1A1A] border-t-transparent rounded-none animate-spin mx-auto"></div>
          <span className="text-xs font-mono uppercase tracking-widest">Opening your style lookbooks...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-center text-sm rounded-none">
          {error}
        </div>
      ) : favourites.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed border-[#1A1A1A]/10 rounded-none p-8 space-y-4">
          <div className="h-12 w-12 rounded-none bg-[#FAF6F0] flex items-center justify-center mx-auto text-gray-400 border border-[#1A1A1A]/10">
            <HeartCrack className="h-6 w-6 text-[#8B4513]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-medium text-gray-900 uppercase tracking-wide">No Saved Looks Yet</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-serif italic">
              When using the Outfit Recommender tool, click the "Heart Look" button to store a matched combination permanently in your custom looks book!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {favourites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-5"
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[9px] uppercase font-mono bg-[#8B4513]/10 text-[#8B4513] rounded-none border border-[#8B4513]/10 tracking-widest font-bold">
                      {fav.occasion}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] uppercase font-mono bg-gray-100 text-gray-600 rounded-none tracking-widest">
                      {fav.weather}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Saved {new Date(fav.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(fav.id)}
                  className="p-1.5 rounded-none text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Remove Favourite"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Grid with visual representations */}
              <div className="grid grid-cols-4 gap-3">
                {/* Top */}
                <div className="space-y-1 text-center">
                  <div className="aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-[#1A1A1A]/10 relative">
                    {fav.top ? (
                      <img src={fav.top.imageUrl} alt={fav.top.name} referrerPolicy="no-referrer" className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px] uppercase font-mono font-bold">Deleted</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 bg-black/60 text-[8px] font-mono text-white rounded-none uppercase tracking-widest">Top</span>
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium truncate block" title={fav.top?.name || "Removed Item"}>
                    {fav.top ? fav.top.name : "Deleted"}
                  </span>
                </div>

                {/* Bottom */}
                <div className="space-y-1 text-center">
                  <div className="aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-[#1A1A1A]/10 relative">
                    {fav.bottom ? (
                      <img src={fav.bottom.imageUrl} alt={fav.bottom.name} referrerPolicy="no-referrer" className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px] uppercase font-mono font-bold">Deleted</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 bg-black/60 text-[8px] font-mono text-white rounded-none uppercase tracking-widest">Bot</span>
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium truncate block" title={fav.bottom?.name || "Removed Item"}>
                    {fav.bottom ? fav.bottom.name : "Deleted"}
                  </span>
                </div>

                {/* Footwear */}
                <div className="space-y-1 text-center">
                  <div className="aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-[#1A1A1A]/10 relative">
                    {fav.footwear ? (
                      <img src={fav.footwear.imageUrl} alt={fav.footwear.name} referrerPolicy="no-referrer" className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px] uppercase font-mono font-bold">Deleted</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 bg-black/60 text-[8px] font-mono text-white rounded-none uppercase tracking-widest">Feet</span>
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium truncate block" title={fav.footwear?.name || "Removed Item"}>
                    {fav.footwear ? fav.footwear.name : "Deleted"}
                  </span>
                </div>

                {/* Outerwear */}
                <div className="space-y-1 text-center">
                  <div className="aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-[#1A1A1A]/10 relative flex items-center justify-center">
                    {fav.outerwearId ? (
                      fav.outerwear ? (
                        <img src={fav.outerwear.imageUrl} alt={fav.outerwear.name} referrerPolicy="no-referrer" className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px] uppercase font-mono font-bold">Deleted</div>
                      )
                    ) : (
                      <div className="text-[10px] font-mono text-gray-300 uppercase select-none p-1 leading-snug">No layer</div>
                    )}
                    {fav.outerwearId && <span className="absolute bottom-1 right-1 px-1 bg-[#8B4513] text-[8px] font-mono text-white rounded-none uppercase tracking-widest">Coat</span>}
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium truncate block" title={fav.outerwear ? fav.outerwear.name : "None"}>
                    {fav.outerwearId ? (fav.outerwear ? fav.outerwear.name : "Deleted") : "None"}
                  </span>
                </div>
              </div>

              {/* Design note block */}
              <div className="border-t border-[#1A1A1A]/10 pt-3 text-[11px] text-gray-400 font-mono italic leading-relaxed flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#8B4513] flex-shrink-0" />
                <span>Colors matched: {fav.top?.color || "N/A"} Top, {fav.bottom?.color || "N/A"} Bottoms.</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
