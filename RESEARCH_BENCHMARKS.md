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


## 9. 호스팅형 자막 사이트/API 비교 — 2026-11-11

이번 조사는 스마트폰 브라우저에서 YouTube URL을 붙여 넣어 자막을 표시하는 웹서비스와, 그 서비스가 공개하는 개발자 API를 구분해 확인했다. 사이트가 브라우저에서 작동한다는 사실만으로 영상책의 GitHub Pages 코드에서 그 결과를 직접 읽을 수 있는 것은 아니다.

### YouTubeScribe / 현재 VideoQuill로 연결되는 페이지
- 검색 결과에 남아 있는 YouTubeScribe API 문서: https://youtubescribe.com/docs
- 검색 결과에 남아 있는 API 소개/가격 페이지: https://youtubescribe.com/api-access
- 현재 홈페이지 열기 결과는 https://videoquill.com/ 으로 리디렉션되었다. 따라서 이전 YouTubeScribe 브랜드/무료 조건을 현재 운영 조건으로 단정하지 않는다.
- API 문서는 REST API https://api.youtubescribe.com 및 Bearer API key 인증을 설명한다.
- /youtube/transcript는 영상 자막을 구조화된 segment 또는 텍스트로 반환하고 시작 시각/길이를 포함할 수 있다. language 매개변수로 언어 우선순위를 지정하며 asr는 자동 생성 자막 트랙 요청으로 문서화되어 있다.
- 자막 추출은 성공한 응답(200)당 1 credit이며, 검색 API도 페이지당 1 credit. 문서에 분당 300 요청의 rate limit이 표시되어 있다. Credit 한도와 rate limit은 서로 다른 제한이다.
- 문서는 API 키를 환경 변수에 보관하고 클라이언트 코드에 넣지 말라고 명시한다.
- 검색된 가격 안내는 무료 자막 추출을 표방하지만 API는 key/credit 잔액을 요구한다. 별도 최신 공식 약관/현재 서비스 페이지가 일치하는지 확인되지 않았고, 현재 사이트 리디렉션도 있으므로 ‘무제한 무료 API’로 판정하지 않는다.
- 영상책 판정: timestamped transcript 응답 형식은 기술적으로 유용한 참고다. 그러나 비밀 키를 GitHub Pages 클라이언트에 넣을 수 없고, 안전한 호출에는 별도 서버/중계 계층이 필요하다. 현재의 서버 없음/무료 쿼터 최소화 조건과 맞지 않아 통합 보류.
- 확인 출처: https://youtubescribe.com/docs ; https://youtubescribe.com/api-access ; https://youtubescribe.com/

### YT2Text
- 공식 문서: https://docs.yt2text.cc/guide/getting-started/
- FAQ: https://docs.yt2text.cc/reference/faq/
- 확인된 구조: yt2text.cc 웹 앱과 api.yt2text.cc API 백엔드는 분리되어 있다. API는 계정에서 발급한 API key를 매 요청 Bearer 또는 X-API-Key 헤더로 전달한다.
- 영상 처리 요청은 job ID를 반환하고, 백엔드가 자막을 추출한 후 상태 조회/결과 조회로 결과를 받는 비동기 작업 구조다.
- 자막이 있는 공개 영상의 기존 캡션 트랙을 읽는다고 설명한다. 자체 음성 인식으로 자막이 없는 영상을 전사하는 기능이라고 확인되지는 않았다.
- FAQ 가격표는 Free 5 videos/month, Plus 200/month, Pro 1,000/month라고 안내한다. 별도 rate limit 문서에서는 Free 5/day 및 5/month 등 계획별 제한을 제시한다.
- FAQ는 API 키를 클라이언트 코드/버전 관리에 노출하지 말라고 명시하며, API 백엔드는 별도 VPS에 있다고 설명한다.
- 문서 내부에 API key 이용 가능 플랜 설명이 서로 완전히 일치하지 않는 부분이 있으므로 실제 가입/결제 전 최신 대시보드 조건을 재확인해야 한다.
- 영상책 판정: API가 있어 연결 자체는 가능하지만 인증 키 보호를 위한 서버가 필요하고 무료 사용량도 제한된다. 현재 요구사항의 핵심 의존성으로 채택하지 않는다.
- 확인 출처: https://docs.yt2text.cc/guide/getting-started/ ; https://docs.yt2text.cc/reference/faq/

### 영상책에 대한 기술적 결론
1. 모바일 웹사이트에서 URL을 붙여 넣어 자막을 얻는 서비스는 보통 서비스 운영 서버가 요청을 처리한다. 모바일 브라우저가 직접 YouTube 자막 데이터를 모두 가져온다는 증거가 되지 않는다.
2. 공개 API가 있더라도 API key가 필요한 경우 GitHub Pages의 JavaScript에 키를 넣으면 공개된다. 문서가 키를 클라이언트에 넣지 말라고 하면 서버 중계가 필요하다.
3. 무료 웹 UI, 무료 API, 무료 무제한 API는 서로 다른 조건이다. API credit, 계정 제한, 분당 rate limit, 서버 운영 한도를 각각 확인해야 한다.
4. 이번 후보들은 자막 형식/타임스탬프 데이터 구조의 참고 자료로는 유용하지만, 현재의 ‘GitHub Pages 단독 + 별도 서버 없음 + 무료/쿼터 최소화’ 핵심 조건을 만족하는 채택 후보는 아니다.
5. 다음 단계는 사용자가 별도 서버를 허용할지 여부를 결정하는 것이다. 승인 전에는 제3자 API 키를 앱 코드에 넣거나 연동 코드를 추가하지 않는다.


## 10. 일반 웹페이지에서 YouTube 자막을 직접 읽을 수 있는지 — 2026-11-11

### 확인된 브라우저 보안 경계
- 영상책은 GitHub Pages 출처에서 실행되고 YouTube 영상은 다른 출처의 iframe에서 재생된다.
- MDN의 동일 출처 정책 문서는 교차 출처 iframe의 내부 문서/DOM에 대한 스크립트 접근이 제한되며, 교차 출처 간 통신은 명시적으로 허용된 `postMessage` 등의 통로를 사용해야 한다고 설명한다.
- 따라서 영상책의 일반 페이지 JavaScript가 YouTube iframe 내부 자막 DOM을 직접 읽는 방식을 기본 기능으로 가정할 수 없다.
- 출처:
  - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentWindow

### Android Chrome 확장 프로그램 경로
- Chromium Extensions 담당자는 2026-10-08 공개 Chromium Extensions 포럼 답변에서 Chrome 모바일에 확장 프로그램 지원 계획이 없다고 답했다.
- Chrome 도움말 커뮤니티도 Android용 Chrome은 데스크톱 확장 프로그램을 지원하지 않는다고 안내한다.
- 영상책 사용 환경이 Android Chrome이므로, 데스크톱 Chrome/Edge 확장 프로그램 기반 프로젝트를 설치해 해결하는 경로는 현재 사용자 환경에 맞지 않는다.
- 출처:
  - https://groups.google.com/a/chromium.org/g/chromium-extensions/c/tCUm3kceybk
  - https://support.google.com/chrome/thread/469081090/extensions?hl=en

### 브라우저 음성 인식과 YouTube iframe 오디오
- 확인한 Web Speech API 관련 Edge 문서는 음성 인식 입력으로 마이크 또는 사용자가 선택한 오디오/비디오 파일을 설명한다.
- 이 문서는 교차 출처 YouTube iframe에서 재생 중인 오디오 스트림을 웹페이지가 직접 입력으로 받을 수 있다고 설명하지 않는다.
- 따라서 마이크 기반 음성 인식이나 파일 기반 로컬 STT를 현재 YouTube iframe 오디오의 자동 전사 기능으로 간주하지 않는다.
- 사용자 제공 미디어 파일을 처리하는 로컬 STT 가능성은 별도 후속 후보로 남긴다.
- 출처: https://learn.microsoft.com/en-us/microsoft-edge/web-platform/speech-recognition-api

### 영상책 판정
1. 일반 GitHub Pages JavaScript가 YouTube iframe 내부의 자막 DOM/텍스트를 직접 읽는 경로는 동일 출처 정책상 사용할 수 있다고 가정하지 않는다.
2. Android Chrome에서 데스크톱 확장 프로그램을 설치하는 경로는 현재 지원되지 않으므로 제외한다.
3. Web Speech API/로컬 STT는 마이크 또는 사용자가 제공한 파일 입력과 YouTube iframe의 오디오를 구분해서 평가한다.
4. 이는 자동 자막 전체가 불가능하다는 결론이 아니다. 서비스 자체 서버가 자막을 제공하는 경로, 허용된 공식 인터페이스, 사용자 제공 자막/미디어 등은 각각 따로 검증한다.
5. 다음 조사는 자막 웹사이트가 브라우저에서 직접 데이터를 받는지, 서비스 서버가 중계하는지, 영상책에서 안전하게 호출 가능한 공개 인터페이스가 있는지 확인하는 데 집중한다.


## 11. GitHub Pages와 GitHub Actions의 실행 모델 — 2026-11-11

### GitHub Pages
- 공식 문서는 Pages를 저장소의 HTML, CSS, JavaScript 등의 정적 파일을 게시하는 서비스로 설명한다.
- Pages는 PHP, Ruby, Python 같은 서버 측 언어를 지원하지 않는다.
- 출처: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages ; https://docs.github.com/ko/pages/getting-started-with-github-pages/creating-a-github-pages-site

### GitHub Actions
- workflow는 저장소 이벤트, 외부 repository_dispatch, 수동 workflow_dispatch, 예약 실행 등으로 트리거된다.
- workflow는 하나 이상의 job으로 구성되고, job은 runner 실행 환경에서 수행된다. 공식 개념 문서는 각 workflow run이 새로 프로비저닝된 가상 머신에서 실행된다고 설명한다.
- REST API로 workflow run을 조회/관리하거나 실행을 트리거할 수 있는 경우가 있지만, 이는 계속 요청을 기다리는 HTTP 백엔드와 다르다.
- 출처: https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows ; https://docs.github.com/en/actions/get-started/understand-github-actions ; https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows ; https://docs.github.com/en/rest/actions/workflow-runs

### 영상책 판정
1. Pages는 영상책 프런트엔드를 계속 호스팅할 수 있다.
2. Actions는 빌드/검사/배포 자동화에는 적합하지만, 재생 중인 영상마다 자막 요청을 받아 즉시 처리하는 서버로는 적합하지 않다.
3. 공개 정적 JavaScript에 PAT나 기타 비밀 토큰을 포함하는 방식은 채택하지 않는다.
4. GitHub 내부 우선 원칙은 유지한다. 다음 단계에서는 외부 서비스를 도입하기 전에 Pages 브라우저에서 공식적으로 접근 가능한 자막 데이터/통신 경로를 추가로 검증한다.
5. 제품 목표는 바뀌지 않는다: 현재 영상의 자막 자동 취득, 시간대별 동기화, 자막 클릭 시 해당 시점 이동.


## 12. TranscriptLayer — timestamped caption API 후보 검토 — 2026-11-11
- 공식 API 문서는 YouTube를 첫 번째 source adapter로 지원하고, 공개 영상의 기존 caption track을 JSON, text, SRT, WebVTT로 반환한다고 설명한다. normalized segments는 start_ms, duration_ms, text를 포함한다.
- POST /v1/transcripts는 200 완료 또는 202 비동기 job을 반환하고, GET polling/download는 무료라고 설명한다. 완료된 선택 트랙 1개당 1 credit이며 무료 계정은 100 credits를 제공한다. 무료 계정 API rate limit은 분당 120회.
- API 요청에는 Bearer API key가 필요하다. 문서는 키를 공개하지 말고 URL/query string에 넣지 말라고 한다. 따라서 정적 공개 JavaScript에 키를 삽입하는 방식은 부적절하다.
- 문서에서 브라우저 CORS 허용 여부는 확인되지 않았다. CORS가 허용되더라도 키를 공개해야 하는 문제는 해결되지 않는다.
- Acceptable Use Policy는 접근 통제, 지역 제한, 플랫폼 보안 우회, 쿠키/로그인정보 제공, rate/concurrency/credit limit 회피를 금지한다. 공개 또는 별도 허가된 콘텐츠만 요청해야 한다.
- Privacy Policy는 계정을 성인(18세 이상)으로 제한한다. 따라서 현재 프로젝트의 사용 후보로 채택하지 않고, 가입/키 발급/API 호출을 진행하지 않는다.
- 판정: timestamped transcript 데이터 구조와 서비스형 처리 흐름만 참고한다. 무료 무제한 서비스로 취급하지 않는다.
- 출처: https://transcriptlayer.com/docs/ ; https://transcriptlayer.com/signup/ ; https://transcriptlayer.com/acceptable-use/ ; https://transcriptlayer.com/privacy/


## 13. 무키 공개 체험형 자막 서비스의 자동화 제한 — 2026-11-11
### TranscriptFetch / YouTubeTranscripts.io
- TranscriptFetch의 2026-11-06 비교 글은 공개 무키 체험 경로가 네트워크당 하루 10회라고 설명한다. 같은 글은 로컬 도구가 사용자 네트워크에서는 동작할 수 있으나, 클라우드 IP에서는 YouTube 차단 가능성이 더 높다고 보고한다. 이는 서비스 운영자의 자체 테스트이며 일반적인 성공 보장이 아니다.
- YouTubeTranscripts.io 약관은 사용자가 전사할 권리가 있는 영상만 사용하도록 하며, 스크립트/봇으로 자막을 수집하거나 방문자/계정 한도를 회피하는 행위를 금지한다.
- 따라서 무키 체험이 가능하더라도 그것이 영상책에서 자동 호출할 수 있는 공개 API라는 뜻은 아니다. 수동 UI 체험과 제품 내 자동화 호출을 구분한다.
- 판정: 자동화 호출 공급원으로 채택하지 않음. 한도 공유/회피 또는 약관 위반을 시도하지 않는다.
- 출처: https://transcriptfetch.com/blog/youtube-transcript-api-no-key ; https://youtubetranscripts.io/terms/


## 14. 제작자 제공/허가 자막 및 공식 API — VB-08 — 2026-11-11

### YouTube 공식 Captions API
- 구현 가이드: https://developers.google.com/youtube/v3/guides/implementation/captions
- `captions.list`: OAuth 2.0 인증이 필요하며 지정 영상의 자막 트랙 목록/메타데이터를 반환한다. 응답에는 자막 본문이 없다. 문서상 quota cost는 50 units.
- `captions.download`: OAuth 2.0 인증이 필요하고, 호출 사용자는 해당 영상을 수정할 권한이 있어야 한다. 원본 형식 또는 SRT/VTT 등 지정 형식으로 다운로드할 수 있다. 문서상 quota cost는 200 units.
- 제작자 또는 채널/영상 편집 권한을 받은 사람의 영상에서는 공식 API를 통해 자막을 받을 수 있는 길이 존재한다. 그러나 일반 시청자가 임의 공개 영상의 자막을 다운로드하는 범용 API가 아니다.
- 영상책에서 이 경로를 사용하려면 Google OAuth 로그인, 적절한 scope, 토큰 수명/보안, 사용자의 영상 수정 권한 확인을 구현해야 한다. 현재 정적 Pages 개인용 MVP에 바로 추가할 만큼 단순한 경로가 아니다.

### IFrame Player API
- 공식 참조: https://developers.google.com/youtube/iframe_api_reference
- captions 모듈의 문서화된 옵션은 자막 글자 크기 및 자막 데이터 reload 등 플레이어 내 표시 제어다.
- 자막 텍스트 전문이나 시간대별 cue를 영상책 JavaScript로 반환하는 API는 문서에서 확인되지 않았다.
- 따라서 플레이어 내부 CC 표시를 켜는 기능과 영상책의 별도 텍스트 패널에 자막을 제공하는 기능은 구분해야 한다.

### 제작자가 제공하는 SRT/VTT 파일
- YouTube 도움말: https://support.google.com/youtube/answer/2734796?hl=en
- 제작자는 YouTube Studio에서 자막 파일을 업로드하거나 직접 텍스트를 입력해 자막을 추가할 수 있다. 자막 파일은 텍스트뿐 아니라 각 문장의 표시 시각도 포함할 수 있다.
- 영상책의 현재 `app.js`에는 SRT/VTT 파싱, 사용자가 선택한 파일 읽기, 재생 시점에 따른 활성 cue 강조, cue 클릭 시 `seekTo`가 이미 존재한다. 자동 파일 탐색/다운로드/영상 ID 매핑은 아직 없다.
- 구현 후보: 제작자가 제공하거나 사용을 허락한 자막 파일을 영상책 저장소 내 정적 폴더에 두고, 별도의 정적 매핑 데이터에서 YouTube video ID → 자막 파일 경로를 연결한다. 영상 로드 시 매핑을 확인해 등록된 파일만 자동 fetch한다. 이는 GitHub Pages와 동일 출처이므로 별도 API key나 서버 없이 동작할 수 있는 구조다.
- 제작자가 외부 사이트에 파일을 호스팅하면 MDN의 CORS 정책에 따라 해당 호스트가 영상책의 출처를 허용해야 JavaScript `fetch()`로 파일 내용을 읽을 수 있다. 공개 URL이더라도 CORS 허용이 없으면 브라우저에서 읽지 못할 수 있다.
- 동일 저장소 정적 파일 방식은 등록/허가된 영상만 지원한다. 무작위 공개 영상 자막을 자동 수집하는 방식이 아니며, 영상 ID와 자막 파일의 정확한 연결 및 파일 사용 허가를 확인해야 한다.

### 영상책 판정
1. 공식 YouTube Captions API는 영상 제작자/수정 권한 보유자에게만 의미 있는 선택 경로로 남긴다. OAuth와 quota 부담 때문에 현재 MVP 기본 경로로 채택하지 않는다.
2. IFrame Player API는 재생 및 플레이어 자막 표시 제어용이며, 별도 자막 패널의 텍스트 공급원은 아니다.
3. 현재 앱의 로컬 SRT/VTT 파서와 동기화 기능을 재사용해, 제작자 허가 파일을 저장소 정적 경로에서 영상 ID로 자동 연결하는 방식을 다음 검증 후보로 선정한다.
4. 이번 단계에서는 문서 조사만 수행했으며 코드/배포 기능은 변경하지 않았다.
5. 다음 단계는 허가된 샘플 영상 한 건과 SRT/VTT 파일을 기준으로 자동 fetch와 Android 재생 동기화를 검증하는 것이다.



## 15. 제조사/호스팅 플랫폼의 스크립트 기능 재검증 — VB-09 — 2026-11-11

### TI 공식 사이트
- TI 제품 페이지에서 `View video with transcript` UI가 제공되는 사례를 확인했다.
- 확인 가능한 공개 페이지 정보만으로는 스크립트 본문이 외부 JavaScript에 공개되는지, 시간 정보가 포함된 SRT/VTT 파일 또는 공개 자막 데이터 주소가 존재하는지 확인되지 않았다.
- 판정: 제조사 자체 페이지의 접근성/읽기 기능 사례로만 기록한다. 영상책에서 일반 YouTube 자막을 가져오는 기술 경로로 채택하지 않는다.

### Wistia
- 공식 도움말은 Wistia 미디어의 captions와 time-coded transcripts를 구분하고, transcript embed로 Wistia 플레이어 옆에 스크립트를 표시할 수 있다고 설명한다.
- Wistia 공식 API의 특정 미디어 captions 조회는 API token과 `Read all folder and media data` 등 권한을 요구한다. SRT/VTT/TXT 형식 응답을 지원하지만 Wistia 계정/미디어 권한이 전제된다.
- 판정: Wistia에 호스팅된 미디어에 대해서는 유효한 기능이지만 일반 YouTube URL의 자막 공급원이 아니다. 별도 토큰 없이 모든 사용자의 YouTube 자막을 가져오는 경로가 아니므로 영상책의 핵심 자동 취득 후보에서 제외한다.
- 출처: https://support.wistia.com/en/articles/8274062-transcripts-and-captions ; https://docs.wistia.com/reference/get_medias-mediahashedid-captions-languagecode ; https://docs.wistia.com/docs/transcript-embeds

### Brightcove
- 공식 문서는 제작자가 WebVTT 자막 파일을 영상에 등록하거나 원격 파일로 연결하고, Brightcove Player의 `<track>` 요소로 제공하는 방식을 설명한다. 원격 자막 파일은 브라우저에서 접근 가능해야 하며 CORS 설정이 필요할 수 있다.
- 판정: Brightcove 호스팅 영상과 Brightcove Player를 위한 제작자 제공 자막 경로다. 일반 YouTube 영상에서 자막 전문을 추출하거나 영상책으로 전달하는 기능이 아니므로 핵심 자동 취득 후보에서 제외한다.
- 출처: https://player.support.brightcove.com/user-interface/adding-captions-videos-programmatically.html ; https://mstudio.support.brightcove.com/media/managing-text-tracks.html

### YouTube 영상책과의 구분
- YouTube IFrame Player API는 플레이어 내 captions 표시 옵션과 reload를 제어하지만 자막 cue 전문을 영상책 JavaScript로 반환하는 문서화된 API를 제공하지 않는다.
- 따라서 TI/Wistia/Brightcove의 자체 플레이어/자체 미디어 스크립트 기능을 YouTube 영상책의 일반 자막 자동 취득 기능으로 간주하지 않는다.
- 현재 코드에는 SRT/VTT 파서, 로컬 파일 선택, 시간 동기화, 문장 클릭 seek가 구현되어 있으나, 자막 파일 자동 탐색/다운로드는 구현되어 있지 않다.
- 현재 제약(일반 YouTube 공개 영상, 무료/무제한 우선, 서버 없음, GitHub Pages 정적 앱)을 모두 유지하면서 별도 자막 전문을 안정적으로 자동 취득하는 검증된 경로는 아직 확인되지 않았다.
- 다음 결정은 제약을 유지한 상태에서 제작자 허가 자막이 제공되는 일부 영상만 지원할지, 아니면 서버/API 비용·계정·사용량 제한 중 일부를 허용할지 정하는 것이다.


## 16. 무료 전용 아키텍처 조건 — 2026-11-11
- 사용자 확정 조건: 무료만 허용하며 저렴한 유료 서비스도 사용하지 않는다.
- GitHub Pages 공식 문서: GitHub Free 공개 저장소에서 정적 사이트 호스팅을 제공한다. HTML/CSS/JavaScript를 게시하지만 PHP/Ruby/Python 등 서버 측 언어 실행은 지원하지 않는다. 사이트/저장소 크기, 빌드 시간, 대역폭 등에 제한이 있다.
- Cloudflare Workers 공식 제한 문서: Workers Free는 하루 100,000 요청, HTTP 요청당 CPU 10ms 등 무료 한도가 있다. Static Assets 요청은 무료·무제한이라고 문서화되어 있으나 Worker 스크립트 요청은 무료 플랜 한도를 적용받는다.
- 판정: Workers Free의 존재는 기록하되, 무료 한도와 별도 서비스 의존성이 있고, 일반 YouTube 영상의 자막 전문을 공식적으로 공급하는 출처가 확인되지 않았으므로 현재 영상책의 핵심 경로로 채택하지 않는다.
- YouTube 공식 Captions API: captions.list는 OAuth 인증을 요구하고 실제 자막 본문을 반환하지 않으며 50 quota units를 사용한다. captions.download는 OAuth와 영상 수정 권한이 필요하며 200 quota units를 사용한다. 일반 공개 영상 시청자를 위한 무료 범용 자막 API가 아니다.
- 결론: 비용 0원과 기존 GitHub Pages/브라우저 처리 조건을 고정한다. 무료 체험, 결제 수단, 무료 한도 초과 시 유료 전환이 필요한 서비스는 핵심 기능에서 제외한다. 무료 서버를 붙이는 것만으로 자막 공급원 문제가 해결되는 것은 아니다.
- 출처:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
  - https://developers.cloudflare.com/workers/platform/limits/
  - https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download


## 17. VB-10 — YouTube 공식 자막 인터페이스 최종 재검증 — 2026-11-11

### IFrame Player API의 captions 모듈
- 공식 참조: https://developers.google.com/youtube/iframe_api_reference
- 문서는 captions 모듈의 문서화된 옵션으로 `fontSize`와 `reload`를 제시한다. `fontSize`는 플레이어 안에서 보이는 자막의 크기, `reload`는 플레이어의 자막 데이터를 다시 불러오는 동작이다.
- `getOptions('captions')`, `getOption`, `setOption`은 플레이어 옵션을 확인/변경하기 위한 인터페이스다. 문서에서 자막 cue 텍스트 배열, cue별 시작/종료 시각을 영상책 페이지로 반환하는 메서드는 확인되지 않았다.
- 판정: 플레이어 안의 CC 표시를 제어할 수 있다는 사실을 별도 transcript 패널 데이터 접근 권한으로 해석하지 않는다.

### 공식 YouTube Captions API 재확인
- 공식 참조: https://developers.google.com/youtube/data/reference/rest/v3/captions
- `captions.list` 응답은 자막 트랙 리소스/메타데이터이며 실제 자막 본문은 포함하지 않는다.
- 본문을 내려받는 `captions.download`는 OAuth 인증을 요구하며 영상 수정 권한이 필요하다. 이는 제작자/편집 권한 보유자에게 해당하는 관리 API이지 일반 공개 영상 시청자용 범용 자막 API가 아니다.
- 판정: 일반 공개 영상 자동 자막 취득 경로로 채택하지 않는다.

### 브라우저 보안과 정적 호스팅
- MDN 동일 출처 정책: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- YouTube iframe은 영상책 GitHub Pages와 다른 출처다. 일반 JavaScript가 iframe 내부 DOM을 직접 읽을 수 없고, 외부 자막 파일을 `fetch()`하려면 제공 서버가 CORS를 허용해야 한다.
- GitHub Pages 공식 설명: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Pages는 HTML/CSS/JavaScript 등의 정적 파일을 게시한다. 방문자 요청마다 YouTube 자막을 추출해 응답하는 서버 실행 환경은 아니다.

### VB-10 결론 및 구현 범위
1. 비용 0원, 서버 없음, GitHub Pages 정적 호스팅 조건을 유지하면서 임의의 공개 YouTube 영상에 대해 자막 전문과 타임스탬프를 자동 취득하는 공식·안정적 경로는 이번 재검증에서도 확인되지 않았다.
2. 제작자가 제공하거나 사용을 허가한 SRT/VTT를 저장소에 정적으로 등록하고 영상 ID와 매핑하는 방식은 등록된 영상에 한해 구현 가능하다. 같은 저장소에서 제공하면 브라우저가 동일 출처로 파일을 읽을 수 있다.
3. 외부 사이트의 공개 자막 URL은 CORS 허용이 확인된 경우에만 브라우저에서 읽을 수 있다.
4. 기존 로컬 SRT/VTT 파일 선택, 파싱, 재생 시점 동기화, 문장 클릭 seek 기능은 유지한다. 임의 영상의 가짜 자막이나 권한이 확인되지 않은 파일은 추가하지 않는다.
5. 실제 허가 샘플 파일이 없으므로 자동 매핑 코드 추가 및 Android 실기기 검증은 보류한다. 허가된 샘플이 확보되면 해당 파일을 대상으로만 자동 fetch와 동기화를 검증한다.
6. 앱 코드와 배포 설정은 이번 단계에서 변경하지 않았다.



## 18. VB-11 — 등록형 정적 자막 연결 구현 — 2026-11-11
- 저장소 루트에 `captions.json`을 추가했다. 현재 등록 항목은 없으며 예시 형식만 설명한다.
- `captions/README.md`에 제작자 제공/사용 허가 자막 파일만 추가하고, video ID와 상대 경로를 연결하는 등록 절차를 기록했다.
- `app.js`는 영상 ID로 등록 목록을 조회한 뒤 `captions/` 폴더의 SRT/VTT만 동일 출처 fetch하도록 구현했다. 외부 URL을 등록 경로로 허용하지 않는다.
- 등록 파일은 기존 `parseSubtitle`, `renderTranscript`, `updateActiveCue`를 사용하므로 기존 cue 시간 동기화 및 클릭 seek 흐름을 재사용한다.
- 영상 ID 변경 시 이전 fetch 응답이 뒤늦게 도착해 현재 영상 자막을 덮지 않도록 요청 토큰을 사용한다. 사용자가 로컬 파일을 직접 선택한 경우에도 진행 중인 자동 fetch를 무효화해 수동 선택이 우선하도록 했다.
- 등록 목록 fetch 실패 시 다음 시도에서 재요청할 수 있도록 실패한 Promise를 초기화한다.
- MDN Fetch 문서에 따르면 동일 출처 요청은 브라우저에서 기본적으로 처리할 수 있고, 교차 출처 응답은 서버의 CORS 허용 헤더가 필요하다. 따라서 자막 파일을 Pages와 같은 출처에 두는 방식은 별도 외부 API나 CORS 설정을 요구하지 않는다.
- 출처: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch ; https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- 제한: 등록 목록은 현재 비어 있다. 허가된 샘플 파일이 없으므로 실제 fetch 성공, 실제 cue 표시, Android 재생 동기화는 아직 테스트되지 않았다. 코드 반영 사실을 실기기 검증 완료로 표현하지 않는다.
