import trenchWhiteTrousersImg from "../assets/images/trench_white_trousers_1784776431127.jpg";
import casualMenOutfitImg from "../assets/images/casual_men_outfit_1784776936521.jpg";
import tuxedoSuitMenImg from "../assets/images/tuxedo_suit_men_1784778077845.jpg";
import drapedSatinGownImg from "../assets/images/draped_satin_gown_1784778093472.jpg";
import chikankariAnarkaliImg from "../assets/images/chikankari_anarkali_1784778106446.jpg";
import velvetBlazerPantsImg from "../assets/images/velvet_blazer_pants_1784778835682.jpg";
import collegeStreetwearMenImg from "../assets/images/college_streetwear_men_1784779295873.jpg";
import collegeChicWomenImg from "../assets/images/college_chic_women_1784779310265.jpg";
import greySweatshirtSageCargoImg from "../assets/images/grey_sweatshirt_sage_cargo_1784779765584.jpg";
import midnightBlueGownImg from "../assets/images/midnight_blue_gown_1784780231453.jpg";
import brownDesignerWatchImg from "../assets/images/brown_designer_watch_1784782822655.jpg";
import preppyMenFleeceImg from "../assets/images/preppy_men_fleece_1784783500000_jpg_1784955100101.jpg";
import linenShirtMenImg from "../assets/images/linen_shirt_men_1784783600000_jpg_1784955122801.jpg";
import chelseaBootsImg from "../assets/images/chelsea_boots_1784783700000_jpg_1784955138760.jpg";
import satinWrapHeelsImg from "../assets/images/satin_wrap_heels_1784960433738.jpg";

export interface Outfit {
  id: string;
  name: string;
  brand: string;
  rating: number;
  price: number;
  category: "men" | "women" | "shoes" | "accessories" | "sports" | "party wear";
  occasions: ("party" | "office" | "college" | "wedding" | "vacation" | "date night")[];
  imageUrl: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  trending?: boolean;
  bodyShapes?: ("hourglass" | "rectangle" | "pear" | "inverted_triangle" | "apple" | "trapezoid" | "triangle" | "oval")[];
}

export const CURATED_OUTFITS: Outfit[] = [
  // Men
  {
    id: "men-college-1",
    name: "Vintage Varsity Jacket & Light Denim",
    brand: "Campus Culture",
    rating: 4.9,
    price: 165,
    category: "men",
    occasions: ["college", "vacation", "party"],
    imageUrl: collegeStreetwearMenImg,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Forest & Cream", hex: "#2D4A3E" },
      { name: "Navy & White", hex: "#1D283F" },
      { name: "Black & Charcoal", hex: "#1A1A1A" }
    ],
    description: "An iconic varsity street outfit featuring a wool-blend varsity jacket with contrast sleeves, plain white crewneck tee, relaxed straight-leg light denim jeans, and retro sneakers.",
    trending: true,
    bodyShapes: ["rectangle", "trapezoid", "inverted_triangle", "triangle"]
  },
  {
    id: "men-1",
    name: "Relaxed Knit & Chino Casual Ensemble",
    brand: "Aether Archive",
    rating: 4.9,
    price: 240,
    category: "men",
    occasions: ["college", "vacation", "date night"],
    imageUrl: casualMenOutfitImg,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal Beige", hex: "#E5DDC8" },
      { name: "Navy Blue", hex: "#1D283F" },
      { name: "Olive Green", hex: "#556B2F" }
    ],
    description: "An effortless casual outfit for men featuring a relaxed beige crewneck sweater over a white tee, paired with tailored dark chinos and box-fresh white leather sneakers.",
    trending: true,
    bodyShapes: ["trapezoid", "rectangle", "oval"]
  },
  {
    id: "men-college-2",
    name: "Preppy Layered Crewneck & Cargo Joggers",
    brand: "Aether Archive",
    rating: 4.8,
    price: 135,
    category: "men",
    occasions: ["college", "vacation"],
    imageUrl: preppyMenFleeceImg,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Heather Grey", hex: "#808080" },
      { name: "Washed Black", hex: "#2B2B2B" },
      { name: "Sage Green", hex: "#8A9A86" }
    ],
    description: "A comfortable yet sharp campus outfit featuring a heavyweight fleece sweatshirt layered over an oxford shirt, paired with slim cargo joggers and casual trainers.",
    bodyShapes: ["trapezoid", "inverted_triangle", "rectangle"]
  },
  {
    id: "men-2",
    name: "Sartorial Silk-Lined Tuxedo Suit",
    brand: "Savile Row Custom",
    rating: 5.0,
    price: 890,
    category: "men",
    occasions: ["wedding", "party"],
    imageUrl: tuxedoSuitMenImg,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Obsidian Black", hex: "#1A1A1A" },
      { name: "Midnight Navy", hex: "#1D283F" },
      { name: "Ivory White", hex: "#E1D9D1" }
    ],
    description: "An immaculate custom peak lapel blazer with structured shoulders, lined with pure midnight blue silk. Completed with tailored flat-front trousers.",
    trending: true,
    bodyShapes: ["trapezoid", "triangle", "oval", "rectangle"]
  },
  {
    id: "men-3",
    name: "Minimalist Linen Blend Shirt",
    brand: "Aether Archive",
    rating: 4.8,
    price: 185,
    category: "men",
    occasions: ["vacation", "college"],
    imageUrl: linenShirtMenImg,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#E5DDC8" },
      { name: "Charcoal", hex: "#1A1A1A" },
      { name: "Slate Blue", hex: "#4A607A" }
    ],
    description: "An effortless luxury casual shirt crafted from organic Italian linen, perfect for modern urban exploration. Features raw edge details and clean French seams.",
    bodyShapes: ["trapezoid", "inverted_triangle", "oval", "rectangle"]
  },

  // Women
  {
    id: "women-college-1",
    name: "Oversized Cream Cardigan & Wide-Leg Jeans",
    brand: "Campus Culture",
    rating: 4.9,
    price: 145,
    category: "women",
    occasions: ["college", "vacation", "date night"],
    imageUrl: collegeChicWomenImg,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream Oatmeal", hex: "#E5DDC8" },
      { name: "Soft Sage", hex: "#9CAF88" },
      { name: "Dusty Rose", hex: "#D8A7B1" }
    ],
    description: "The ultimate cozy campus aesthetic featuring an oversized chunky cream cable cardigan over a cropped white tank top, high-waisted wide-leg denim, and clean white sneakers.",
    trending: true,
    bodyShapes: ["hourglass", "pear", "rectangle", "inverted_triangle"]
  },
  {
    id: "women-college-2",
    name: "Cozy Grey Sweatshirt & Sage Cargo Pants",
    brand: "Campus Culture",
    rating: 4.9,
    price: 138,
    category: "women",
    occasions: ["college", "vacation", "party"],
    imageUrl: greySweatshirtSageCargoImg,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Heather Grey", hex: "#9E9E9E" },
      { name: "Sage Green", hex: "#87A987" },
      { name: "Chalk White", hex: "#F5F5F5" }
    ],
    description: "An ultra-stylish and comfortable college streetwear ensemble featuring a relaxed heather grey sweatshirt paired with high-waisted sage green cargo trousers and chunky retro sneakers.",
    trending: true,
    bodyShapes: ["inverted_triangle", "rectangle", "hourglass"]
  },
  {
    id: "women-1",
    name: "Structured Black Trench & White Trousers",
    brand: "Studio L'Artisan",
    rating: 4.9,
    price: 340,
    category: "women",
    occasions: ["office", "date night"],
    imageUrl: trenchWhiteTrousersImg,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black Onyx", hex: "#1A1A1A" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Tan Gabardine", hex: "#C5A880" }
    ],
    description: "An iconic monochrome street silhouette featuring a double-breasted black belted trench coat over a fitted turtleneck, paired with crisp high-waisted white wide-leg trousers.",
    trending: true,
    bodyShapes: ["hourglass", "pear", "apple", "rectangle"]
  },
  {
    id: "women-2",
    name: "Asymmetrical Draped Satin Gown",
    brand: "Atelier Mode",
    rating: 4.9,
    price: 720,
    category: "women",
    occasions: ["party", "wedding", "date night"],
    imageUrl: drapedSatinGownImg,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Cocoa Satin", hex: "#8B4513" },
      { name: "Bronze Dust", hex: "#AF905F" },
      { name: "Classic Black", hex: "#1A1A1A" }
    ],
    description: "Crafted from liquid heavy-weight satin, this stunning gown moves like water, emphasizing couture drape tailoring and an elegant sweeping silhouette.",
    trending: true,
    bodyShapes: ["hourglass", "pear", "inverted_triangle"]
  },
  {
    id: "women-3",
    name: "Georgette Floral Chikankari Anarkali",
    brand: "Aangan Weaver",
    rating: 4.8,
    price: 380,
    category: "women",
    occasions: ["wedding", "party"],
    imageUrl: chikankariAnarkaliImg,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Pastel Peach", hex: "#FFF8F2" },
      { name: "Warm Alabaster", hex: "#EBE3D5" },
      { name: "Gilded Wheat", hex: "#AF905F" }
    ],
    description: "Exquisite Lucknowi chikankari shadow work embroidered onto premium lightweight georgette, complete with beautiful tiered pleating.",
    bodyShapes: ["apple", "pear", "rectangle", "hourglass"]
  },

  // Shoes
  {
    id: "shoes-1",
    name: "Handcrafted Leather Chelsea Boots",
    brand: "Savile Row Custom",
    rating: 4.8,
    price: 240,
    category: "shoes",
    occasions: ["office", "date night", "college"],
    imageUrl: chelseaBootsImg,
    sizes: ["7", "8", "9", "10", "11"],
    colors: [
      { name: "Cognac Brown", hex: "#8B4513" },
      { name: "Stealth Black", hex: "#1A1A1A" }
    ],
    description: "Hand-painted Italian calf leather boots with breathable leather lining, custom elastic side gusset, and Goodyear welted leather sole.",
    bodyShapes: ["trapezoid", "rectangle", "hourglass", "pear", "inverted_triangle", "triangle", "oval", "apple"]
  },
  {
    id: "shoes-2",
    name: "Nouveau Satin Wrap Heels",
    brand: "Atelier Mode",
    rating: 4.9,
    price: 310,
    category: "shoes",
    occasions: ["party", "wedding", "date night"],
    imageUrl: satinWrapHeelsImg,
    sizes: ["5", "6", "7", "8", "9"],
    colors: [
      { name: "Nude Rose", hex: "#B68973" },
      { name: "Midnight Spark", hex: "#111111" }
    ],
    description: "Premium satin fabric wrapping with crystal embellishments. Includes memory foam cushioning for prolonged luxury event comfort.",
    bodyShapes: ["hourglass", "pear", "rectangle", "apple", "inverted_triangle"]
  },
  {
    id: "shoes-3",
    name: "Aerodynamic Knit Trainer",
    brand: "Apex Athletics",
    rating: 4.7,
    price: 160,
    category: "shoes",
    occasions: ["college", "vacation"],
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    sizes: ["8", "9", "10", "11"],
    colors: [
      { name: "Chalk", hex: "#FAF6F0" },
      { name: "Red Ember", hex: "#DC2626" }
    ],
    description: "Engineered knit sports upper with responsive shock absorption foam. Outfitted with high traction rubber pads.",
    bodyShapes: ["trapezoid", "rectangle", "oval", "triangle", "inverted_triangle", "hourglass", "pear", "apple"]
  },

  // Accessories
  {
    id: "acc-1",
    name: "Designer Bronze Chronograph Watch",
    brand: "Studio L'Artisan",
    rating: 4.9,
    price: 420,
    category: "accessories",
    occasions: ["office", "date night", "party", "college"],
    imageUrl: brownDesignerWatchImg,
    sizes: ["OS"],
    colors: [
      { name: "Bronze & Rose Gold", hex: "#8B5A2B" },
      { name: "Obsidian Black", hex: "#1A1A1A" }
    ],
    description: "An exceptional luxury chronograph wristwatch featuring a dark textured chocolate dial, rose gold indices and sub-dials, framed by a bronze brushed case and matching metal link bracelet strap.",
    trending: true,
    bodyShapes: ["trapezoid", "rectangle", "oval", "triangle", "inverted_triangle", "hourglass", "pear", "apple"]
  },
  {
    id: "acc-2",
    name: "Premium Pebbled Leather Belt & Wallet Set",
    brand: "Aether Archive",
    rating: 4.7,
    price: 150,
    category: "accessories",
    occasions: ["office", "college"],
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
    sizes: ["32", "34", "36", "38"],
    colors: [
      { name: "Tan", hex: "#C5A880" },
      { name: "Black Onyx", hex: "#1A1A1A" }
    ],
    description: "An matching pair of luxury belt and wallet, made from select pebbled leather. Features silver-tone polished solid alloy buckles.",
    bodyShapes: ["trapezoid", "rectangle", "oval", "triangle", "inverted_triangle", "hourglass", "pear", "apple"]
  },

  // Sports
  {
    id: "sports-1",
    name: "Seamless Thermal Tech Bodysuit",
    brand: "Apex Athletics",
    rating: 4.6,
    price: 125,
    category: "sports",
    occasions: ["vacation", "college"],
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Stealth Black", hex: "#1A1A1A" },
      { name: "Burnt Sienna", hex: "#8B4513" },
      { name: "Arctic Ice", hex: "#4A607A" }
    ],
    description: "High-compression, moisture-wicking aerodynamic technical suit featuring seamless thermal rib-knit panels for thermal regulation.",
    bodyShapes: ["hourglass", "inverted_triangle", "rectangle"]
  },
  {
    id: "sports-2",
    name: "Precision Aerostat Running Shell",
    brand: "Velo Lab",
    rating: 4.7,
    price: 190,
    category: "sports",
    occasions: ["vacation"],
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Chalk Matte", hex: "#FAF6F0" },
      { name: "Deep Obsidian", hex: "#1A1A1A" },
      { name: "Solar Bronze", hex: "#AF905F" }
    ],
    description: "Ultra-lightweight ripstop running shell engineered with laser-cut breathability vents, water-resistant finish, and micro-reflective elements.",
    bodyShapes: ["trapezoid", "rectangle", "oval", "triangle"]
  },

  // Party Wear
  {
    id: "party-1",
    name: "Tailored Black Velvet Blazer & Leather Pants",
    brand: "Vanguard Studio",
    rating: 4.9,
    price: 360,
    category: "party wear",
    occasions: ["party", "date night", "office", "college"],
    imageUrl: velvetBlazerPantsImg,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Jet Black Velvet", hex: "#1A1A1A" },
      { name: "Pure Silk White", hex: "#FFFFFF" }
    ],
    description: "A chic urban night-out ensemble featuring a tailored black velvet blazer over a relaxed silk white shirt, paired with sleek fitted leather trousers and layered gold jewelry.",
    trending: true,
    bodyShapes: ["hourglass", "rectangle", "inverted_triangle", "trapezoid"]
  },
  {
    id: "party-2",
    name: "Midnight Blue Shimmer Lurex Gown",
    brand: "Aura Paris",
    rating: 4.9,
    price: 490,
    category: "party wear",
    occasions: ["party", "date night", "wedding"],
    imageUrl: midnightBlueGownImg,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Midnight Blue Shimmer", hex: "#0D1B2A" },
      { name: "Champagne Gold", hex: "#D4AF37" },
      { name: "Sapphire Spark", hex: "#001F54" }
    ],
    description: "An exquisite long-sleeved midnight blue metallic lurex gown with subtle shimmer, tailored waist wrap detailing, and an elegant front leg slit. Complemented by gold accessories.",
    trending: true,
    bodyShapes: ["hourglass", "pear", "inverted_triangle", "apple"]
  }
];
