# 영상책 개발 로드맵

상세 상태는 [PROJECT_STATUS.md](./PROJECT_STATUS.md), 기술 결정은 [DECISIONS.md](./DECISIONS.md), 벤치마킹 자료는 [RESEARCH_BENCHMARKS.md](./RESEARCH_BENCHMARKS.md)를 기준으로 관리합니다.

## 최우선 선결 과제 — 내부 검색과 자동 스크립트 확보

- [!] 영상책 페이지 안 YouTube 검색의 공식 경로 확인: IFrame 검색 기능은 중단, Data API는 계정/Cloud 프로젝트/자격 증명/계약 연령 제약으로 현재 조건에서 보류
- [ ] 검색 결과에서 영상을 선택하는 흐름 정의
- [ ] 선택한 임의 공개 영상의 스크립트/자막을 영상책 안에서 자동 추출할 수 있는 경로 검증
- [ ] 추출한 스크립트의 맞춤법·띄어쓰기 교정 가능성 검증 (추출 경로 확보 후)
- [ ] 교정된 스크립트를 영상책 내부 패널에 표시하고, 시간 정보가 있으면 재생과 동기화
- [ ] 모바일 YouTube 웹에서 사용자가 스크립트를 복사해 오도록 요구하지 않음
- [ ] 공식 대본 페이지 링크를 핵심 기능 완료로 간주하지 않음

**선결 조건:** 위의 검색·자동 추출·교정·내부 표시 흐름이 성립하지 않으면 영상책의 핵심 가치가 아직 구현되지 않은 것이다. 0원·Android·GitHub Pages 정적 웹앱 우선·정책 준수 조건을 사용자 승인 없이 완화하지 않는다.

## 0단계 — 프로젝트 기반
- [x] 전용 GitHub 저장소와 요구사항 문서
- [x] GitHub Pages 기본 화면 Android 접속 확인
- [x] Android에서 YouTube 영상 재생과 시점 이동 확인

## 1단계 — 핵심 기술 검증
- [x] YouTube IFrame Player API 기반 재생
- [?] 로컬 SRT/VTT 파서 및 한국어 인코딩 실기기 확인
- [x] YouTube 공식 Captions API 권한 제약 확인
- [x] YouTube IFrame API의 자막 텍스트 접근 범위 확인
- [x] 브라우저 확장 방식과 별도 서버 방식의 공개 저장소 구조 비교
- [!] 정적 Pages만으로 임의 공개 영상 자동 자막을 안정적으로 공급하는 경로 미확인
- [x] GitHub Actions가 요청 시점 백엔드 역할을 할 수 있는지 확인
- [x] TI/Wistia/Brightcove 스크립트 기능이 일반 YouTube 자막 공급원이 아님을 공식 문서로 확인
- [!] 현재 제약을 모두 유지하는 범용 자동 자막 취득 경로 미확인
- [ ] 자동 자막 범위/서버/API/사용량 조건 중 조정 가능한 항목 결정
- [ ] 결정된 경로가 성립할 때 자동 자막 연결 구현
- [ ] 자막 시간 동기화 및 교정 UI 개선

## 2단계 — MVP
- [ ] 영상 주소 입력 및 영상책 안에서 재생
- [ ] 정책/쿼터에 맞는 경우 영상 검색
- [ ] 가능한 자막 언어/출처/자동 생성 여부 표시
- [ ] 시간대별 자막과 클릭 seek
- [ ] 자막 텍스트 편집 및 브라우저 저장

## 3단계 — 안정화
- [ ] Android 화면/긴 자막 성능
- [ ] 네트워크/자막 없음/권한 오류 안내
- [ ] 개인정보·키·저장 데이터 점검
- [ ] 실제 Android 회귀 테스트

## 4단계 — 후속 기능
- [ ] 자막 없는 영상의 음성 인식 가능성
- [ ] 실제 장면 이미지 삽입 가능성
- [ ] 요약/긴 글/콘텐츠 피드

## 현재 작업
**VB-27 — 검색 공식 경로 판정.** IFrame Player API 검색 기능은 중단됐고, Data API는 현재 사용자 제약상 설정하지 않는다. 자동 자막 취득도 미해결이다. 동일한 조사 반복이나 기능처럼 보이는 UI 추가는 하지 않는다. 핵심 제약을 유지할지 변경할지 결정되기 전까지 핵심 기능 구현은 차단 상태다.

## 작업 기록
- 2026-11-11: Android에서 기본 YouTube 재생/시점 이동 확인.
- 2026-11-11: 로컬 SRT/VTT 파서 코드 반영(실기기 검증은 별도).
- 2026-11-11: 공식 Captions API는 임의 공개 영상의 범용 자막 다운로드를 지원하지 않음을 확인.
- 2026-11-11: IFrame Player API 문서에서 자막 텍스트 반환 메서드를 확인하지 못함. 플레이어 내 캡션 표시 제어와 자막 전문 취득을 구분.
- 2026-11-11: Transcript Studio for YouTube와 yttext의 README/라이선스/아키텍처/배포 문서를 확인. 확장 권한 방식과 FastAPI 서버 방식의 제약을 기록.
- 2026-11-11: 별도 참고 페이지를 사용자 테스트 대상으로 안내하지 않기로 재확인.

- 2026-11-11: YouTubeScribe(현재 VideoQuill로 리디렉션)와 YT2Text의 공개 API 문서/가격/인증 구조 확인. timestamped transcript API는 있으나 API 키 보호를 위해 서버가 필요하고 무료/credit 한도가 있어 현재 정적 Pages 기준에 채택하지 않음.

- 2026-11-11: MDN 동일 출처 정책 문서에서 교차 출처 YouTube iframe 내부 DOM 직접 접근 제한 확인.
- 2026-11-11: Chromium Extensions 담당자의 공개 답변에서 Android Chrome 확장 프로그램 지원 계획이 없음을 확인.
- 2026-11-11: Web Speech API 문서의 마이크/파일 입력 범위를 확인하고 YouTube iframe 오디오 자동 전사와 구분.

- 2026-11-11: GitHub 공식 문서로 Pages 정적 호스팅과 Actions workflow/runner의 이벤트 기반 실행 구조를 확인. Actions를 방문자 요청 처리용 상시 백엔드로 쓰지 않기로 결정.

- 2026-11-11: TranscriptLayer API의 timestamped segments/무료 100 credits/분당 120회 제한/Bearer key/18세 이상 계정 조건을 확인. 사용 후보에서 제외하고 참고 자료로만 기록.

- 2026-11-11: TranscriptFetch 무키 체험은 네트워크당 하루 10회 및 자동 스크립트/봇 수집 금지 약관을 확인해 자동 공급원에서 제외.

- 2026-11-11: VB-08 공식 Captions API 권한/quota, IFrame captions 범위, 제작자 제공 SRT/VTT의 동일 출처/CORS 경로 조사. 다음 작업 VB-09 단일 영상 자동 연결 검증.

- 2026-11-11: VB-09에서 TI/Wistia/Brightcove 공식 스크립트 기능을 재검증. 일반 YouTube 영상의 자막 공급원이 아님을 확인하고 핵심 자동 취득 후보에서 제외. 앱 코드/배포 변경 없음.


- 2026-11-11: 사용자가 개발비용은 무료만 허용한다고 확정. 저렴한 유료 서비스, 무료 체험 후 결제, 무료 한도 소진 후 유료 전환이 필요한 핵심 의존성을 제외. GitHub Pages/브라우저 내 처리 원칙 유지.


- 2026-11-11: VB-10 공식 IFrame captions 모듈, YouTube Captions API, MDN 동일 출처/CORS, GitHub Pages 실행 모델 재검증. 범용 공개 영상 자동 자막은 현재 무료·정적 구조에서 미확인으로 결론. 허가 SRT/VTT 등록 영상만 자동 연결 가능 후보로 남김. 코드/배포 변경 없음.


- 2026-11-11: VB-11 등록형 자막 연결 골격 구현. `captions.json` 및 `captions/README.md` 추가, `app.js`에 video ID 기반 자동 fetch·경로 검사·이전 요청 무시 처리 추가. 실제 허가 샘플 미확보로 자동 자막 로드/Android 실기기 테스트는 보류.


- 2026-11-11: VB-11 안정성 점검에서 수동 자막 파일의 비동기 읽기가 영상 전환 후 늦게 완료되어 새 영상 자막을 덮어쓸 수 있는 경쟁 상태를 발견하고 요청 토큰 확인을 추가. SRT 2 cue/VTT 1 cue 파서 합성 테스트, 잘못된 형식 거부, 경로 검사 및 전체 JS 구문 검사 통과. 실영상/Android/Pages 배포 테스트는 허가 샘플이 없어 미완료.


- 2026-11-11: 저장소 정적 점검에서 captions.json의 JSON 문법 오류 발견. 이를 수정한 뒤 JSON 파싱, HTML-스크립트 요소 ID 연결, 로컬 스크립트 참조, JS 구문, 등록형 로더 합성 테스트(정상 매핑/매핑 없음/경로 탈출 차단)를 검증했다. 실영상/실기기/Pages 배포 테스트는 별도다.


- 2026-11-11: VB-12 코드 감사에서 현재 제품 범위(플레이어/자막 패널/로컬 자막/허가 파일 등록 골격)와 미구현 기능(범용 자동 취득/요약/사진/피드)을 재확인. 겹치는 cue의 활성 문장 선택 오류를 수정하고 일반 cue 경계/공백/중첩 합성 테스트를 수행.


- 2026-11-11: VB-12에서 YouTube 주소에서 추출한 ID의 11자리 검증 누락과 자막 시간값의 분/초 범위 검증 누락을 발견해 수정. 지원 주소/잘못된 ID/시간 경계/SRT·VTT 파서 격리 테스트 18/18 통과, 전체 JavaScript 구문 검사 통과. Android 실제 파일/화면 동작은 다음 확인 단계.


- 2026-11-11: 요구사항과 맞지 않게 추가했던 스크립트 붙여넣기 UI/파서를 제거하고 기존 자동 자막 목표 및 SRT/VTT 시험용 보조 기능으로 복원. 다음 작업 VB-14는 자동 취득 경로 검토.


## AI 작업 운영 원칙
- [x] 매 작업 전 기준 문서/최신 커밋 조회 절차 문서화
- [x] 최신 정보의 1차 출처 및 독립 출처 교차 확인 원칙 문서화
- [x] 성공·실패·미실행 테스트·미확인 사항의 작업 후 기록 규칙 문서화
- [ ] 다음 작업부터 매 회차 실제 적용 및 기록 누락 여부 점검

- 2026-11-11: 사용자의 요청에 따라 `AGENT_WORK_RULES.md`를 추가하고 README, 프로젝트 기준/상황판, 로드맵, 결정 기록 및 조사 자료에 연결했다. TranscriptFox는 API 문서의 무료 제한과 API/Privacy 설명 간 처리 경로 차이를 확인해 채택하지 않고 후보/자료 충돌 상태로 남겼다. CORS/POST/실영상/Android 검증은 미실행.


## VB-14 — 공개 자막 추출 프로젝트 및 정책 적합성 조사 (2026-11-11)
- [x] youtube-transcript-api의 기능, 라이선스, Python 런타임 의존성 확인
- [x] YouTube.js의 브라우저 지원, 내부 API 의존성, 라이선스 확인
- [x] yt-dlp의 자막 옵션, CLI/Python 실행 요구, 라이선스 확인
- [x] YouTube 이용약관 및 API Developer Policies에서 자동 스크래핑/비공식 API 제한 확인
- [x] 공식 Captions API의 OAuth, 메타데이터/본문 차이, 영상 편집 권한 확인
- [x] 후보 3개 모두 현재 제품 제약과 정책 기준으로 채택하지 않기로 판정
- [ ] 제작자 본인/명시적 권한이 있는 영상의 공식 자막 취득 흐름 조사
- [ ] 이용 권한이 명확하고 무료 조건이 확인되는 독립 자막 제공처 조사

- 2026-11-11: VB-14 조사 결과 공개 구현 프로젝트 3개는 확인했으나 영상책 조건을 모두 충족하는 적합 후보는 찾지 못했다. 비공식 내부 API/스크래핑은 YouTube 공식 정책과 충돌하므로 채택하지 않는다. 코드 변경 및 실제 브라우저/Android/배포 테스트 없음.

### VB-15 작업 기록 — 2026-11-11
- [x] TranscriptFox API/Terms/Privacy 최신 조건 확인
- [x] Transcript.land API key 및 월별 무료 한도 확인 (일부 원문 열람 제한 기록)
- [x] GetYouTubeTranscript 무료 크레딧·API key·수집 방식 확인
- [x] YouTube API 약관의 법적 계약 연령 조건 확인
- [!] 모든 제약을 만족하는 범용 공개 영상 자막 API 미발견
- [ ] 제작자 명시 제공/허가 SRT/VTT를 기존 정적 레지스트리에 연결하는 사용자 흐름 구체화
- [ ] 허가된 샘플 파일이 확보되면 Android에서 실제 자동 fetch 및 동기화 검증

현재 작업 상태: VB-15 조사 완료, 외부 API 통합 보류. 범용 자동 자막은 미해결이며 코드 변경·계정 생성·결제는 없었다.

### VB-16 작업 기록 — 2026-11-11
- [x] YouTube 공식 대본 보기 도움말과 Developer Policies 확인
- [x] 영상 로드 시 YouTube 공식 시청 페이지 대본 링크를 표시하도록 구현
- [x] 기존 영상 재생·정적 자막 등록·cue 동기화 코드 변경 없이 fallback만 추가
- [ ] JavaScript 정적 구문 검사 (현재 컨테이너의 DNS 오류로 원격 소스 다운로드 실패)
- [ ] 브라우저에서 유효/잘못된 URL별 링크 표시 검증
- [ ] Android에서 YouTube 대본 보기 링크 및 공식 UI 확인
- [ ] GitHub Pages 배포 후 실제 동작 확인

현재 작업 상태: 정책 준수 fallback UI 구현. 내부 패널 자동 대본 로드는 미해결. 비공식 스크래핑/내부 API/프록시 우회는 사용하지 않음.

### VB-17 기록 — 2026-11-11
- [x] 영상책 내부 검색 → 스크립트 자동 추출 → 맞춤법 교정 → 내부 표시 순서를 최우선 목표로 문서화
- [x] YouTube 모바일 웹에서 대본 복사를 요구하지 않는 조건 명시
- [x] 공식 대본 링크는 보조 경로이며 핵심 기능 대체가 아님을 명시
- [ ] YouTube 공식 검색 경로의 쿼터·키·연령/약관 조건 재검증
- [ ] 정책에 맞는 공개 영상 스크립트 자동 추출 경로 검증
- [ ] 추출 성공 후 브라우저 내 한국어 맞춤법 교정 품질/Android 성능 검증

이번 회차는 문서 갱신만 수행했으며 코드·API·배포 변경은 없다. 검색/추출/교정/Android/Pages 테스트는 미실행.


## VB-18 조사 반영 — 2026-11-11
- [!] YouTube 공식 검색 API는 존재하지만, API 프로젝트/자격 증명·하루 100회 쿼터·계약 연령 조건·공개 저장소 자격 증명 금지 때문에 현재 사용자와 GitHub Pages 정적 앱 조건으로 채택 보류.
- [!] `captions.list`는 본문을 반환하지 않으며 OAuth 필요; `captions.download`는 OAuth와 영상 편집 권한이 필요하므로 임의 공개 영상 자동 추출의 해결책이 아님.
- [ ] 제작자 본인/명시적 권한 영상에서 공식적으로 제공되는 자막 파일을 영상책이 정적으로 자동 연결할 수 있는 형태 조사.
- 맞춤법 교정·내부 표시 구현은 자동 추출 입력 경로를 확보한 다음에 진행.
- 상세 근거: `PROJECT_STATUS.md` §13, `RESEARCH_BENCHMARKS.md` §23, `DECISIONS.md` Decision 036.


## VB-19 조사 반영 — 2026-11-11
- [x] YouTube Studio의 제작자/편집자 자막 파일 다운로드 절차 확인
- [x] SRT UTF-8 및 WebVTT 지원 형식 확인
- [x] 기존 `captions.json` → `captions/` → parser → player sync 코드 경로 재확인
- [!] 공개 저장소 재배포는 권리자의 명시적 허가가 있을 때만 가능
- [ ] 권리 허가가 확인된 실제 SRT/VTT 파일과 영상 ID 1개로 end-to-end 테스트
- [ ] 실제 Android 및 GitHub Pages 배포에서 자동 로드·시간 동기화 확인
- [ ] 임의 공개 영상의 앱 내부 검색·범용 자동 추출 경로는 별도 미해결 과제로 유지

이번 회차는 공식 문서 조사와 기존 코드 경로 확인, 문서 반영만 수행했다. 코드·자막 파일·API·배포는 변경하지 않았으며 실제 파일 E2E는 미실행.


## VB-20 기록 — 2026-11-11
- [x] 일반 시청자에게 YouTube 공식 대본 UI가 제공되는 범위 확인
- [x] `captions.list`가 본문이 아니라 트랙 목록만 반환하고 OAuth를 요구하는 점 재확인
- [x] `captions.download`가 OAuth와 영상 편집 권한을 요구하는 점 재확인
- [x] IFrame Player API의 공개 기능과 브라우저 교차 출처 경계 확인
- [x] YouTube 정책의 undocumented API 및 스크래핑 금지 조항 확인
- [x] 제작자 파일 경로가 일반 시청자용 해결책으로 보이지 않도록 README/기준 문서 수정
- [ ] 일반 시청자용 공식 자동 자막 취득 경로 발견 및 실제 검증
- [ ] 앱 내부 YouTube 검색, 자동 추출, 교정, 표시/시간 동기화 E2E
- [ ] Android 및 GitHub Pages 실기기/배포 테스트

이번 회차는 공식 문서 조사와 프로젝트 문서 갱신만 수행했다. 코드·API 계정·키·OAuth·외부 서비스·결제 변경은 없고 비용은 0원이다. 실제 브라우저/CORS/Android/Pages 테스트는 미실행이다. 제작자/권리자 파일을 일반 시청자에게 요구하지 않는다.


## VB-22 기록 — 2026-11-11
- [x] Web Speech API가 YouTube 자막 API가 아닌 STT라는 점 확인
- [x] 기본 Chrome SpeechRecognition이 서버 기반일 수 있고 오프라인이 아님을 확인
- [x] Chrome Android에서 SpeechRecognition on-device `processLocally` 지원이 확인되지 않음을 확인
- [x] Chrome Android에서 `getDisplayMedia` 및 systemAudio 지원이 확인되지 않음을 확인
- [x] YouTube IFrame API captions 모듈의 공개 옵션(fontSize, reload) 확인
- [x] captions 모듈이 transcript 본문/cue 반환 기능을 문서화하지 않음을 확인
- [ ] 일반 시청자용 공식 자동 자막 본문 취득 경로 발견
- [ ] 앱 내부 검색 → 자동 자막 → 한국어 교정 → 표시/시간 동기화 E2E
- [ ] Android 실기기 및 Pages 테스트

이번 회차는 공식 문서 조사 및 문서 반영만 수행했다. 코드 변경·API 호출·외부 서비스·계정·결제는 없고 비용은 0원이다. Android 실기기와 실제 YouTube 영상에서의 API 실험은 미실행이다.


## VB-23 기록 — 2026-11-11
- [x] 10개를 넘는 검색 질의로 GitHub/웹/npm/Reddit/공식 정책 탐색
- [x] 대표 오픈소스 프로젝트 5개 이상의 README 및 실제 추출 소스 코드 비교
- [x] Python/Node/TypeScript/Go/CLI/브라우저 DOM 방식 구분
- [x] Reddit에서 YouTube transcript panel 수동 열기 및 외부 서비스 의존 사례 확인
- [x] 모바일 Safari CORS 문제 GitHub issue 확인
- [x] 공식 정책/약관과 비공식 API·스크래핑 방식의 위험 교차 확인
- [ ] Android에서 공식·정책 준수 원본 페이지 DOM 연동 가능성 검증
- [ ] 일반 시청자용 공식 자동 자막 본문 취득 경로 발견
- [ ] 앱 내부 검색 → 자동 자막 → 교정 → 표시/시간 동기화 E2E

이번 회차는 생태계 조사와 문서 갱신만 수행했다. 코드·API·계정·외부 서비스·프록시·결제 변경은 없고 비용은 0원이다. Android 실기기 및 Pages 테스트는 미실행이다.


## VB-24 — 스크래핑 유형별 조사 (2026-11-11)
- [x] DOM scraping / page network interception / undocumented endpoint / headless browser 분류
- [x] YouTube Copy Transcript, SubtideX, PromptTube의 transcript DOM 흐름 비교
- [x] youtube-transcript-downloader의 fetch interception 구조 확인
- [x] YouTube Copy Transcript의 최신/구형 DOM selector fallback 및 fixture test 확인
- [x] Obsidian Clipper의 DOM selector 변경 및 timedtext empty-response 장애 사례 확인
- [x] Defuddle의 모바일 Safari CORS/fallback 문제 확인
- [x] YouTube ToS와 API Developer Policies의 적용 범위 구분
- [x] Chrome Android 확장 미지원 및 Firefox Android 확장 호환성 제한 확인
- [ ] Android Firefox에서 실제 extension compatibility 및 end-to-end 실행 검증
- [ ] extension → Video Book 페이지 자동 전달 경로의 사용성/보안/정책 검증
- [ ] 자동 검색 → transcript DOM → 교정 → 앱 표시/재생 동기화 E2E

이번 회차는 자료 조사와 문서 기록만 수행했다. 코드 변경, 실기기 테스트, API/서버/프록시/계정 설정은 없고 비용은 0원이다.


## VB-25 — Firefox Android 확장 연계·정책 검토 (2026-11-12)
- [x] Firefox for Android 확장 설치 지원 및 호환성 주의 확인
- [x] Firefox 확장 서명·AMO 등록·자체 배포 XPI 설치 조건 확인
- [x] WebExtensions 메시지 전달 및 로컬 저장 API의 설계 가능성 확인
- [x] YouTube Terms의 자동화 접근 제한 문구 재확인
- [x] 영상책의 IFrame Player API 사용과 YouTube API Client 정의/스크래핑 정책의 관련성 확인
- [x] 사용자 복사·붙여넣기 없는 확장→영상책 데이터 전달 설계안 작성
- [ ] YouTube의 명확한 서면 허가 또는 적용 가능한 공식 정책 허용 근거 확인
- [ ] Firefox Android에서 영상책 확장 설치·API 호환성·실제 YouTube DOM 읽기·탭 간 전달 실기기 테스트 (정책 허용 근거 확보 후에만 진행)
- [ ] 앱 내부 검색 → 자동 자막 → 교정 → 표시/시간 동기화 E2E

판정: 전달 구조는 설계상 가능성이 있지만 Android 실기기 검증은 미실행이다. YouTube 약관/Developer Policies 관련 위험으로 실제 scraping 구현과 배포는 보류한다. 이번 회차 코드 변경·계정 생성·API/서버/프록시/결제는 없고 비용은 0원.


## VB-26 — YouTube 공식 문의·사전 서면 허가 경로 확인 (2026-11-13)
- [x] YouTube Terms의 automated means 및 prior written permission 문구 재확인
- [x] Developer Policies III.E.6의 API Client scraping 금지 문구 재확인
- [x] API Compliance Audit 가이드의 안내 목적 확인
- [x] 정책 문서에서 연결되는 실제 양식의 제목, 요청 유형, 필수 항목 확인
- [x] YouTube Legal Support 이메일의 공식 안내 범위 확인
- [x] API Services Terms의 법적 계약 연령 제한 확인
- [ ] API Client scraping prohibition과 Terms prior written permission 사이의 관계에 대한 YouTube 공식 서면 답변 확보
- [ ] API 프로젝트/약관 수락을 요구하지 않는 일반 사전 허가 신청 경로 확인
- [ ] 정책상 허용 근거 확보 후 Android viewer transcript E2E 테스트

판정: 공식 API Compliance Audit은 존재하지만, 양식은 API Client/프로젝트에 대한 quota audit 또는 재감사 중심이며, 스크래핑 허가만 요청하는 일반 사용자용 경로로 확인되지 않았다. Legal Support 이메일도 허가 접수처인지 미확인. API Services 약관의 계약 연령 요건 때문에 사용자에게 계정/프로젝트/약관 수락을 안내하지 않는다. 구현은 보류한다.


## VB-27 — 검색 경로 및 실제 구현 상태 (2026-11-13)
- [x] 현재 `index.html` / `app.js`의 실제 구현 범위를 재확인
- [x] IFrame Player API 검색 결과 목록 기능의 지원 중단 시점 확인
- [x] 공식 Data API 검색 경로 및 등록/할당량 요건 확인
- [x] API 약관의 계약 연령 요건 재확인
- [!] 현재 사용자 제약에서 영상책 내부 검색 구현 — 공식 경로 설정 불가
- [!] 일반 시청자용 자동 자막 취득 — 승인된 구현 경로 미확보
- [ ] 자동 맞춤법 교정 및 내부 스크립트 표시 — 자막 공급 경로가 해결되기 전에는 구현을 시작하지 않음

작업 기록: 이번 회차에는 코드 변경이 없다. 기능이 없는 상태에서 검색창/버튼만 추가하는 것은 작동하는 기능이 아니므로 하지 않았다. 현재 앱은 영상 주소 재생과 자막 파일 파싱/동기화 실험판이다. 자세한 근거는 PROJECT_STATUS.md VB-27, DECISIONS.md Decision 045, RESEARCH_BENCHMARKS.md §31.


## VB-28 — 영상책 내부 검색 흐름 확정 (2026-11-13)
- [x] 검색은 영상책 화면 안에서 이뤄져야 한다는 요구사항 명문화
- [x] 검색 결과 목록도 영상책 화면 안에 표시하도록 명문화
- [x] 목록 항목 선택 시 외부 이동 없이 내부 플레이어 재생하도록 명문화
- [x] 외부 YouTube 검색 후 URL 복사/붙여넣기를 핵심 흐름 대체안에서 제외
- [!] 실제 내부 검색창/검색 결과 목록/목록 선택 재생 구현 — 공식 검색 공급 경로 미확보
- [ ] 현재 연령·계정·비용·정적 웹앱 제약을 모두 유지하는 허용된 검색 데이터 경로가 확인되면 실제 API 연결과 E2E 검증
- [ ] 검색 공급 경로가 확보되기 전에는 목업 검색 결과나 미작동 버튼을 제품 기능으로 추가하지 않음

**필수 UX:** 영상책 내부 검색창 → 내부 검색 결과 목록 → 항목 선택 → 영상책 내부 플레이어 재생. 외부 검색 페이지/URL 복사·붙여넣기는 대체 완료가 아니다.


## VB-29 — 자막 파서 테스트 기반
- [x] 파싱/시간 표시 로직을 독립 ES module로 분리
- [x] Node.js 내장 테스트 러너 설정 및 8개 자동 테스트 추가
- [x] GitHub Actions push/pull request 검사 워크플로 추가
- [~] GitHub Actions 실제 실행 결과 확인
- [ ] Android 실기기에서 실제 한국어 SRT/VTT 파일과 영상 동기화 재검증

이 작업은 기존 자막 파일 파서의 유지보수성과 회귀 검증을 개선한다. YouTube 일반 시청자용 자동 자막 취득이나 내부 검색을 해결한 것은 아니다.
