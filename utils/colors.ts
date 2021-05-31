type AvailableCSSVarColor =
  | "--sky-blue-crayola"
  | "--celeste"
  | "--mint-cream"
  | "--piggy-pink"
  | "--cotton-candy"
  | "--mountbatten-pink"
  | "--light-coral"
  | "--middle-blue-purple"
  | "--liberty"
  | "--cerise";

const COLORS = [
  "--sky-blue-crayola",
  "--celeste",
  "--mint-cream",
  "--piggy-pink",
  "--cotton-candy",
  "--mountbatten-pink",
  "--light-coral",
  "--middle-blue-purple",
  "--liberty",
  "--cerise",
] as const;

type CSSVarColorHex =
  | "#7bdff2"
  | "#b2f7ef"
  | "#eff7f6"
  | "#f7d6e0"
  | "#f2b5d4"
  | "#93748a"
  | "#ef767a"
  | "#7d7abc"
  | "#6457a6"
  | "#db2763";

const COLOR_HEXS = [
  "#7bdff2",
  "#b2f7ef",
  "#eff7f6",
  "#f7d6e0",
  "#f2b5d4",
  "#93748a",
  "#ef767a",
  "#7d7abc",
  "#6457a6",
  "#db2763",
] as const;

const colorToHexMap = new Map<AvailableCSSVarColor, CSSVarColorHex>(
  COLORS.map((color, idx) => [color, COLOR_HEXS[idx]])
);

export function getRandomCSSVarColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function getHexFromCSSVarColor(c: AvailableCSSVarColor) {
  return colorToHexMap.get(c) ?? getRandomCSSVarColor();
}

export function getCSSVarColorForString(id: string) {
  return COLORS[hashString(id) % COLORS.length];
}

function hashString(s: string): number {
  let hash = 0;

  if (s.length == 0) {
    return hash;
  }

  for (var i = 0; i < s.length; i++) {
    var char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}
