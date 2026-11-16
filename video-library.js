export const VIDEO_LIBRARY_KEY = "video-book-library-v1";
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const MAX_LIBRARY_ITEMS = 100;

function getDefaultStorage() {
  try { return globalThis.localStorage; }
  catch (_) { return null; }
}

function normalizeEntry(entry, now = Date.now()) {
  if (!entry || typeof entry !== "object" || !VIDEO_ID_PATTERN.test(entry.videoId || "")) return null;
  const title = typeof entry.title === "string" ? entry.title.trim().slice(0, 120) : "";
  const savedAt = Number.isFinite(entry.savedAt) && entry.savedAt > 0 ? entry.savedAt : now;
  return { videoId: entry.videoId, title: title || "제목 없는 영상", savedAt };
}

export function readVideoLibrary(storage = getDefaultStorage()) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(VIDEO_LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = new Map();
    for (const item of parsed) {
      const entry = normalizeEntry(item);
      if (entry) unique.set(entry.videoId, entry);
    }
    return [...unique.values()].sort((a, b) => b.savedAt - a.savedAt);
  } catch (_) {
    return [];
  }
}

export function saveVideo(storage, entry, now = Date.now()) {
  if (!storage) throw new Error("브라우저 저장 공간을 사용할 수 없습니다.");
  const normalized = normalizeEntry(entry, now);
  if (!normalized) throw new TypeError("올바른 YouTube 영상 ID가 아닙니다.");
  const items = readVideoLibrary(storage);
  const existing = items.find(item => item.videoId === normalized.videoId);
  if (existing) normalized.savedAt = existing.savedAt;
  const next = [normalized, ...items.filter(item => item.videoId !== normalized.videoId)]
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX_LIBRARY_ITEMS);
  storage.setItem(VIDEO_LIBRARY_KEY, JSON.stringify(next));
  return next;
}

export function removeVideo(storage = getDefaultStorage(), videoId) {
  if (!storage) throw new Error("브라우저 저장 공간을 사용할 수 없습니다.");
  if (!VIDEO_ID_PATTERN.test(videoId || "")) return readVideoLibrary(storage);
  const next = readVideoLibrary(storage).filter(item => item.videoId !== videoId);
  storage.setItem(VIDEO_LIBRARY_KEY, JSON.stringify(next));
  return next;
}
