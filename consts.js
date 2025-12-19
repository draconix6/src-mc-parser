export const SRC_API_URL = "https://www.speedrun.com/api/v1/runs?game=j1npme6p&status=new&embed=category,level,players&orderby=submitted&max=200";

export const SHEET_NAMES = {
    RSG_116: "1.16+ RSG (sub 13s)",
    RSG: "Pre 1.16 RSG (top runs)",
    SSG: "SSG (top runs)",
    COOP: "Co-op (all)",
    GLITCHED_PEACEFUL: "Glitched/Peaceful (all)",
    AA: "AA (all)",
};

export const SEED_TYPES = {
  "Random Seed": "RSG",
  "Set Seed": "SSG",
}

export const GLITCHED_TYPES = {
  EXTERNAL: "External",
  INTERNAL: "Internal",
  GLITCHLESS: "Glitchless",
}

export const COOP_LABELS = {
  "2 Players": " Duos",
  "3 Players": " Trios",
  "4 Players": " Quads",
  "5-9 Players": " 5-9",
  "10+ Players": " 10+",
}

export const GLITCHLESS_CUTOFFS = {
  "RSG": {
    "Pre 1.8": [25 * 60, 23 * 60],
    "1.8": [25 * 60, 23 * 60],
    "1.9-1.12": [30 * 60, 25 * 60],
    "1.13-1.15": [20 * 60, 17 * 60],
    "1.16-1.19": [13 * 60, 10 * 60],
    "1.20+": [0, 0],
  },
  "SSG": {
    "Pre 1.8": [255, 255],
    "1.8": [210, 210],
    "1.9-1.12": [60, 60],
    "1.13-1.15": [165, 165],
    "1.16-1.19": [110, 110],
    "1.20+": [95, 95],
  },
};