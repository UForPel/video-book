import test from "node:test";
import assert from "node:assert/strict";
import { VIDEO_LIBRARY_KEY, readVideoLibrary, saveVideo, removeVideo } from "../video-library.js";

function createStorage(initial = null) {
  const values = new Map(initial === null ? [] : [[VIDEO_LIBRARY_KEY, initial]]);
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
}

test("saves a video and reads it back in newest-first order", () => {
  const storage = createStorage();
  saveVideo(storage, { videoId: "abcdefghijk", title: "첫 영상" }, 100);
  saveVideo(storage, { videoId: "lmnopqrstuv", title: "두 번째 영상" }, 200);
  assert.deepEqual(readVideoLibrary(storage), [
    { videoId: "lmnopqrstuv", title: "두 번째 영상", savedAt: 200 },
    { videoId: "abcdefghijk", title: "첫 영상", savedAt: 100 }
  ]);
});

test("updates a duplicate without moving its original saved date", () => {
  const storage = createStorage();
  saveVideo(storage, { videoId: "abcdefghijk", title: "이전 제목" }, 100);
  saveVideo(storage, { videoId: "abcdefghijk", title: "새 제목" }, 500);
  assert.deepEqual(readVideoLibrary(storage), [
    { videoId: "abcdefghijk", title: "새 제목", savedAt: 100 }
  ]);
});

test("rejects invalid IDs and ignores malformed stored entries", () => {
  const storage = createStorage(JSON.stringify([{ videoId: "bad", title: "잘못된 항목" }]));
  assert.deepEqual(readVideoLibrary(storage), []);
  assert.throws(() => saveVideo(storage, { videoId: "bad", title: "잘못된 항목" }), TypeError);
});

test("removes a saved video", () => {
  const storage = createStorage();
  saveVideo(storage, { videoId: "abcdefghijk", title: "첫 영상" }, 100);
  saveVideo(storage, { videoId: "lmnopqrstuv", title: "두 번째 영상" }, 200);
  assert.deepEqual(removeVideo(storage, "abcdefghijk"), [
    { videoId: "lmnopqrstuv", title: "두 번째 영상", savedAt: 200 }
  ]);
});

test("handles unavailable or invalid local storage data safely", () => {
  assert.deepEqual(readVideoLibrary({ getItem() { throw new Error("blocked"); } }), []);
  assert.deepEqual(readVideoLibrary(createStorage("not-json")), []);
});

test("limits the library to the newest 100 unique videos", () => {
  const storage = createStorage();
  for (let i = 0; i < 105; i++) {
    const id = i.toString(36).padStart(11, "a").slice(-11);
    saveVideo(storage, { videoId: id, title: "영상 " + i }, i + 1);
  }
  const items = readVideoLibrary(storage);
  assert.equal(items.length, 100);
  assert.equal(items[0].title, "영상 104");
  assert.equal(items.at(-1).title, "영상 5");
});

test("returns an empty library when storage is unavailable and rejects writes", () => {
  assert.deepEqual(readVideoLibrary(null), []);
  assert.throws(() => saveVideo(null, { videoId: "abcdefghijk", title: "영상" }), /저장 공간/);
  assert.throws(() => removeVideo(null, "abcdefghijk"), /저장 공간/);
});
