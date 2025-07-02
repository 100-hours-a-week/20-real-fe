export function stringToColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360; // 다양한 색상 분포를 위해 hue만 hash로
  const s = 70; // 적당한 채도
  const l = 80; // 밝은 명도 (밝은 배경)

  return `hsl(${h}, ${s}%, ${l}%)`;
}
