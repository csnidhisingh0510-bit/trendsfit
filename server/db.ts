import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
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
  // Populated for frontend convenience
  top?: WardrobeItem;
  bottom?: WardrobeItem;
  footwear?: WardrobeItem;
  outerwear?: WardrobeItem | null;
}

interface DBStructure {
  users: User[];
  wardrobeItems: WardrobeItem[];
  savedFavourites: SavedFavourite[];
}

const DB_FILE = path.join(process.cwd(), "database.json");

// Initial mock data mirroring schema.sql
const DEFAULT_DB: DBStructure = {
  users: [
    {
      id: 1,
      email: "cs.nidhisingh0510@gmail.com",
      passwordHash: crypto.createHash("sha256").update("password123").digest("hex"), // sha256 for simple robust verification
      role: "registered",
      stylePreference: "Minimalist",
    },
    {
      id: 2,
      email: "guest@trendfits.app",
      passwordHash: "",
      role: "guest",
      stylePreference: "Casual",
    },
  ],
  wardrobeItems: [
    {
      id: 1,
      userId: 1,
      name: "Classic White Linen Shirt",
      category: "top",
      color: "White",
      season: "summer",
      occasion: "casual",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      name: "Black Merino Wool Sweater",
      category: "top",
      color: "Black",
      season: "winter",
      occasion: "work",
      imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      userId: 1,
      name: "Silk Champagne Blouse",
      category: "top",
      color: "Champagne",
      season: "autumn",
      occasion: "party",
      imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      userId: 1,
      name: "Dry-Fit Athletic Tee",
      category: "top",
      color: "Slate Gray",
      season: "all_season",
      occasion: "workout",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      userId: 1,
      name: "Sand Tailored Chinos",
      category: "bottom",
      color: "Beige",
      season: "spring",
      occasion: "work",
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      userId: 1,
      name: "Dark Indigo Selvedge Jeans",
      category: "bottom",
      color: "Indigo",
      season: "all_season",
      occasion: "casual",
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 7,
      userId: 1,
      name: "Pleated Velvet Night Trouser",
      category: "bottom",
      color: "Black",
      season: "winter",
      occasion: "party",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 8,
      userId: 1,
      name: "Lightweight Breathable Shorts",
      category: "bottom",
      color: "Charcoal",
      season: "summer",
      occasion: "workout",
      imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 9,
      userId: 1,
      name: "Handmade Leather Loafers",
      category: "footwear",
      color: "Brown",
      season: "all_season",
      occasion: "work",
      imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 10,
      userId: 1,
      name: "Minimalist White Sneakers",
      category: "footwear",
      color: "White",
      season: "summer",
      occasion: "casual",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 11,
      userId: 1,
      name: "Suede Ankle Heeled Boots",
      category: "footwear",
      color: "Taupe",
      season: "autumn",
      occasion: "party",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 12,
      userId: 1,
      name: "High-Performance Trainer Shoes",
      category: "footwear",
      color: "Neon Gray",
      season: "all_season",
      occasion: "workout",
      imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 13,
      userId: 1,
      name: "Tailored Beige Trench Coat",
      category: "outerwear",
      color: "Beige",
      season: "autumn",
      occasion: "work",
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
    {
      id: 14,
      userId: 1,
      name: "Premium Black Leather Jacket",
      category: "outerwear",
      color: "Black",
      season: "winter",
      occasion: "party",
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400",
      createdAt: new Date().toISOString(),
    },
  ],
  savedFavourites: [],
};

export class TrendFitsDB {
  private static loadDB(): DBStructure {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(fileContent);
      } else {
        this.saveDB(DEFAULT_DB);
        return DEFAULT_DB;
      }
    } catch (e) {
      console.error("Failed to parse database file. Resetting to defaults.", e);
      return DEFAULT_DB;
    }
  }

  private static saveDB(db: DBStructure) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save database file.", e);
    }
  }

  // --- Users Operations ---
  public static getUsers(): User[] {
    return this.loadDB().users;
  }

  public static findUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public static findUserById(id: number): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public static createUser(email: string, passwordHash: string, role: "registered" | "guest" = "registered"): User {
    const db = this.loadDB();
    const newId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      email,
      passwordHash,
      role,
      stylePreference: "Casual",
    };
    db.users.push(newUser);
    
    // Seed some initial fashion items for any newly registered user to make the app interactive and delightful!
    const seedItems: Omit<WardrobeItem, "id" | "userId" | "createdAt">[] = [
      { name: "Cream Cotton Tee", category: "top", color: "Cream", season: "summer", occasion: "casual", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400" },
      { name: "Slate Wool Coat", category: "outerwear", color: "Slate", season: "winter", occasion: "work", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400" },
      { name: "Denim Trucker Jacket", category: "outerwear", color: "Blue", season: "spring", occasion: "casual", imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=400" },
      { name: "Slim Fit Black Jeans", category: "bottom", color: "Black", season: "all_season", occasion: "casual", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" },
      { name: "Suede Chelsea Boots", category: "footwear", color: "Taupe", season: "winter", occasion: "party", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" }
    ];

    let seedId = db.wardrobeItems.length > 0 ? Math.max(...db.wardrobeItems.map((i) => i.id)) + 1 : 1;
    for (const seed of seedItems) {
      db.wardrobeItems.push({
        ...seed,
        id: seedId++,
        userId: newId,
        createdAt: new Date().toISOString()
      });
    }

    this.saveDB(db);
    return newUser;
  }

  public static updateUserProfile(userId: number, stylePreference: string): User | undefined {
    const db = this.loadDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return undefined;
    db.users[userIndex].stylePreference = stylePreference;
    this.saveDB(db);
    return db.users[userIndex];
  }

  // --- Wardrobe Items Operations ---
  public static getWardrobeItems(userId: number): WardrobeItem[] {
    return this.loadDB().wardrobeItems.filter((item) => item.userId === userId);
  }

  public static getWardrobeItemById(id: number): WardrobeItem | undefined {
    return this.loadDB().wardrobeItems.find((item) => item.id === id);
  }

  public static createWardrobeItem(item: Omit<WardrobeItem, "id" | "createdAt">): WardrobeItem {
    const db = this.loadDB();
    const newId = db.wardrobeItems.length > 0 ? Math.max(...db.wardrobeItems.map((i) => i.id)) + 1 : 1;
    const newItem: WardrobeItem = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    db.wardrobeItems.push(newItem);
    this.saveDB(db);
    return newItem;
  }

  public static updateWardrobeItem(id: number, userId: number, updatedFields: Partial<Omit<WardrobeItem, "id" | "userId" | "createdAt">>): WardrobeItem | undefined {
    const db = this.loadDB();
    const itemIndex = db.wardrobeItems.findIndex((item) => item.id === id && item.userId === userId);
    if (itemIndex === -1) return undefined;

    db.wardrobeItems[itemIndex] = {
      ...db.wardrobeItems[itemIndex],
      ...updatedFields,
    };
    this.saveDB(db);
    return db.wardrobeItems[itemIndex];
  }

  public static deleteWardrobeItem(id: number, userId: number): boolean {
    const db = this.loadDB();
    const initialLength = db.wardrobeItems.length;
    db.wardrobeItems = db.wardrobeItems.filter((item) => !(item.id === id && item.userId === userId));
    
    // Also remove any saved favourite outfits that referenced this deleted wardrobe item to prevent integrity issues
    db.savedFavourites = db.savedFavourites.filter(
      (fav) => !(fav.userId === userId && (fav.topId === id || fav.bottomId === id || fav.footwearId === id || fav.outerwearId === id))
    );

    this.saveDB(db);
    return db.wardrobeItems.length < initialLength;
  }

  // --- Saved Favourites Operations ---
  public static getSavedFavourites(userId: number): SavedFavourite[] {
    const db = this.loadDB();
    const userFavs = db.savedFavourites.filter((fav) => fav.userId === userId);
    
    // Joint-populate wardrobe item records for clean UI consumption
    return userFavs.map((fav) => {
      return {
        ...fav,
        top: db.wardrobeItems.find((i) => i.id === fav.topId),
        bottom: db.wardrobeItems.find((i) => i.id === fav.bottomId),
        footwear: db.wardrobeItems.find((i) => i.id === fav.footwearId),
        outerwear: fav.outerwearId ? db.wardrobeItems.find((i) => i.id === fav.outerwearId) : null,
      };
    });
  }

  public static saveFavourite(favourite: Omit<SavedFavourite, "id" | "createdAt">): SavedFavourite {
    const db = this.loadDB();
    const newId = db.savedFavourites.length > 0 ? Math.max(...db.savedFavourites.map((f) => f.id)) + 1 : 1;
    const newFav: SavedFavourite = {
      ...favourite,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    db.savedFavourites.push(newFav);
    this.saveDB(db);

    // Return populated version
    return {
      ...newFav,
      top: db.wardrobeItems.find((i) => i.id === favourite.topId),
      bottom: db.wardrobeItems.find((i) => i.id === favourite.bottomId),
      footwear: db.wardrobeItems.find((i) => i.id === favourite.footwearId),
      outerwear: favourite.outerwearId ? db.wardrobeItems.find((i) => i.id === favourite.outerwearId) : null,
    };
  }

  public static deleteFavourite(id: number, userId: number): boolean {
    const db = this.loadDB();
    const initialLength = db.savedFavourites.length;
    db.savedFavourites = db.savedFavourites.filter((fav) => !(fav.id === id && fav.userId === userId));
    this.saveDB(db);
    return db.savedFavourites.length < initialLength;
  }
}
