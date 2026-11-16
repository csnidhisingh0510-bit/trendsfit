import { Router, Request, Response } from "express";
import { TrendFitsDB, WardrobeItem } from "./db.js";

export const wardrobeRouter = Router();

// 1. Get User Wardrobe
wardrobeRouter.get("/items", (req: Request, res: Response): void => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const items = TrendFitsDB.getWardrobeItems(userId);
    res.json({ success: true, items });
  } catch (err: any) {
    console.error("Fetch wardrobe error:", err);
    res.status(500).json({ error: "Failed to fetch wardrobe items" });
  }
});

// 2. Add Wardrobe Item
wardrobeRouter.post("/items", (req: Request, res: Response): void => {
  try {
    const { userId, name, category, color, season, occasion, imageUrl } = req.body;

    if (!userId || !name || !category || !color || !season || !occasion || !imageUrl) {
      res.status(400).json({ error: "All fields are required to add a wardrobe item" });
      return;
    }

    const newItem = TrendFitsDB.createWardrobeItem({
      userId: Number(userId),
      name,
      category,
      color,
      season,
      occasion,
      imageUrl,
    });

    res.status(201).json({ success: true, item: newItem });
  } catch (err: any) {
    console.error("Add wardrobe item error:", err);
    res.status(500).json({ error: "Failed to add wardrobe item" });
  }
});

// 3. Update Wardrobe Item
wardrobeRouter.put("/items/:id", (req: Request, res: Response): void => {
  try {
    const itemId = Number(req.params.id);
    const { userId, name, category, color, season, occasion, imageUrl } = req.body;

    if (!itemId || !userId) {
      res.status(400).json({ error: "Item ID and User ID are required" });
      return;
    }

    const updated = TrendFitsDB.updateWardrobeItem(itemId, Number(userId), {
      name,
      category,
      color,
      season,
      occasion,
      imageUrl,
    });

    if (!updated) {
      res.status(404).json({ error: "Wardrobe item not found or unauthorized" });
      return;
    }

    res.json({ success: true, item: updated });
  } catch (err: any) {
    console.error("Update wardrobe item error:", err);
    res.status(500).json({ error: "Failed to update wardrobe item" });
  }
});

// 4. Delete Wardrobe Item
wardrobeRouter.delete("/items/:id", (req: Request, res: Response): void => {
  try {
    const itemId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (!itemId || !userId) {
      res.status(400).json({ error: "Item ID and User ID are required" });
      return;
    }

    const deleted = TrendFitsDB.deleteWardrobeItem(itemId, userId);
    if (!deleted) {
      res.status(404).json({ error: "Wardrobe item not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err: any) {
    console.error("Delete wardrobe item error:", err);
    res.status(500).json({ error: "Failed to delete wardrobe item" });
  }
});

// 5. Get Saved Favourites
wardrobeRouter.get("/favourites", (req: Request, res: Response): void => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const favourites = TrendFitsDB.getSavedFavourites(userId);
    res.json({ success: true, favourites });
  } catch (err: any) {
    console.error("Fetch favourites error:", err);
    res.status(500).json({ error: "Failed to fetch saved favourites" });
  }
});

// 6. Save Favourite
wardrobeRouter.post("/favourites", (req: Request, res: Response): void => {
  try {
    const { userId, topId, bottomId, footwearId, outerwearId, occasion, weather } = req.body;

    if (!userId || !topId || !bottomId || !footwearId || !occasion || !weather) {
      res.status(400).json({ error: "Missing required combination elements" });
      return;
    }

    // Check if combination already exists in favourites to prevent duplicates
    const existing = TrendFitsDB.getSavedFavourites(Number(userId)).find(
      (f) =>
        f.topId === Number(topId) &&
        f.bottomId === Number(bottomId) &&
        f.footwearId === Number(footwearId) &&
        f.outerwearId === (outerwearId ? Number(outerwearId) : null) &&
        f.occasion === occasion &&
        f.weather === weather
    );

    if (existing) {
      res.json({ success: true, favourite: existing, message: "Combination is already saved!" });
      return;
    }

    const newFavourite = TrendFitsDB.saveFavourite({
      userId: Number(userId),
      topId: Number(topId),
      bottomId: Number(bottomId),
      footwearId: Number(footwearId),
      outerwearId: outerwearId ? Number(outerwearId) : null,
      occasion,
      weather,
    });

    res.status(201).json({ success: true, favourite: newFavourite });
  } catch (err: any) {
    console.error("Save favourite error:", err);
    res.status(500).json({ error: "Failed to save combination to favourites" });
  }
});

// 7. Remove Favourite
wardrobeRouter.delete("/favourites/:id", (req: Request, res: Response): void => {
  try {
    const favId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (!favId || !userId) {
      res.status(400).json({ error: "Favourite ID and User ID are required" });
      return;
    }

    const deleted = TrendFitsDB.deleteFavourite(favId, userId);
    if (!deleted) {
      res.status(404).json({ error: "Favourite not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Favourite deleted successfully" });
  } catch (err: any) {
    console.error("Delete favourite error:", err);
    res.status(500).json({ error: "Failed to delete favourite combination" });
  }
});
