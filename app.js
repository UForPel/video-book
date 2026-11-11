const statusEl = document.getElementById("status");
const inputEl = document.getElementById("video-url");
const loadButton = document.getElementById("load-video");
const placeholder = document.getElementById("player-placeholder");
const subtitleFile = document.getElementById("subtitle-file");
const transcriptEl = document.getElementById("transcript");
const transcriptHint = document.getElementById("transcript-hint");

let player = null;
let apiReady = false;
let pendingVideoId = null;
let cues = [];
let activeCueIndex = -1;
let captionRegistryPromise = null;
let captionLoadToken = 0;

function getVideoId(value) {
  const raw = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const id = url.searchParams.get("v");
      if (id) return id;
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0]) && parts[1]) return parts[1];
    }
  } catch (_) { return null; }
  return null;
}

function loadVideo() {
  const id = getVideoId(inputEl.value);
  if (!id) { statusEl.textContent = "올바른 유튜브 주소 또는 11자리 영상 ID를 입력해주세요."; return; }
  pendingVideoId = id;
  loadRegisteredSubtitle(id);
  if (!apiReady) { statusEl.textContent = "유튜브 플레이어를 준비하고 있습니다…"; return; }
  if (player && typeof player.loadVideoById === "function") player.loadVideoById(id);
  else createPlayer(id);
}

function createPlayer(videoId) {
  player = new YT.Player("player", {
    videoId,
    playerVars: { playsinline: 1, rel: 0 },
    events: {
      onReady: () => {
        placeholder.hidden = true;
        statusEl.textContent = cues.length
          ? "영상이 준비됐습니다. 등록된 자막을 함께 읽을 수 있습니다."
          : "영상이 준비됐습니다. 자막이 없다면 SRT/VTT 파일을 선택해주세요.";
      },
      onError: event => {
        const messages = {
          2: "영상 주소를 확인해주세요.",
          5: "이 영상은 HTML5 플레이어에서 재생할 수 없습니다.",
          100: "영상을 찾을 수 없거나 비공개 영상입니다.",
          101: "영상 소유자가 외부 사이트 재생을 허용하지 않았습니다.",
          150: "영상 소유자가 외부 사이트 재생을 허용하지 않았습니다."
        };
        statusEl.textContent = messages[event.data] || "영상을 재생할 수 없습니다. 다른 영상으로 시험해주세요.";
      }
    }
  });
}

window.onYouTubeIframeAPIReady = function () {
  apiReady = true;
  if (pendingVideoId) createPlayer(pendingVideoId);
};

function getCaptionRegistry() {
  if (!captionRegistryPromise) {
    captionRegistryPromise = fetch("./captions.json")
      .then(response => {
        if (!response.ok) throw new Error("caption registry unavailable");
        return response.json();
      })
      .then(data => {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("invalid caption registry");
        }
        return data;
      })
      .catch(error => {
        captionRegistryPromise = null;
        throw error;
      });
  }
  return captionRegistryPromise;
}

async function loadRegisteredSubtitle(videoId) {
  const token = ++captionLoadToken;
  cues = [];
  activeCueIndex = -1;
  renderTranscript();
  transcriptHint.textContent = "등록된 자막이 있는지 확인하고 있습니다.";

  try {
    const registry = await getCaptionRegistry();
    if (token !== captionLoadToken) return;

    const path = registry[videoId];
    if (!path) {
      transcriptHint.textContent = "이 영상에 등록된 자막이 없습니다. 제작자 제공/허가 SRT·VTT 파일을 선택할 수 있습니다.";
      statusEl.textContent = "등록된 자막이 없습니다. 자막 파일을 직접 선택할 수 있습니다.";
      return;
    }

    if (typeof path !== "string" ||
        !/^captions\/[A-Za-z0-9._/-]+\.(srt|vtt)$/i.test(path) ||
        path.includes("..")) {
      throw new Error("invalid registered caption path");
    }

    const response = await fetch("./" + path);
    if (!response.ok) throw new Error("registered caption file unavailable");
    const text = await response.text();
    if (token !== captionLoadToken) return;

    const parsed = parseSubtitle(text);
    if (!parsed.length) throw new Error("registered caption file is empty or invalid");

    cues = parsed;
    activeCueIndex = -1;
    renderTranscript();
    statusEl.textContent = "등록된 자막 " + cues.length + "개를 자동으로 불러왔습니다.";
  } catch (_) {
    if (token !== captionLoadToken) return;
    transcriptHint.textContent = "등록된 자막을 자동으로 불러오지 못했습니다. SRT/VTT 파일을 직접 선택할 수 있습니다.";
    statusEl.textContent = "등록 자막을 읽지 못했습니다. 자막 파일을 직접 선택해주세요.";
  }
}

function parseTimestamp(value) {
  // SRT: 00:00:01,250 / VTT: 00:01.250 or 00:00:01.250
  const time = value.trim().split(/\s+/)[0].replace(",", ".");
  const parts = time.split(":");
  if (parts.length !== 2 && parts.length !== 3) return null;
  const secondsPart = parts.pop();
  const secondsMatch = secondsPart.match(/^(\d{1,2})(?:\.(\d{1,3}))?$/);
  if (!secondsMatch) return null;
  const minutesPart = parts.pop();
  if (!/^\d{1,2}$/.test(minutesPart)) return null;
  const hoursPart = parts.length ? parts.pop() : "0";
  if (!/^\d+$/.test(hoursPart)) return null;
  const fraction = secondsMatch[2] ? Number((secondsMatch[2] + "00").slice(0, 3)) / 1000 : 0;
  return Number(hoursPart) * 3600 + Number(minutesPart) * 60 + Number(secondsMatch[1]) + fraction;
}

function parseSubtitle(text) {
  const blocks = text.replace(/^\uFEFF/, "").replace(/\r/g, "").split(/\n\s*\n/);
  const parsed = [];
  for (const block of blocks) {
    const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
    const timeIndex = lines.findIndex(line => line.includes("-->"));
    if (timeIndex < 0) continue;
    const times = lines[timeIndex].split("-->");
    const start = parseTimestamp(times[0]);
    const end = parseTimestamp(times[1].trim().split(/\s+/)[0]);
    const content = lines.slice(timeIndex + 1).join(" ")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    if (start !== null && end !== null && end > start && content) parsed.push({ start, end, text: content });
  }
  return parsed.sort((a, b) => a.start - b.start);
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
    : [m, s].map(v => String(v).padStart(2, "0")).join(":");
}

function renderTranscript() {
  transcriptEl.replaceChildren();
  if (!cues.length) {
    transcriptHint.textContent = "SRT 또는 VTT 자막 파일을 선택하면 시간대별로 표시됩니다.";
    return;
  }
  const fragment = document.createDocumentFragment();
  cues.forEach((cue, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-line";
    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = formatTime(cue.start);
    const words = document.createElement("span");
    words.className = "cue-text";
    words.textContent = cue.text;
    button.append(timestamp, words);
    button.addEventListener("click", () => {
      if (!player || typeof player.seekTo !== "function") {
        statusEl.textContent = "먼저 영상을 불러와주세요.";
        return;
      }
      player.seekTo(cue.start, true);
      player.playVideo();
      statusEl.textContent = formatTime(cue.start) + " 자막 위치로 이동했습니다.";
    });
    fragment.appendChild(button);
  });
  transcriptEl.appendChild(fragment);
  transcriptHint.textContent = cues.length + "개 자막을 불러왔습니다. 문장을 누르면 영상이 해당 시점으로 이동합니다.";
}

subtitleFile.addEventListener("change", async () => {
  const file = subtitleFile.files && subtitleFile.files[0];
  if (!file) return;
  if (!/\.(srt|vtt)$/i.test(file.name)) {
    statusEl.textContent = "SRT 또는 VTT 파일만 불러올 수 있습니다.";
    subtitleFile.value = "";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    statusEl.textContent = "현재 시험 버전은 5MB 이하 자막 파일만 지원합니다.";
    subtitleFile.value = "";
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let decoded = "";
    try {
      decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (_) {
      // Korean subtitle files are sometimes saved as EUC-KR/CP949.
      try {
        decoded = new TextDecoder("euc-kr").decode(bytes);
      } catch (_) {
        decoded = new TextDecoder("utf-8").decode(bytes);
      }
    }
    const result = parseSubtitle(decoded);
    if (!result.length) {
      statusEl.textContent = "자막 형식을 인식하지 못했습니다. SRT/VTT 파일인지, 시간 표기가 올바른지 확인해주세요.";
      return;
    }
    cues = result;
    activeCueIndex = -1;
    renderTranscript();
    statusEl.textContent = file.name + " 파일에서 자막 " + cues.length + "개를 불러왔습니다.";
  } catch (_) {
    statusEl.textContent = "파일을 읽지 못했습니다. 다른 자막 파일로 다시 시도해주세요.";
  }
});

function updateActiveCue() {
  if (!player || !cues.length || typeof player.getCurrentTime !== "function") return;
  const now = player.getCurrentTime();
  let low = 0, high = cues.length - 1, found = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (now < cues[mid].start) high = mid - 1;
    else if (now >= cues[mid].end) low = mid + 1;
    else { found = mid; break; }
  }
  if (found === activeCueIndex) return;
  activeCueIndex = found;
  transcriptEl.querySelectorAll(".time-line").forEach((line, index) => {
    const active = index === found;
    line.classList.toggle("active", active);
    if (active) line.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

loadButton.addEventListener("click", loadVideo);
inputEl.addEventListener("keydown", event => { if (event.key === "Enter") loadVideo(); });
setInterval(updateActiveCue, 500);

const apiScript = document.createElement("script");
apiScript.src = "https://www.youtube.com/iframe_api";
apiScript.async = true;
document.head.appendChild(apiScript);
