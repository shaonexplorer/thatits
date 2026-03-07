const DIFFICULTY_TONES = {
  yellow: {
    label: "Yellow • Easy",
    pill: "bg-[#f6dd63] text-[#66490a]",
    panel: "border-[#f1df87] bg-[#fff7d2]",
  },
  green: {
    label: "Green • Moderate",
    pill: "bg-[#b9e397] text-[#1f5f2f]",
    panel: "border-[#b6db9a] bg-[#effde6]",
  },
  blue: {
    label: "Blue • Hard",
    pill: "bg-[#bcd3ff] text-[#18408b]",
    panel: "border-[#b8cbed] bg-[#ebf2ff]",
  },
  purple: {
    label: "Purple • Tricky",
    pill: "bg-[#ddc0ff] text-[#552a87]",
    panel: "border-[#d8baf5] bg-[#f6edff]",
  },
};

const PUZZLE_LIBRARY = [
  {
    id: "clinic-essentials",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "routine-basics",
        category: "Core Skincare Actions",
        difficulty: "yellow",
        words: ["Cleanse", "Tone", "Treat", "Moisturize"],
      },
      {
        id: "sun-shield",
        category: "Sun Protection Terms",
        difficulty: "green",
        words: ["SPF", "Broad", "Mineral", "Reapply"],
      },
      {
        id: "texture-goals",
        category: "Desired Skin Finish",
        difficulty: "blue",
        words: ["Dewy", "Glass", "Matte", "Velvet"],
      },
      {
        id: "ingredient-stars",
        category: "Active Ingredient Families",
        difficulty: "purple",
        words: ["Retinol", "Peptide", "Niacinamide", "Ceramide"],
      },
    ],
  },
  {
    id: "grooming-focus",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "hair-shape",
        category: "Hair Styling Verbs",
        difficulty: "yellow",
        words: ["Part", "Curl", "Smooth", "Set"],
      },
      {
        id: "facial-zones",
        category: "Face Areas",
        difficulty: "green",
        words: ["Cheek", "Temple", "Jawline", "Forehead"],
      },
      {
        id: "spa-tools",
        category: "At-Home Tools",
        difficulty: "blue",
        words: ["Roller", "GuaSha", "Steamer", "Brush"],
      },
      {
        id: "fragrance-notes",
        category: "Perfume Notes",
        difficulty: "purple",
        words: ["Citrus", "Musk", "Amber", "Vanilla"],
      },
    ],
  },
  {
    id: "beauty-rhythm",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "morning-routine",
        category: "AM Routine Steps",
        difficulty: "yellow",
        words: ["Rinse", "Serum", "Cream", "Sunscreen"],
      },
      {
        id: "night-routine",
        category: "PM Routine Steps",
        difficulty: "green",
        words: ["Cleanser", "Essence", "Retinoid", "Mask"],
      },
      {
        id: "problem-areas",
        category: "Common Concerns",
        difficulty: "blue",
        words: ["Dryness", "Breakout", "Redness", "Texture"],
      },
      {
        id: "finish-styles",
        category: "Makeup Finish Styles",
        difficulty: "purple",
        words: ["Satin", "Airbrush", "Luminous", "SoftFocus"],
      },
    ],
  },
  {
    id: "clinic-language",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "facial-motions",
        category: "Massage Motions",
        difficulty: "yellow",
        words: ["Lift", "Press", "Glide", "Tap"],
      },
      {
        id: "hydration-cues",
        category: "Hydration Clues",
        difficulty: "green",
        words: ["Plump", "Supple", "Bounce", "Comfort"],
      },
      {
        id: "formula-textures",
        category: "Product Textures",
        difficulty: "blue",
        words: ["Gel", "Milk", "Balm", "Oil"],
      },
      {
        id: "premium-labels",
        category: "Luxury Label Terms",
        difficulty: "purple",
        words: ["Reserve", "Maison", "Couture", "Atelier"],
      },
    ],
  },
  {
    id: "daily-vanity",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "mirror-counter",
        category: "Vanity Essentials",
        difficulty: "yellow",
        words: ["Mirror", "Tray", "Brushes", "Cotton"],
      },
      {
        id: "haircare-cycle",
        category: "Haircare Routine",
        difficulty: "green",
        words: ["Shampoo", "Conditioner", "LeaveIn", "Serum"],
      },
      {
        id: "complexion-words",
        category: "Complexion Descriptors",
        difficulty: "blue",
        words: ["Even", "Bright", "Smooth", "Clear"],
      },
      {
        id: "spa-aromas",
        category: "Spa Aroma Notes",
        difficulty: "purple",
        words: ["Rose", "Jasmine", "Sandalwood", "Lavender"],
      },
    ],
  },
  {
    id: "signature-glow",
    title: "Talula's Daily Exam",
    subtitle: "Find four connected groups of beauty terms.",
    groups: [
      {
        id: "brow-work",
        category: "Brow Grooming Verbs",
        difficulty: "yellow",
        words: ["Brush", "Fill", "Shape", "Set"],
      },
      {
        id: "lips-focus",
        category: "Lip Care Terms",
        difficulty: "green",
        words: ["Scrub", "Balm", "Tint", "Gloss"],
      },
      {
        id: "clinic-benefits",
        category: "Treatment Benefits",
        difficulty: "blue",
        words: ["Firming", "Calming", "Clarifying", "Smoothing"],
      },
      {
        id: "editorial-looks",
        category: "Editorial Beauty Looks",
        difficulty: "purple",
        words: ["Monochrome", "Graphic", "BarelyThere", "Chrome"],
      },
    ],
  },
];

const DAILY_EXAM_STORAGE_KEY = "taltula-daily-connections";
const EXAM_RESET_INTERVAL_MINUTES = 5;
const EXAM_RESET_INTERVAL_MS = EXAM_RESET_INTERVAL_MINUTES * 60 * 1000;

const clampNumber = (value, min, max) => Math.max(min, Math.min(value, max));

const hashSeed = (input) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return hash >>> 0;
};

const seededRng = (seedValue) => {
  let state = seedValue;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let temp = Math.imul(state ^ (state >>> 15), 1 | state);
    temp = (temp + Math.imul(temp ^ (temp >>> 7), 61 | temp)) ^ temp;
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
  };
};

const seededShuffle = (items, seedText) => {
  const next = [...items];
  const random = seededRng(hashSeed(seedText));

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const getExamCycleIndex = (date) =>
  Math.floor(date.getTime() / EXAM_RESET_INTERVAL_MS);

export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getExamCycleKey = (date = new Date()) =>
  `exam-${getExamCycleIndex(date)}`;

export const getMillisecondsUntilNextExamReset = (date = new Date()) => {
  const elapsedInCycle = date.getTime() % EXAM_RESET_INTERVAL_MS;
  if (elapsedInCycle === 0) {
    return EXAM_RESET_INTERVAL_MS;
  }
  return EXAM_RESET_INTERVAL_MS - elapsedInCycle;
};

export const formatExamCountdown = (milliseconds) => {
  const safeValue = Math.max(0, milliseconds);
  const totalSeconds = Math.ceil(safeValue / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const getDailyPuzzle = (date = new Date()) => {
  const dateKey = getExamCycleKey(date);
  const puzzleIndex = getExamCycleIndex(date) % PUZZLE_LIBRARY.length;
  const sourcePuzzle = PUZZLE_LIBRARY[puzzleIndex];

  const groups = sourcePuzzle.groups.map((group, groupIndex) => {
    const safeDifficulty = DIFFICULTY_TONES[group.difficulty]
      ? group.difficulty
      : "yellow";
    const groupId = group.id ?? `${sourcePuzzle.id}-group-${groupIndex + 1}`;

    return {
      ...group,
      id: groupId,
      difficulty: safeDifficulty,
      words: group.words.map((word) => String(word).toUpperCase()),
    };
  });

  const allWords = groups.flatMap((group) =>
    group.words.map((word, wordIndex) => ({
      id: `${group.id}-${slugify(word)}-${wordIndex + 1}`,
      label: word,
      groupId: group.id,
    })),
  );

  return {
    ...sourcePuzzle,
    dateKey,
    groups,
    words: seededShuffle(allWords, `${dateKey}-${sourcePuzzle.id}`),
  };
};

export const createFreshGameState = (mistakesAllowed = 4) => ({
  selectedWordIds: [],
  solvedGroupIds: [],
  attemptsUsed: 0,
  mistakesRemaining: mistakesAllowed,
  status: "playing",
  lastOutcome: null,
});

export const getDifficultyTone = (difficulty) =>
  DIFFICULTY_TONES[difficulty] ?? DIFFICULTY_TONES.yellow;

export const loadStoredGameState = (dateKey, puzzleId, mistakesAllowed = 4) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DAILY_EXAM_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const storeId = `${dateKey}:${puzzleId}`;
    const entry = parsed?.[storeId];
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const status =
      entry.status === "won" || entry.status === "lost" ? entry.status : "playing";

    return {
      selectedWordIds: Array.isArray(entry.selectedWordIds)
        ? entry.selectedWordIds
        : [],
      solvedGroupIds: Array.isArray(entry.solvedGroupIds)
        ? entry.solvedGroupIds
        : [],
      attemptsUsed: clampNumber(Number(entry.attemptsUsed) || 0, 0, 64),
      mistakesRemaining: clampNumber(
        Number(entry.mistakesRemaining) || 0,
        0,
        mistakesAllowed,
      ),
      status,
      lastOutcome:
        entry.lastOutcome === "correct" || entry.lastOutcome === "incorrect"
          ? entry.lastOutcome
          : null,
    };
  } catch {
    return null;
  }
};

export const saveStoredGameState = (dateKey, puzzleId, state) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const raw = window.localStorage.getItem(DAILY_EXAM_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const nextStore = {
      ...(parsed && typeof parsed === "object" ? parsed : {}),
      [`${dateKey}:${puzzleId}`]: {
        selectedWordIds: state.selectedWordIds,
        solvedGroupIds: state.solvedGroupIds,
        attemptsUsed: state.attemptsUsed,
        mistakesRemaining: state.mistakesRemaining,
        status: state.status,
        lastOutcome: state.lastOutcome,
      },
    };

    window.localStorage.setItem(
      DAILY_EXAM_STORAGE_KEY,
      JSON.stringify(nextStore),
    );
  } catch {
    // Ignore storage write failures in private mode.
  }
};
