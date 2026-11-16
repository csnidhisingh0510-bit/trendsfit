import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Grid, Filter, RefreshCw, X, Image as ImageIcon, ExternalLink, Calendar, Compass } from "lucide-react";
import { WardrobeItem, User } from "../types";

interface WardrobeGridProps {
  user: User;
  onItemsChange?: () => void;
}

// Beautiful preset Unsplash images for easy visual seeding
const IMAGE_PRESETS = [
  { name: "White linen shirt", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400" },
  { name: "Beige Knit Sweater", url: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=400" },
  { name: "Champagne Silk top", url: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400" },
  { name: "Denim trucker jacket", url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=400" },
  { name: "Tailored Trench coat", url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400" },
  { name: "Casual Denim jeans", url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" },
  { name: "Tailored beige chinos", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400" },
  { name: "White minimal sneakers", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
  { name: "Leather ankle boots", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400" },
  { name: "Active fitness Tee", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400" },
];

export default function WardrobeGrid({ user, onItemsChange }: WardrobeGridProps) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  // Form Drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "top" as WardrobeItem["category"],
    color: "",
    season: "all_season" as WardrobeItem["season"],
    occasion: "casual" as WardrobeItem["occasion"],
    imageUrl: "",
  });
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/wardrobe/items?userId=${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve closet items");
      }
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || "Failed to load wardrobe items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user.id]);

  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to remove this item from your wardrobe?")) return;
    try {
      const response = await fetch(`/api/wardrobe/items/${itemId}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not delete wardrobe item");
      }
      // Reload items
      fetchItems();
      if (onItemsChange) onItemsChange();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "top",
      color: "",
      season: "all_season",
      occasion: "casual",
      imageUrl: IMAGE_PRESETS[0].url,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: WardrobeItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      occasion: item.occasion,
      imageUrl: item.imageUrl,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.color || !formData.imageUrl) {
      setFormError("All fields must be filled out.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    try {
      const isEdit = !!editingItem;
      const endpoint = isEdit ? `/api/wardrobe/items/${editingItem.id}` : "/api/wardrobe/items";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save clothing item");
      }

      setIsFormOpen(false);
      fetchItems();
      if (onItemsChange) onItemsChange();
    } catch (err: any) {
      setFormError(err.message || "Something went wrong saving the item.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered items computed properties
  const filteredItems = items.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const occasionMatch = selectedOccasion === "all" || item.occasion === selectedOccasion;
    const seasonMatch = selectedSeason === "all" || item.season === selectedSeason;
    return categoryMatch && occasionMatch && seasonMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters & Actions bar */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-none p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Grid className="h-5 w-5 text-[#8B4513]" />
            <div>
              <h3 className="font-serif text-3xl font-light italic text-[#1A1A1A]">Wardrobe</h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40 mt-1 block">
                YOUR ARCHIVE OF {items.length} DESIGNER GARMENTS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchItems}
              className="p-2 border border-[#1A1A1A]/10 rounded-none text-gray-500 hover:bg-[#FAF6F0] transition"
              title="Refresh Closet"
            >
              <RefreshCw className="h-4 w-4 text-[#1A1A1A]" />
            </button>
            <button
              onClick={handleOpenAddForm}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition duration-150 flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Wardrobe Item
            </button>
          </div>
        </div>

        {/* Filter Selection Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#1A1A1A]/10 pt-4 text-xs">
          <div>
            <label className="block text-[#1A1A1A]/40 font-mono mb-1.5 uppercase tracking-widest font-bold">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-[#1A1A1A] font-mono uppercase text-[10px] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="all">All Categories</option>
              <option value="top">Tops</option>
              <option value="bottom">Bottoms</option>
              <option value="footwear">Footwear</option>
              <option value="outerwear">Outerwear</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1A1A]/40 font-mono mb-1.5 uppercase tracking-widest font-bold">
              Occasion
            </label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-[#1A1A1A] font-mono uppercase text-[10px] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="all">All Occasions</option>
              <option value="casual">Casual Wear</option>
              <option value="work">Work / Formal</option>
              <option value="party">Party / Evening</option>
              <option value="workout">Workout / Active</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1A1A]/40 font-mono mb-1.5 uppercase tracking-widest font-bold">
              Seasonality
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-[#1A1A1A] font-mono uppercase text-[10px] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
              <option value="all_season">All Season basics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wardrobe Items Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
          <RefreshCw className="h-8 w-8 animate-spin text-[#8B4513]" />
          <span className="text-xs font-mono uppercase tracking-widest">Opening your curated wardrobe drawers...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-none text-center">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-[#1A1A1A]/10 rounded-none p-8 space-y-4">
          <div className="h-12 w-12 rounded-none bg-[#FAF6F0] border border-[#1A1A1A]/10 flex items-center justify-center mx-auto text-gray-400">
            <Filter className="h-6 w-6 text-[#8B4513]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-medium text-gray-900 uppercase tracking-wide">No Clothing Items Found</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed font-serif italic">
              {items.length === 0
                ? "Your digital wardrobe is empty. Start curating your closet by adding tops, bottoms, outerwear, and footwear!"
                : "No clothing items match your chosen filters. Try adjusting your category, occasion, or season search!"}
            </p>
          </div>
          {items.length === 0 && (
            <button
              onClick={handleOpenAddForm}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Your First Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#1A1A1A]/10 rounded-none overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between p-3"
            >
              {/* Product Card Image Container */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden w-full rounded-none">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />

                {/* Categories Badge Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded-none bg-black/80 backdrop-blur-xs text-[8px] font-mono tracking-widest text-white uppercase font-bold">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-none bg-[#8B4513] text-[8px] font-mono tracking-widest text-white uppercase font-bold">
                    {item.occasion}
                  </span>
                </div>

                {/* Quick CRUD Hover Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenEditForm(item)}
                    className="p-2 rounded-none bg-white text-gray-800 hover:bg-gray-100 border border-[#1A1A1A]/10 transition shadow"
                    title="Edit Item Details"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-none bg-white text-red-600 hover:bg-red-50 border border-red-200 transition shadow"
                    title="Delete Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Information Footer */}
              <div className="pt-3.5 pb-1 space-y-1 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 truncate leading-snug" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-wide">
                  <span>Color: {item.color}</span>
                  <span>{item.season.replace("_", " ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Form Drawer Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-[#F5F2EF] w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-slide-in p-8 border-l border-[#1A1A1A]/10">
            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#8B4513]" />
                  <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A]">
                    {editingItem ? "Edit Garment" : "Curate Garment"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-[#1A1A1A]/5 rounded-none transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-none font-mono uppercase tracking-wider">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5 text-xs text-left">
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="e.g. Classic Tailored Cashmere Coat"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-xs text-gray-800 font-mono uppercase focus:outline-none focus:border-[#1A1A1A]"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="footwear">Footwear</option>
                      <option value="outerwear">Outerwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                      Color
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      placeholder="e.g. Cream, Charcoal, Indigo"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value as any })}
                      className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-xs text-[#1A1A1A] font-mono uppercase focus:outline-none focus:border-[#1A1A1A]"
                    >
                      <option value="casual">Casual</option>
                      <option value="work">Work / Formal</option>
                      <option value="party">Party / Special</option>
                      <option value="workout">Workout</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                      Seasonality
                    </label>
                    <select
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                      className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-xs text-[#1A1A1A] font-mono uppercase focus:outline-none focus:border-[#1A1A1A]"
                    >
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                      <option value="autumn">Autumn</option>
                      <option value="winter">Winter</option>
                      <option value="all_season">All-Season Basic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                    Image Address URL
                  </label>
                  <input
                    type="url"
                    required
                    className="w-full bg-white border border-[#1A1A1A]/10 rounded-none px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] mb-2"
                    placeholder="https://images.unsplash.com/... or choose preset below"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                {/* Visual presets selector */}
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                    Or select a luxury preset photo:
                  </label>
                  <div className="grid grid-cols-5 gap-2 bg-white p-2.5 rounded-none border border-[#1A1A1A]/10 h-28 overflow-y-auto">
                    {IMAGE_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`aspect-square relative rounded-none overflow-hidden border transition ${
                          formData.imageUrl === preset.url
                            ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="h-full w-full object-cover grayscale hover:grayscale-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-[#1A1A1A]/40 font-mono uppercase tracking-widest mb-1.5">
                      Card Image Preview:
                    </label>
                    <div className="aspect-[3/4] w-28 bg-white border border-[#1A1A1A]/10 rounded-none overflow-hidden p-1">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="object-cover h-full w-full grayscale"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="border-t border-[#1A1A1A]/10 pt-6 flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-2.5 border border-[#1A1A1A]/20 rounded-none text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={formSubmitting}
                onClick={handleFormSubmit}
                className="flex-grow bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition disabled:opacity-50"
              >
                {formSubmitting ? "Saving..." : editingItem ? "Update Garment" : "Curate Garment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
