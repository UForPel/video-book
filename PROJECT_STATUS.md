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

## 5. 현재 다음 작업 — VB-04

**목표: 영상책 핵심 제약의 우선순위를 확정한다.**

자동 자막을 구현하기 전에 사용자에게 선택을 강요하거나 임의로 요구사항을 바꾸지 않는다. 다음 작업에서 현재 고정된 조건(정적 Pages, 무료/쿼터 최소화, Android, 자동 자막)을 유지할 경우의 한계와, 서버를 허용할 경우의 운영 부담을 짧고 명확하게 비교해 결정한다.

그 결정 전에는 자동 자막 취득 코드를 추가하지 않는다. 별도 참고 프로젝트 페이지를 사용자에게 테스트시키지 않는다.

## 6. 사용자 테스트 및 기록 원칙

실기기 결과는 사용자가 직접 보고한 것만 기록합니다. 테스트가 필요할 때는 영상책의 실제 화면에서 핵심 기능을 확인하고, 별도 참고 프로젝트 페이지를 사용자 테스트로 떠넘기지 않습니다.

작업 종료 때 코드 변경 여부, 조사 결과, 미검증 사항, 다음 작업 하나를 문서에 반영합니다.


## 7. 호스팅형 자막 사이트/API 조사 — 2026-11-11
- YouTubeScribe API 문서에서 timestamped transcript segments, Bearer key, credit 차감 및 rate limit을 확인. 현재 홈페이지가 VideoQuill로 리디렉션되어 서비스 브랜드/무료 조건은 추가 확인 필요.
- YT2Text 공식 문서에서 API key 인증, 별도 VPS 백엔드, 비동기 job, 무료 플랜 영상 수 제한을 확인.
- 두 서비스 모두 API 키를 정적 공개 웹앱에 안전하게 보관할 수 없으므로 서버 없는 현재 구조의 핵심 의존성으로 채택하지 않음.
- 자막 timestamp 데이터 구조 참고 후보로만 보관.
- 현재 다음 작업 VB-04: 제약 우선순위 결정. 사용자가 별도 서버를 허용할지 결정하기 전에는 연동 코드 추가 금지.


## 8. 브라우저 직접 접근 경로 조사 — 2026-11-11
- 동일 출처 정책상 GitHub Pages에서 실행되는 일반 JavaScript는 교차 출처 YouTube iframe 내부 DOM/자막 텍스트를 직접 읽을 수 없음을 MDN 문서로 확인.
- Chromium Extensions 담당자의 공개 답변에서 Chrome 모바일 확장 프로그램 지원 계획이 없음을 확인. Android Chrome 환경의 데스크톱 확장 프로그램 방식은 현재 적용 대상에서 제외.
- 확인한 Web Speech API 문서는 마이크/선택한 미디어 파일 입력을 설명하며, YouTube iframe 오디오를 직접 입력받는 기능은 확인되지 않음.
- 다음 작업 VB-05: 호스팅형 자막 사이트의 브라우저 직접 호출/서버 중계/CORS/인증/무료 한도 구분.


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
