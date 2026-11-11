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
