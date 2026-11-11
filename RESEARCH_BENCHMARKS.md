# 영상책 벤치마킹 후보 — 재검증 기록

조사일: 2026-11-11  
목적: 이전에 검토한 오픈소스 프로젝트 중 공식 저장소와 README에서 기능·구조를 다시 확인할 수 있는 항목만 기록한다.

## 판정 기준

- **확인됨**: 공식 GitHub 저장소/README에서 프로젝트 목적, 주요 기능, 기술적 전제 또는 라이선스를 확인함.
- **벤치마킹 가능**: 코드/화면 구조를 참고할 가치가 있음. 영상책에 그대로 복사하거나 의존성을 추가한다는 뜻은 아님.
- **채택 보류**: 영상책의 핵심 제약(정적 GitHub Pages, Android, 무료/쿼터 최소화, 자동 자막)과 맞지 않거나 정책·안정성·라이선스 검증이 더 필요함.
- 별도 실기기 테스트나 운영 안정성 검증을 하지 않은 사항은 성공했다고 간주하지 않는다.

## 1. Hyperaudio Lite

- 저장소: https://github.com/hyperaudio/hyperaudio-lite
- 공식 데모: https://hyperaudio.github.io/hyperaudio-lite/youtube.html
- 확인된 내용:
  - 가벼운 인터랙티브 transcript viewer.
  - Vanilla JavaScript, 프레임워크/의존성 없이 동작하며 빌드 단계가 필요 없다고 README에 명시.
  - MIT 라이선스.
  - YouTube iframe을 플레이어로 연결하는 예제가 있음.
  - 타임스탬프가 포함된 transcript를 클릭해 해당 시점으로 이동하고 재생 중 텍스트를 따라가는 기능을 제공.
  - 입력 transcript는 SRT 등에서 변환하거나 별도 Editor/Converter로 준비해야 함.
- 영상책 벤치마킹: **적극 권장** — 타임라인 자막 UI, 문장/단어 클릭 seek, 자동 스크롤, 플레이어 어댑터 구조.
- 한계:
  - YouTube 영상에서 자막을 자동으로 가져오는 기능은 README에서 확인되지 않음.
  - 자막 확보 문제를 해결해 주는 도구가 아니라, 확보된 시간표시 transcript를 재생과 동기화하는 도구.
- 판정: **UI/동기화 참고 후보로 확인됨. 자동 자막 취득 도구로는 부적합.**

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
| Hyperaudio Lite | 타임드 transcript와 YouTube iframe 동기화 | 확인 안 됨 | 프런트엔드 모듈로 검토 가능 | 동기화 UI 참고 |
| Hyperaudio Lite Editor | 로컬 STT/자막 교정/내보내기 | 로컬 미디어 대상 기능, YouTube iframe 자동 추출은 미확인 | 일부 브라우저 기능은 가능성 있으나 실험 필요 | 교정 UI/로컬 STT 참고 |
| Invidious | 대체 프런트엔드/API | 이번 조사에서 확인 안 됨 | 부적합(서버/인스턴스) | 구조만 참고 |
| Piped | 대체 프런트엔드/API | 이번 조사에서 확인 안 됨 | 부적합(백엔드/인스턴스) | 구조만 참고 |
| ViewTube | 모바일 UI/검색/영상 탐색 | 이번 조사에서 확인 안 됨 | 부적합(서버/API 구조) | UI만 참고 |
| Materialious | 모바일 플레이어/탐색 UI | 이번 조사에서 확인 안 됨 | 부적합(백엔드 배포 경로) | UI만 참고 |

## 영상책에 대한 결론

1. **Hyperaudio Lite를 우선 벤치마킹**한다. 이미 영상책이 구현한 YouTube IFrame 플레이어와 결합할 수 있는 시간 동기화 transcript UI가 목적에 가장 가깝다.
2. **Hyperaudio Lite Editor는 별도 실험**으로 둔다. Android 기기에서 한국어 Whisper/Parakeet 모델이 실제로 실행되는지, 메모리/성능이 감당 가능한지 확인하기 전에는 통합하지 않는다.
3. Invidious, Piped, ViewTube, Materialious는 제품 전체를 복제하거나 서버를 연결하지 않는다. 필요한 UI/구조만 참고한다.
4. 이번 재검증으로도 **임의의 공개 YouTube 영상에서 자막을 자동으로 얻는, 무료·무제한·서버 없는 확실한 방법은 확인되지 않았다.**
5. 어떤 비공식 서비스도 자동 자막 취득 경로로 확정하지 않는다. 공식 문서, 운영 구조, 라이선스, 정책, 장애 대응을 확인하고 별도 실험을 통과한 뒤에만 채택한다.

## 확인한 공식 출처

- https://github.com/hyperaudio/hyperaudio-lite
- https://github.com/hyperaudio/hyperaudio-lite-editor
- https://github.com/iv-org/invidious
- https://github.com/TeamPiped/Piped
- https://github.com/ViewTube/viewtube
- https://github.com/Materialious/Materialious

이 문서는 저장소 README/공식 문서에서 확인한 기능 설명을 정리한 것이며, 각 프로젝트의 모든 버전·배포 인스턴스·실사용 가용성을 실기기에서 검증했다는 뜻은 아니다.
