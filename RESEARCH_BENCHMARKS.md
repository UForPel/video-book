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
  - 가능한 다음 실험은 (A) 별도 테스트 페이지에서 Hyperaudio Lite가 YouTube 플레이어를 단독 소유하게 해 검증하거나, (B) 현재 영상책 플레이어와 연결하는 사용자 정의 adapter를 검토하는 것이다. 어느 쪽이 적절한지는 최소 실험 후 결정한다.
- 자동 자막 취득:
  - README, YouTube 데모, 확인한 핵심 코드에서 임의의 공개 YouTube 영상 자막을 자동으로 내려받는 기능은 확인하지 못했다.
  - 데모 transcript는 HTML에 미리 들어 있는 시간표시 텍스트이며, 플레이어에서 자동 추출한 자막이 아니다.
- 판정: **시간 동기화 UI 벤치마킹으로 적합. 자동 자막 취득 기능은 제공하지 않음. 영상책 기존 플레이어에 즉시 통합하지 말고 독립 실험을 먼저 수행.**

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

## 요약 비교

| 프로젝트 | 확인된 강점 | 자동 자막 취득 | GitHub Pages 단독 적합성 | 영상책 활용 |
|---|---|---|---|---|
| Hyperaudio Lite | 단어 단위 timed transcript와 YouTube iframe 동기화 | 확인 안 됨 | 정적 프런트엔드 라이브러리로 검토 가능 | 독립 실험 후 동기화 UI 일부 참고 |
| Hyperaudio Lite Editor | 로컬 STT/자막 교정/내보내기 | 로컬 미디어 대상 기능, YouTube iframe 자동 추출은 미확인 | 일부 브라우저 기능은 가능성 있으나 실험 필요 | 교정 UI/로컬 STT 참고 |
| Invidious | 대체 프런트엔드/API | 이번 조사에서 확인 안 됨 | 부적합(서버/인스턴스) | 구조만 참고 |
| Piped | 대체 프런트엔드/API | 이번 조사에서 확인 안 됨 | 부적합(백엔드/인스턴스) | 구조만 참고 |
| ViewTube | 모바일 UI/검색/영상 탐색 | 이번 조사에서 확인 안 됨 | 부적합(서버/API 구조) | UI만 참고 |
| Materialious | 모바일 플레이어/탐색 UI | 이번 조사에서 확인 안 됨 | 부적합(백엔드 배포 경로) | UI만 참고 |

## 영상책에 대한 결론

1. **Hyperaudio Lite를 시간 동기화 UI의 1순위 벤치마킹 대상으로 유지**한다.
2. **바로 현재 앱에 붙이지 않는다.** 현재 앱과 Hyperaudio Lite 모두 YouTube IFrame API 플레이어를 생성/관리하므로 이중 플레이어 관리 충돌 위험을 먼저 해결해야 한다.
3. 다음 최소 실험은 별도 테스트 페이지에서 Hyperaudio Lite 단독 YouTube iframe + 미리 준비된 소량의 timed transcript로 클릭 seek/활성 단어/자동 스크롤을 확인하는 것이다. 이 실험은 자막 자동 취득 테스트가 아니다.
4. Hyperaudio Lite Editor는 별도 실험으로 둔다. Android 기기에서 한국어 Whisper/Parakeet 모델의 실행, 메모리/성능, 라이선스를 확인하기 전에는 통합하지 않는다.
5. Invidious, Piped, ViewTube, Materialious는 제품 전체를 복제하거나 서버를 연결하지 않는다. 필요한 UI/구조만 참고한다.
6. 임의의 공개 YouTube 영상에서 자막을 자동으로 얻는 무료·무제한·서버 없는 확실한 방법은 여전히 확인되지 않았다.
7. 비공식 서비스도 자동 자막 취득 경로로 확정하지 않는다. 공식 문서, 운영 구조, 라이선스, 정책, 장애 대응을 확인하고 별도 실험을 통과한 뒤에만 채택한다.

## 확인한 공식 출처

- https://github.com/hyperaudio/hyperaudio-lite
- https://github.com/hyperaudio/hyperaudio-lite/blob/main/README.md
- https://github.com/hyperaudio/hyperaudio-lite/blob/main/demos/youtube.html
- https://github.com/hyperaudio/hyperaudio-lite/blob/main/js/hyperaudio-lite.js
- https://github.com/hyperaudio/hyperaudio-lite/blob/main/package.json
- https://github.com/hyperaudio/hyperaudio-lite/blob/main/LICENSE
- https://github.com/hyperaudio/hyperaudio-lite-editor
- https://github.com/iv-org/invidious
- https://github.com/TeamPiped/Piped
- https://github.com/ViewTube/viewtube
- https://github.com/Materialious/Materialious

이 문서는 저장소 README/공식 문서와 일부 실제 소스 파일을 확인한 결과이며, Android 실기기에서 Hyperaudio Lite를 테스트했다는 뜻은 아니다.


## 7. YouTube 공식 자막 접근 경로 — 2026-11-11 재확인

### YouTube Data API Captions
- `captions.list`: OAuth 2.0 인증이 필요하며 응답은 자막 트랙의 메타데이터 목록이다. 실제 자막 본문은 응답에 포함되지 않는다.
- `captions.download`: OAuth 2.0 인증이 필요하고, 호출하는 사용자가 해당 동영상을 수정할 권한을 가져야 한다.
- 따라서 다른 사람이 올린 임의의 공개 영상을 영상책에서 자동으로 가져오는 일반 사용자용 공개 API로 쓸 수 없다.
- 공식 문서:
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download
  - https://developers.google.com/youtube/v3/guides/implementation/captions

### YouTube IFrame Player API
- 공식 API는 임베드 영상 재생/일시정지/시점 이동/재생 정보 조회를 지원한다.
- `captions` 모듈은 `fontSize`, `reload` 등 플레이어 안에서 자막 표시를 제어하는 옵션을 문서화한다.
- 문서화된 공개 메서드 중 자막 전문이나 시간대별 caption cue를 외부 페이지의 JavaScript로 반환하는 기능은 확인되지 않았다.
- 그러므로 플레이어에 CC가 표시되는 것과 영상책이 자막 텍스트를 받아 별도 패널에 표시할 수 있는 것은 별개의 기능이다.
- 공식 문서: https://developers.google.com/youtube/iframe_api_reference

### 영상책에 대한 판정
- GitHub Pages 정적 앱 + 공식 YouTube API만으로 임의 공개 영상의 자막 텍스트를 자동 취득하는 경로는 확인되지 않았다.
- 비공식 내부 인터페이스/스크래핑/공개 프록시를 즉시 붙이지 않는다. 가용성, 정책, 개인정보, 안정성 및 무료 사용 한도를 검증하지 않은 상태에서 핵심 기능으로 채택할 수 없다.
- 다음 조사는 사용자의 핵심 제약(정적 Pages, Android, 비용/쿼터 최소화)을 기준으로 어떤 조건을 완화해야 실제 자동 자막이 가능한지 비교하는 것이다.
- 이번 조사는 코드 구현이나 Android 실기기 검증이 아니다.
