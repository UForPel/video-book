# 영상책 프로젝트 상황판

마지막 정리: 2026-11-11
저장소: https://github.com/UForPel/video-book
배포 페이지: https://uforpel.github.io/video-book/

이 문서를 프로젝트의 **현재 상태 단일 기준표**로 사용합니다.

## 1. 전체 상태

상태 표기: [x] 확인 완료 · [~] 진행 중 · [?] 코드 반영/검증 대기 · [ ] 미착수 · [!] 막힘/결정 필요

| 영역 | 상태 | 현재 확인된 사실 | 다음 확인/작업 |
|---|---|---|---|
| GitHub 저장소/문서 | [x] | 전용 저장소와 요구사항/결정/조사 문서 존재 | 변경 때 문서 갱신 |
| GitHub Pages 및 기본 화면 | [x] | Android에서 기존 사이트 열림 확인. Pages는 정적 파일 호스팅 | 변경 후 회귀 확인 |
| GitHub Actions 실시간 백엔드 가능성 | [x] | 이벤트/수동/예약 실행형 작업이며 요청을 상시 수신하는 웹 서버가 아님 | 빌드·검사·배포 용도로만 활용 |
| YouTube 영상 재생/시점 이동 | [x] | Android 실기기에서 재생과 예시 시점 이동 성공 보고 | 핵심 기능 변경 시 회귀 확인 |
| 로컬 SRT/VTT 파서 | [?] | 코드/합성 SRT·VTT 파싱 검사 통과, 실제 한국어 파일 실기기 검증 미확인 | Android에서 한국어 SRT/VTT 인코딩 및 표시 확인 |
| YouTube 자막 자동 취득 | [!] | 범용 공개 영상의 무료·공식 자동 취득 경로 미확인. 등록형 연결 코드는 있으나 허가 자막 등록은 0건 | 범용 자동 취득은 기술/정책 조건이 바뀌기 전까지 보류 |
| Hyperaudio Lite | [?] | timed transcript 동기화 UI 참고 자료. 자동 자막 취득 기능은 아님 | UI 개선 때 구조 참고 |
| Hyperaudio 독립 실험 페이지 | [!] | 사용자에게 안내한 URL이 404였음. 사용자 테스트 대상에서 제외 | 재테스트 요청하지 않음 |
| 자막 자동 교정 | [ ] | 미구현 | 자막 공급 경로가 해결된 뒤 설계 |
| 앱 내 YouTube 검색 | [ ] | 미구현 | 공식 API 쿼터 또는 검색 대안 결정 |
| 실제 장면 이미지/요약/피드 | [ ] | 후속 기능 | 핵심 자막 기능 뒤로 보류 |

## 2. 제품 목표

1. 영상책 안에서 YouTube 영상을 검색하거나 주소로 연다.
2. 영상은 영상책 화면 안에서 재생한다.
3. 현재 영상의 자막을 가능한 경우 자동으로 확보한다.
4. 시간대별 자막을 영상과 동기화한다.
5. 문장을 누르면 영상이 해당 시점으로 이동한다.
6. 자막을 읽기 좋게 교정하고 편집한다.

기기에서 SRT/VTT 파일을 직접 선택하는 기능은 개발 시험용 보조 기능이며 최종 흐름이 아니다.

## 3. 개발 제약

- Android 스마트폰에서 개발/사용 가능해야 함.
- GitHub Pages 정적 웹앱을 우선한다.
- 유료 API/AI를 핵심 기능의 필수 의존성으로 두지 않는다.
- 무료 서비스도 쿼터/사용량/가용성 제한을 확인한다.
- 완전 무제한 무료라고 검증되지 않은 서비스를 그렇게 표현하지 않는다.
- 전화번호 인증이 필요한 도구는 가급적 피한다.
- YouTube 정책, 저작권, 개인정보, 제3자 서비스 약관을 확인한다.
- 공개 저장소에 비밀키/토큰을 올리지 않는다.
- 실제 Android 테스트 전에는 완료로 표시하지 않는다.
- 한 번에 하나의 핵심 작업만 진행한다.

## 4. 자동 자막 확보 방식 비교 결과

| 방식 | 필요한 실행 환경 | 쿼터/제한 관점 | 현재 판정 |
|---|---|---|---|
| 공식 YouTube Captions API | OAuth + 해당 영상 수정 권한 | 공식 API 정책/쿼터 적용 | 임의 공개 영상용으로 부적합 |
| IFrame Player API | GitHub Pages 브라우저 | 플레이어 제어는 가능하지만 자막 전문 반환 기능 미확인 | 재생 전용 |
| Transcript Studio | Chrome/Edge 확장 프로그램 + YouTube 탭 권한 | README가 YouTube 요청 제한 가능성을 전제. Android Chrome 확장 미지원 | Pages 앱/현재 Android 환경에 부적합 |
| yttext | Python/FastAPI 로컬 또는 별도 호스팅 서버 | YouTube 429 및 서버 자원/요청 제한 | 정적 Pages 단독 불가 |
| 로컬 STT | 사용자가 제공한 미디어 + 브라우저 내 모델 | 외부 API 호출을 피할 수 있지만 기기 성능/파일 제약 | 후속 검증 후보 |
| SRT/VTT 직접 제공 | 사용자 기기 브라우저 | 외부 API 쿼터 없음 | 보조 기능 |

중요:
- “API 키 없음”은 “요청 제한 없음”을 뜻하지 않는다.
- “무료 오픈소스”는 “서버 비용 없음” 또는 “무제한 서비스”를 뜻하지 않는다.
- 브라우저 확장 프로그램 권한은 일반 웹페이지(GitHub Pages)에 자동으로 부여되지 않는다.
- 별도 서버 방식은 서버 운영 비용, 용량, 요청 제한, 남용 방지와 유지보수가 필요하다.
- 조사한 후보 중 임의 공개 영상 자동 자막 + 무료/무제한 + 서버 없음 + GitHub Pages만 사용을 모두 만족하는 안정적·정책 검증 경로는 확인되지 않았다.

## 5. VB-10 조사 결과 — 2026-11-11

공식 YouTube IFrame Player API의 captions 모듈은 플레이어 안 자막의 글자 크기와 reload를 제어한다. 별도 자막 패널에 필요한 cue 전문/타임스탬프를 반환하는 문서화된 메서드는 확인되지 않았다. 공식 Captions API의 `captions.list`는 트랙 메타데이터만 반환하고, `captions.download`는 OAuth 및 해당 영상 수정 권한을 요구하므로 일반 시청자의 임의 공개 영상용 API가 아니다.

브라우저의 동일 출처 정책은 YouTube iframe 내부 DOM 직접 접근을 막으며, 외부 자막 파일 fetch에는 제공 서버의 CORS 허용이 필요하다. GitHub Pages는 정적 호스팅이므로, 요청 시점에 YouTube 자막을 추출하는 서버 역할을 하지 않는다.

**결론:** 비용 0원 + 서버 없음 + GitHub Pages 조건을 유지하면 임의 공개 YouTube 영상의 자막 전문을 자동 취득하는 공식·안정적 경로는 현재 확인되지 않았다. 제작자 제공/허가 SRT/VTT 파일을 저장소에 등록하고 영상 ID와 매핑하면 해당 영상에 한해서는 자동 연결할 수 있다. 허가 샘플이 없으므로 등록형 자동 연결의 실제 자막 로드는 아직 검증하지 않았다. VB-11에서 빈 등록 목록과 자동 fetch 골격은 추가했으며, 기존 로컬 SRT/VTT 업로드와 동기화 기능은 유지한다.

출처:
- https://developers.google.com/youtube/iframe_api_reference
- https://developers.google.com/youtube/data/reference/rest/v3/captions
- https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

### VB-11 구현 진행 — 2026-11-11
- `app.js`에 YouTube 영상 ID 기준의 정적 자막 등록 목록(`captions.json`) 조회 기능을 추가했다.
- 등록된 경로가 `captions/` 폴더의 SRT/VTT 파일인지 검사한 뒤 동일 GitHub Pages 출처에서 fetch하고, 기존 자막 파서·시간 동기화·문장 클릭 seek를 재사용한다.
- 영상 ID를 빠르게 바꿨을 때 이전 요청의 늦은 응답이 새 영상 자막을 덮어쓰지 않도록 요청 토큰을 적용했다.
- `captions.json`은 현재 빈 등록 목록이며, `captions/README.md`에 제작자 제공/사용 허가 파일 등록 방법을 기록했다.
- 실제 허가 샘플이 없으므로 등록 영상/실제 자막 자동 로드와 Android 실기기 동기화는 아직 검증되지 않았다. 임의 영상이나 가짜 자막은 등록하지 않았다.
- 앱 코드 외에 자막 등록 파일과 안내 문서만 추가했다. GitHub Pages 배포 완료 및 Android 실기기 확인은 아직 주장하지 않는다.

## 6. 사용자 테스트 및 기록 원칙

실기기 결과는 사용자가 직접 보고한 것만 기록합니다. 테스트가 필요할 때는 영상책의 실제 화면에서 핵심 기능을 확인하고, 별도 참고 프로젝트 페이지를 사용자 테스트로 떠넘기지 않습니다.

작업 종료 때 코드 변경 여부, 조사 결과, 미검증 사항, 다음 작업 하나를 문서에 반영합니다.


## 7. 호스팅형 자막 사이트/API 조사 — 2026-11-11
- YouTubeScribe API 문서에서 timestamped transcript segments, Bearer key, credit 차감 및 rate limit을 확인. 현재 홈페이지가 VideoQuill로 리디렉션되어 서비스 브랜드/무료 조건은 추가 확인 필요.
- YT2Text 공식 문서에서 API key 인증, 별도 VPS 백엔드, 비동기 job, 무료 플랜 영상 수 제한을 확인.
- 두 서비스 모두 API 키를 정적 공개 웹앱에 안전하게 보관할 수 없으므로 서버 없는 현재 구조의 핵심 의존성으로 채택하지 않음.
- 자막 timestamp 데이터 구조 참고 후보로만 보관.
- 당시 조사 단계의 기록이며, 이후 VB-08까지 진행됨. 최신 작업은 문서 하단의 현재 다음 작업을 기준으로 한다.


## 8. 브라우저 직접 접근 경로 조사 — 2026-11-11
- 동일 출처 정책상 GitHub Pages에서 실행되는 일반 JavaScript는 교차 출처 YouTube iframe 내부 DOM/자막 텍스트를 직접 읽을 수 없음을 MDN 문서로 확인.
- Chromium Extensions 담당자의 공개 답변에서 Chrome 모바일 확장 프로그램 지원 계획이 없음을 확인. Android Chrome 환경의 데스크톱 확장 프로그램 방식은 현재 적용 대상에서 제외.
- 확인한 Web Speech API 문서는 마이크/선택한 미디어 파일 입력을 설명하며, YouTube iframe 오디오를 직접 입력받는 기능은 확인되지 않음.
- 조사 완료: 호스팅형 자막 사이트의 브라우저 직접 호출/서버 중계/CORS/인증/무료 한도를 구분했고, 후속 결과는 아래 항목에 기록함.


## 9. GitHub Actions의 요청 시점 백엔드 가능성 — 2026-11-11
- GitHub 공식 문서에서 Actions workflow는 저장소 이벤트, 외부에서 발생시킨 repository_dispatch, 수동 workflow_dispatch, 예약 실행으로 시작되는 자동화 작업임을 확인.
- 각 job은 runner에서 실행되고, runner는 workflow job을 수행하는 실행 환경이다. 계속 HTTP 요청을 수신하는 상시 웹 서버가 아니다.
- GitHub Pages는 HTML/CSS/JavaScript 등 정적 파일을 게시하는 서비스이며 서버 측 언어 실행을 지원하지 않는다.
- Actions REST API로 workflow 실행을 요청할 수는 있지만, 브라우저 방문자마다 즉시 요청을 처리하고 동기식으로 결과를 반환하는 백엔드 API와는 구조가 다르다. 공개 정적 코드에 PAT/비밀 토큰을 포함하는 설계는 금지한다.
- 판정: GitHub 내부 우선 원칙은 유지하되, Actions를 실시간 자막 추출 서버로 사용하지 않는다. Actions는 빌드/테스트/배포 및 관리 자동화 용도로 사용한다.
- 자동 자막 목표는 변경하지 않는다. 다음은 GitHub 안에서 가능한 대안 중 브라우저에서 안전하게 동작하는 공개 기능/데이터 경로가 있는지 한 가지씩 검증한다.
- 출처: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages ; https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows ; https://docs.github.com/en/actions/get-started/understand-github-actions ; https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows ; https://docs.github.com/en/rest/actions/workflow-runs


## 10. 공개 자막 API 후보의 사용 조건 확인 — 2026-11-11
- TranscriptLayer 공개 문서는 YouTube 공개 영상의 기존 자막 트랙을 JSON/segments/SRT/VTT로 반환하는 API를 설명한다. 성공한 선택 트랙 1개당 1 credit, 무료 계정은 가입 시 100 credits, 무료 분당 120 API 요청 제한을 안내한다.
- API는 Bearer API key 인증을 요구하며 키를 공개 코드에 넣거나 공유하지 말라고 명시한다. API 문서에서 브라우저 CORS 허용 여부는 확인되지 않았다.
- Acceptable Use Policy는 접근 통제 우회, 쿠키/로그인정보 제공, 제한 회피를 금지하고, 적법하게 처리할 권리/허가가 있는 콘텐츠만 요청하도록 한다.
- Privacy Policy는 계정을 성인(18세 이상)으로 제한한다고 명시한다. 따라서 이 프로젝트의 현재 사용자 환경에서 계정 생성/서비스 사용 후보로 채택하지 않는다.
- 판정: 기술 구조/응답 데이터 형식의 참고 자료로만 기록. 연동 및 가입 진행하지 않음.
- 출처: https://transcriptlayer.com/docs/ ; https://transcriptlayer.com/signup/ ; https://transcriptlayer.com/acceptable-use/ ; https://transcriptlayer.com/privacy/


## 11. 무키 공개 체험형 자막 서비스의 자동 호출 적합성 — 2026-11-11
- TranscriptFetch의 공개 비교 글은 무키 체험 경로를 소개하며 네트워크당 하루 10회 제한을 명시한다. 같은 글은 로컬 도구는 사용자 자신의 네트워크에서 동작하지만 클라우드 주소에서는 YouTube가 더 강하게 차단할 수 있다고 설명한다.
- 관련 서비스 약관은 영상책이 스크립트/봇으로 자막을 수집하거나 방문자/계정별 사용 한도를 회피하는 행위를 금지한다.
- 판정: 일회성 웹 UI 이용과 영상책 자동화 호출은 구분한다. 자동 호출/한도 공유/회피가 금지되는 서비스를 영상책 자막 공급원으로 채택하지 않는다.
- 다음 검토는 영상 제작자 허가/공개 제공 자막 또는 공식적으로 허용된 임베드/데이터 인터페이스로 한정한다.
- 출처: https://transcriptfetch.com/blog/youtube-transcript-api-no-key ; https://youtubetranscripts.io/terms/


## 12. 제작자 제공/허가 자막 경로 조사 — VB-08 — 2026-11-11

### 공식 YouTube Captions API
- `captions.list`는 OAuth 2.0 인증이 필요하고 영상의 자막 트랙 메타데이터만 반환한다. 자막 본문은 반환하지 않는다. 문서상 호출 비용은 50 quota units다.
- `captions.download`는 OAuth 2.0 인증과 해당 영상에 대한 수정 권한을 요구한다. SRT/VTT 등으로 내려받을 수 있지만 호출 비용은 200 quota units다.
- 따라서 영상 제작자/채널 소유자 또는 해당 영상 수정 권한을 부여받은 사용자에게는 공식 경로가 될 수 있지만, 임의 공개 영상의 시청자에게 제공되는 자동 자막 API는 아니다.
- 영상책에 OAuth 계정 연결과 토큰 보관/보안 처리를 추가해야 하므로 현재의 서버 없는 단순 정적 앱에 바로 넣지 않는다.
- IFrame Player API의 captions 모듈은 플레이어 안의 자막 표시 설정(글자 크기 등)과 reload 제어를 제공하지만, 자막 텍스트/타임스탬프 전문을 앱에 반환하지 않는다.

### 제작자가 제공하는 SRT/VTT 파일
- YouTube Studio는 제작자가 자막 파일을 업로드하거나 텍스트를 입력해 영상에 자막을 추가할 수 있도록 지원한다.
- 영상책의 현재 코드에는 SRT/VTT 파서, 로컬 파일 선택, 재생 시점 기반 활성 자막 강조, 자막 클릭 시 seek가 이미 구현되어 있다. 다만 자동으로 자막 파일을 찾거나 가져오는 기능은 없다.
- 가장 단순한 서버 없는 자동 연결 후보는 제작자가 제공/허가한 SRT/VTT 파일을 영상책 저장소의 정적 경로에 두고, 영상 ID와 파일 경로를 정적 목록(JSON 등)으로 연결하는 방식이다. Pages와 같은 출처에서 파일을 가져오면 외부 API 키/서버가 필요하지 않으며, 영상이 열릴 때 영상 ID로 등록된 자막 파일을 자동 로드할 수 있다.
- 제작자가 별도 도메인에 파일을 호스팅하는 경우에는 해당 서버가 영상책 출처에 CORS 접근을 허용해야 브라우저 JavaScript의 fetch로 내용을 읽을 수 있다. 단순 공개 URL이라는 사실만으로 CORS가 허용되는 것은 아니다.
- 이 방식은 제작자 제공 파일이 등록된 영상에만 자동 연결된다. 모든 YouTube 공개 영상의 자막을 자동으로 찾아오는 범용 기능은 아니다. 파일 배포/저장에 대한 제작자 허가와 저작권 조건도 확인해야 한다.

### 판정 및 다음 단계
- 공식 Captions API는 소유/수정 권한이 있는 영상의 선택적 경로로만 기록하고, 현재 MVP 기본 경로로 채택하지 않는다.
- 영상책의 현재 제약을 유지하면서 검증할 다음 후보는 제작자 허가 SRT/VTT의 정적 호스팅 + 영상 ID 매핑이다.
- 이번 조사에서는 코드 변경을 하지 않았다. 자동 연결 구현 전에 실제로 사용할 수 있는 허가된 샘플 자막과 대상 영상 한 건을 기준으로 자동 fetch 및 Android 동기화를 검증한다.
- 출처:
  - https://developers.google.com/youtube/v3/guides/implementation/captions
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download
  - https://developers.google.com/youtube/iframe_api_reference
  - https://support.google.com/youtube/answer/2734796?hl=en
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS


## 13. 제조사 스크립트 플랫폼 후보 재검증 — VB-09 — 2026-11-11
- TI의 `View video with transcript`는 TI 자체 사이트가 영상과 스크립트를 함께 표시하는 사례다. 그러나 스크립트 원문을 외부 사이트의 일반 JavaScript가 읽을 수 있는지, 자막 파일/SRT/VTT 주소가 있는지는 확인되지 않았다. 따라서 영상책의 자막 공급원으로 채택하지 않는다.
- Wistia 공식 문서는 자사 미디어의 transcript/captions 생성, 업로드, 다운로드와 transcript embed를 설명한다. 별도 Captions API의 자막 조회는 계정 권한이 있는 API token을 요구한다. Wistia 미디어 전용 기능이므로 일반 YouTube 영상의 자막을 가져오는 경로가 아니다.
- Brightcove 공식 문서는 제작자가 WebVTT/SRT 등을 등록하고 자체 Brightcove Player에 `<track>`으로 연결하는 방식을 설명한다. 외부 호스팅 파일은 CORS 허용이 필요하다. 이는 Brightcove에 호스팅된 영상/자체 플레이어 경로이며 일반 YouTube 영상의 자막 공급원이 아니다.
- 판정: TI/Wistia/Brightcove를 일반 YouTube 자막 자동 취득 후보에서 제외한다. 각 플랫폼 자체 영상에 자막을 표시하는 기능과 YouTube 자막을 영상책에 가져오는 기능을 혼동하지 않는다.
- 현재 `app.js` 재확인: YouTube 영상 재생, SRT/VTT 파일 파싱, 문장 클릭 시 seek, 재생 시점에 따른 활성 cue 강조는 이미 구현되어 있다. 자동 자막 전문 취득/자동 파일 연결은 구현되어 있지 않다.
- 코드/배포 변경: 없음. 허가된 샘플 파일이 없는 상태에서 임의 자막 파일을 추가하거나 실제 영상과 맞지 않는 가짜 자막을 매핑하지 않았다.
- 판정 이후 남은 현실적인 경로: (1) 제작자 허가 SRT/VTT 파일이 제공되는 영상에 한정한 자동 연결, 또는 (2) 외부 서버/API 도입을 허용하는 별도 설계 검토. 두 경로 모두 현재의 ‘모든 공개 YouTube 영상 + 무료/무제한 + 서버 없음’ 요구를 동시에 만족한다고 확인된 것은 아니다.
- 공식 출처:
  - https://support.wistia.com/en/articles/8274062-transcripts-and-captions
  - https://docs.wistia.com/reference/get_medias-mediahashedid-captions-languagecode
  - https://docs.wistia.com/docs/transcript-embeds
  - https://player.support.brightcove.com/user-interface/adding-captions-videos-programmatically.html
  - https://mstudio.support.brightcove.com/media/managing-text-tracks.html
  - https://developers.google.com/youtube/iframe_api_reference


## 14. 비용 조건 확정 — 2026-11-11
- 사용자 결정: 영상책 개발은 **무료만 허용**한다. 저렴한 유료 서비스도 사용하지 않는다.
- 제외: 유료 API/서버/AI, 유료 플랜으로의 전환이 필요한 서비스, 무료 체험 후 결제, 결제 수단 등록을 요구하는 핵심 의존성.
- 핵심 경로 원칙: 무료 사용량이 소진되면 기능이 중단되거나 유료 전환을 요구하는 외부 서비스를 핵심 자막 공급원으로 채택하지 않는다.
- 유지: GitHub Free 공개 저장소 + GitHub Pages 정적 호스팅, 브라우저 내 처리, 기존 SRT/VTT 파서와 동기화 UI.
- 공식 문서 확인: GitHub Pages는 GitHub Free 공개 저장소에서 사용할 수 있는 정적 호스팅이며 서버 측 언어 실행을 지원하지 않는다. GitHub Pages 사용량에는 권장 저장소/사이트 크기와 soft bandwidth/build limits가 있다.
- 무료 Workers 등의 서버리스 플랜은 일일 요청/CPU 제한이 있는 별도 서비스다. 현재 확인한 무료 한도만으로 YouTube 자막 전문을 합법적·공식적으로 공급할 수 있는 것은 아니므로 채택하지 않는다.
- 공식 YouTube Captions API는 OAuth 인증 및 영상 수정 권한이 필요하며, captions.list는 자막 본문을 반환하지 않는다. 일반 공개 영상 시청자의 무료 범용 자막 공급원으로 사용할 수 없다.
- 후속 작업 VB-11은 허가된 SRT/VTT의 등록형 자동 연결을 실제 샘플로 검증한다. 비용이 발생하거나 무료 한도 소진 시 결제가 필요한 경로는 제안·구현하지 않는다.
- 출처:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
  - https://developers.cloudflare.com/workers/platform/limits/
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download


## 15. VB-11 코드 안정성 재검사 — 2026-11-11
- 등록형 자동 자막 로더의 경로 검증, 요청 토큰 처리, 오류 안내 흐름을 재검토했다.
- 추가로 발견한 경쟁 상태: 사용자가 SRT/VTT 파일을 선택한 직후 파일 읽기(arrayBuffer)가 끝나기 전에 영상을 바꾸면, 늦게 끝난 파일 읽기가 새 영상의 자막을 덮어쓸 수 있었다.
- 수정: 수동 파일 선택 시 요청 토큰을 보관하고, 파일 읽기가 끝난 뒤에도 현재 토큰과 일치하는지 확인한다. 다른 영상/파일 선택으로 토큰이 바뀌었다면 오래된 결과를 폐기한다.
- 검증: app.js 전체 JavaScript 구문 검사 통과. 기존 파서로 SRT 샘플 2개 cue, VTT 샘플 1개 cue를 정상 파싱하고 잘못된 형식은 0개 반환하는 것을 확인했다. 경로 검사에서 정상 captions 경로 허용 및 상위 경로 이동 문자열 거부를 확인했다.
- 제한: 이는 코드 수준의 합성 입력 검사이며 실제 YouTube 영상·실제 제작자 허가 자막·Android 브라우저·GitHub Pages 배포 검증을 대체하지 않는다.
- 비용: 추가 서비스/유료 API/서버 도입 없음. 0원 조건 유지.


## 16. VB-11 저장소 정적 점검 — 2026-11-11
- 사용자가 요청한 대로 실제 영상/자막을 요구하기 전에 GitHub 저장소 파일만으로 가능한 검사를 수행했다.
- 발견한 실제 결함: captions.json의 _example_format 항목이 JSON 문법에 맞지 않아 response.json()이 실패한다. 따라서 등록형 자동 자막 로더가 모든 영상에서 레지스트리를 읽지 못하는 상태였다.
- 수정: captions.json을 정상 JSON으로 고치고, 예시를 실제 매핑으로 오인하지 않도록 설명 문자열로 변경했다. 실제 자막 매핑은 비워 두었다.
- 추가 검사: HTML의 JS 참조 요소 ID 누락 없음, 로컬 script 경로 존재, JS 구문 유효, 레지스트리 JSON 파싱 성공. 격리된 함수 테스트에서 등록된 VTT 샘플 1 cue 로드, 매핑 없음 처리, 상위 경로 접근 거부를 확인했다. 이전 응답에서 수정한 비동기 파일 읽기 토큰 보호도 유지됨.
- 합성 VTT는 파서/로더 검사 전용이며 실제 영상 자막이 아니다. 따라서 실영상 재생 동기화, 브라우저 네트워크, Android, Pages 배포 검증과는 구분한다.
- 결론: 사용자가 실제 자막 파일을 보내지 않아도 저장소 코드 검증을 계속할 수 있고, 이번에는 실제 결함을 찾아 수정했다.


## 17. VB-11 코드 감사 및 동기화 수정 — 2026-11-11
- 프로젝트 목표와 현재 구현을 대조했다. 현재 앱은 YouTube 재생 + 별도 자막 패널 + 로컬 SRT/VTT + 허가 파일 등록형 자동 연결 골격까지이며, 범용 자동 자막 취득/요약/사진/피드는 구현되지 않았다.
- updateActiveCue()가 자막 cue가 겹칠 때 이진 탐색 중 임의의 겹치는 cue를 선택할 수 있는 문제를 확인했다. SRT/VTT는 겹치는 시간 구간이 있을 수 있으므로, 현재 시각 이전에 시작한 마지막 cue부터 역방향으로 검사해 가장 늦게 시작한 활성 cue를 선택하도록 수정했다.
- 검사: 일반 연속 cue의 시작/끝 경계 및 공백 구간, 겹치는 cue의 활성 선택을 합성 데이터로 확인. JavaScript 구문 검사 통과.
- 제한: 실제 영상 재생과 Android 브라우저의 스크롤/강조 동작은 실기기에서 확인하지 않았다.
- 다음 작업은 기능을 더 추가하는 것이 아니라 현재 MVP 범위와 남은 핵심 요구사항을 기준으로 테스트 계획을 고정하는 것이다.


## 18. VB-12 주소 및 자막 시간값 검증 — 2026-11-11
- 주소 처리 감사에서 getVideoId()가 youtu.be/watch URL에서 추출한 ID의 길이를 재검사하지 않는 문제를 확인했다. 예를 들어 https://youtu.be/abc도 문자열 abc를 반환해 플레이어에 잘못된 ID가 전달될 수 있었다.
- 수정: 원시 ID뿐 아니라 youtu.be, watch, embed, shorts, live 경로에서 추출한 ID도 영문자/숫자/밑줄/하이픈 11자리인지 확인한다.
- 시간 파서 감사에서 초·분이 59를 초과해도 숫자로 변환되는 문제를 확인했다. 수정 후 범위를 벗어난 시간은 거부한다.
- 격리 함수 테스트 18/18 통과: 지원 주소 유형 7개, 잘못된 ID/도메인 3개, SRT/VTT 시간 6개, SRT CRLF 및 VTT 헤더/기본 엔티티 파싱 2개. 전체 app.js 구문 검사 통과.
- 테스트는 브라우저 API를 모의한 격리 함수 검사이며 Android 실기기/실제 영상/Pages 배포 검증이 아니다. 자막 cue 활성 강조의 실기기 스크롤도 미검증 상태다.
- 새 서비스·서버·유료 API를 추가하지 않았다. 0원 조건 유지.
- 다음 확인은 Android에서 정상/잘못된 주소 입력, 실제 SRT/VTT 파일 선택, 영상 재생 중 활성 cue 강조와 문장 클릭 seek를 한 차례 확인하는 것이다.


## 19. VB-13 작업 정정 — 2026-11-11

- 직전 작업에서 사용자 요구와 다르게 YouTube 스크립트 수동 붙여넣기 UI를 추가했으나, 프로젝트 기준 문서(README.md, PROJECT_CONTEXT.md, PROJECT_STATUS.md, DECISIONS.md 결정 007)에 명시된 최종 흐름과 맞지 않아 제거했다.
- `app.js`, `index.html`, `style.css`에서 붙여넣기 입력창·파서·버튼 코드를 되돌렸다. 로컬 SRT/VTT 선택은 기존 개발 시험용 보조 기능으로 유지한다.
- 이번 실수로 추가한 수동 붙여넣기 기능은 제품 요구사항이나 로드맵으로 채택하지 않는다.
- 다음 작업은 임의 공개 YouTube 영상의 자막 자동 취득을 위한 정책 준수 경로를 다시 검토하는 것이다. 코드 변경 전 비용/쿼터/서버/Android 호환성을 비교하고 사용자 승인 없이 제약을 바꾸지 않는다.


## 8. AI 작업 운영 절차 및 이번 회차 점검 — 2026-11-11

### 행동강령 적용
- 새 문서 [AGENT_WORK_RULES.md](./AGENT_WORK_RULES.md)를 추가했다. 영상책 관련 매 작업 전 저장소 문서/최신 커밋 조회, 당일 최신 근거 확인, 교차 검증, 작업 전 설명, 작업 후 성공·실패·미실행 기록을 의무화한다.
- 사용자 요구를 재확인: 비용 0원, Android 스마트폰, GitHub Pages 정적 웹앱 우선, 영상 링크에서 자막 자동 확보가 핵심 목표. 수동 복사·붙여넣기를 제품 목표로 대체하지 않는다.

### 이번 회차 조사 기록
- 저장소 기준 문서 5종(README, PROJECT_CONTEXT, PROJECT_STATUS, DECISIONS, ROADMAP)과 RESEARCH_BENCHMARKS를 다시 조회했다.
- 공개 비교 목록에서 자막을 가져오는 라이브러리/호스팅 API/음성 인식 도구가 서로 다른 실행 구조임을 확인했다. 공개 목록은 후보 탐색용 2차 자료이므로 개별 저장소의 README·라이선스·이슈와 원문을 추가 확인해야 한다.
- TranscriptFox API 문서는 계정/API key 없이 호출 가능하다고 안내하지만 익명 1일 1건, 로그인 1일 10건 및 첫 10분 제한, 서비스 전체 처리 한도 등을 명시한다. 핵심 무제한 공급원이 아니다.
- **자료 충돌 발견:** TranscriptFox API 문서는 API가 기존 캡션/저장 transcript만 읽고 음성인식을 시작하지 않는다고 설명한다. 반면 Privacy 문서는 링크에 캡션이 없으면 서버가 오디오를 내려받아 외부 음성인식 서비스로 전송한다고 설명한다. API와 웹사이트의 처리 경로 차이일 수도 있으나 문서만으로 API 범위를 확정할 수 없어 개인정보/처리 경로는 미확인으로 남긴다.
- API 문서의 POST 방식은 확인했으나, 브라우저 CORS/OPTIONS preflight, 영상책의 실제 POST 응답, 대상 영상의 자막 반환 여부는 이번 회차에 실행하지 않았다.
- 따라서 TranscriptFox는 채택하지 않고 조사 후보로만 유지한다. 가입·결제·API 통합·코드 변경은 하지 않았다.

### 결과
- 성공: 기존 기준 문서와 미해결 목표 재조회, AI 작업 행동강령 초안의 저장소 반영.
- 실패: 이전 작업들이 일관되게 행동강령을 조회하고 진행/실패를 기록하지 못했다는 운영상 결함을 확인.
- 미실행: 실시간 POST/CORS 브라우저 검증, 실제 대상 영상 조회, Android 실기기, 배포 확인.
- 코드/앱 기능 변경: 없음.
- 비용: 0원, 외부 계정/API 사용 없음.
- 다음 작업: 공개 소스 프로젝트와 자막 사이트의 구현 구조를 개별 원문으로 검증하고, 영상책 조건에 맞는 후보만 비교한다.


## 9. VB-14 — 공개 자막 추출 프로젝트 조사 및 정책 적합성 판정 (2026-11-11)

### 작업 전 확인
- 이번 회차 시작 시 `AGENT_WORK_RULES.md`, `README.md`, `PROJECT_CONTEXT.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `DECISIONS.md`, `RESEARCH_BENCHMARKS.md`를 다시 조회했다.
- 핵심 목표는 YouTube 링크를 입력하면 이용 가능한 자막을 자동 확보해 별도 시간 동기화 패널에 표시하는 것이다. 변경 금지 조건은 0원, Android 스마트폰, GitHub Pages 정적 웹앱 우선, 수동 복사·붙여넣기는 제품 흐름이 아님이다.

### 조사 대상과 확인 결과
1. `jdepoix/youtube-transcript-api`: README는 일반/자동 생성 자막, 언어 선택, 타임스탬프가 있는 snippet을 제공하는 Python 라이브러리라고 설명한다. 현재 pyproject.toml은 버전 1.2.5, MIT, Python >=3.8,<3.16, requests 의존성을 표시한다. Python 패키지이므로 GitHub Pages 정적 브라우저 앱에서 직접 실행하는 기본 구조가 아니며, 서버/런타임 추가는 현재 제약과 충돌한다.
2. `LuanRT/YouTube.js`: README는 브라우저도 지원하는 JavaScript 클라이언트지만 YouTube 내부 API인 InnerTube를 사용하는 라이브러리라고 명시한다. package.json은 버전 18.3.0, browser export, MIT를 표시한다. 브라우저 실행 가능성이 내부 API 사용 권한을 의미하지 않는다. 공식 정책상 undocumented API/스크래핑 제한과 충돌하므로 채택하지 않는다. 특정 자막 본문 API의 안정성은 미확인이다.
3. `yt-dlp/yt-dlp`: README는 CLI 도구이며 자막 목록, 직접 자막, 자동 생성 자막 저장 옵션을 제공한다. pyproject.toml은 Python >=3.11, LICENSE는 Unlicense다. CLI/Python 실행 환경이 필요해 GitHub Pages만으로 방문자 브라우저에서 실행할 수 없다. 채택하지 않는다.

### 공식 정책과 공식 API 교차 확인
- YouTube 이용약관은 허가되지 않은 자동 수단(로봇/스크래퍼 등)으로 서비스에 접근하는 것을 제한한다. 예외는 robots.txt에 따른 공개 검색엔진 또는 사전 서면 허가다.
- YouTube API Developer Policies는 undocumented API 사용과 YouTube/Google 애플리케이션 스크래핑 또는 스크랩된 데이터 획득을 금지한다고 명시한다.
- 공식 `captions.list`는 자막 트랙 메타데이터만 반환하고 본문은 반환하지 않는다. OAuth 필요, 50 quota units.
- 공식 `captions.download`는 OAuth 및 해당 영상 편집 권한이 필요하며 200 quota units.
- 공식 IFrame Player API captions 모듈은 표시 옵션과 reload를 문서화하지만 자막 본문/시간 cue 배열을 앱에 반환하는 공개 인터페이스는 확인되지 않았다.

### 최종 판정
- **적합 후보 발견: 없음.** 공개 프로젝트는 기술적으로 자막 추출 기능을 제공하지만 현재 제품 제약 또는 YouTube 정책과 충돌한다.
- 오픈소스 코드 라이선스는 코드 재사용 권한이지 YouTube 데이터 스크래핑/내부 API 사용 권한이 아니다.
- TranscriptFox도 무료 일일 한도, API/Privacy 설명 차이, CORS 미확인으로 핵심 의존성으로 채택하지 않는다.
- 앱 코드 변경 없음. 비공식 API 요청, 스크래핑, 제한 우회 구현 없음.

### 결과 상태
- 성공: 저장소 기준 문서 재조회, 공개 프로젝트 3개의 원문 README/LICENSE/실행 환경 확인, YouTube 공식 정책과 Captions API 문서 교차 확인.
- 부분 성공: 공개 프로젝트의 작동 범주와 실행 환경은 확인했으나 영상책 조건을 모두 충족하는 허용 가능한 후보는 찾지 못함.
- 실패: 이번 조사 범위에서 0원·무서버·Android·정책 준수 조건을 모두 만족하는 범용 공개 영상 자막 자동 취득 수단 발견 실패.
- 미실행: 실제 API 호출, 브라우저 CORS 테스트, 대상 영상 자막 반환 확인, Android 실기기 테스트, GitHub Pages 배포 테스트.
- 비용/계정: 0원, 외부 계정 생성·결제·카드 등록 없음. 코드 변경 없음.
- 다음 작업: 제작자 본인 또는 명시적 권한이 있는 영상의 공식 자막 접근 경로와, 이용 허가가 명확한 독립 자막 제공처만 별도로 조사한다.

### 출처 (2026-11-11 재조회)
- YouTube 이용약관: https://www.youtube.com/t/terms
- YouTube API Developer Policies: https://developers.google.com/youtube/terms/developer-policies
- Captions list: https://developers.google.com/youtube/data/reference/rest/v3/captions/list
- Captions download: https://developers.google.com/youtube/data/reference/rest/v3/captions/download
- IFrame Player API: https://developers.google.com/youtube/iframe_api_reference
- youtube-transcript-api: https://github.com/jdepoix/youtube-transcript-api
- YouTube.js: https://github.com/LuanRT/YouTube.js
- yt-dlp: https://github.com/yt-dlp/yt-dlp

## 10. VB-15 — 독립 호스팅 자막 API 검토 및 채택 보류 (2026-11-11)

### 작업 전 확인
- AGENT_WORK_RULES.md, README.md, PROJECT_CONTEXT.md, PROJECT_STATUS.md, ROADMAP.md, DECISIONS.md, RESEARCH_BENCHMARKS.md를 저장소 기본 브랜치에서 다시 조회했다.
- 조회 당시 최신 커밋은 c86669598150133cccb0e78e9f05d87d2c2648b5이며 직전 VB-14 조사와 미해결 자동 자막 목표를 확인했다.
- 목표와 고정 조건: YouTube URL 기반 자막 자동 확보, 별도 동기화 패널, 비용 0원, Android, GitHub Pages 정적 웹앱 우선, 수동 붙여넣기는 제품 흐름이 아님.

### 이번 회차 조사
- TranscriptFox API/Terms/Privacy를 최신 문서로 재확인했다. 익명 하루 1건·첫 10분, API key 불필요, JSON POST, 서비스 전체 한도, 공유 캐시와 기술 로그를 확인했다. API 자체는 기존 캡션/저장 transcript만 읽고 ASR을 시작하지 않는다고 명시한다. 웹사이트의 ASR 처리와 API 경로는 별개로 설명되어 이전 기록의 모호성을 정리했다.
- TranscriptFox 약관은 공개 API의 가벼운 자동 사용을 공개 한도 안에서 허용하지만, 사용자가 읽을 권리가 있는 공개 미디어만 제출하도록 요구한다. YouTube 캡션을 어떤 권한으로 취득하는지와 영상책 사용 범위는 여전히 미확인이다.
- Transcript.land 문서는 API key, 월 15분 무료, 외부 서버/ASR 경로를 안내한다. 약관은 미디어를 전사할 권리와 호스팅 플랫폼 약관 준수를 요구한다. 일부 공식 페이지는 HTTP 402로 직접 열리지 않아 원문 확인은 부분적이다.
- GetYouTubeTranscript는 일회성 100 free credits와 API key/이메일 확인을 요구한다. 공개 README가 서비스 인프라를 YouTube 스크래핑 기반이라고 설명하므로 채택하지 않는다.
- YouTube API Services Terms 3.2는 법적 계약 체결 연령에 미달하는 사람의 API 약관 수락 및 서비스 사용을 금지한다. 사용자의 연령을 고려해 API 가입/OAuth/약관 수락은 진행하지 않는다.
- YouTube 공식 Studio는 제작자가 자막 파일을 추가/업로드할 수 있음을 확인했다. 이 파일을 제작자가 명시적으로 제공하면 기존 정적 SRT/VTT 등록 경로에 연결할 수 있다.

### 결과 판정
- 성공: 저장소 문서 재조회, 세 독립 서비스의 무료 한도/인증/실행 구조 비교, TranscriptFox API와 웹사이트 처리 경로 구분, YouTube API 연령 조항 확인.
- 실패: 모든 제약(0원 지속, 무서버, Android, 명확한 권리, YouTube 정책 준수)을 충족하는 범용 공개 영상 자막 공급원 발견 실패.
- 보류: TranscriptFox는 무료 API 접근성은 있으나 한도, 원본 캡션 취득 권한, CORS, 개인정보 검토가 미완료이므로 통합 보류.
- 제외: Transcript.land(월 15분 무료·API key·서버 의존), GetYouTubeTranscript(일회성 100 credits·API key·README의 scraping 설명).
- 미실행: 실제 API POST, 브라우저 CORS/OPTIONS, 특정 영상 자막 반환, Android 실기기, GitHub Pages 배포.
- 코드/기능 변경: 없음. 계정 생성·OAuth·결제·카드 등록 없음. 비용 0원.

### 다음 작업
외부 API 통합 대신, 제작자가 명시적으로 제공하거나 사용 허가한 SRT/VTT 파일을 기존 정적 레지스트리에 연결하는 흐름만 유지한다. 범용 자동 자막 목표는 미해결로 표시한다.

## 11. VB-16 — YouTube 공식 대본 페이지 fallback 추가 (2026-11-11)

### 작업 전 확인
- 이번 회차 시작 전 AGENT_WORK_RULES.md, README.md, PROJECT_CONTEXT.md, PROJECT_STATUS.md, ROADMAP.md, DECISIONS.md, RESEARCH_BENCHMARKS.md 및 최신 커밋을 다시 조회했다.
- 시작 시 최신 기본 브랜치 커밋은 033e2e2021c556af329fa3206e4951a13a85ed18이었다.
- 사용자 요청: YouTube 정책에 피해를 주지 않는 범위에서 합법적 대체 경로를 계속 진행. 기존 고정 조건(0원, Android, GitHub Pages 정적, 자동 자막 목표, 수동 transcript 붙여넣기 금지)을 유지했다.

### 공식 근거
- YouTube Help의 'View video transcripts'는 자막이 있는 영상에서 영상 설명의 'Show transcript'를 열고, 대본 문장을 선택해 해당 위치로 이동할 수 있다고 설명한다: https://support.google.com/youtube/answer/15930243
- YouTube API Developer Policies는 문서화되지 않은 API 사용과 YouTube/Google 앱 스크래핑, 스크랩된 데이터 획득을 금지한다: https://developers.google.com/youtube/terms/developer-policies
- 따라서 공식 대본 페이지로 사용자를 연결하는 것은 채택 가능한 fallback이지만, 대본 DOM을 자동 추출하거나 내부 패널로 복사하는 방식은 구현하지 않는다.

### 코드 변경
- index.html: transcript 안내 아래에 숨겨진 'YouTube에서 공식 대본 보기' 링크 추가.
- app.js: 유효한 YouTube video ID가 입력되면 표준 시청 페이지 URL을 설정하고 링크를 표시한다. 잘못된 입력이면 링크를 숨긴다.
- style.css: 링크 스타일 및 hidden 상태 스타일 추가.
- 기존 iframe player, captions.json 정적 레지스트리, SRT/VTT 파서, cue 동기화, seek 동작은 변경하지 않았다.
- 링크는 YouTube 공식 시청 페이지를 새 탭으로 연다. 영상책 내부 자막 패널로 대본 본문을 자동 전송하지 않는다.

### 결과 상태
- 성공: 세 코드 파일 업데이트 커밋 완료.
- 부분 성공: 정책 준수 fallback UI 추가. 사용자가 YouTube 페이지에서 대본을 볼 수 있지만 영상책 내부 패널 자동 표시 문제는 해결되지 않았다.
- 실패/미해결: 임의 공개 영상의 대본을 영상책 내부 패널에 자동 로드하는 정책 준수 범용 경로는 이번 단계에서도 확인되지 않았다.
- 미실행: 브라우저 UI 테스트, Android 실기기 테스트, 실제 영상 대본 링크 테스트, GitHub Pages 배포 확인.
- 정적 구문 검사: 미실행. 컨테이너에서 GitHub raw 파일을 내려받으려 했으나 DNS 해석 실패로 소스 파일을 테스트 환경에 가져오지 못했다. 따라서 JavaScript 문법 검사를 통과했다고 주장하지 않는다. GitHub 저장소에서 변경된 파일과 핵심 링크 코드가 반영된 것은 재조회로 확인했다.
- 비용/계정: 0원, 외부 계정 생성·API 연결·결제 없음.

### 다음 단계
- 정적 코드 검사를 수행하고, 사용자가 Android에서 링크를 열었을 때 YouTube 공식 대본 기능을 찾기 쉬운지 확인한다. 이후 제작자 제공 자막 파일의 등록 절차를 더 간단하게 하는 방법을 검토한다.

## 12. VB-17 — 사용자 최우선 목표 재확정 및 문서 복원 (2026-11-11)

### 작업 전 확인
- 저장소 기본 브랜치 최신 커밋을 재조회했다: 29970e1d6477a3c982fd94f8cd1fd3df5de3cc19.
- 작업 전 AGENT_WORK_RULES.md, README.md, PROJECT_CONTEXT.md, PROJECT_STATUS.md, ROADMAP.md, DECISIONS.md, RESEARCH_BENCHMARKS.md를 다시 조회했다.
- 직전 상태는 VB-16 공식 대본 페이지 링크 fallback 구현이며, 내부 자동 스크립트 취득은 미해결이었다.

### 사용자가 다시 명확히 확정한 제1 목표
1. 영상책 페이지 안에서 YouTube 검색
2. 영상 선택
3. 스크립트/자막 자동 추출
4. 추출한 스크립트 맞춤법·띄어쓰기 교정
5. 교정된 스크립트를 영상책 페이지 안에 표시

### 반드시 지킬 사용성 조건
- 사용자는 Android 스마트폰을 사용하며 YouTube 모바일 웹에서는 스크립트 복사가 어렵다고 명시했다.
- YouTube 모바일 웹에서 사용자가 스크립트를 복사해 오도록 요구하는 방식은 제품 흐름에서 제외한다. 기존 수동 붙여넣기 UI도 다시 추가하지 않는다.
- YouTube 공식 대본 페이지 링크는 보조 링크다. 핵심 기능의 대체 완료가 아니다.
- 검색, 추출, 교정, 내부 표시를 각각 검증하고, 추출이 안 되면 프로젝트의 핵심 가치가 아직 성립하지 않았다고 기록한다.

### 기술 원칙과 미해결
- 검색 기능은 YouTube 공식 검색 경로의 최신 쿼터·API 키·계정/연령 요건을 따로 확인한다. 검색 가능성이 자막 본문 추출 가능성을 의미하지 않는다.
- 공식 Captions API는 임의 공개 영상의 일반 시청자용 자막 본문 추출을 제공하지 않는다는 기존 확인을 유지한다.
- undocumented API, 스크래핑, 프록시/접근 제한 우회는 구현하지 않는다.
- 0원, Android, GitHub Pages 정적 웹앱 우선, 유료/카드/유료 전환 무료쿼터 비의존 조건은 승인 없이 바꾸지 않는다.
- 현재 이 조건을 모두 만족하는 공개 영상 자동 추출 경로는 확인되지 않았다. 불가능하다고 최종 단정하지 않으며, 정책에 맞는 공식·권한 있는 경로를 다음 작업에서 조사한다.
- 맞춤법 교정은 스크립트 확보 이후 단계다. 브라우저 내 한국어 교정의 품질과 Android 실행 성능은 미검증이다.

### 이번 작업 결과
- 성공: 프로젝트 기준 문서와 행동강령에 사용자 제1 목표 및 모바일 복사 불가 조건을 명시했다.
- 실패/미해결: 자동 추출 구현 경로는 아직 확인되지 않았으며 이번 회차에 코드 기능을 구현하지 않았다.
- 미실행: YouTube 검색 API 호출, 공개 영상 자동 스크립트 추출, 맞춤법 교정 품질 테스트, Android 실기기 테스트, 브라우저/CORS 테스트, GitHub Pages 배포 테스트.
- 코드 변경: 없음. 문서만 갱신.
- 비용/계정: 0원. 새 계정, API 연결, OAuth, 결제, 카드 등록 없음.
- 다음 작업: 공식·권한 기반 YouTube 검색과 공개 영상 스크립트 추출 가능성을 별개로 검증하고, 검색 API의 연령·약관·쿼터 조건을 확인한다. 자막 추출 경로가 확인되기 전에는 교정 기능을 핵심 진전으로 포장하지 않는다.


## 13. VB-18 — YouTube 공식 검색 API와 자막 본문 접근 재검증 (2026-11-11)

### 작업 전 확인
- 최신 기본 브랜치 커밋: `ff3f24de6b6c35ab27c41cf165253840a448d8ec` (`docs: record primary in-app transcript workflow`).
- 작업 전 `AGENT_WORK_RULES.md`, `README.md`, `PROJECT_CONTEXT.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `DECISIONS.md`, `RESEARCH_BENCHMARKS.md`를 다시 조회했다.
- 사용자 제1 목표는 영상책 내부 YouTube 검색 → 영상 선택 → 자동 자막 추출 → 한국어 맞춤법·띄어쓰기 교정 → 내부 표시다. 모바일 YouTube에서 수동 복사하는 흐름은 금지한다.

### 공식 문서에서 확인한 사항 (2026-11-11)
1. **검색 API는 존재한다.** YouTube Data API `search.list`는 공개 동영상 검색 결과를 반환하며, 사용자 계정 OAuth 없이 공개 동영상 검색을 할 수 있는 경우가 있다고 Developer Policies가 설명한다. 다만 API 프로젝트와 API 자격 증명은 필요할 수 있다.
2. **검색 쿼터는 무제한이 아니다.** 기본 할당은 `search.list` 하루 100회이며 호출당 1 quota unit이다. 추가 페이지 요청도 별도 호출이다.
3. **공개 검색 결과를 앱이 임의로 수정할 수 없다.** Developer Policies는 검색 결과의 텍스트·이미지·정보를 수정하거나 대체하지 못하도록 규정한다. YouTube 출처 표시 등 API Client 요구사항도 따라야 한다.
4. **공개 저장소에 API 자격 증명을 넣을 수 없다.** Developer Policies는 API Credentials를 공개 오픈소스 프로젝트에 삽입하거나 제3자에게 공개하지 말라고 명시한다. GitHub Pages 정적 앱은 브라우저 코드가 공개되므로 비밀 자격 증명을 안전하게 보관할 수 없다. 서버를 두지 않는 현재 구조와 충돌한다.
5. **검색 API 이용에는 연령 계약 조건이 적용된다.** API Services Terms §3.2는 법적 구속력이 있는 계약을 체결할 법적 연령에 미달한 사람은 약관을 수락하거나 API 서비스를 이용하지 못한다고 명시한다. 사용자의 연령을 고려해 API 프로젝트 생성, 약관 수락, API 키 발급, OAuth를 진행하지 않았다.
6. **자막 목록 API는 본문을 주지 않는다.** `captions.list`는 지정 영상의 자막 트랙 목록만 반환하며 실제 자막 본문은 포함하지 않는다. OAuth scope가 필요하고 호출 비용은 50 units다.
7. **자막 다운로드는 영상 편집 권한이 필요하다.** `captions.download`는 OAuth scope와 해당 영상 편집 권한을 요구하며 호출 비용은 200 units다. 따라서 임의의 공개 영상을 시청하는 일반 사용자에게 제공되는 범용 자막 다운로드 경로가 아니다.
8. **정책 경계 재확인.** Developer Policies는 문서화되지 않은 API 사용과 YouTube/Google 애플리케이션 스크래핑 및 스크랩된 데이터 취득을 금지한다. 내부 API, DOM 읽기, 자동 브라우저 수집, 프록시 우회는 구현하지 않는다.

### 제약별 판정
| 하위 기능 | 공식 경로 | 영상책 조건 판정 |
|---|---|---|
| 앱 안 YouTube 검색 | Data API `search.list` | 기술적으로 가능하지만 API 프로젝트/자격 증명, 일일 100회 쿼터, 계약 연령 조건, 공개 저장소 자격 증명 금지 때문에 현재 사용자·정적 앱 경로로 채택하지 않음 |
| 공개 영상 자막 트랙 목록 | `captions.list` | OAuth scope 필요, 본문 미반환, 일반 공개 영상의 시청자 권한으로는 부족 |
| 자막 본문 다운로드 | `captions.download` | OAuth scope와 영상 편집 권한 필요, 범용 공개 영상 추출 불가 |
| 자막 교정 및 내부 표시 | 브라우저 내 후처리 | 입력 스크립트 자동 확보 경로가 없으므로 본 회차 구현·검증하지 않음 |

### 결과 상태
- 성공: 공식 검색 API, 쿼터 계산기, API 이용 약관, Developer Policies, captions.list/download 원문 재조회.
- 부분 성공: YouTube 내부 검색은 공식 API로 기술 지원됨을 확인했으나, 사용자의 연령/비용/정적 공개 저장소 조건에 맞는 직접 사용 경로는 확인되지 않음.
- 실패/미해결: 임의 공개 영상의 자막 본문을 일반 시청자 권한으로 영상책에 자동 제공하는 공식 경로를 찾지 못함.
- 미실행: API 프로젝트 생성, 키 발급, 실제 search.list 요청, captions.list/download 호출, OAuth, CORS/브라우저 테스트, Android 실기기, GitHub Pages 배포.
- 코드 변경: 없음. 외부 API·비공식 API·스크래핑·프록시 통합 없음.
- 비용/계정: 0원. API 계정 설정·키 발급·OAuth·결제·카드 등록 없음.
- 다음 작업: 제작자 본인/명시적 권한이 있는 영상에서 제공되는 자막 파일을 영상책이 자동 연결할 수 있는 정적·권한 기반 공급 형태가 있는지 확인한다. 범용 공개 영상 자동 추출 경로가 확인되기 전에는 교정 UI를 핵심 진전으로 구현하지 않는다.

### 출처 (공식 문서, 2026-11-11 조회)
- Search: list: https://developers.google.com/youtube/data/reference/rest/v3/search/list
- Quota calculator: https://developers.google.com/youtube/data/determine_quota_cost
- YouTube API Services Terms §3.2: https://developers.google.com/youtube/terms/api-services-terms-of-service/
- YouTube API Developer Policies: https://developers.google.com/youtube/terms/developer-policies
- Captions: list: https://developers.google.com/youtube/data/reference/rest/v3/captions/list
- Captions: download: https://developers.google.com/youtube/data/reference/rest/v3/captions/download


## 14. VB-19 — 제작자 제공 자막 파일의 공식 확보·정적 연결 경로 확인 (2026-11-11)

### 작업 전 확인
- 최신 기본 브랜치 커밋: `8db9aa522cb938af385f5c485f547d56d6ab06b1`.
- 작업 전 `AGENT_WORK_RULES.md`, `README.md`, `PROJECT_CONTEXT.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `DECISIONS.md`, `RESEARCH_BENCHMARKS.md`를 재조회했다.
- 이번 단계는 제작자/권리자가 명시적으로 제공할 수 있는 자막 파일의 공식 확보 경로와 기존 앱의 정적 등록 구조가 연결되는지 확인하는 것으로 한정했다.

### 공식 근거
- YouTube Help의 'Edit or remove captions'는 YouTube Studio → Subtitles → 대상 영상 → 해당 언어의 Edit → Options → Download subtitles 순서로 자막 트랙 파일을 브라우저에 다운로드하는 절차를 명시한다.
- YouTube Help의 'Supported subtitle and closed caption files'는 SRT(.srt)를 기본 형식으로 권장하며 UTF-8 일반 텍스트를 요구한다. WebVTT(.vtt)도 지원 형식 목록에 있다.
- YouTube Help의 'Add subtitles & captions'는 자막 파일이 텍스트와 각 줄의 타임스탬프를 포함한다고 설명한다.
- 중요 권리 구분: Studio에서 자막 파일을 내려받을 수 있다는 기능은 그 파일을 제3자 공개 웹사이트/저장소에 재배포할 권리를 자동 부여하지 않는다. 공개 저장소에 올리려면 실제 권리자의 명시적 허가가 필요하다. 이는 법률 자문이 아니며, 권리 범위가 불분명하면 공개 등록하지 않는다.

### 기존 영상책 코드 구조 재조회
- `app.js`는 `captions.json`에서 영상 ID별 파일 경로를 읽고, `captions/<파일명>.srt/.vtt` 파일을 정적 fetch로 불러오는 경로를 이미 구현하고 있다.
- 경로 검증은 `captions/` 아래의 SRT/VTT만 허용하고 `..` 경로를 거부한다.
- 자막 파서는 타임스탬프와 텍스트 cue를 읽고, 플레이어의 재생 시점과 동기화하며 문장 선택 시 해당 시점으로 이동한다.
- 현재 `captions.json`에는 설명용 주석만 있고 실제 영상 ID/자막 파일 등록은 없다. 따라서 실제 자막 파일을 통한 자동 로드 성공은 아직 테스트되지 않았다.
- 별도 파일 선택기는 사용자가 기기에 저장된 SRT/VTT 파일을 선택해 브라우저에서 읽는 기능이다. 텍스트 복사·붙여넣기를 요구하지 않지만, 임의 YouTube 영상의 자동 추출은 아니다.

### 제한적 등록 절차
1. 영상 제작자 또는 자막 권리자가 YouTube Studio에서 자막 파일을 다운로드하거나 별도로 SRT/VTT 파일을 제공한다.
2. 실제 권리자가 GitHub 저장소에 자막 파일을 공개하는 것을 명시적으로 허가한 경우에만 `captions/` 아래에 파일을 저장한다.
3. `captions.json`에 정확한 11자리 YouTube video ID와 파일 경로를 등록한다.
4. 앱이 영상 ID를 받으면 기존 코드가 등록 파일을 자동 로드하고 시간 cue를 표시한다.

### 판정
- 성공: YouTube Studio 공식 자막 파일 다운로드 절차와 SRT/VTT 지원 여부 확인; 기존 정적 registry → 파일 fetch → parser → playback sync 코드 경로 확인.
- 부분 성공: 제작자 제공/권리 허가 파일에 한해 내부 자동 표시로 연결 가능한 구조가 이미 존재한다.
- 실패/미해결: 임의 공개 영상의 자동 자막 추출 및 앱 내부 YouTube 검색은 해결되지 않았다. 사용자 제1 목표의 대체 완료가 아니다.
- 미실행: 실제 권리 허가 파일 확보, 실제 video ID 등록, 자막 파일 추가, end-to-end Pages fetch, Android 실기기 테스트, 자막 텍스트 교정 품질 테스트.
- 코드 변경: 없음. `app.js`, `captions.json`, `index.html` 변경 없음.
- 비용/계정: 0원. API 계정, OAuth, 외부 서비스, 결제 없음.
- 다음 단계: 사용자가 권리자의 명시적 허가가 있는 SRT/VTT 파일을 실제로 제공할 수 있는 경우에만, 테스트용 파일 1개를 비공개 데이터가 아닌 공개 권한 확인 후 등록해 end-to-end 검증한다. 허가된 파일이 없으면 더미 콘텐츠를 실제 지원 사례처럼 꾸미지 않는다.

### 출처 (공식 문서, 2026-11-11 조회)
- YouTube Studio 자막 다운로드: https://support.google.com/youtube/answer/2734705
- YouTube 자막 파일 형식: https://support.google.com/youtube/answer/2734698
- YouTube 자막 추가 및 타임스탬프 설명: https://support.google.com/youtube/answer/2734796


## 15. VB-20 — 일반 시청자 자막 자동 취득 공식 경로 재검증 (2026-11-11)

### 사용자 관점 및 목표
- 사용자 지적을 반영해 대상 사용자를 다시 고정했다: 영상책 사용자는 영상 제작자/편집자가 아니라 일반 유튜브 시청자다.
- 제작자에게 연락하거나 YouTube Studio에서 자막을 내려받거나 SRT/VTT를 가져오도록 요구하는 흐름은 일반 시청자용 해결책이 아니며, 제품 핵심 기능으로 제안하지 않는다.
- 핵심 목표는 영상책 안에서 YouTube 영상을 찾고 선택한 뒤, 일반 시청자에게 보이는 자막/대본을 자동 확보하고, 한국어 표기 교정 후 영상책 내부에 표시하며 재생 시점과 동기화하는 것이다.

### 공식 자료 재검증 (2026-11-11)
1. **YouTube 대본 UI**
   - YouTube Help는 자막이 있는 영상에서 영상 설명의 'Show transcript'를 통해 전체 대본을 보고, 문장을 눌러 해당 시점으로 이동할 수 있다고 설명한다.
   - 이 문서는 YouTube 사용자 UI 사용법이며, 제3자 앱에 대본 본문을 제공하는 API라고 설명하지 않는다.
   - 출처: https://support.google.com/youtube/answer/15930243

2. **YouTube Captions API**
   - `captions.list`는 자막 트랙 목록만 반환하고 실제 자막 본문은 포함하지 않는다. OAuth scope가 필요하며 quota cost는 50 units다.
   - `captions.download`는 실제 자막 파일을 반환하지만 OAuth가 필요하고, 요청 사용자가 해당 영상을 편집할 권한이 있어야 한다. quota cost는 200 units다.
   - 따라서 일반 시청자 권한으로 임의 공개 영상의 본문을 가져오는 공식 API가 아니다.
   - 출처: https://developers.google.com/youtube/data/reference/rest/v3/captions/list ; https://developers.google.com/youtube/data/reference/rest/v3/captions/download ; https://developers.google.com/youtube/data/guides/implementation/captions

3. **IFrame Player API와 브라우저 경계**
   - 공식 IFrame Player API는 YouTube 영상을 삽입하고 재생/일시정지/탐색/현재 재생 시간 등의 플레이어 제어를 제공한다. 검토한 공식 문서에서 자막 텍스트/대본 본문을 읽어오는 메서드는 확인되지 않았다.
   - 브라우저 동일 출처 정책상 다른 출처의 iframe DOM은 부모 페이지에서 직접 읽을 수 없다.
   - 출처: https://developers.google.com/youtube/iframe_api_reference ; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

4. **정책 경계**
   - YouTube Developer Policies는 문서화되지 않은 API 사용을 금지하고, YouTube/Google 애플리케이션 스크래핑 또는 스크랩된 YouTube 데이터/콘텐츠 취득을 금지한다.
   - 출처: https://developers.google.com/youtube/terms/developer-policies
   - 따라서 InnerTube 등 내부 요청 복제, YouTube 페이지 DOM 자동 수집, 프록시를 통한 수집·우회는 구현 후보에서 제외한다.

5. **앱 내부 검색의 별도 문제**
   - 공개 영상 검색용 `search.list`는 공식 API이나, 기본 할당량은 하루 100회이며 추가 페이지 호출도 쿼터를 소비한다.
   - 공개 데이터 요청에도 API key가 필요하고, API 정책은 자격 증명을 오픈소스 프로젝트에 삽입하지 못하도록 한다. API 이용 약관 §3.2의 법적 계약 연령 조건도 있다.
   - 출처: https://developers.google.com/youtube/data/reference/rest/v3/search/list ; https://developers.google.com/youtube/data/guides/authentication ; https://developers.google.com/youtube/terms/api-services-terms-of-service ; https://developers.google.com/youtube/terms/developer-policies
   - 현재 사용자에게 API 프로젝트/약관 수락/키/OAuth 설정을 안내하지 않는다.

### 판정
- **확인됨:** YouTube는 자막이 있는 영상의 대본을 일반 사용자에게 YouTube 화면 안에서 보여준다.
- **확인됨:** 공식 Captions API는 일반 시청자의 임의 공개 영상 자막 본문 자동 취득 경로가 아니다.
- **확인됨:** 공식 IFrame API는 재생 제어·현재 시간 확인 기능을 제공한다.
- **확인됨:** 정책은 undocumented API와 YouTube 앱 스크래핑/스크랩 데이터 취득을 금지한다.
- **미확인:** 일반 시청자가 볼 수 있는 대본을 영상책의 정적 GitHub Pages 앱이 공식적이고 지속적으로 자동 취득할 수 있는 경로.
- **미해결:** 영상책 내부 검색 → 자막 자동 취득 → 한국어 교정 → 내부 표시/시간 동기화의 전체 흐름.
- **중요:** 이번 조사는 모든 가능한 기술 경로가 불가능하다는 증명이 아니다. 현재 공식 문서와 제약 검토에서 채택 가능한 경로를 찾지 못했다는 결론이다.

### 코드·테스트·비용
- 코드 변경: 없음.
- API 계정/키/OAuth/외부 서비스/결제: 없음, 비용 0원.
- 실제 API 호출, CORS/브라우저 테스트, Android 실기기 테스트, GitHub Pages 배포 테스트: 미실행.
- 앱 내부 검색/자동 자막/교정/시간 동기화 end-to-end: 미실행.
- 제작자 제공 SRT/VTT 정적 경로: 역사적 참고/권리 허가 테스트용으로만 문서화하며 일반 시청자 해결책으로 안내하지 않는다.

### 다음 작업
- 일반 시청자에게 공개된 대본을 제3자 앱에서 읽어오는 **공식적으로 문서화된 방법**이 새로 확인되는 경우에만 작은 검증을 진행한다. 그렇지 않으면 자막 취득을 해결한 것처럼 기능을 추가하지 않는다.


## VB-21 — AI 작업 행동강령에 사용자 관점 검증 및 오류 정정 규칙 추가 (2026-11-11)

### 발생한 오류
- 이전 작업에서 일반 유튜브 시청자인 사용자를 대상으로, 제작자/편집 권한자가 YouTube Studio에서 자막 파일을 내려받아 제공하는 경로를 다음 단계로 제안했다.
- 이 방법은 특수 권한을 가진 제작자/편집자만 수행할 수 있으므로 목표 사용자에게 실현 가능한 해결책이 아니었다.
- 기술적으로 기존 코드에 연결 가능하다는 사실만 확인하고, 사용자의 실제 역할·권한·행동 부담을 검증하지 않은 것이 원인이다.
- 사용자가 이 부적합성을 지적한 뒤에야 일반 시청자 관점과 핵심 요구를 다시 고정했다.

### 시정 조치
- AGENT_WORK_RULES.md에 §10 '사용자 관점 적합성 — 해결책을 제안하기 전 필수 관문'을 추가했다.
- 해결책별 사용자/권한/행동 부담/환경/핵심 목표 적합성을 판정하도록 했다.
- 공식 링크, 수동 파일, 제작자 파일, 데모/합성 테스트를 핵심 기능 대체 완료로 표현하지 못하도록 명문화했다.
- 오류를 발견하면 원인 인정 → 관련 문서 정정 → 재발 방지 규칙 추가 → 수정 후 문서 모순 검사 순서로 조치하도록 했다.
- README의 AI 작업 관리 링크와 제작자 파일 설명을 행동강령에 맞게 정정했다.

### 검증
- 시작 전 최신 커밋 확인: 2f16d38d40d708ed4d7c39343d0bde96091f8722.
- 작업 규칙과 README/상태/결정 문서 재조회: 완료.
- 수정 문서 재조회 및 규칙/정정 문구 확인: 작업 후 수행.
- 코드 변경: 없음.
- 기능 테스트/Android/브라우저/Pages 테스트: 이번 문서 작업 범위가 아니며 미실행.
- 비용/계정/API/OAuth: 0원, 신규 생성 없음.

### 재발 방지 핵심
앞으로 영상책의 대안은 반드시 "일반 시청자가 Android 스마트폰과 현재 허용된 계정/권한만으로 실제 수행할 수 있는가?"를 먼저 통과해야 한다. 통과하지 못하면 핵심 해결책으로 제시하지 않는다.


## 16. VB-22 — 브라우저 STT 및 IFrame captions 모듈 검증 (2026-11-11)

### 목표
일반 유튜브 시청자가 Android 스마트폰과 무료·정적 GitHub Pages 환경에서 영상의 음성 또는 YouTube 자막을 영상책 안의 텍스트로 자동 취득할 수 있는 공식 브라우저 경로가 있는지 확인.

### A. 브라우저 Web Speech API
- MDN SpeechRecognition 문서는 일부 브라우저(Chrome 포함)의 기본 구현이 서버 기반 음성 인식을 사용하고, 오디오가 웹 서비스로 전송되므로 오프라인 작동하지 않는다고 설명한다.
- `SpeechRecognition.start()`는 오디오 트랙을 전달할 수 있지만, 오디오 트랙을 지정하지 않으면 마이크 입력을 사용한다.
- MDN Browser Compatibility Data는 SpeechRecognition API 자체가 Chrome Android에서 Chrome 지원을 미러링한다고 표시하지만, `processLocally`는 Chrome Android에서 지원되지 않는 것으로 표시한다.
- 마이크 입력으로 YouTube 플레이어 스피커 소리를 다시 듣게 하는 방법은 영상책이 YouTube의 실제 오디오 스트림을 직접 받는 것이 아니다. 외부 소리 재생, 마이크 권한, 환경/에코 제거 영향, 온라인 음성 인식 서비스 의존성이 생긴다. 정확도·시간 동기화·개인정보·지속 무료 여부가 보장되지 않는다.
- 공식 근거:
  - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
  - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/start
  - https://github.com/mdn/browser-compat-data/blob/main/api/SpeechRecognition.json

### B. Android 화면/시스템 오디오 캡처
- `getDisplayMedia()`의 오디오 반환 여부는 브라우저/OS별로 달라질 수 있으며, 요청해도 오디오 트랙이 반환된다고 보장되지 않는다.
- MDN Browser Compatibility Data는 Chrome Android에서 `getDisplayMedia`가 지원되지 않는 것으로 표시한다. `systemAudio` 옵션도 Chrome Android에서 지원되지 않는 것으로 표시한다.
- Chrome 개발자 문서의 systemAudio 설명은 데스크톱 Chrome 기준이다. 이를 Android에서 가능한 기능으로 간주하지 않는다.
- 공식 근거:
  - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
  - https://github.com/mdn/browser-compat-data/blob/main/api/MediaDevices.json
  - https://developer.chrome.com/docs/web-platform/screen-sharing-controls

### C. YouTube IFrame API captions 모듈 — 새로 확인한 핵심 사실
- 공식 IFrame API는 `onApiChange` 이후 `getOptions('captions')`로 captions 모듈 옵션을 확인할 수 있다고 설명한다.
- 공식 문서가 나열한 captions 옵션은 `fontSize`(플레이어 내 표시 글꼴 크기)와 `reload`(현재 영상의 자막 데이터 다시 불러오기)뿐이다.
- 문서화된 옵션 목록에는 자막 본문, 개별 cue, 타임스탬프, transcript 문자열을 반환하는 기능이 없다.
- 따라서 "IFrame API에 captions 모듈이 있다"는 사실은 "영상책이 자막 텍스트를 읽을 수 있다"는 뜻이 아니다.
- 공식 근거: https://developers.google.com/youtube/iframe_api_reference (onApiChange / captions module options section)

### 적합성 판정
| 후보 | 기술적 사실 | 일반 시청자·Android·무료 정적 앱 적합성 |
|---|---|---|
| SpeechRecognition 마이크 입력 | 일부 Chrome에서 가능, 서버 기반일 수 있음 | 부적합한 보조 실험. 실제 영상 오디오를 직접 읽지 않으며 사용자 마이크/스피커 작업이 필요 |
| SpeechRecognition on-device | 언어 팩 기반 기능이 있으나 Chrome Android 지원 근거 없음 | 현재 조건에서 채택 불가 |
| getDisplayMedia 시스템 오디오 | 브라우저/OS에 따라 다름 | Chrome Android 지원되지 않는 것으로 표시 |
| IFrame captions module | 표시 글꼴 조절 및 자막 데이터 reload | 자막 본문 취득 기능이 아님 |
| 전체 자막 자동 취득 | 일반 시청자에게 공식적으로 노출된 본문 API 없음 | 여전히 미해결 |

### 결론
- **확인됨:** IFrame captions 모듈은 자막 표시 설정과 reload만 노출하며, 공식 문서에 transcript 본문 반환 옵션은 없다.
- **확인됨:** Web Speech API는 STT이며 YouTube 자막을 가져오는 API가 아니다. 기본 Chrome 인식은 서버 기반일 수 있다.
- **확인됨:** Android Chrome의 on-device SpeechRecognition 및 getDisplayMedia 지원은 현재 MDN 호환성 자료에서 확인되지 않는다.
- **미채택:** 마이크로 휴대폰 스피커 음성을 재인식하는 방법. 사용자 행동 부담·정확도·동기화·개인정보·비용 조건이 맞지 않고 실제 Android 실험도 하지 않았다.
- **미해결:** 일반 시청자가 보는 YouTube 대본을 영상책 내부로 자동 취득하는 공식 경로.
- 이 결과는 문서화된 기능 검토다. 모든 비공식 기술 경로의 존재 여부를 증명하거나 허용 가능성을 판단한 것이 아니다.

### 테스트·비용
- 공식 MDN 및 YouTube IFrame API 문서 조사: 완료.
- Android 실기기 SpeechRecognition/마이크/스피커 테스트: 미실행.
- Android getDisplayMedia 실험: 미실행.
- 실제 YouTube 영상의 captions module getOptions 호출: 미실행.
- 코드 변경: 없음.
- API 계정/키/OAuth/외부 STT 서비스/결제: 없음.
- 비용: 0원.

### 다음 단계
- YouTube IFrame API captions module의 공식 옵션 범위를 이번 조사에서 확인했으므로, 동일한 옵션 확인을 반복하지 않는다.
- 새 후보를 검토할 때는 일반 시청자가 Android에서 수행할 수 있고, 자막 본문을 실제로 앱 내부에 제공한다는 공식 근거부터 확인한다. UI에 자막이 표시되는 것만으로 텍스트 취득 가능성을 추정하지 않는다.


## 17. VB-23 — 공개 자막 추출 프로젝트·코드·커뮤니티 사례 조사 (2026-11-11)

### 사용자 지적 및 조사 우선순위 수정
- 사용자는 STT 조사로 방향을 넓힌 것이 핵심 과제에서 벗어난다고 지적했다.
- 지적이 맞다. 영상책의 질문은 음성 재인식이 아니라 일반 시청자가 YouTube에서 볼 수 있는 기존 자막/대본을 앱 내부로 가져오는 방법이다.
- 공식 문서 조사 후 STT로 옮겨가기 전에 공개 라이브러리·실제 소스 코드·커뮤니티 사용 사례를 폭넓게 조사했어야 했다. 이는 조사 순서의 오류다.
- 이번 회차에서는 STT를 추가 조사하지 않고 자막 추출 구현만 조사했다.

### 조사 범위 및 양
- 10개를 넘는 서로 다른 검색 질의로 탐색. 검색 주제: transcript extraction library, GitHub JS/Python/Go 구현, npm 패키지, 브라우저 전용 앱, CORS, InnerTube/timedtext, yt-dlp, Reddit Obsidian/Web Clipper/self-hosted 사용자 사례, 공식 정책/약관.
- 출처 유형: YouTube 공식 정책/약관, GitHub 저장소와 실제 소스, npm, Reddit, DEV Community 및 기술 문서.
- 실제 소스 코드 파일 확인:
  1. `neurelectra-oss/youtube-captions/src/transcript.js`
  2. `devhims/youtube-caption-extractor/src/index.ts`
  3. `kepano/defuddle/src/extractors/youtube.ts`
  4. `jdepoix/youtube-transcript-api/youtube_transcript_api/_api.py`
  5. `jdepoix/youtube-transcript-api/youtube_transcript_api/_transcripts.py`
  6. `yt-dlp/yt-dlp/yt_dlp/options.py`
  7. `rapha30/yt-youtube-transcript/README.md` 및 공개 프로젝트 구조
- Reddit 사례 2건 이상과 GitHub issue 1건을 교차 확인했다.

### 대표 구현 분석
| 프로젝트 | 실제 구현 성격 | 영상책 적합성 |
|---|---|---|
| jdepoix/youtube-transcript-api | Python requests로 영상 페이지의 caption track을 찾고 timedtext를 가져오는 CLI/서버용 라이브러리 | Python 런타임/서버 성격, 내부 구현 의존성 및 IP 차단 이슈. 정적 브라우저 앱 아님 |
| neurelectra-oss/youtube-captions | Node axios, InnerTube client 설정, timedtext JSON3/XML 파서, 선택적 proxy agent | Node/서버 네트워크 계층과 비공식 API 의존. 정적 브라우저 앱 아님 |
| devhims/youtube-caption-extractor | TypeScript fetch, InnerTube client profile 순회, caption track 선택·파싱; Next.js/Cloudflare Container API 예제 | README가 scraper로 설명, 서버 예제가 포함. 공개 fetch만으로 브라우저 적합성을 입증하지 않음 |
| kepano/defuddle | 기존 YouTube 페이지 DOM transcript를 먼저 추출하고, 비공식 API fetch를 보조 경로로 사용 | Web Clipper는 원본 YouTube 페이지의 DOM을 읽음. 영상책의 별도 페이지/iframe에서 바로 쓸 수 없음. iOS Safari CORS 이슈 확인 |
| rapha30/yt-youtube-transcript | Go CLI/라이브러리, Android/iOS InnerTube와 watch-page scraping fallback | Go 실행 환경 필요, 비공식 endpoint 및 페이지 스크래핑 명시 |
| yt-dlp | Python CLI의 수동/자동 자막 다운로드 및 파일 변환 | 사용자가 CLI를 실행해야 하며 GitHub Pages 앱 내 자동 취득 기능과는 다름 |

### 커뮤니티 사례와 실사용 문제
- Reddit의 Obsidian Web Clipper 작성자는 사용자가 YouTube transcript pane을 직접 열어야 하고, clipper는 페이지에 현재 존재하는 데이터만 읽는다고 답했다.
- 같은 게시물의 후속 댓글에는 YouTube 레이아웃 변경 후 동작이 깨졌다는 보고가 있다.
- 다른 Reddit plugin 사례는 외부 Nootube 서비스에 의존하고, captions가 없으면 Whisper로 전환한다고 설명한다. 이는 무서버·0원 조건을 충족하는 독립 구현이 아니다.
- Defuddle GitHub issue #310은 iOS Safari의 m.youtube.com 경로에서 caption fetch CORS preflight가 실패하여 transcript가 비는 사례를 기록한다.

### 정책·약관 검토
- YouTube API Developer Policies는 문서화되지 않은 API 사용과 YouTube/Google 앱 스크래핑 및 스크랩된 데이터 취득을 금지하는 문구를 포함한다.
- YouTube Terms of Service도 자동화된 접근(robots.txt를 따르는 공개 검색엔진 또는 사전 서면 허가 예외 제외)에 제한을 둔다.
- 공개 GitHub 코드와 MIT 라이선스는 YouTube 서비스 접근 방식의 허가나 정책 준수를 의미하지 않는다.
- 본 기록은 정책/약관 위험을 식별한 것이며 개별 사용 사례의 법률 자문이나 법적 판단이 아니다.

### 현재 판정
- **코드 참고 가치 있음:** 자막 cue의 공통 데이터 구조(text/start/duration), 수동/자동 자막 트랙 선택, 언어 우선순위, 파서 분리, 오류 유형, 테스트 설계.
- **영상책에 그대로 통합하지 않음:** InnerTube, timedtext scrape, YouTube page scraping, proxy/지역 라우팅, 비공식 client impersonation.
- **브라우저 DOM 추출은 보조 연구:** 사용자가 원본 YouTube 페이지에서 transcript pane을 열어야 하고, 영상책의 별도 도메인에서는 iframe DOM 접근이 안 된다. Android Chrome 확장/탭 연동은 이번 조사에서 검증하지 않았다.
- **공식 공개 API 대안:** 이번 생태계 조사에서도 일반 시청자가 임의 공개 영상의 자막 본문을 정적 앱에 제공하는 공식 공개 API는 찾지 못했다.
- 결론은 조사한 대표 프로젝트와 공식 문서에 한정되며 모든 가능한 경로가 없다고 증명한 것은 아니다.

### 검증·비용
- 10개 초과 검색 질의: 완료.
- GitHub 실제 코드 파일 6개 이상/프로젝트 5개: 확인.
- Reddit 사용자 사례: 2건 이상 확인.
- 공식 정책·약관 교차 확인: 완료.
- 실제 Android 기기·브라우저·GitHub Pages E2E: 미실행.
- 앱 코드 변경: 없음.
- 계정/API/OAuth/유료 API/프록시/결제: 사용·설정 안 함.
- 비용: 0원.

### 다음 단계
- STT를 우선 경로로 삼지 않는다.
- 다음 탐색은 브라우저 원본 YouTube 페이지 DOM에서 사용자가 이미 볼 수 있는 transcript를 어떤 공식·정책 준수 범위에서 활용할 수 있는지, Android에서 실제로 앱 간 연결이 가능한지에 초점을 둔다. 구현 전 사용자 조작 부담과 Android 호환성을 확인한다.
- 비공식 API/스크래핑 코드는 벤치마크 참고에만 두고 영상책에 통합하지 않는다.
