import { Router, Request, Response } from "express";
import crypto from "crypto";
import { TrendFitsDB } from "./db.js";

export const authRouter = Router();

// Hashing helper using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// 1. User Registration
authRouter.post("/register", (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = TrendFitsDB.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    const passwordHash = hashPassword(password);
    const newUser = TrendFitsDB.createUser(email, passwordHash, "registered");

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        stylePreference: newUser.stylePreference,
      },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 2. User Login
authRouter.post("/login", (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = TrendFitsDB.findUserByEmail(email);
    if (!user || user.role === "guest") {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        stylePreference: user.stylePreference,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// 3. Guest Login
authRouter.post("/guest", (req: Request, res: Response): void => {
  try {
    // Return or find the standard guest user
    let guestUser = TrendFitsDB.findUserByEmail("guest@trendfits.app");
    if (!guestUser) {
      guestUser = TrendFitsDB.createUser("guest@trendfits.app", "", "guest");
    }

    res.json({
      success: true,
      user: {
        id: guestUser.id,
        email: guestUser.email,
        role: guestUser.role,
        stylePreference: guestUser.stylePreference,
      },
    });
  } catch (err: any) {
    console.error("Guest access error:", err);
    res.status(500).json({ error: "Failed to access guest mode" });
  }
});

// 4. Update Profile Preferences
authRouter.post("/profile", (req: Request, res: Response): void => {
  try {
    const { userId, stylePreference } = req.body;

    if (!userId || !stylePreference) {
      res.status(400).json({ error: "User ID and style preference are required" });
      return;
    }

    const updatedUser = TrendFitsDB.updateUserProfile(Number(userId), stylePreference);
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        stylePreference: updatedUser.stylePreference,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});
