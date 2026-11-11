const statusEl = document.getElementById("status");
const inputEl = document.getElementById("video-url");
const loadButton = document.getElementById("load-video");
const placeholder = document.getElementById("player-placeholder");

let player = null;
let apiReady = false;
let pendingVideoId = null;

function getVideoId(value) {
  const raw = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery) return fromQuery;
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0]) && parts[1]) return parts[1];
    }
  } catch (_) {
    return null;
  }
  return null;
}

function loadVideo() {
  const id = getVideoId(inputEl.value);
  if (!id) {
    statusEl.textContent = "올바른 유튜브 주소 또는 11자리 영상 ID를 입력해주세요.";
    return;
  }
  pendingVideoId = id;
  if (!apiReady) {
    statusEl.textContent = "유튜브 플레이어를 준비하고 있습니다…";
    return;
  }
  if (player && typeof player.loadVideoById === "function") {
    player.loadVideoById(id);
  } else {
    createPlayer(id);
  }
}

function createPlayer(videoId) {
  player = new YT.Player("player", {
    videoId,
    playerVars: { playsinline: 1, rel: 0 },
    events: {
      onReady: () => {
        placeholder.hidden = true;
        statusEl.textContent = "영상이 준비됐습니다. 재생 및 시점 이동을 확인해보세요.";
      },
      onError: (event) => {
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

loadButton.addEventListener("click", loadVideo);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadVideo();
});

document.querySelectorAll(".time-line").forEach((button) => {
  button.addEventListener("click", () => {
    const seconds = Number(button.dataset.seconds);
    if (player && typeof player.seekTo === "function" && player.getPlayerState() !== -1) {
      player.seekTo(seconds, true);
      statusEl.textContent = seconds === 0 ? "영상 처음으로 이동했습니다." : seconds + "초 지점으로 이동했습니다.";
    } else {
      statusEl.textContent = "먼저 영상을 불러와주세요.";
    }
  });
});

const apiScript = document.createElement("script");
apiScript.src = "https://www.youtube.com/iframe_api";
apiScript.async = true;
document.head.appendChild(apiScript);