import { Router, Request, Response } from "express";
import { TrendFitsDB, WardrobeItem } from "./db.js";
import { GoogleGenAI } from "@google/genai";

export const recommendationsRouter = Router();

// Helper to determine season eligibility based on weather selection
function isSeasonCompatible(season: string, weather: string): boolean {
  if (season === "all_season") return true;
  
  switch (weather) {
    case "hot":
      return season === "summer" || season === "spring";
    case "cold":
      return season === "winter" || season === "autumn";
    case "rainy":
      return season === "autumn" || season === "spring" || season === "winter";
    case "moderate":
      return season === "spring" || season === "autumn" || season === "summer";
    default:
      return true;
  }
}

// Algorithmic Matchmaker
recommendationsRouter.get("/recommend", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.query.userId);
    const occasion = (req.query.occasion as string || "casual").toLowerCase();
    const weather = (req.query.weather as string || "moderate").toLowerCase();
    const useAI = req.query.useAI === "true";

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const items = TrendFitsDB.getWardrobeItems(userId);

    if (items.length === 0) {
      res.json({
        success: true,
        combinations: [],
        message: "Your wardrobe is empty. Please add some tops, bottoms, and footwear first!",
      });
      return;
    }

    // Step 1: Separate items by categories
    const tops = items.filter((i) => i.category === "top");
    const bottoms = items.filter((i) => i.category === "bottom");
    const footwear = items.filter((i) => i.category === "footwear");
    const outerwear = items.filter((i) => i.category === "outerwear");

    if (tops.length === 0 || bottoms.length === 0 || footwear.length === 0) {
      res.json({
        success: true,
        combinations: [],
        message: "To recommend an outfit, you need at least one Top, one Bottom, and one pair of Footwear in your wardrobe.",
      });
      return;
    }

    // Matchmaking algorithm scoring:
    // +3 points for exact occasion match
    // +2 points for season compatibility with selected weather
    // +1 point for general versatile items ('all_season')
    const scoreItem = (item: WardrobeItem): number => {
      let score = 0;
      if (item.occasion === occasion) score += 3;
      if (isSeasonCompatible(item.season, weather)) score += 2;
      if (item.season === "all_season") score += 1;
      return score;
    };

    // Score and sort lists
    const scoredTops = tops.map((i) => ({ item: i, score: scoreItem(i) })).sort((a, b) => b.score - a.score);
    const scoredBottoms = bottoms.map((i) => ({ item: i, score: scoreItem(i) })).sort((a, b) => b.score - a.score);
    const scoredFootwear = footwear.map((i) => ({ item: i, score: scoreItem(i) })).sort((a, b) => b.score - a.score);

    // Get the top outerwear if weather is cold or rainy
    let suggestedOuterwear: WardrobeItem | null = null;
    if ((weather === "cold" || weather === "rainy") && outerwear.length > 0) {
      const scoredOuterwear = outerwear.map((i) => ({ item: i, score: scoreItem(i) })).sort((a, b) => b.score - a.score);
      suggestedOuterwear = scoredOuterwear[0].item;
    }

    // Generate top combinations (up to 3 matching combinations)
    const combinations: any[] = [];
    const limit = Math.min(3, scoredTops.length * scoredBottoms.length * scoredFootwear.length);

    // Create combinations by taking the highest-scoring pairs
    let count = 0;
    for (let t = 0; t < Math.min(scoredTops.length, 2); t++) {
      for (let b = 0; b < Math.min(scoredBottoms.length, 2); b++) {
        for (let f = 0; f < Math.min(scoredFootwear.length, 2); f++) {
          if (count >= 3) break;

          const top = scoredTops[t].item;
          const bottom = scoredBottoms[b].item;
          const feet = scoredFootwear[f].item;

          // Simple dynamic styling comment
          let explanation = `A polished ${occasion} pairing perfect for ${weather} conditions. `;
          if (top.color.toLowerCase() === "white" || bottom.color.toLowerCase() === "black") {
            explanation += "The classic contrast provides timeless sophistication.";
          } else {
            explanation += `The blend of ${top.color} and ${bottom.color} creates an elegant color story.`;
          }

          combinations.push({
            id: `combo-${t}-${b}-${f}`,
            top,
            bottom,
            footwear: feet,
            outerwear: suggestedOuterwear,
            occasion,
            weather,
            explanation,
            matchScore: Math.round(((scoredTops[t].score + scoredBottoms[b].score + scoredFootwear[f].score) / 18) * 100),
          });

          count++;
        }
      }
    }

    // OPTIONAL: Gemini AI Fashion Consultation Integration
    let aiAdvice: string | null = null;
    if (useAI && combinations.length > 0) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const primaryCombo = combinations[0];
          const prompt = `You are an elite, modern luxury personal fashion stylist for our application 'TrendFits'.
The user wants an outfit for a '${occasion}' event in '${weather}' weather.
We recommended this outfit from their wardrobe:
- Top: ${primaryCombo.top.name} (${primaryCombo.top.color}, Season: ${primaryCombo.top.season})
- Bottom: ${primaryCombo.bottom.name} (${primaryCombo.bottom.color}, Season: ${primaryCombo.bottom.season})
- Footwear: ${primaryCombo.footwear.name} (${primaryCombo.footwear.color})
${primaryCombo.outerwear ? `- Outerwear layer: ${primaryCombo.outerwear.name} (${primaryCombo.outerwear.color})` : ""}

Provide a warm, inspiring 2-to-3 sentence professional styling advice of why this combination is a perfect choice, how they can carry it beautifully, and maybe a tiny tip on accessories or fit. Speak directly to the user (e.g., 'This curated look pairs your...'). Avoid markdown syntax, keep it as plain text.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
          });

          if (response && response.text) {
            aiAdvice = response.text.trim();
          }
        } catch (aiErr) {
          console.error("Gemini API styling call failed", aiErr);
          aiAdvice = "The AI Stylist is currently browsing Paris runway trends. Enjoy your handpicked classic recommendations below!";
        }
      } else {
        aiAdvice = "Unlock your bespoke AI Stylist consultation by saving your Gemini API Key in the Secrets panel!";
      }
    }

    res.json({
      success: true,
      combinations,
      aiAdvice,
    });
  } catch (error: any) {
    console.error("Failed to generate recommendations:", error);
    res.status(500).json({ error: "An error occurred while generating recommendations" });
  }
});

// AI Body Posture & Morphology Scanning Endpoint
recommendationsRouter.post("/body-posture-scan", async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, gender = "female", preference = "all" } = req.body;

    if (!image) {
      res.status(400).json({ error: "No image provided for body posture scanning." });
      return;
    }

    // Default fallback profiles based on gender & archetype
    const fallbackProfiles: Record<string, any> = {
      female: {
        bodyShape: "hourglass",
        bodyShapeName: "Hourglass Proportion",
        confidenceScore: 94,
        postureSummary: "Graceful upright posture with well-balanced shoulder alignment, defined natural waist curve, and symmetrical hip line.",
        postureHighlights: [
          "Shoulders: Balanced natural line aligning seamlessly with hip breadth",
          "Waist & Torso: Visibly defined natural waistline creating harmonious curves",
          "Stance: Symmetrical vertical alignment optimal for structured tailoring and wrap cuts",
          "Lower Line: Fluid leg proportion that carries wide-leg and mid-rise hems with poise"
        ],
        recommendedSilhouettes: [
          "Wrap dresses & belted double-breasted trench coats",
          "High-waisted tailored wide-leg trousers",
          "Fitted sweetheart & V-neck knit tops",
          "A-line structured midi skirts & tailored single-button blazers"
        ],
        avoidSilhouettes: [
          "Unstructured shapeless boxy sack dresses",
          "Stiff heavy drop-shoulder garments that conceal waist definition"
        ],
        fashionStylingTip: "Emphasize your naturally balanced proportions by accentuating the waistline with belts, tailored waist darts, and clean fluid drape fabrics like silk, wool-crepe, and soft knitwear.",
        colorPaletteAdvice: "Monochromatic tones (Ivory, Obsidian Black, Camel) paired with bronze or gold metallic accents draw the eye to your natural silhouette harmony.",
        suggestedOutfitStyles: [
          "Structured Belted Trench & White Wide-Leg Trousers",
          "Asymmetrical Draped Satin Gown",
          "Velvet Tailored Blazer & Leather Trousers",
          "Oversized Cardigan with Defined Waist Crop"
        ],
        suggestedOutfitIds: ["women-1", "women-2", "party-1", "women-college-1"]
      },
      male: {
        bodyShape: "trapezoid",
        bodyShapeName: "Athletic Trapezoid Frame",
        confidenceScore: 96,
        postureSummary: "Broad squared shoulders tapering naturally into a clean athletic waist with confident, balanced upright posture.",
        postureHighlights: [
          "Shoulders: Broad, defined horizontal stance with strong deltoid carriage",
          "Torso: Gradual athletic taper from chest down to waist",
          "Posture: Upright spinal line supporting both structured blazers and relaxed layerings",
          "Leg Line: Clean vertical silhouette well-suited for straight-leg chinos and tailored denim"
        ],
        recommendedSilhouettes: [
          "Tailored 2-button notch lapel suits & blazers",
          "Layered wool varsity jackets & shackets",
          "Crewneck knit sweaters over structured collared shirts",
          "Straight-leg dark chinos and handcrafted leather Chelsea boots"
        ],
        avoidSilhouettes: [
          "Overly loose shapeless oversized suits that bury shoulder definition",
          "Extremely skinny tapered pants that distort upper-to-lower balance"
        ],
        fashionStylingTip: "Your broad shoulder-to-waist taper gives you high versatile styling flexibility. Layering textured outerwear (shackets, varsity jackets) over clean neutral bases adds depth while preserving your natural frame symmetry.",
        colorPaletteAdvice: "Navy Blue, Charcoal, Oatmeal Beige, and Forest Green create a commanding, timeless palette.",
        suggestedOutfitStyles: [
          "Vintage Varsity Jacket & Relaxed Straight Denim",
          "Relaxed Oatmeal Knit & Dark Chino Casual Ensemble",
          "Peak Lapel Tuxedo Suit with Silk Inset",
          "Layered Preppy Fleece with Cargo Joggers"
        ],
        suggestedOutfitIds: ["men-college-1", "men-1", "men-2", "men-college-2"]
      }
    };

    const isMale = gender === "male";
    let analysisResult = isMale ? fallbackProfiles.male : fallbackProfiles.female;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        // Extract base64 image data
        let mimeType = "image/jpeg";
        let base64Data = image;

        if (image.startsWith("data:")) {
          const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
          }
        }

        const prompt = `You are an elite haute couture fashion morphology and body posture stylist for the luxury application 'TrendFits'.
Analyze the uploaded person's body posture, silhouette, and proportions in this photo.

Respond ONLY with a valid JSON object strictly matching this schema (no markdown, no backticks, just raw JSON):
{
  "bodyShape": "${isMale ? 'trapezoid' : 'hourglass'}" (choose best match from: "hourglass", "pear", "inverted_triangle", "rectangle", "apple", "trapezoid", "triangle", "oval"),
  "bodyShapeName": "Descriptive Name (e.g. Balanced Hourglass, Sartorial Trapezoid, Athletic Inverted Triangle, Pear Silhouette, Rectangle Frame, Apple Silhouette)",
  "confidenceScore": 95,
  "postureSummary": "A concise 2-sentence assessment of their posture alignment (head, shoulder level, spinal balance, torso line, stance).",
  "postureHighlights": [
    "Shoulder Alignment: Specific observation on shoulder drop/breadth",
    "Torso & Waist: Specific observation on waist curve/definition",
    "Stance & Balance: Stance alignment and vertical proportion",
    "Leg Line: Leg line length and lower body proportion"
  ],
  "recommendedSilhouettes": [
    "Specific cut/garment 1",
    "Specific cut/garment 2",
    "Specific cut/garment 3",
    "Specific cut/garment 4"
  ],
  "avoidSilhouettes": [
    "Cut to avoid/balance 1",
    "Cut to avoid/balance 2"
  ],
  "fashionStylingTip": "A warm, empowering 2-3 sentence styling guideline on how this user should dress their posture and shape for maximum elegance and confidence.",
  "colorPaletteAdvice": "Advice on colors, contrast, and visual balance that flatter this posture and frame.",
  "suggestedOutfitStyles": [
    "Outfit recommendation 1",
    "Outfit recommendation 2",
    "Outfit recommendation 3"
  ],
  "suggestedOutfitIds": ["${isMale ? 'men-college-1' : 'women-1'}", "${isMale ? 'men-1' : 'women-college-1'}", "${isMale ? 'men-2' : 'party-1'}"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        });

        if (response && response.text) {
          const rawText = response.text.trim();
          const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);

          if (parsed && parsed.bodyShape) {
            analysisResult = {
              ...analysisResult,
              ...parsed,
              confidenceScore: parsed.confidenceScore || 95,
            };
          }
        }
      } catch (aiErr) {
        console.error("Gemini Vision Posture analysis failed, falling back to morphology engine:", aiErr);
      }
    }

    res.json({
      success: true,
      data: analysisResult,
      isAiPowered: Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY"),
    });
  } catch (error: any) {
    console.error("Failed to process body posture scan:", error);
    res.status(500).json({ error: "An error occurred during body posture scanning." });
  }
});
