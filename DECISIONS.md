# 영상책 기술 결정 기록

이 문서는 확정된 결정과 아직 검증 중인 선택지를 구분해 기록합니다.

## 결정 001 — GitHub 전용 저장소
- 상태: 확정
- 결정: `UForPel/video-book`을 기준 저장소로 사용한다. 기존 ReadTube/Bolt 작업물은 보존한다.

## 결정 002 — 모바일 우선 정적 웹앱
- 상태: 방향 확정
- 결정: Android 우선, GitHub Pages 정적 호스팅을 우선한다. Pages 자체는 백엔드를 제공하지 않는다.

## 결정 003 — 유료 및 사용량 제한 의존성 최소화
- 상태: 필수 원칙
- 결정: 유료 API/AI를 핵심 기능의 필수 의존성으로 두지 않는다. 무료 서비스도 쿼터와 한도를 확인한다. 완전 무제한 무료를 보장하지 않는다.

## 결정 004 — 영상 재생과 자막 UI 분리
- 상태: 설계 방향
- 결정: 플레이어와 자막 표시/편집 모듈을 분리한다. Hyperaudio Lite는 시간 동기화 UI 참고 자료일 뿐 자막 공급원이 아니다.

## 결정 005 — 공식 검색 API의 쿼터
- 상태: 위험 확인
- 결정: YouTube Data API 검색은 쿼터가 있는 기능이며 무제한으로 취급하지 않는다.

## 결정 006 — 공식 Captions API는 임의 공개 영상 자막의 범용 취득 수단이 아님
- 상태: 공식 문서 확인
- 확인:
  - `captions.list`는 OAuth 2.0 인증을 요구하며 실제 자막 본문을 반환하지 않는다.
  - `captions.download`는 OAuth 2.0 인증과 영상 수정 권한을 요구한다.
- 결론: 일반 사용자가 임의의 공개 영상에서 자막을 자동으로 가져오는 용도로 공식 Captions API를 사용할 수 없다.
- 출처:
  - https://developers.google.com/youtube/v3/docs/captions/list
  - https://developers.google.com/youtube/v3/docs/captions/download

## 결정 007 — 자동 자막은 제품의 핵심 목표
- 상태: 요구사항 확정, 기술 경로 미확정
- 결정: 기기에서 SRT/VTT 파일을 직접 선택하는 기능은 보조 기능이며 최종 흐름이 아니다.
- 목표: YouTube 영상 선택 후 가능한 경우 자막을 자동 연결하고 시간대별로 표시한다.
- 원칙: 자막을 자동 확보할 수 없는 경우 그 사실과 이유를 명확히 알린다.

## 결정 008 — 실제 영상 장면 이미지
- 상태: 후속 검증
- 결정: YouTube 임베드 영상의 임의 프레임을 브라우저 캔버스로 직접 추출할 수 있다고 가정하지 않는다. 교차 출처 제한과 권한을 검토한다.

## 결정 009 — 벤치마킹 자료는 재검증 후 기록
- 상태: 작업 방식 확정
- 결정: 공식 저장소/문서/실제 코드를 확인하고 확인된 사실과 미검증 사항을 분리한다. 벤치마킹은 참고를 뜻하며 무조건 통합한다는 뜻이 아니다.

## 결정 010 — Hyperaudio Lite의 활용 범위
- 상태: 참고 자료로 보관
- 확인: Hyperaudio Lite 2.6.4, MIT. timed transcript 동기화 UI, 클릭 seek, 활성 단어, 자동 스크롤 기능을 제공한다.
- 한계: 임의 공개 YouTube 영상의 자막을 자동 취득하지 않는다.
- 결정: 영상책의 동기화 UI를 개선할 때 참고한다. 별도 실험 페이지를 사용자에게 테스트시키는 작업은 중단한다.

## 결정 011 — IFrame API에서 자막 텍스트를 직접 얻을 수 없음
- 상태: 공식 문서 확인
- 확인:
  - YouTube IFrame Player API는 영상 재생/제어와 일부 플레이어 정보를 제공한다.
  - `captions` 모듈에서 문서화된 옵션은 글자 크기와 캡션 데이터 reload 등 플레이어 내 표시 제어에 한정된다.
  - 공개 API 문서에서 자막 전문이나 시간대별 자막 트랙을 앱으로 반환하는 메서드는 확인되지 않았다.
- 결론: 플레이어 안에 CC 자막이 표시된다는 사실만으로 영상책이 그 자막 텍스트를 읽어올 수 있는 것은 아니다.
- 출처: https://developers.google.com/youtube/iframe_api_reference

## 결정 012 — 비공식 자막 취득 경로를 검증 없이 연결하지 않음
- 상태: 확정
- 결정: 비공식 내부 인터페이스, 스크래핑, 공개 프록시를 영상책에 바로 연결하지 않는다. 안정성, 정책, 개인정보, 가용성, 운영 한도를 확인하기 전에는 핵심 기능으로 채택하지 않는다.

## 결정 013 — API 키 없는 자막 추출 프로젝트의 구조적 한계
- 상태: 저장소 문서 확인
- 확인:
  - Transcript Studio for YouTube는 Chrome/Edge 확장 프로그램으로, YouTube 탭에 대한 확장 권한과 비공개 내부 요청 경로를 설명한다. 일반 GitHub Pages 웹페이지에 동일한 브라우저 권한이 제공되는 구조가 아니다.
  - yttext는 Python/FastAPI 서버에서 자막을 가져오는 브라우저 앱/CLI다. 정적 Pages만으로 동작하는 웹앱이 아니다.
  - yttext README는 YouTube HTTP 429 요청 제한이 발생할 수 있다고 안내한다.
- 결정: 두 프로젝트는 API 쿼터를 피하는 무제한 정적 웹앱의 해법으로 간주하지 않는다. 구조 비교 자료로만 사용한다.
- 참고:
  - https://github.com/krishnakanthb13/yt-transcript-studio
  - https://github.com/kkensuke/yttext
  - https://github.com/kkensuke/yttext/blob/main/docs/architecture.md
  - https://github.com/kkensuke/yttext/blob/main/docs/deployment.md

## 결정 014 — 핵심 제약을 모두 동시에 만족한다고 가정하지 않음
- 상태: 확정
- 요구사항: 임의 공개 YouTube 영상 자동 자막, 무제한 무료, 별도 서버 없음, GitHub Pages 정적 앱, Android 사용.
- 결론: 조사한 후보 중 이 조건을 모두 안정적·정책 검증 상태로 만족하는 방식은 확인되지 않았다.
- 결정: 다음 구현 전에 어떤 제약을 완화할 수 있는지 사용자와 결정한다. 승인 전에는 자동 자막 취득 코드를 추가하지 않는다.


## 결정 015 — 호스팅형 자막 사이트와 API의 차이
- 상태: 공개 개발자 문서/페이지 확인
- 확인: YouTubeScribe 문서(현재 홈페이지는 VideoQuill로 리디렉션)는 transcript API, timestamped segments, Bearer key, credit 차감, rate limit을 문서화한다. API 키를 클라이언트 코드에 노출하지 말라고 명시한다.
- YT2Text는 별도 VPS 백엔드와 API key 인증, 비동기 job 처리 구조를 설명한다. 무료 플랜도 월별 영상 처리 한도가 있다.
- 스마트폰 브라우저에서 웹사이트가 작동하는 것과, GitHub Pages 앱이 해당 사이트의 자막 결과를 안전하게 직접 호출할 수 있는 것은 별개다.
- 결정: 두 서비스 모두 timestamped transcript 데이터 형식의 참고 후보로만 둔다. API 키를 공개 저장소/클라이언트 코드에 넣지 않는다. 현재 정적 Pages + 서버 없음 + 무료/쿼터 최소화 조건에서는 핵심 의존성으로 채택하지 않는다.
- 주의: YouTubeScribe/VideoQuill 브랜드와 가격/무료 조건의 최신 일관성이 확인되지 않았으므로 무제한 무료 API로 간주하지 않는다. YT2Text 문서 내 무료 한도/API 키 플랜 설명도 가입 전 재확인한다.
- 참고: https://youtubescribe.com/docs ; https://youtubescribe.com/api-access ; https://videoquill.com/ ; https://docs.yt2text.cc/guide/getting-started/ ; https://docs.yt2text.cc/reference/faq/


## 결정 016 — 일반 웹페이지의 YouTube iframe 내부 자막 직접 읽기
- 상태: 브라우저 보안 문서 확인
- 확인: 영상책과 YouTube iframe은 서로 다른 출처다. 동일 출처 정책에 따라 일반 페이지 JavaScript는 교차 출처 iframe의 내부 문서/DOM에 자유롭게 접근할 수 없다.
- 결정: YouTube iframe 내부 자막 DOM을 영상책에서 직접 읽는 설계를 채택하지 않는다. 공식적으로 허용된 메시지/API 통로가 별도로 확인될 경우에만 재평가한다.
- 출처:
  - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

## 결정 017 — Android Chrome 확장 프로그램 경로는 현재 환경에 부적합
- 상태: 2026-10 공개 Chromium 담당자 답변 확인
- 확인: Chromium Extensions 담당자는 Chrome 모바일에 확장 프로그램 지원 계획이 없다고 답변했다.
- 결정: Android Chrome을 사용하는 영상책의 기본 해결책으로 데스크톱 Chrome/Edge 확장 프로그램을 요구하지 않는다.
- 출처: https://groups.google.com/a/chromium.org/g/chromium-extensions/c/tCUm3kceybk

## 결정 018 — 브라우저 음성 인식 입력 범위 구분
- 상태: 공식 브라우저 문서 확인
- 확인: 확인한 Web Speech API 문서는 마이크 또는 사용자가 선택한 오디오/비디오 파일을 입력으로 설명한다. YouTube iframe 내부에서 재생 중인 교차 출처 오디오를 자동으로 전달받는 기능은 확인되지 않았다.
- 결정: 마이크/파일 기반 음성 인식은 YouTube iframe 오디오 자동 전사와 같은 기능으로 취급하지 않는다. 로컬 미디어 STT는 별도 후보로 유지한다.
- 출처: https://learn.microsoft.com/en-us/microsoft-edge/web-platform/speech-recognition-api


## 결정 019 — GitHub Actions는 실시간 자막 백엔드가 아님
- 상태: GitHub 공식 문서 확인
- 확인:
  - GitHub Pages는 HTML/CSS/JavaScript 등 정적 파일을 게시하는 호스팅 서비스이며 서버 측 언어 실행을 지원하지 않는다.
  - GitHub Actions workflow는 저장소 이벤트, 외부 dispatch, 수동 실행 또는 예약에 의해 시작되는 작업이다.
  - 각 job은 runner 실행 환경에서 수행되며, workflow는 상시 HTTP 요청을 수신하는 웹 서버가 아니다.
  - Actions REST API를 통해 workflow를 실행할 수 있지만, 이것은 방문자 요청에 실시간 응답하는 일반적인 백엔드 API와 다르다.
- 결정: Actions를 실시간 YouTube 자막 요청 서버로 사용하지 않는다. 빌드, 검사, 배포 및 관리 자동화 용도로만 사용한다.
- 보안: 공개 GitHub Pages JavaScript에 PAT 또는 비밀 토큰을 넣지 않는다.
- 제품 목표는 변경하지 않는다. 현재 YouTube 재생 화면에서 자막을 자동 확보하고 시간대별로 동기화하는 것이 계속 핵심 목표다.
- 출처:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows
  - https://docs.github.com/en/actions/get-started/understand-github-actions
  - https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
  - https://docs.github.com/en/rest/actions/workflow-runs


## 결정 020 — TranscriptLayer는 사용 후보에서 제외
- 상태: 공개 문서 확인
- 확인:
  - TranscriptLayer는 공개 YouTube 영상의 기존 자막 트랙을 timestamped segments 및 JSON/SRT/VTT로 제공하는 API를 문서화한다.
  - 무료 가입 크레딧은 100이며, 성공한 선택 트랙 1개당 1 credit. 무료 계정의 요청 속도 제한은 분당 120회다.
  - API는 Bearer API key를 요구하고, 키를 공개하거나 공유하지 말라고 명시한다. 정적 GitHub Pages 코드에 키를 넣을 수 없다.
  - 공개 API 문서에서 CORS 허용 정책은 확인되지 않았다.
  - Acceptable Use Policy는 접근 통제/지역 제한/플랫폼 보안 우회, 쿠키/로그인정보 제공, 한도 회피를 금지한다.
  - Privacy Policy는 계정을 성인(18세 이상)으로 제한한다.
- 결정: 사용자의 연령 조건에 맞지 않으므로 계정 생성/서비스 사용/연동을 진행하지 않는다. 기술 구조와 timestamped transcript schema 참고용으로만 보관한다.
- 출처:
  - https://transcriptlayer.com/docs/
  - https://transcriptlayer.com/signup/
  - https://transcriptlayer.com/acceptable-use/
  - https://transcriptlayer.com/privacy/


## 결정 021 — TranscriptFetch 무키 체험 경로를 자동 공급원으로 채택하지 않음
- 상태: 공개 안내 및 약관 검색 결과 확인
- 서비스 안내 글은 무키 체험을 네트워크당 하루 10회로 제한한다고 설명한다.
- 서비스 약관은 스크립트/봇을 통한 자막 수집, 경쟁 데이터셋 구축, 방문자/계정 한도 회피를 금지한다.
- 결정: 사람의 일회성 웹 UI 사용과 영상책의 자동 호출을 구분한다. 자동화가 금지되는 서비스를 영상책의 자막 공급원으로 연결하지 않는다.
- 다음 검토 범위: 제작자가 제공/허가한 자막과 공식적으로 허용된 인터페이스.
- 출처: https://transcriptfetch.com/blog/youtube-transcript-api-no-key ; https://youtubetranscripts.io/terms/


## 결정 022 — 제작자 허가 SRT/VTT 정적 파일을 우선 검증
- 상태: 공식 문서 및 현재 코드 확인
- 확인:
  - YouTube `captions.list`는 OAuth 인증과 50 quota units가 필요하며, 자막 본문이 아닌 트랙 정보를 반환한다.
  - `captions.download`는 OAuth 인증, 해당 영상 수정 권한, 200 quota units가 필요하다. 제작자/소유자 권한이 있는 영상에는 공식 경로지만 임의 공개 영상 시청자용 범용 API가 아니다.
  - IFrame Player API의 captions 모듈은 플레이어 내 표시 설정과 reload를 제어하지만 자막 전문을 앱에 반환하지 않는다.
  - YouTube Studio는 제작자가 SRT/VTT 등 자막 파일을 업로드할 수 있도록 한다.
  - 영상책 현재 코드에는 SRT/VTT 로컬 파서와 시간 동기화 UI가 구현되어 있다.
- 결정: 현재 GitHub Pages 정적 앱/서버 없음/무료 우선 조건에서 다음 검증 후보는 제작자가 제공 또는 사용을 허가한 SRT/VTT 파일을 저장소의 정적 경로에 두고, 영상 ID와 파일 경로를 매핑해 자동 로드하는 방식이다. 동일 출처 파일은 서버/API 키 없이 브라우저에서 읽을 수 있다.
- 외부 호스트의 자막 URL은 CORS 허용이 확인되어야 브라우저 fetch가 가능하다. 공개 URL만으로 접근 가능하다고 가정하지 않는다.
- 범위: 등록된 허가 영상에만 자동 연결되는 방식이며, 모든 공개 영상의 자막을 자동 취득하는 해결책은 아니다.
- 구현 전 조건: 허가된 샘플 영상 및 SRT/VTT 파일로 Android 실기기 검증. 이번 VB-08에서는 코드 변경을 하지 않는다.
- 출처:
  - https://developers.google.com/youtube/v3/guides/implementation/captions
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download
  - https://developers.google.com/youtube/iframe_api_reference
  - https://support.google.com/youtube/answer/2734796?hl=en
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS


## 결정 023 — Wistia/Brightcove/TI 스크립트 기능은 일반 YouTube 자막 공급원에서 제외
- 상태: 공식 문서 및 공개 페이지 범위 확인
- 확인:
  - TI의 `View video with transcript`는 TI 사이트의 스크립트 제공 사례지만 외부에서 읽을 수 있는 자막 전문/API/파일 주소는 확인되지 않았다.
  - Wistia는 자사 미디어의 transcript embed와 captions 다운로드/API를 지원하지만 API 조회에는 권한이 있는 계정 token이 필요하다.
  - Brightcove는 제작자가 제공한 WebVTT 등의 자막을 Brightcove Player에 연결하는 구조이며, 외부 자막 파일은 CORS 설정이 필요할 수 있다.
  - 세 사례 모두 일반 YouTube 영상의 자막 전문을 영상책으로 전달하는 인터페이스가 아니다.
- 결정: 이 플랫폼들을 일반 YouTube 자막 자동 취득 경로로 구현하지 않는다. 각 서비스의 자체 영상용 기능이라는 범위를 유지한다.
- 남은 선택지: 제작자 허가 SRT/VTT 파일이 있는 일부 영상만 자동 연결하거나, 외부 서버/API를 허용하는 별도 아키텍처를 검토한다. 현재 조건 전체를 만족하는 범용 경로는 확인되지 않았다.
- 출처:
  - https://support.wistia.com/en/articles/8274062-transcripts-and-captions
  - https://docs.wistia.com/reference/get_medias-mediahashedid-captions-languagecode
  - https://docs.wistia.com/docs/transcript-embeds
  - https://player.support.brightcove.com/user-interface/adding-captions-videos-programmatically.html
  - https://mstudio.support.brightcove.com/media/managing-text-tracks.html
  - https://developers.google.com/youtube/iframe_api_reference


## 결정 024 — 영상책의 비용은 무료만 허용
- 상태: 사용자 명시 결정 및 공식 요금/제한 문서 대조
- 사용자 요구: 무료만 사용. 저렴한 유료 서비스도 허용하지 않는다.
- 제외:
  - 유료 API, 서버, AI 서비스
  - 무료 체험 종료 후 결제가 필요한 서비스
  - 결제 수단 등록 또는 유료 플랜 전환이 핵심 기능의 조건인 서비스
  - 무료 사용량 소진 시 유료 전환을 요구하는 외부 서비스의 핵심 의존성
- 유지:
  - GitHub Free 공개 저장소와 GitHub Pages 정적 호스팅
  - 브라우저 내 처리
  - 기존 SRT/VTT 파서와 자막 시간 동기화 UI
- 확인:
  - GitHub Pages는 GitHub Free 공개 저장소에서 제공되는 정적 호스팅이며 서버 측 언어 실행을 지원하지 않는다. 사용량 제한/soft limit은 존재한다.
  - Cloudflare Workers Free에는 일일 100,000 요청 및 요청별 CPU 시간 등 제한이 있다. 현재 조사 범위에서 이 무료 서버리스 플랜이 일반 YouTube 영상의 자막 전문을 공식적으로 공급할 수 있다는 근거는 확인되지 않았으므로 채택하지 않는다.
  - YouTube captions.list는 OAuth를 요구하고 실제 자막 본문을 반환하지 않는다. captions.download는 OAuth 및 해당 영상 수정 권한이 필요하다. 일반 공개 영상의 무료 범용 자막 API가 아니다.
- 결정: 서버리스 무료 플랜이 존재한다는 이유만으로 채택하지 않는다. 무료이고, 사용 조건에 부합하며, 실제 자막 데이터를 합법적·안정적으로 제공한다는 세 조건이 모두 확인되어야 후보로 인정한다.
- 출처:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
  - https://developers.cloudflare.com/workers/platform/limits/
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download


## 결정 025 — 범용 공개 YouTube 자동 자막은 현재 구조에서 보류
- 상태: 공식 YouTube API/IFrame API 및 브라우저 보안 문서 재검증 완료
- 확인:
  - IFrame Player API captions 모듈의 문서화된 옵션은 플레이어 내 자막의 `fontSize`와 `reload`다. 별도 자막 패널용 cue 텍스트/타임스탬프 반환 메서드는 확인되지 않았다.
  - YouTube Data API의 `captions.list`는 자막 본문이 아닌 트랙 정보를 반환한다. `captions.download`는 OAuth 및 영상 수정 권한이 필요하다.
  - 교차 출처 YouTube iframe 내부 DOM은 일반 페이지 JavaScript에서 읽을 수 없다. 외부 자막 파일을 브라우저에서 fetch하려면 제공 서버가 CORS를 허용해야 한다.
  - GitHub Pages는 정적 사이트 호스팅이며 요청 시점의 자막 추출 서버가 아니다.
- 결정: 비용 0원, 서버 없음, GitHub Pages 정적 호스팅 조건에서 임의 공개 YouTube 영상의 자막 전문 자동 취득 기능을 구현하지 않는다. 비공식 인터페이스/프록시/서비스 한도 우회도 채택하지 않는다.
- 유지할 수 있는 범위: 사용자가 선택한 SRT/VTT 파일의 파싱·동기화·문장 클릭 seek. 제작자 제공/허가 파일이 준비되면 저장소 정적 파일 + 영상 ID 매핑으로 등록 영상에 한해 자동 연결할 수 있다.
- 구현 조건: 실제 사용 허가가 확인된 샘플 영상과 자막 파일을 확보한 뒤 자동 fetch 및 Android 실기기 동기화를 검증한다. 샘플이 없는 상태에서 자동 매핑 코드를 추측으로 추가하지 않는다.
- 출처:
  - https://developers.google.com/youtube/iframe_api_reference
  - https://developers.google.com/youtube/data/reference/rest/v3/captions
  - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages


## 결정 026 — 등록된 허가 자막은 동일 출처 정적 파일로 자동 연결
- 상태: 코드 골격 반영, 실제 샘플 검증 대기
- 구현:
  - 저장소 루트 `captions.json`에 YouTube video ID → `captions/` 내 SRT/VTT 상대 경로를 등록한다.
  - `app.js`가 영상을 불러올 때 등록 목록을 조회하고, 등록된 경로만 동일 GitHub Pages 출처에서 fetch한다.
  - 파일 경로는 `captions/` 하위 SRT/VTT로 제한하고 상위 경로 이동 문자열을 거부한다.
  - 기존 파서와 cue 동기화/seek UI를 재사용하며, 영상 변경 시 이전 비동기 응답이 새 영상 자막을 덮지 않도록 요청 식별자를 사용한다.
- 현재 등록 목록은 비어 있다. 실제 사용 허가가 확인된 샘플 파일이 없으므로 어떤 YouTube 영상도 새 자동 등록 자막을 제공하지 않는다.
- 검증 대기: 실제 허가 SRT/VTT 파일을 등록한 뒤 GitHub Pages에서 fetch 성공, cue 표시, 재생 동기화, 문장 클릭 seek를 확인하고 Android 실기기에서 회귀 테스트한다.
- 기존 로컬 SRT/VTT 선택 기능은 유지한다. 범용 공개 YouTube 자막 자동 취득으로 확대 해석하지 않는다.


## Decision 027 — 수동 자막 파일 읽기 경쟁 상태 방지 (2026-11-11)
- 수동 SRT/VTT 파일을 읽는 동안 영상 또는 다른 자막 파일이 선택되면, 이전 비동기 파일 읽기 결과를 폐기한다.
- 자동 등록 자막 로드와 수동 파일 로드 모두 동일한 captionLoadToken을 사용해 오래된 결과가 현재 화면 상태를 덮어쓰지 않도록 한다.
- 검증 범위는 구문 검사와 합성 SRT/VTT 파서 입력이다. 실제 허가 자막/영상 연결, Android 기기, GitHub Pages 배포는 별도 실기기 확인이 필요하다.
- 0원 개발 조건을 유지하며 새 서비스나 유료 의존성을 추가하지 않는다.


## Decision 028 — 등록 자막 레지스트리는 유효한 JSON이어야 함 (2026-11-11)
- captions.json은 브라우저 response.json()으로 읽으므로 엄격한 JSON 문법을 따라야 한다.
- 설명용 예시는 JSON 값으로만 남기고, 실제 영상 ID 매핑으로 오인되지 않도록 한다. 실제 자막이 제공/허가되지 않은 영상 ID는 등록하지 않는다.
- 정적 저장소 검사와 합성 데이터 로더 검사를 먼저 수행한다. 실영상 자막 파일은 실제 동기화/배포 확인이 필요한 단계에서만 요청한다.


## Decision 029 — 겹치는 자막 cue의 활성 선택 규칙 (2026-11-11)
- 자막 cue가 겹치면 현재 시각 이전에 시작한 cue 중 가장 늦게 시작했고 아직 끝나지 않은 cue를 활성 문장으로 선택한다.
- 단순 이진 탐색으로 임의의 겹친 cue를 고르지 않는다. 시작 시각 정렬을 유지한 뒤 upper-bound 탐색과 역방향 확인을 사용한다.
- 실제 영상 재생 및 Android 스크롤 동작은 별도 실기기 검증으로 남긴다.


## 결정 030 — 영상 ID 및 자막 시간값 검증 (2026-11-11)
- YouTube 주소에서 추출한 영상 ID도 원시 입력 ID와 동일하게 [A-Za-z0-9_-]{11} 형식이어야 한다. 잘못된 길이의 ID를 플레이어로 전달하지 않는다.
- SRT/VTT 타임스탬프의 초와 분 필드는 0~59 범위만 허용한다. 범위를 벗어난 타임스탬프는 cue로 채택하지 않는다.
- 주소 형식별 정상/비정상 사례와 SRT/VTT 시간 경계는 격리 함수 테스트로 확인한다. 브라우저 실기기 검증은 별도다.


## 결정 031 — 수동 스크립트 붙여넣기 UI는 제품 목표로 채택하지 않음
- 상태: 이전 작업에서 잘못 추가했다가 제거함
- 확인: 사용자가 확정한 제품 흐름은 영상책에서 YouTube 링크를 열면 이용 가능한 자막을 자동으로 확보하고 별도 패널에 동기화하는 것이다. 스크립트 수동 복사/붙여넣기는 요청된 흐름이 아니다.
- 결정: 임의로 추가했던 붙여넣기 입력창·파서·버튼을 제거했다. 로컬 SRT/VTT 선택 기능은 내부 테스트용 보조 기능으로 유지한다.
- 후속: 자동 취득을 가능하게 하는 정책 준수 경로를 다시 조사하되, 비용/쿼터/서버/기기 조건을 바꾸는 작업은 먼저 사용자에게 설명하고 승인받는다.


## 결정 026 — AI 작업 행동강령과 회차별 검증 기록 의무화
- 결정일: 2026-11-11
- 상태: 사용자 요청으로 확정
- 내용:
  1. 영상책 관련 작업을 시작할 때마다 저장소 최신 상태와 기준 문서를 먼저 조회한다.
  2. 사용자에게 작업 목표·이유·범위·검증 방법을 먼저 알린다.
  3. 변동 가능한 사실은 당일 1차 출처와 독립된 근거로 교차 확인한다. 근거 부족과 자료 충돌을 명시하고 추측으로 메우지 않는다.
  4. 무료 0원, Android 스마트폰, GitHub Pages 우선, YouTube 자막 자동 확보라는 요구사항을 사용자 승인 없이 변경하지 않는다.
  5. 작업 종료 후 성공/실패/부분 성공/미실행을 구분하고, 변경 파일·커밋·검사 결과·남은 위험·다음 작업을 GitHub에 기록한다.
  6. 코드 합성 테스트를 실제 Android/브라우저/배포 성공으로 과장하지 않는다.
- 상세 절차: [AGENT_WORK_RULES.md](./AGENT_WORK_RULES.md)
- 이번 회차에서 확인한 운영상 결함: 이전 대화에서 조사·실수·검증 여부를 매번 저장소에 반영하지 못했다. 이번 결정으로 절차를 명문화했으며, 이후 실제 준수 여부를 매 회차 점검한다.


## Decision 032 — 비공식 YouTube 스크래핑/내부 API 기반 자막 취득은 채택하지 않음 (2026-11-11)
- 상태: 확정
- 배경: 공개된 오픈소스 프로젝트 중 YouTube 자막을 읽는 Python 라이브러리, 브라우저 지원 JavaScript 내부 API 클라이언트, CLI 도구를 조사했다.
- 근거:
  1. YouTube 이용약관은 허가되지 않은 자동 접근(robots/scrapers 등)을 제한한다.
  2. YouTube API Developer Policies는 undocumented API 사용과 YouTube 애플리케이션 스크래핑 및 스크랩된 데이터 획득을 금지한다.
  3. MIT/Unlicense 등 오픈소스 코드 라이선스는 해당 코드의 재사용 권한이지 YouTube 데이터 취득 권한을 부여하지 않는다.
  4. YouTube.js가 브라우저에서 실행된다는 사실만으로 내부 API 접근이 허용되는 것은 아니다.
- 결정:
  - youtube-transcript-api, YouTube.js의 비공식/내부 인터페이스 기반 수집 경로, yt-dlp 자동 수집을 영상책의 일반 공개 영상 자막 기능에 적용하지 않는다.
  - 정책 제한 우회, 프록시를 통한 스크래핑, 비공개 요청 인터페이스 복제 등을 구현하지 않는다.
  - 공식 API는 영상 소유/편집 권한이 있는 경우에 한해 별도 검토한다.
- 공식 API 제한: captions.list는 트랙 메타데이터만 반환하고 OAuth 및 50 quota units가 필요하다. captions.download는 영상 편집 권한과 OAuth가 필요하고 200 quota units가 든다.
- 결과: 현재 무료 0원·무서버·Android·임의 공개 영상 자동 취득을 모두 만족하는 정책 준수 경로는 확인되지 않았다. 제품 목표 자체를 변경한 것은 아니며, 목표 달성 경로가 미해결 상태임을 명확히 한다.
- 참고: [AGENT_WORK_RULES.md](./AGENT_WORK_RULES.md), [VB-14 조사 기록](./PROJECT_STATUS.md#9-vb-14--공개-자막-추출-프로젝트-조사-및-정책-적합성-판정-2026-11-11)

## Decision 033 — 독립 자막 API는 핵심 의존성으로 채택하지 않음 (2026-11-11)
- 상태: 확정 (현재 제약 기준)
- 배경: TranscriptFox, Transcript.land, GetYouTubeTranscript의 최신 공개 API 문서·이용약관·개인정보 안내를 비교했다.
- 근거:
  1. TranscriptFox는 API key 없이 쓸 수 있으나 익명 하루 1건, 첫 10분 제한 및 서비스 전체 한도가 있다. 공개 API의 원본 YouTube 캡션 취득 권한과 브라우저 CORS 지원은 문서에서 확인되지 않았다.
  2. Transcript.land는 API key와 월 15분 무료 한도를 요구하며 외부 서버/ASR 처리에 의존한다. 일부 원문은 웹 조회에서 HTTP 402로 열리지 않아 추가 확인이 필요하다.
  3. GetYouTubeTranscript는 일회성 무료 100 credits 및 API key가 필요하며 공개 README가 자체 서비스의 YouTube scraping infrastructure를 명시한다.
  4. YouTube API Services Terms 3.2는 법적 구속력이 있는 계약 체결 연령 미달자의 API 약관 수락/사용을 금지한다. 사용자 연령을 고려해 API 계정/OAuth 가입을 진행하지 않는다.
  5. YouTube 공식 API의 captions.download는 해당 영상 편집 권한과 OAuth가 필요하므로 임의 공개 영상의 시청자용 자막 API가 아니다.
- 결정:
  - 세 외부 서비스를 영상책의 핵심 자동 자막 공급원으로 통합하지 않는다.
  - 무료 한도, 외부 서버, CORS, 권리 취득 방식, 개인정보 처리 중 하나라도 확인되지 않은 서비스는 채택하지 않는다.
  - 비공식 스크래핑 또는 undocumented API 접근을 구현하지 않는다.
  - 제작자가 명시적으로 제공/허가한 SRT/VTT 파일의 정적 등록 경로만 제한적으로 유지한다.
- 제품의 범용 자동 자막 목표를 포기한 것은 아니다. 현재 0원·무서버·Android·정책 준수 조건을 동시에 충족하는 경로를 찾지 못해 미해결로 유지한다.
- 상세 근거: RESEARCH_BENCHMARKS.md §21, PROJECT_STATUS.md §10.

## Decision 034 — YouTube 공식 대본 페이지 링크를 보조 경로로 제공 (2026-11-11)
- 상태: 구현, 실기기 검증 대기
- 근거: YouTube Help는 자막이 있는 영상에서 공식 '대본 보기' 기능과 문장별 시점 이동을 안내한다. Developer Policies는 undocumented API와 YouTube 앱 스크래핑을 금지한다.
- 결정:
  - 유효한 YouTube video ID가 입력되면 표준 YouTube 시청 페이지 링크를 노출한다.
  - 사용자는 YouTube 공식 UI에서 대본이 제공되는지 확인하고 읽을 수 있다.
  - 영상책이 YouTube 페이지의 대본 DOM을 읽거나 대본을 자동 복제한다고 주장하지 않는다.
  - 내부 패널은 제작자가 제공/허가한 SRT/VTT 등록 파일만 자동 로드한다.
  - 비공식 API, 스크래핑, 프록시, 접근 제한 우회는 구현하지 않는다.
- 이 fallback은 사용자에게 공식 대본으로 가는 경로를 제공하지만, 영상책 내부 자동 자막 취득 목표를 완료한 것은 아니다.
- 참고: https://support.google.com/youtube/answer/15930243, https://developers.google.com/youtube/terms/developer-policies

## Decision 035 — 영상책의 제1 목표와 사용자 흐름 재확정 (2026-11-11)
- 상태: 사용자 요구사항 확정, 기술 구현 경로 미해결
- 핵심 사용자 흐름:
  1. 영상책 페이지 안에서 YouTube 영상 검색
  2. 검색 결과에서 영상 선택 및 앱 안에서 재생
  3. 스크립트/자막 자동 추출
  4. 추출 스크립트의 맞춤법·띄어쓰기·문장부호 교정
  5. 교정된 스크립트를 영상책 페이지 안에 표시하고, 시간 정보가 있으면 재생과 동기화
- 모바일 웹 YouTube에서는 사용자가 대본을 복사하기 어렵다고 명시했으므로, YouTube에서 복사해 오도록 요구하는 흐름은 금지한다. 수동 복사·붙여넣기 UI도 다시 추가하지 않는다.
- YouTube 공식 대본 페이지 링크는 보조 링크일 뿐, 영상책 내부 자동 추출·교정·표시의 대체물이 아니다.
- 검색 기능과 자막 본문 추출 기능은 별개로 검증한다. 검색 API가 있다고 해서 임의 공개 영상의 transcript를 가져올 수 있다고 추정하지 않는다.
- 정책 경계: undocumented/private API, 앱/웹 DOM 스크래핑, 프록시 또는 접근 제한 우회는 구현하지 않는다. 공식·권한 기반 경로를 우선 확인한다.
- 고정 제약: 0원, Android 스마트폰, GitHub Pages 정적 웹앱 우선, 외부 유료 AI/API·카드·유료 전환 무료 쿼터 비의존. 사용자의 별도 승인 없이 변경하지 않는다.
- 현재 판정: 이 조건을 모두 충족하는 공개 영상 자동 스크립트 추출 경로는 아직 확인되지 않았다. 기술적으로 불가능하다고 최종 단정하지 않고 다음 조사 과제로 유지한다.
- 후속 순서: (1) 공식 검색의 쿼터/키/연령 조건 재확인, (2) 정책 준수 자동 추출 경로 검증, (3) 추출 성공 후 브라우저 내 한국어 맞춤법 교정, (4) 내부 표시/동기화 검증.
- 상세 요구사항 및 대화 복원 요약: [PROJECT_CONTEXT.md §13](./PROJECT_CONTEXT.md#13-최우선-제품-목표와-대화-복원-기준--2026-11-11), [PROJECT_STATUS.md §12](./PROJECT_STATUS.md#12-vb-17--사용자-최우선-목표-재확정-및-문서-복원-2026-11-11).


## Decision 036 — YouTube 공식 검색 API와 자막 추출을 별도 판정 (2026-11-11)
- 상태: 공식 검색 API 존재 확인, 현재 사용자·정적 앱 조건에서는 구현 보류; 범용 공개 영상 자막 자동 추출은 미해결.
- 검색:
  - YouTube Data API `search.list`는 공식 공개 영상 검색 경로다.
  - 기본 한도는 하루 100회, 호출당 1 quota unit이며 추가 페이지도 별도 호출이다.
  - API 프로젝트/자격 증명이 필요할 수 있고, Developer Policies는 자격 증명을 공개 오픈소스 프로젝트에 삽입하지 못하도록 한다.
  - GitHub Pages 정적 클라이언트에는 비밀 키를 안전하게 보관할 수 있는 서버가 없다.
  - API Services Terms §3.2의 법적 계약 연령 조건 때문에 사용자가 직접 약관 수락·키 발급·OAuth를 진행하지 않는다. 연령 제한 우회나 타인 계정 대여는 제안하지 않는다.
- 자막:
  - `captions.list`는 트랙 메타데이터만 반환하고 본문을 반환하지 않으며 OAuth scope와 50 units가 필요하다.
  - `captions.download`는 OAuth scope, 해당 영상 편집 권한, 200 units가 필요하다.
  - 따라서 임의 공개 영상의 일반 시청자 권한으로 자동 추출하는 범용 공식 경로가 아니다.
- 정책:
  - undocumented API, YouTube/Google 앱 스크래핑, 스크랩된 데이터 취득은 채택하지 않는다.
  - 검색 결과 원문·이미지·정보를 임의로 변경하거나 다른 출처와 섞지 않는 등 API Client 정책을 따라야 한다.
- 현재 결정:
  - API 키/계정/OAuth를 설정하지 않고, 검색 기능도 현 상태에서 코드에 연결하지 않는다.
  - 기존 제작자 제공/허가 SRT/VTT 정적 등록 기능은 보조 경로로만 유지한다.
  - 자동 자막 추출을 확보하기 전에는 맞춤법 교정 UI를 핵심 구현 진전으로 포장하지 않는다.
  - 이번 조사로 모든 가능한 기술 경로가 불가능하다고 단정하지 않는다.
- 근거: RESEARCH_BENCHMARKS.md §23, PROJECT_STATUS.md §13.


## Decision 037 — 제작자 제공 자막 파일은 제한적 정적 등록 경로로 유지 (2026-11-11)
- 상태: 기존 코드 경로 확인, 실제 파일 E2E 검증 대기.
- 근거:
  - YouTube Studio는 권한 있는 제작자/편집자가 자막 트랙 파일을 다운로드하는 공식 UI를 제공한다.
  - YouTube 공식 도움말은 SRT와 WebVTT를 지원하며 SRT는 UTF-8 plain text를 요구한다.
  - 영상책 `app.js`는 `captions.json`의 video ID → `captions/` 파일 경로를 읽고, 파일을 파싱해 플레이어 시간과 동기화하는 코드가 이미 있다.
- 결정:
  - 권리자가 공개 저장소에 자막 파일을 게시하도록 명시적으로 허가한 SRT/VTT 파일만 정적 registry에 등록한다.
  - YouTube Studio 다운로드 권한과 공개 재배포 권한을 혼동하지 않는다.
  - 권리 허가가 없는 자막 파일은 GitHub 저장소에 업로드하지 않는다.
  - 사용자가 기기 내 파일 선택기를 이용하는 기존 경로는 별도로 유지하되, 수동 텍스트 복사·붙여넣기는 도입하지 않는다.
  - 이 경로는 제작자 제공 파일 연결이며, 앱 내부 YouTube 검색 또는 임의 공개 영상 자동 추출의 대체 완료가 아니다.
- 검증되지 않은 실제 파일 등록/E2E 테스트는 완료로 표시하지 않는다.
- 근거: PROJECT_STATUS.md §14, RESEARCH_BENCHMARKS.md §24.


## Decision 038 — 제작자 제공 파일 경로는 일반 시청자용 해결책으로 제안하지 않음 (2026-11-11)
- 상태: 확정된 제품 관점 정리. 기존 코드는 변경하지 않음.
- 사용자 관점: 영상책의 목표 사용자는 일반 유튜브 시청자이며 제작자/편집 권한자가 아니다.
- 결정:
  - 제작자에게 연락하거나 YouTube Studio에서 자막 파일을 다운로드하거나 권리 허가 SRT/VTT를 제공하도록 사용자에게 요구하지 않는다.
  - 제작자 파일 정적 등록 경로는 역사적 기술 참고 및 명시적 권리 허가가 있는 테스트 자료에 한정한다. 일반 시청자용 핵심 기능/해결책으로 소개하지 않는다.
  - 공식 대본 UI는 YouTube 내에서 사용자가 직접 읽는 기능으로만 분류하며, 영상책이 본문을 자동 취득하는 경로로 간주하지 않는다.
  - Captions API의 `list`/ `download`는 일반 시청자 권한으로 임의 공개 영상 자막 본문을 얻는 수단이 아니다.
  - IFrame Player API는 재생 제어/시간 조회용이며, 공식 문서에서 transcript 본문 취득 메서드는 확인되지 않았다.
  - undocumented API, YouTube 앱 스크래핑, 프록시/접근 제한 우회는 구현하지 않는다.
  - 현재 적합한 공식 자동 취득 경로가 확인되지 않았으므로 핵심 기능은 미해결로 유지한다. 모든 가능한 방법이 불가능하다고 단정하지 않는다.
- 근거: PROJECT_STATUS.md VB-20, RESEARCH_BENCHMARKS.md §25.


## Decision 039 — AI 대안 제안 전 사용자 관점 적합성 검증 의무화 (2026-11-11)
- 상태: 사용자 요청에 따라 행동강령에 반영.
- 발생 원인: 일반 시청자용 영상책에 제작자/편집 권한이 필요한 SRT/VTT 확보 경로를 다음 단계로 제안했다. 코드상 연결 가능성은 있었지만 목표 사용자가 직접 실행할 수 없는 경로였다.
- 결정:
  1. 모든 대안에 대해 목표 사용자의 실제 역할, 계정/권한, 기기, 비용, 추가 행동을 먼저 확인한다.
  2. 특수 권한자만 수행할 수 있는 절차는 일반 사용자용 해결책으로 제시하지 않는다.
  3. 보조 링크, 수동 파일, 제작자 제공 파일, 로컬 파일, 데모/합성 테스트는 핵심 기능의 대체 완료로 표현하지 않는다.
  4. 제안 전에 실제 사용자 시나리오("누가, 어떤 기기와 권한으로, 어떤 행동을 해, 어떤 결과를 얻는가")를 검증한다.
  5. 부적합한 대안을 제시한 사실을 발견하면 원인을 인정하고 관련 문서·로드맵·행동강령을 함께 정정한 뒤 재조회한다.
- 영상책 구체 규칙: 목표 사용자는 일반 유튜브 시청자다. 제작자 연락, YouTube Studio 접근, 제작자 자막 파일 확보를 요구하지 않는다.
- 행동강령: AGENT_WORK_RULES.md §10.
- 작업 기록: PROJECT_STATUS.md VB-21.


## Decision 040 — 브라우저 STT 및 IFrame captions 옵션을 자동 자막 취득 해결책으로 채택하지 않음 (2026-11-11)
- 상태: 조사 기반 비채택 결정.
- 근거:
  - Web Speech API는 STT이며 YouTube transcript API가 아니다. 기본 Chrome 음성 인식은 서버 기반일 수 있고 Android Chrome on-device 처리 지원은 확인되지 않았다.
  - Android Chrome의 화면/시스템 오디오 캡처 지원은 확인되지 않았다.
  - YouTube IFrame API captions 모듈의 공식 옵션은 fontSize와 reload뿐이며, transcript 본문/cue를 반환하지 않는다.
- 결정:
  1. 마이크로 휴대폰 스피커 소리를 다시 듣게 하는 방식은 사용자 행동 부담, 정확도, 동기화, 개인정보 및 지속 무료 여부가 검증되지 않아 핵심 경로로 채택하지 않는다.
  2. IFrame captions 모듈 존재를 transcript 본문 취득 가능성으로 해석하지 않는다.
  3. 문서화된 옵션 범위(fontSize, reload)를 확인했으므로 동일한 확인을 반복하지 않는다.
  4. 새 후보는 일반 시청자가 Android에서 직접 사용할 수 있고 실제 텍스트 본문을 앱에 제공한다는 공식 근거가 있을 때만 검증한다.
- 상세 기록: PROJECT_STATUS.md VB-22, RESEARCH_BENCHMARKS.md §26.


## Decision 041 — 자막 추출 생태계 조사를 STT보다 우선하고 비공식 코드 통합은 보류 (2026-11-11)
- 상태: 조사 우선순위 확정.
- 원인: 공식 문서와 IFrame 옵션 확인 뒤 공개 라이브러리·실제 코드·커뮤니티 사례를 충분히 비교하기 전에 STT로 조사 방향을 넓혔다. 사용자의 핵심 목표(기존 YouTube 자막/대본을 일반 시청자 관점에서 가져오기)와 우선순위가 어긋났다.
- 결정:
  1. 기술 대안 탐색이 필요한 경우 공식 문서 외에 GitHub 실제 소스/이슈, npm 등 패키지, Reddit/사용자 경험을 함께 조사한다. 사용자가 폭넓은 조사를 요청한 핵심 과제는 10개 이상의 서로 다른 검색 질의와 복수 출처 교차 검증을 수행한다.
  2. README만 보지 않고 실제 추출 코드와 실행 런타임, CORS, 서버/프록시, 유지보수 위험을 확인한다.
  3. InnerTube, timedtext scrape, 페이지 스크래핑 등 공개 저장소의 비공식 구현은 기술 참고로만 분류하며 영상책에 복사·통합하지 않는다.
  4. STT는 기존 자막 추출 생태계 조사 이후 별도 후보로만 다룬다.
  5. 브라우저 DOM 방식은 사용자가 원본 YouTube 페이지에서 이미 볼 수 있는 DOM을 읽는 것인지, 영상책 iframe에서 읽는 것인지 구분한다.
- 행동강령: AGENT_WORK_RULES.md §11.
- 작업 기록: PROJECT_STATUS.md VB-23, RESEARCH_BENCHMARKS.md §27.


## Decision 042 — 스크래핑은 유형별로 평가하며 일괄 배제하지 않는다 (2026-11-11)
- 상태: 조사 분류 및 우선순위 결정.
- 배경: 사용자는 스크래핑이 핵심 자막 취득의 현실적인 방법일 수 있다고 지적했다. "스크래핑"을 하나의 방법처럼 다뤄 빠르게 비채택한 것은 충분한 분석이 아니었다.
- 결정:
  1. 화면에 렌더링된 transcript DOM 읽기를 가장 가까운 기술 후보로 조사한다.
  2. YouTube 페이지 내부 네트워크 응답 가로채기, 비공식 endpoint 직접 요청, 서버/헤드리스 브라우저를 각각 별도 유형으로 분리한다.
  3. 기술적 가능성과 약관/정책 적합성을 별도 판정한다. 사용자 클릭 후 DOM을 읽는 방식도 약관상 자동화 scraper가 아니라고 단정하지 않는다.
  4. 차단 회피(프록시 회전, 토큰/CAPTCHA 우회, 세션 모방)는 영상책에서 구현하지 않는다.
  5. Android Chrome 확장 미지원, Firefox Android의 호환성 제한, 확장과 정적 웹앱 사이의 데이터 전달을 고려한다.
  6. 약관상 허용 근거가 불명확하면 실제 제품 배포 전 미해결 위험으로 표시한다.
- 행동강령: AGENT_WORK_RULES.md §12.
- 상세 조사: PROJECT_STATUS.md VB-24, RESEARCH_BENCHMARKS.md §28.


## Decision 043 — Firefox Android 확장 연계는 기술 후보로 유지하되 정책 허용 근거 전 채택 보류 (2026-11-12)
- 상태: 조사 기반 보류 결정.
- 근거:
  - Firefox Android는 확장을 설치할 수 있지만 모든 확장이 Android와 호환되는 것은 아니다.
  - Firefox 정식/베타용 확장은 Mozilla 서명이 필요하며, 자체 배포 XPI는 Android에서 파일을 통한 추가 설치 과정이 필요하다. AMO 등록에는 개발자 계정과 제출/검증이 필요하다.
  - WebExtensions의 runtime.sendMessage, tabs.sendMessage, tabs.query, storage.local을 조합하면 원본 YouTube 탭에서 영상책 탭으로 cue 데이터를 전달하는 구조를 설계할 수 있다. Android Firefox에서 실제 동작은 미검증이다.
  - YouTube Terms는 자동화 수단을 통한 서비스 접근을 제한한다.
  - YouTube API Developer Policies는 API Client의 YouTube Applications 스크래핑 및 스크랩 데이터 취득을 금지한다. API Client 정의는 YouTube API Services를 사용하는 웹사이트/앱이며, 문서는 IFrame Player API를 해당 서비스의 예시로 명시한다. 영상책은 IFrame Player API를 사용하므로 정책 관련성을 무시할 수 없다.
- 결정:
  1. DOM scraping은 기술적으로 가능한 후보라는 점은 유지한다.
  2. 사용자 클릭 또는 화면에 표시된 transcript라는 사실만으로 약관상 허용된다고 단정하지 않는다.
  3. 영상책은 IFrame Player API 사용으로 API Client 정책이 관련될 가능성이 높으므로, YouTube의 명확한 서면 승인 또는 적용 가능한 공식 허용 근거가 확인되기 전 scraping 코드를 통합·배포하지 않는다.
  4. 확장→앱 전달 구조는 설계 참고로만 보관한다. Android 실기기 설치·API 호환·E2E는 미실행 상태다.
  5. 사용자의 복사·붙여넣기, 제작자 자막 파일, 외부 서버/유료 API로 핵심 요구를 대체하지 않는다.
- 상세 기록: PROJECT_STATUS.md VB-25, PROJECT_CONTEXT.md §20, RESEARCH_BENCHMARKS.md §29.


## Decision 044 — 공식 허가 경로가 확인되기 전 YouTube DOM scraping 보류 유지 (2026-11-13)
- 상태: 공식 문서/실제 신청 양식 확인에 따른 보류.
- 확인:
  1. YouTube Terms는 자동화 수단 접근 제한과 YouTube의 사전 서면 허가 예외를 명시한다.
  2. YouTube API Developer Policies III.E.6은 API Client의 직접/간접 YouTube Applications 스크래핑 및 스크랩 데이터 취득을 금지한다. 해당 조항은 공개 검색엔진 예외를 별도로 언급하지만 일반 API Client 전체에 대한 승인 예외를 명시하지 않는다.
  3. 영상책은 IFrame Player API를 사용하므로 API Client 정의와 정책의 관련성이 높다.
  4. Terms의 사전 서면 허가가 Developer Policies의 API Client scraping prohibition까지 면제하는지 공식 답변은 없다.
  5. 정책 문서의 사전 승인 링크는 실제로 YouTube Data API Services Audit and Quota Extension Form으로 연결된다. 폼의 요청 유형은 추가 할당량 감사와 요청받은 재감사이며, API 프로젝트 번호 및 API Client URL/개인정보처리방침 등을 요구한다. 일반적인 scraping-only 허가 신청 유형은 확인되지 않았다.
  6. YouTube Legal Support 이메일은 공식 연락처로 확인되지만, 자동화 접근 허가 요청을 접수하는 곳이라고 명시되어 있지 않다.
  7. API Services Terms §3.2는 계약 체결 법적 연령에 도달하지 않은 자의 계약 수락 및 API 사용을 금지한다. 사용자에게 계약/프로젝트/양식 제출을 안내하지 않는다.
- 결정:
  - 공식 허가 절차나 정책 예외가 확인되지 않은 상태에서는 scraping 코드와 확장 배포를 진행하지 않는다.
  - 일반 Terms의 서면 허가 문구만으로 API Developer Policies도 면제된다고 추정하지 않는다.
  - Compliance Audit과 Legal Support를 scraping permission channel이라고 부르지 않는다.
  - API 프로젝트 생성, 계약 수락, 타인 명의 제출을 사용자에게 권하지 않는다.
  - 핵심 목표는 유지하되 허가 확보 전까지 자막 자동 취득 기능은 미해결로 둔다.
- 회차 회고 및 상세 근거: PROJECT_STATUS.md VB-26, PROJECT_CONTEXT.md §21, RESEARCH_BENCHMARKS.md §30.
