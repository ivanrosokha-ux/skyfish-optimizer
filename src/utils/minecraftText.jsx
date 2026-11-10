const COLOR_MAP = {
  0: '#000000',
  1: '#0000AA',
  2: '#00AA00',
  3: '#00AAAA',
  4: '#AA0000',
  5: '#AA00AA',
  6: '#FFAA00',
  7: '#AAAAAA',
  8: '#555555',
  9: '#5555FF',
  a: '#55FF55',
  b: '#55FFFF',
  c: '#FF5555',
  d: '#FF55FF',
  e: '#FFFF55',
  f: '#FFFFFF',
};

/**
 * Parse a Minecraft formatted string (§codes) into React spans
 */
export function renderMinecraftText(text) {
  if (!text) return null;
  const str = String(text);
  if (!str.includes('§')) return str;

  const parts = [];
  const regex = /§([0-9a-fk-or])/gi;
  let currentColor = '#FFFFFF';
  let isBold = false;
  let isItalic = false;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      const chunk = str.substring(lastIndex, match.index);
      if (chunk) {
        parts.push(
          <span
            key={parts.length}
            style={{
              color: currentColor,
              fontWeight: isBold ? '700' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
            }}
          >
            {chunk}
          </span>
        );
      }
    }

    const code = match[1].toLowerCase();
    if (COLOR_MAP[code]) {
      currentColor = COLOR_MAP[code];
      isBold = false;
      isItalic = false;
    } else if (code === 'l') {
      isBold = true;
    } else if (code === 'o') {
      isItalic = true;
    } else if (code === 'r') {
      currentColor = '#FFFFFF';
      isBold = false;
      isItalic = false;
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    const chunk = str.substring(lastIndex);
    parts.push(
      <span
        key={parts.length}
        style={{
          color: currentColor,
          fontWeight: isBold ? '700' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
        }}
      >
        {chunk}
      </span>
    );
  }

  return parts;
}
