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
