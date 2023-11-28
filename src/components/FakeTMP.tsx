// Absolutely ~~abhorrent~~ wonderful regex made by Sylvie
const colorRegex =
  /(?:<(?:color=)?(?:#?(?<hex>[0-9a-fA-F]{6}|[0-9a-fA-F]{3}|[0-9a-fA-F]{8})|(?<name>\w+))>)/m;
const spriteRegex = /<sprite.*?>/m;

// https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/StyledText.html#supported-colors
const colorNames: Record<string, string> = {
  aqua: "#00ffffff",
  black: "#000000ff",
  blue: "#0000ffff",
  brown: "#a52a2aff",
  cyan: "#00ffffff",
  darkblue: "#0000a0ff",
  fuchsia: "#ff00ffff",
  green: "#008000ff",
  grey: "#808080ff",
  lightblue: "#add8e6ff",
  lime: "#00ff00ff",
  magenta: "#ff00ffff",
  maroon: "#800000ff",
  navy: "#000080ff",
  olive: "#808000ff",
  orange: "#ffa500ff",
  purple: "#800080ff",
  red: "#ff0000ff",
  silver: "#c0c0c0ff",
  teal: "#008080ff",
  white: "#ffffffff",
  yellow: "#ffff00ff"
};

function parse(temp: string): React.ReactNode[] {
  const spans: React.ReactNode[] = [];
  let text = temp;
  let currentColor: string | null = null;

  function add(str: string) {
    if (currentColor == null) {
      spans.push(
        <span className="tmp" key={spans.length}>
          {str}
        </span>
      );
    } else {
      spans.push(
        <span style={{ color: currentColor }} key={spans.length}>
          {str}
        </span>
      );
    }
  }

  while (text.length > 0) {
    const colorMatch = colorRegex.exec(text);
    if (colorMatch != null) {
      // if there's text before this, add it to the spans first
      if (colorMatch.index > 0) {
        const chunk = text.slice(0, colorMatch.index);
        add(chunk);
        text = text.slice(colorMatch.index);
        continue;
      }

      // if there's a color, add it to the spans
      if (colorMatch.groups?.hex != null) {
        const hex = colorMatch.groups.hex;
        currentColor = `#${hex}`;
      }

      if (colorMatch.groups?.name != null) {
        currentColor = colorNames[colorMatch.groups.name];
      }

      text = text.slice(colorMatch[0].length);
      continue;
    }

    const spriteMatch = spriteRegex.exec(text);
    if (spriteMatch != null) {
      // Just strip sprite matches
      if (spriteMatch.index > 0) {
        const chunk = text.slice(0, spriteMatch.index);
        add(chunk);
        text = text.slice(spriteMatch.index);
        continue;
      }

      text = text.slice(spriteMatch[0].length);
      continue;
    }

    add(text);
    text = "";
  }

  return spans;
}

export default function FakeTMP({ text }: { text: string }) {
  const spans = parse(text);
  return <span>{spans}</span>;
}
