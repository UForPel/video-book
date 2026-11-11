# 영상책 개발 로드맵

상세 상태는 [PROJECT_STATUS.md](./PROJECT_STATUS.md), 기술 결정은 [DECISIONS.md](./DECISIONS.md), 벤치마킹 자료는 [RESEARCH_BENCHMARKS.md](./RESEARCH_BENCHMARKS.md)를 기준으로 관리합니다.

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
- [ ] GitHub 내부에서 가능한 브라우저 측 자막 자동 취득 경로 추가 검증
- [ ] 사용자 제약 우선순위 결정
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
**VB-09 — 제작자 허가 SRT/VTT 파일 자동 연결의 단일 영상 검증.** VB-08에서 YouTube 공식 Captions API는 OAuth 및 영상 수정 권한이 필요하고 quota 비용이 있음을 확인했다. IFrame Player API는 자막 텍스트 전문을 제공하지 않는다. 현재 제약을 유지하는 후보는 허가된 SRT/VTT 파일을 저장소의 정적 경로에 두고 영상 ID와 매핑해 자동 로드하는 방식이다. 실제 허가 샘플로 검증하기 전에는 자동 연결 코드를 추가하지 않는다.

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
