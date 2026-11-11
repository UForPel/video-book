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
| 로컬 SRT/VTT 파서 | [?] | 코드 반영, 실제 한국어 파일 실기기 검증 미확인 | 자동 취득 경로 결정 후 보조 기능으로 검증 |
| YouTube 자막 자동 취득 | [!] | 공식 API 외에 일반 웹페이지의 iframe 내부 DOM 직접 접근은 동일 출처 정책으로 제한됨. Android Chrome 확장 경로도 현재 지원되지 않음 | 호스팅형 자막 사이트의 서버/브라우저 흐름과 공개 호출 가능성 추가 확인 |
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

## 5. 현재 다음 작업 — VB-10

**목표: 자동 자막 기능의 필수 조건 중 무엇을 유지하거나 조정할지 결정한다.**

VB-09에서 공개 제조사/플랫폼 사례(Wistia, Brightcove)를 확인했으나, 이들은 각자의 호스팅 영상에 제작자가 제공한 스크립트/자막을 표시하는 기능이며 일반 YouTube 영상의 자막 공급원이 아니다. 공식 YouTube API, IFrame API, 공개 플랫폼 임베드/API를 대조한 현재까지의 결과로는 모든 공개 YouTube 영상에 대해 무료·무제한·서버 없음·GitHub Pages만으로 별도 자막 전문을 자동 확보하는 검증된 경로를 찾지 못했다.

제작자 허가 SRT/VTT를 저장소에 정적으로 등록하고 영상 ID로 연결하는 방식은 특정 영상에 한해 기술적으로 가능하지만, 실제 허가된 샘플이 없어 자동 fetch 및 Android 동기화 검증은 보류한다. 허가되지 않은 영상의 자막을 임의 등록하거나 비공개 인터페이스/서비스 제한을 우회하지 않는다. 다음 단계에서는 기존 제약을 유지할지, 외부 서버/API 허용 등 한 가지 조건을 조정할지 결정한다.

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
- 다음 작업 VB-10은 비용 0원 조건을 고정한 상태에서 브라우저/공식 API/정적 호스팅만으로 가능한 범위를 재검토한다. 비용이 발생하거나 무료 한도 소진 시 결제가 필요한 경로는 제안·구현하지 않는다.
- 출처:
  - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
  - https://developers.cloudflare.com/workers/platform/limits/
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download
