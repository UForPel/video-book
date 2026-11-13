/** Parse SRT/WebVTT subtitle files without inserting their text as HTML. */
export function parseTimestamp(value) {
  if (typeof value !== "string") return null;
  // SRT: 00:00:01,250 / WebVTT: 00:01.250 or 00:00:01.250
  const time = value.trim().split(/\\s+/)[0].replace(",", ".");
  const parts = time.split(":");
  if (parts.length !== 2 && parts.length !== 3) return null;
  const secondsPart = parts.pop();
  const secondsMatch = secondsPart.match(/^(\\d{1,2})(?:\\.(\\d{1,3}))?$/);
  if (!secondsMatch || Number(secondsMatch[1]) > 59) return null;
  const minutesPart = parts.pop();
  if (!/^\\d{1,2}$/.test(minutesPart) || Number(minutesPart) > 59) return null;
  const hoursPart = parts.length ? parts.pop() : "0";
  if (!/^\\d+$/.test(hoursPart)) return null;
  const hours = Number(hoursPart);
  if (!Number.isSafeInteger(hours)) return null;
  const fraction = secondsMatch[2] ? Number((secondsMatch[2] + "00").slice(0, 3)) / 1000 : 0;
  const result = hours * 3600 + Number(minutesPart) * 60 + Number(secondsMatch[1]) + fraction;
  return Number.isFinite(result) ? result : null;
}

function decodeSubtitleEntities(value) {
  return value
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\\d+);/g, (_, code) => {
      const point = Number(code);
      return point <= 0x10ffff ? String.fromCodePoint(point) : "�";
    })
    .replace(/&#x([\\da-f]+);/gi, (_, code) => {
      const point = Number.parseInt(code, 16);
      return point <= 0x10ffff ? String.fromCodePoint(point) : "�";
    });
}

export function parseSubtitle(text) {
  if (typeof text !== "string" || !text.trim()) return [];
  const blocks = text.replace(/^\\uFEFF/, "").replace(/\\r/g, "").split(/\\n\\s*\\n/);
  const parsed = [];
  for (const block of blocks) {
    const lines = block.split("\\n").map(line => line.trim()).filter(Boolean);
    const timeIndex = lines.findIndex(line => line.includes("-->"));
    if (timeIndex < 0) continue;
    const times = lines[timeIndex].split("-->");
    if (times.length !== 2) continue;
    const start = parseTimestamp(times[0]);
    const end = parseTimestamp(times[1].trim().split(/\\s+/)[0]);
    const content = decodeSubtitleEntities(lines.slice(timeIndex + 1).join(" ").replace(/<[^>]*>/g, "")).trim();
    if (start !== null && end !== null && end > start && content) parsed.push({ start, end, text: content });
  }
  return parsed.sort((a, b) => a.start - b.start);
}

export function formatTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return hours
    ? [hours, minutes, remainder].map(value => String(value).padStart(2, "0")).join(":")
    : [minutes, remainder].map(value => String(value).padStart(2, "0")).join(":");
}
