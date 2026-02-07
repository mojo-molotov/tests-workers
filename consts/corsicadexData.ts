const SPRITES_URL =
  "https://github.com/mojo-molotov/igoristan/blob/main/assets/images/corsicadex";
const SOUNDS_URL =
  "https://github.com/mojo-molotov/igoristan/blob/main/assets/sounds/corsicadex";

export const corsicaDexData = [
  {
    id: 1,
    name: "pietra",
    types: [{ type: { name: "drink" } }, { type: { name: "dessert" } }],
    height: 2,
    weight: 3,
    sprites: {
      front_default: `${SPRITES_URL}/pietra.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/pietra.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/pietra.mp3?raw=true`,
    },
  },
  {
    id: 2,
    name: "figatellu",
    types: [{ type: { name: "charcuterie" } }],
    height: 2,
    weight: 3,
    sprites: {
      front_default: `${SPRITES_URL}/figatellu.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/figatellu.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/figatellu.mp3?raw=true`,
    },
  },
  {
    id: 3,
    name: "coppa",
    types: [{ type: { name: "charcuterie" } }],
    height: 3,
    weight: 4,
    sprites: {
      front_default: `${SPRITES_URL}/coppa.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/coppa.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/coppa.mp3?raw=true`,
    },
  },
  {
    id: 4,
    name: "donkey-sausage",
    types: [{ type: { name: "siciliacchia di merda" } }],
    height: 2,
    weight: 3,
    sprites: {
      front_default: `${SPRITES_URL}/donkey-sausage.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/donkey-sausage.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/donkey-sausage.mp3?raw=true`,
    },
  },
  {
    id: 5,
    name: "casu-martzu",
    types: [{ type: { name: "cheese" } }, { type: { name: "bug" } }],
    height: 1,
    weight: 5,
    sprites: {
      front_default: `${SPRITES_URL}/casu-martzu.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/casu-martzu.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/casu-martzu.mp3?raw=true`,
    },
  },
  {
    id: 6,
    name: "castagna",
    types: [{ type: { name: "grass" } }],
    height: 1,
    weight: 1,
    sprites: {
      front_default: `${SPRITES_URL}/castagna.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/castagna.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/castagna.mp3?raw=true`,
    },
  },
  {
    id: 7,
    name: "fiadone",
    types: [{ type: { name: "dessert" } }],
    height: 1,
    weight: 2,
    sprites: {
      front_default: `${SPRITES_URL}/fiadone.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/fiadone.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/fiadone.mp3?raw=true`,
    },
  },
  {
    id: 8,
    name: "prisuttu",
    types: [{ type: { name: "charcuterie" } }],
    height: 8,
    weight: 80,
    sprites: {
      front_default: `${SPRITES_URL}/prisuttu.png?raw=true`,
      other: {
        "official-artwork": {
          front_default: `${SPRITES_URL}/prisuttu.png?raw=true`,
        },
      },
    },
    cries: {
      latest: `${SOUNDS_URL}/prisuttu.mp3?raw=true`,
    },
  },
] as const;
