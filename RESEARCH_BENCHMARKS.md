# 영상책 벤치마킹 후보 — 재검증 기록

조사일: 2026-11-11  
목적: 이전에 검토한 오픈소스 프로젝트 중 공식 저장소와 README/코드에서 확인 가능한 내용만 기록한다.

## 판정 기준

- **확인됨**: 공식 GitHub 저장소/README/실제 코드에서 기능, 구조, 라이선스 또는 기술 전제를 확인함.
- **벤치마킹 가능**: 코드/화면 구조를 참고할 가치가 있음. 영상책에 그대로 복사하거나 의존성을 추가한다는 뜻은 아님.
- **채택 보류**: 영상책의 핵심 제약(정적 GitHub Pages, Android, 무료/쿼터 최소화, 자동 자막)과 맞지 않거나 정책·안정성·라이선스 검증이 더 필요함.
- 별도 실기기 테스트나 운영 안정성 검증을 하지 않은 사항은 성공했다고 간주하지 않는다.

## 1. Hyperaudio Lite

- 공식 저장소: https://github.com/hyperaudio/hyperaudio-lite
- README: https://github.com/hyperaudio/hyperaudio-lite/blob/main/README.md
- YouTube 데모: https://hyperaudio.github.io/hyperaudio-lite/youtube.html
- 실제 YouTube 데모 소스: https://github.com/hyperaudio/hyperaudio-lite/blob/main/demos/youtube.html
- 확인한 버전: package.json에 2.6.4 표기
- 라이선스: 저장소 LICENSE 파일 및 package.json에 MIT 명시
- 확인된 구조/기능:
  - Vanilla JavaScript 기반의 인터랙티브 transcript viewer.
  - README는 약 10KB minified, 외부 라이브러리 의존성 없음, 프레임워크 없음, 빌드 단계 없이 사용할 수 있다고 설명.
  - transcript는 HTML 요소로 표현하고 각 단어에 `data-m`(시작 시각, 밀리초), `data-d`(단어 길이, 밀리초)를 둔다.
  - 클릭 가능한 단어에서 해당 시점으로 이동하고 재생할 수 있으며, 재생/seek에 맞춰 현재 단어 강조와 자동 스크롤을 수행한다.
  - YouTube iframe 지원이 실제 코드에 있음. iframe은 `id`, `data-player-type="youtube"`, `enablejsapi=1` 설정을 사용하며 라이브러리의 YouTube 어댑터가 YouTube IFrame API를 로드하고 `YT.Player` 인스턴스를 생성한다.
  - 최신 README는 options 객체 방식의 초기화와 destroy()/pauseAutoscroll()/resumeAutoscroll() 등을 설명한다.
  - SRT는 편집기/변환기에서 transcript로 변환할 수 있는 입력 형식으로 언급된다. 라이브러리의 핵심 transcript DOM 형식은 SRT 파일 자체가 아니라 단어별 타임스탬프 HTML이다.
- 영상책 벤치마킹:
  - 자막 문장/단어 클릭 시 seek
  - 재생 위치에 맞춘 활성 단어 강조
  - 자막 자동 스크롤
  - 미디어 플레이어 어댑터를 분리하는 구조
- **중요한 통합 충돌 위험(영상책 현재 코드와 비교):**
  - 현재 영상책 `app.js`는 `new YT.Player("player", ...)`로 플레이어 인스턴스를 직접 생성하고, 같은 인스턴스에서 `loadVideoById`, `seekTo`, `getCurrentTime` 등을 호출한다.
  - Hyperaudio Lite의 기본 YouTube 어댑터도 지정된 iframe에 대해 별도의 `new YT.Player(...)`를 생성한다.
  - 따라서 현재 플레이어에 Hyperaudio Lite 기본 YouTube 어댑터를 그대로 덧붙이면 같은 영상 플레이어를 두 객체가 관리하거나 API 콜백/이벤트가 중복되는 충돌 가능성이 있다. 바로 통합하지 않는다.
- 자동 자막 취득:
  - README, YouTube 데모, 확인한 핵심 코드에서 임의의 공개 YouTube 영상 자막을 자동으로 내려받는 기능은 확인하지 못했다.
  - 데모 transcript는 HTML에 미리 들어 있는 시간표시 텍스트이며, 플레이어에서 자동 추출한 자막이 아니다.
- 판정: **시간 동기화 UI 벤치마킹으로 적합. 자동 자막 취득 기능은 제공하지 않음. 기존 앱에 즉시 통합하지 않는다.**

## 2. Hyperaudio Lite Editor

- 저장소: https://github.com/hyperaudio/hyperaudio-lite-editor
- 공식 데모: https://hyperaudio.github.io/hyperaudio-lite-editor/
- 확인된 내용:
  - 기계 생성 transcript의 생성·편집·교정용 브라우저 기반 편집기.
  - README는 브라우저 내부 로컬 처리로 Parakeet/Whisper를 실행할 수 있고, 이 경우 오디오가 브라우저 밖으로 나가지 않는다고 설명.
  - 외부 클라우드 전사 서비스는 사용자가 자신의 키를 제공하는 별도 선택지로 안내됨.
  - 타임스탬프 정렬, 문장 편집, 문장부호/단어 수정, SRT/VTT 내보내기 기능을 설명.
  - 모바일/PWA 사용을 표방함.
  - 저장소 README의 라이선스 안내는 AGPL-3.0을 기본으로 하며 비상업/비영리 목적에서 MIT 조건을 문의하도록 설명함. 실제 재사용 전에는 최신 라이선스 파일과 권리 조건을 재확인해야 함.
- 영상책 벤치마킹: **부분 권장** — 자막 교정 UI, 단어/구간 타이밍 편집, 브라우저 내 로컬 STT 가능성.
- 한계:
  - 로컬 미디어/오디오를 전사하는 도구이지, 임의의 YouTube iframe에서 재생되는 오디오를 자동으로 읽어 전사한다고 확인된 것은 아님.
  - 모바일에서 모델 다운로드 크기, RAM, CPU/GPU, 배터리 및 한국어 정확도 실측 필요.
  - 라이선스 조건 확인 전 코드 복사/통합 금지.
- 판정: **편집기와 로컬 STT 실험 참고 후보. YouTube 자동 자막 확보 수단으로는 미확인.**

## 3. Invidious

- 저장소: https://github.com/iv-org/invidious
- 공식 문서: https://docs.invidious.io/
- 확인된 내용:
  - YouTube 대체 프런트엔드이며 공식 YouTube API를 사용하지 않는다고 저장소가 설명.
  - 별도 인스턴스/서버를 운영하는 구조.
  - AGPL-3.0 라이선스.
- 영상책 벤치마킹: 검색/영상 상세/대체 프런트엔드의 화면 흐름과 서버-클라이언트 분리 개념만 참고.
- 한계:
  - GitHub Pages 단독 정적 앱에 그대로 넣을 수 있는 라이브러리가 아님.
  - 자체 서버 또는 제3자 공개 인스턴스에 의존하는 구조.
  - YouTube 사이트 변경에 따른 파싱/재생 안정성 및 서비스 약관 적합성을 별도로 평가해야 함.
- 판정: **구조 참고만. 영상책 핵심 자막 공급원으로 채택 보류.**

## 4. Piped

- 저장소: https://github.com/TeamPiped/Piped
- 공식 문서: https://docs.piped.video/
- 확인된 내용:
  - YouTube 대체 프런트엔드 및 API를 제공하는 프로젝트.
  - 공식 YouTube API 대신 NewPipeExtractor를 사용하는 구조라고 저장소가 설명.
  - 자체 호스팅 및 공개 인스턴스 목록을 안내.
  - AGPL-3.0 라이선스.
- 영상책 벤치마킹: 검색 결과, 피드, 프런트엔드/API 분리 개념만 참고.
- 한계:
  - 백엔드/인스턴스 의존성이 있어 GitHub Pages 단독 정적 앱과 맞지 않음.
  - 공개 인스턴스는 운영자·쿼터·가용성에 의존하므로 무제한/상시 가동을 보장하지 않음.
  - 비공식 추출 경로의 정책·안정성 확인이 필요함.
- 판정: **구조 참고만. 핵심 의존성 채택 보류.**

## 5. ViewTube

- 저장소: https://github.com/ViewTube/viewtube
- 문서: https://viewtube.wiki/
- 확인된 내용:
  - Nuxt와 Nest 기반의 모바일/데스크톱용 대체 프런트엔드라고 README가 설명.
  - 영상 검색, 플레이리스트, 채널 등 기능 제공을 표방.
  - 공식 YouTube API 대신 YouTube 웹사이트 스크래핑과 YouTube.js 및 node-ytpl을 사용한다고 README가 명시.
  - AGPL-3.0 라이선스.
  - 별도 호스팅 가이드가 있음.
- 영상책 벤치마킹: 모바일 UI와 검색/영상 상세 흐름만 참고.
- 한계:
  - 별도 API/서버 구조가 필요하므로 정적 Pages에 직접 통합하는 대상이 아님.
  - 스크래핑 기반이므로 YouTube 변경에 취약할 수 있고 정책 검토 필요.
- 판정: **UI 참고만. 자동 자막 공급원으로는 미확인.**

## 6. Materialious

- 저장소: https://github.com/Materialious/Materialious
- 공식 사이트: https://materialio.us/
- 확인된 내용:
  - YouTube/Invidious를 위한 Material Design 프런트엔드.
  - README는 웹, 데스크톱, Android, Android TV 지원을 설명.
  - Invidious 연결은 선택 사항이며 자체 YouTube 백엔드 경로도 설명.
  - Docker 배포 방식과 AGPL-3.0 라이선스를 안내.
- 영상책 벤치마킹: 모바일 플레이어 화면, 탐색/재생 UI, 반응형 레이아웃.
- 한계:
  - 전체 기능은 별도 백엔드/Docker 배포 경로와 연관되어 GitHub Pages 단독 앱과 맞지 않음.
  - 자동 자막을 임의의 영상에서 안정적으로 공급한다는 근거는 이번 확인에서 찾지 못함.
- 판정: **UI 참고만. 핵심 의존성 채택 보류.**

## 7. YouTube 공식 자막 접근 경로 — 2026-11-11 재확인

### YouTube Data API Captions
- `captions.list`: OAuth 2.0 인증이 필요하며 응답은 자막 트랙의 메타데이터 목록이다. 실제 자막 본문은 응답에 포함되지 않는다.
- `captions.download`: OAuth 2.0 인증이 필요하고, 호출하는 사용자가 해당 동영상을 수정할 권한을 가져야 한다.
- 따라서 다른 사람이 올린 임의의 공개 영상을 영상책에서 자동으로 가져오는 일반 사용자용 공개 API로 쓸 수 없다.
- 공식 문서:
  - https://developers.google.com/youtube/v3/docs/captions/list
  - https://developers.google.com/youtube/v3/docs/captions/download
  - https://developers.google.com/youtube/v3/guides/implementation/captions

### YouTube IFrame Player API
- 공식 API는 임베드 영상 재생/일시정지/시점 이동/재생 정보 조회를 지원한다.
- `captions` 모듈은 `fontSize`, `reload` 등 플레이어 안에서 자막 표시를 제어하는 옵션을 문서화한다.
- 문서화된 공개 메서드 중 자막 전문이나 시간대별 caption cue를 외부 페이지의 JavaScript로 반환하는 기능은 확인되지 않았다.
- 그러므로 플레이어에 CC가 표시되는 것과 영상책이 자막 텍스트를 받아 별도 패널에 표시할 수 있는 것은 별개의 기능이다.
- 공식 문서: https://developers.google.com/youtube/iframe_api_reference

## 8. API 키 없이 자막을 가져온다고 설명하는 프로젝트 — 2026-11-11 소스 확인

### Transcript Studio for YouTube
- 저장소: https://github.com/krishnakanthb13/yt-transcript-studio
- 확인 파일: README.md, LICENSE
- README는 Chrome/Edge Manifest V3 확장 프로그램으로서 YouTube 페이지에서 자막 트랙을 찾아 자막을 가져오고, 언어 선택/검색/클릭 seek/활성 줄 강조/내보내기를 제공한다고 설명한다.
- README가 설명하는 데이터 흐름은 브라우저 확장 권한으로 YouTube 탭에 스크립트를 실행하고, 페이지의 플레이어 데이터에서 트랙을 찾은 뒤 YouTube의 비공개 InnerTube 요청을 사용해 자막 데이터를 가져오는 구조다.
- README는 2025년 중반 이후 WEB 자막 URL에 PoToken 검증이 적용되어 빈 응답을 받는 문제가 있어 WEB 경로를 사용하지 않고 ANDROID/IOS/MWEB 등의 비-WEB 클라이언트 경로를 선택한다고 명시한다.
- 무료/로컬 실행을 표방하지만 README 자체도 YouTube가 요청을 제한할 수 있다고 안내한다. 무제한이나 장기 안정성을 보장하는 근거는 아니다.
- 라이선스 파일은 GNU GPL v3. 영상책 코드에 코드 일부를 복사하거나 통합하려면 GPL 의무와 배포 방식을 별도로 검토해야 한다.
- 중요한 제한: 이 프로젝트는 Chrome/Edge 확장 프로그램이며 YouTube 탭에 대한 확장 권한을 사용한다. GitHub Pages에서 실행되는 일반 웹페이지에 같은 권한이 생기는 것은 아니다.
- 영상책 판정: 자막 표시/편집 UI와 브라우저 확장 프로그램의 권한 경계에 대한 구조 참고만 한다. README가 설명하는 비공개 내부 엔드포인트/클라이언트 선택 경로를 영상책에서 재현하거나 제한을 우회하는 구현은 채택하지 않는다.

### yttext
- 저장소: https://github.com/kkensuke/yttext
- 확인 파일: README.md, docs/architecture.md, docs/deployment.md
- README는 API 키 없이 YouTube의 수동/자동 자막을 추출하고 Markdown/TXT/JSON/SRT/VTT로 내보내는 CLI 및 브라우저 앱이라고 설명한다.
- 실제 구조는 정적 단일 HTML이 아니다. Python CLI/웹 앱이며 브라우저 앱은 로컬 또는 호스팅된 FastAPI 서버와 통신한다.
- 아키텍처 문서는 브라우저 → FastAPI → YouTube 흐름을 설명하며, 추출을 서버 측에서 수행한다고 명시한다.
- 배포 문서는 hosted mode에서 TLS, 허용 Host/Origin, 단일 애플리케이션 worker, 요청 제한과 남용 방지, 메모리 모니터링, 의존성 업데이트가 필요하다고 안내한다.
- README는 HTTP 429가 발생할 수 있고 YouTube가 일시적으로 요청을 제한할 수 있다고 설명한다.
- Gemini 요약은 별도 선택 기능이며 사용자 API 키가 필요하다. 자막 추출 자체와 요약 API는 구분한다.
- 판정: 정적 GitHub Pages만으로 구현하는 방식이 아니라 별도 서버를 운영하는 방식의 참고 사례다. 개인이 직접 로컬로 실행하면 외부 호스팅 비용은 피할 수 있지만, 영상책 웹페이지 단독으로 서버 역할을 할 수는 없다. 공개 호스팅하면 운영자 비용/용량/요청 제한/남용 대응이 생긴다. YouTube 추출 방식의 정책 적합성은 별도로 검토해야 하므로 영상책의 자동 자막 경로로 채택하지 않는다.

## 요약 비교

| 방식/프로젝트 | 자막 취득 구조 | API/사용량 제한 | GitHub Pages 단독 | 영상책 판정 |
|---|---|---|---|---|
| 공식 YouTube Captions API | OAuth + 영상 수정 권한 | 공식 API 쿼터/권한 | 불가(임의 공개 영상) | 소유 영상 보조 |
| IFrame Player API | 임베드 재생/표시 제어 | 공식 API 호출 방식과 다름 | 재생은 가능, 자막 전문은 미제공 | 플레이어 제어 |
| Transcript Studio | 브라우저 확장 권한 + 비공개 내부 요청 | YouTube 요청 제한 가능 | 불가(확장 권한 필요) | UI/권한 구조만 참고 |
| yttext | Python/FastAPI 서버에서 자막 취득 | YouTube 429/서버 용량·운영 제한 | 불가(서버 필요) | 서버형 아키텍처 참고 |
| Hyperaudio Lite | 사전에 제공된 timed transcript 동기화 | 자막 취득 쿼터 없음 | 정적 프런트엔드 라이브러리로 검토 가능 | 자막 UI 참고 |
| 로컬 STT 편집기 | 사용자 제공 로컬 오디오를 기기에서 전사 | 외부 API 없이 가능할 수 있음 | 브라우저 기능 일부 가능 | 로컬 미디어 후속 후보 |

## 영상책에 대한 결론

1. **시간 동기화 UI**는 Hyperaudio Lite를 참고하되, 현재 플레이어와의 이중 인스턴스 충돌을 피하도록 설계한다.
2. **자동 자막 취득**은 UI 라이브러리와 별개의 문제다. 공식 YouTube API만으로 임의 공개 영상의 자막 전문을 얻는 방법은 확인되지 않았다.
3. API 키 없이 자막을 얻는다고 소개하는 오픈소스도 실제 구조를 보면 브라우저 확장 권한과 비공개 내부 요청을 사용하거나, 별도 서버에서 추출한다. 무료라는 표현이 무제한·안정적·정적 Pages 호환을 의미하지 않는다.
4. Transcript Studio의 내부 요청 흐름을 영상책에 복제하지 않는다. yttext의 서버 구조는 정적 Pages만으로 해결되지 않는다는 비교 자료로만 활용한다.
5. **모든 공개 영상 자동 자막 + 무제한 무료 + 서버 없음 + GitHub Pages만 사용**을 동시에 만족하는 안정적·정책 검증 경로는 확인되지 않았다.
6. 다음 설계 결정에서는 사용자 제약 중 어느 하나를 완화할 수 있는지 먼저 정한다. 승인 전에는 자동 자막 취득 코드를 추가하지 않는다.

## 확인한 저장소/공식 출처

- https://github.com/hyperaudio/hyperaudio-lite
- https://github.com/hyperaudio/hyperaudio-lite-editor
- https://github.com/iv-org/invidious
- https://github.com/TeamPiped/Piped
- https://github.com/ViewTube/viewtube
- https://github.com/Materialious/Materialious
- https://developers.google.com/youtube/v3/docs/captions/list
- https://developers.google.com/youtube/v3/docs/captions/download
- https://developers.google.com/youtube/iframe_api_reference
- https://github.com/krishnakanthb13/yt-transcript-studio
- https://github.com/kkensuke/yttext
- https://github.com/kkensuke/yttext/blob/main/docs/architecture.md
- https://github.com/kkensuke/yttext/blob/main/docs/deployment.md

이 문서는 저장소 README와 일부 실제 소스/설계 문서를 확인한 결과이며, Android 실기기에서 위 후보들을 실행해 검증했다는 뜻은 아니다.
