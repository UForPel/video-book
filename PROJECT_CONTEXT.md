# 영상책 프로젝트 기준 문서

이 문서는 새 대화나 개발 환경에서도 프로젝트의 목적과 합의된 기준을 복원하기 위한 기준 문서입니다. 새로운 결정이 생기면 이 문서를 갱신합니다.

## 1. 프로젝트 개요

- 이름: 영상책 (Video Book)
- 목적: 유튜브 영상을 재생하면서 글과 사진(후속 기능)을 함께 읽는 개인용 웹앱
- 사용 대상: 우선 사용자 본인
- 플랫폼: 모바일 우선 웹앱, PC에서도 사용 가능하면 좋음
- 운영 목표: GitHub Pages를 이용한 무료 정적 호스팅

## 2. 사용자 개발 환경

- Android 스마트폰만으로 개발 진행
- 코딩 초보
- AI 도움과 자동화를 최대한 활용
- 무료 또는 거의 무료 도구 선호
- 전화번호 인증을 요구하는 서비스는 가급적 피함
- 기존 ReadTube/Bolt 프로젝트가 있으면 재사용 가능성을 먼저 검토하고 기존 프로젝트는 보존

## 3. 비용 및 사용량 제한 원칙 — 필수 조건

- 외부 유료 API를 핵심 기능의 필수 의존성으로 사용하지 않는다.
- 유료 AI API에 의존하지 않는다.
- 무료 플랜에 일일·월간 쿼터, 요청 수, 대역폭, 저장 공간 등의 제한이 있는지 확인한다.
- 사용량 제한이 있는 무료 서비스는 핵심 기능에 채택하기 전에 대체 경로와 실제 한도를 검토한다.
- 가능한 한 서버 없이 브라우저에서 직접 처리한다.
- GitHub Pages 및 브라우저 자체도 정책·기술적 한계가 있으므로 '완전 무제한 무료'라고 가정하지 않는다.
- 비용, 쿼터, 정책이 확인되지 않은 서비스는 무제한이라고 표현하지 않는다.

## 4. 핵심 사용자 흐름

1. 영상책 안에서 유튜브 영상을 검색한다.
2. 검색 결과에서 영상을 선택한다.
3. 같은 화면에서 영상을 재생한다.
4. 영상과 시간대가 맞는 자막/대본을 화면 아래 또는 옆에서 읽는다.
5. 자막 문장을 선택하면 영상이 해당 시간으로 이동한다.
6. 자막의 인식 오류, 맞춤법, 띄어쓰기, 문장부호를 편집해 읽기 좋게 만든다.

## 5. 기능 우선순위

### MVP 우선

1. 앱 내부 유튜브 검색
2. 앱 내부 영상 재생
3. 이용 가능한 기존 자막 확보
4. 시간 정보가 포함된 자막 표시
5. 자막 구간 선택 시 영상 시점 이동
6. 자막 텍스트 편집 및 교정

### 후속 기능

- 영상의 실제 장면 이미지 삽입
- 10초 간격 장면 이미지
- 짧은 요약과 긴 글 형식의 콘텐츠
- 자막이 없는 영상의 음성 인식(STT)
- 콘텐츠 피드

자막 원문과 교정문을 나란히 비교하는 기능은 필수 MVP가 아니며 나중에 결정합니다.

## 6. 기술 및 정책 제약

- GitHub Pages는 정적 웹 호스팅이며 서버·비밀키 보관소가 아니다.
- YouTube Data API 검색에는 쿼터가 적용되므로 무제한 검색으로 간주하지 않는다.
- YouTube 공식 캡션 API는 모든 공개 영상의 자막을 임의로 내려받을 수 있는 범용 수단이 아니다. 권한 및 영상 소유 조건을 확인한다.
- YouTube IFrame Player API는 영상 재생과 재생 위치 제어에 활용할 수 있다.
- 임베드된 YouTube 영상의 실제 프레임을 임의로 캔버스 추출하는 것은 교차 출처 제한 때문에 일반적으로 불가능하다.
- 비공식 YouTube 프런트엔드/내부 인터페이스는 YouTube 변경에 따라 고장 날 수 있고, 서비스 약관·접근 제한을 검토해야 한다.
- 로컬 또는 사용 권한이 있는 미디어 파일은 브라우저 내 처리 가능성을 별도로 시험한다.
- Android에서 CPU·GPU·메모리·배터리 사용량과 한국어 지원을 직접 시험한다.

## 7. 기술 선택 평가 기준

새 도구나 서비스는 아래 항목을 확인한 뒤 채택합니다.

1. 무료 여부와 유료 전환 조건
2. 일일·월간 사용량 제한 및 쿼터
3. GitHub Pages 정적 배포 호환성
4. Android 브라우저 지원
5. 별도 서버 필요 여부
6. 전화번호·결제수단 요구 여부
7. 실제 사용자 이슈와 최근 유지보수 상태
8. 이용약관·저작권·개인정보 관련 조건
9. 대체 수단과 서비스 중단 시 영향

## 8. 개발 방식

- 기능을 작은 단계로 나누고 각 단계마다 실제 Android 기기에서 확인합니다.
- 검증되지 않은 외부 서비스에 앱 전체가 의존하지 않도록 모듈을 분리합니다.
- API 키와 비밀정보는 공개 저장소에 커밋하지 않습니다.
- 기술 조사는 공식 문서와 실제 이슈·사용자 경험을 함께 확인합니다.
- 확정되지 않은 사항은 '미정' 또는 '검증 필요'로 표시합니다.

## 9. 변경 기록

- 2026-11-11: 개인용 모바일 우선 웹앱, GitHub Pages, 무료/저사용량 의존성 최소화, 핵심 기능 우선순위를 정리함.


## 10. 자동 자막 목표와 공식 API 조사 결과 (2026-11-11)

- 최종 사용자 흐름은 기기에서 SRT/VTT 파일을 직접 선택하는 방식이 아니라, 유튜브 영상을 불러오면 가능한 경우 자막을 자동으로 확보해 영상과 동기화하는 방식이다.
- 로컬 SRT/VTT 선택 기능은 내부 시험용 보조 기능이며 최종 목표가 아니다.
- YouTube 공식 Captions API는 OAuth 인증을 요구한다. `captions.list` 응답에는 자막 본문이 포함되지 않으며, `captions.download`는 사용자가 해당 동영상을 수정할 권한이 있어야 한다.
- 따라서 공식 API만으로 임의의 공개 영상에 대한 자동 자막 취득을 구현할 수 없다.
- 공식 참고 문서:
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/list
  - https://developers.google.com/youtube/data/reference/rest/v3/captions/download
  - https://developers.google.com/youtube/v3/guides/implementation/captions
- 다음 개발 과제는 일반 공개 영상의 자막을 자동 확보할 수 있는 정책 준수 경로를 검증하는 것이다. 비용, 요청 제한, 서버 필요 여부, Android 호환성, 개인정보 및 서비스 안정성을 확인하기 전에는 외부 서비스를 채택하지 않는다.


## 11. AI 작업 행동강령 — 2026-11-11

- 저장소의 [AGENT_WORK_RULES.md](AGENT_WORK_RULES.md)를 모든 영상책 관련 작업 전에 조회하고 따른다.
- 매 작업 전 최신 커밋과 기준 문서, 현재 목표/제약/직전 작업 결과를 확인한다.
- 가격·쿼터·API·약관·지원 여부 등 변동 정보는 작업 당일 1차 출처와 독립된 보조 출처로 재확인한다. 출처 충돌은 숨기지 않고 미확인/자료 충돌로 기록한다.
- 작업 전 목표·범위·검증 방법을 사용자에게 설명하고, 작업 후 성공·실패·미실행 테스트·변경 파일·커밋·다음 작업을 GitHub에 기록한다.
- 테스트 합성 성공, 실제 Android 테스트, 브라우저 네트워크 테스트, GitHub Pages 배포 확인을 서로 구분한다.
- 요구사항과 다른 기능을 임의로 만들지 않는다. 기존의 무료 0원, Android, GitHub Pages 우선, YouTube 자막 자동 취득 목표를 사용자 승인 없이 변경하지 않는다.

## 12. YouTube 공식 대본 연결 보조 경로 — 2026-11-11

- YouTube 공식 도움말은 자막이 있는 영상에서 영상 설명의 '대본 보기'를 열고, 문장을 눌러 해당 시점으로 이동하는 기능을 안내한다.
- 영상책은 영상 ID를 추출한 뒤 표준 YouTube 시청 페이지로 연결하는 보조 링크를 제공한다.
- 이 경로는 사용자가 YouTube 공식 UI에서 대본을 직접 보는 안전한 fallback이다. 대본 본문을 영상책으로 자동 추출하거나 별도 패널에 동기화한다고 표현하지 않는다.
- 영상책 내부 패널의 자동 로드는 현재처럼 제작자가 명시적으로 제공/허가한 정적 SRT/VTT에 한정한다.
- YouTube 웹페이지 DOM 읽기, 내부 API 호출, 자동 브라우저 스크래핑, 프록시/제한 우회는 구현하지 않는다.
- 법률 자문 또는 모든 국가에서의 합법성 보증은 아니며, YouTube 공식 정책과 권리 허가가 명확한 경로만 채택한다.

## 13. 최우선 제품 목표와 대화 복원 기준 — 2026-11-11

### 제품의 제1 목표
영상책 안에서 검색부터 교정된 스크립트 표시까지 완료하는 것이 핵심 가치다.

1. 영상책 페이지 안에서 YouTube 영상 검색
2. 검색 결과에서 영상 선택 및 영상책 안에서 재생
3. 해당 영상의 자막/스크립트를 가능한 경우 자동 추출
4. 추출한 텍스트의 맞춤법·띄어쓰기·문장부호 교정
5. 교정된 스크립트를 영상책 페이지 안에 표시한다. 시간 정보가 확보되면 영상 재생과 동기화한다.

### 사용성에서 반드시 지킬 점
- 사용자는 Android 스마트폰을 사용하며, YouTube 모바일 웹에서는 대본 복사가 어렵다고 명시했다.
- 따라서 YouTube 페이지에서 대본을 복사해 영상책에 붙여넣는 단계를 요구하지 않는다. 이 방식을 대안으로 다시 제안하거나 핵심 기능으로 구현하지 않는다.
- YouTube 공식 대본 페이지로 보내는 링크는 보조 링크일 뿐이다. 영상책 내부에서 자동 추출·교정·표시하지 못하면 핵심 요구사항을 충족한 것이 아니다.
- 영상 검색, 스크립트 추출, 맞춤법 교정, 내부 표시를 별개 기능 단계로 검증한다. 앞 단계의 성공을 뒤 단계 성공으로 간주하지 않는다.

### 기술·정책 경계와 미해결 사항
- YouTube 공식 검색 기능은 쿼터, API 키/인증, 연령 및 약관 요건을 포함해 최신 공식 문서로 검증한다. 어떤 API 키도 공개 저장소나 브라우저 코드에 비밀값인 것처럼 안전하다고 가정해 넣지 않는다.
- YouTube 공식 Captions API는 임의 공개 영상의 일반 시청자용 자막 본문 추출 API가 아니다.
- undocumented/private API, YouTube 앱/웹 DOM 스크래핑, 프록시를 통한 정책 제한 우회는 구현하지 않는다. “합법의 범위”는 접근 제한·약관·저작권을 무시해도 된다는 뜻으로 해석하지 않는다.
- 현재 조사 범위에서 0원·Android·GitHub Pages 정적 구조·정책 준수 조건을 모두 충족하는 임의 공개 영상 자동 스크립트 추출 경로는 확인되지 않았다. 불가능하다고 단정하지도 않으며, 다음 작업에서 실제 공식/허가 경로를 다시 검증한다.
- 외부 유료 AI, 유료 API, 무료 체험 후 과금, 카드 등록, 유료 전환이 필요한 무료 쿼터는 사용자의 별도 승인 없이 채택하지 않는다.
- 추출 이후의 맞춤법 교정은 우선 브라우저 내 처리 가능성을 검토하고, 한국어 품질·Android 메모리/성능을 실측하기 전에는 가능하다고 단정하지 않는다.

### 새 대화에서 반드시 복원할 핵심
“영상책의 제1 목표는 영상책 안에서 YouTube 검색 → 스크립트 자동 추출 → 맞춤법 교정 → 교정된 스크립트 표시다. 모바일 YouTube에서 복사해 오게 하지 않는다. 이 기능이 성립하지 않으면 프로젝트의 핵심 가치가 없으므로, 대체 링크를 완료로 취급하지 말고 추출 경로부터 검증한다.”


## 14. 공식 검색 API와 자막 추출의 분리 검증 (2026-11-11)
- YouTube Data API `search.list`는 공식 공개 동영상 검색 경로이지만 기본 일일 100회 쿼터가 있고, API 프로젝트/자격 증명이 필요할 수 있다.
- YouTube API Services Terms §3.2는 법적 계약을 체결할 연령에 미달한 사람의 API 약관 수락과 서비스 사용을 금지한다. 사용자의 연령을 고려해 API 프로젝트·약관 수락·키 발급·OAuth는 진행하지 않는다.
- Developer Policies는 API 자격 증명을 공개 오픈소스 프로젝트에 삽입하는 것을 금지한다. GitHub Pages 브라우저 코드에 비밀 키를 포함하지 않는다.
- `captions.list`는 실제 자막 본문을 반환하지 않으며 OAuth scope가 필요하다. `captions.download`는 OAuth와 해당 영상 편집 권한이 필요하므로 일반 시청자의 임의 공개 영상 자막 자동 취득 수단이 아니다.
- undocumented/private API, YouTube/Google 앱 스크래핑, 스크랩된 데이터 취득, 프록시/제한 우회는 구현하지 않는다.
- 이번 조사에서 현재 제약을 모두 충족하는 앱 내부 검색+임의 공개 영상 자동 자막 추출 경로는 확인되지 않았다. 불가능하다고 모든 경우를 단정하지 않는다.
- 검색과 추출은 독립된 선결 과제다. 자동 추출 경로가 확보되기 전에는 교정 기능을 핵심 목표 달성으로 간주하지 않는다.
- 상세 조사: [RESEARCH_BENCHMARKS.md §23](./RESEARCH_BENCHMARKS.md#23-youtube-공식-검색-api자막-본문-접근의-분리-검증--2026-11-11), [PROJECT_STATUS.md §13](./PROJECT_STATUS.md#13-vb-18--youtube-공식-검색-api와-자막-본문-접근-재검증-2026-11-11).


## 15. 참고 기록: 제작자 제공 자막 파일 경로 (일반 시청자용 해결책 아님, 2026-11-11)
- YouTube Studio는 권한 있는 제작자/편집자가 영상별 자막 트랙 파일을 다운로드할 수 있는 UI를 제공한다: YouTube Studio → Subtitles → 영상 선택 → 언어별 Edit → Options → Download subtitles.
- YouTube 공식 도움말은 SRT와 WebVTT를 지원하며 SRT는 UTF-8 plain text를 요구한다.
- 영상책 `app.js`는 `captions.json`의 video ID를 `captions/<file>.srt/.vtt`와 매핑하면 파일을 자동 fetch/parse하고 플레이어 시간과 동기화하는 구조를 이미 갖고 있다.
- 현재 `captions.json`에는 실제 등록 항목이 없으므로 실제 파일 기반 E2E는 아직 검증되지 않았다.
- GitHub 저장소에 자막을 올리면 공개 접근 가능해진다. YouTube Studio에서 다운로드 가능하다는 사실만으로 재배포 권한이 생기지 않으므로 실제 권리자의 명시적 공개 허가가 있는 파일만 등록한다.
- 이 경로는 제작자 제공 파일에 한정된 보조 수단이다. 임의 공개 영상의 자동 추출이나 영상책 내부 검색을 구현한 것이 아니다.
- 참고: [PROJECT_STATUS.md §14](./PROJECT_STATUS.md#14-vb-19--제작자-제공-자막-파일의-공식-확보정적-연결-경로-확인-2026-11-11), [RESEARCH_BENCHMARKS.md §24](./RESEARCH_BENCHMARKS.md#24-youtube-studio-제작자-자막-파일과-영상책-정적-등록-경로--2026-11-11).


## 16. 일반 시청자용 자동 자막 취득 — 현재 확인된 제약 (2026-11-11)
- 제품 사용자는 일반 유튜브 시청자다. 영상책은 사용자가 제작자에게 연락하거나, YouTube Studio에 접근하거나, SRT/VTT 파일을 직접 구해 오도록 요구하지 않는다.
- YouTube Help의 'View video transcripts'는 자막이 있는 영상에서 YouTube 시청 화면의 대본을 보여주고, 문장 선택으로 해당 시점으로 이동하는 공식 사용자 기능이다. 이것은 제3자 앱이 대본 본문을 가져오는 API가 아니다.
- YouTube Data API `captions.list`는 자막 트랙 메타데이터만 반환하고 본문을 반환하지 않으며 OAuth가 필요하다. `captions.download`는 OAuth와 해당 영상 편집 권한이 필요하다. 따라서 일반 시청자의 임의 공개 영상 자동 추출 수단이 아니다.
- YouTube IFrame Player API는 영상 재생 제어와 재생 시간 조회를 지원하지만, 공식 문서에서 자막 본문을 가져오는 메서드는 확인되지 않았다.
- 브라우저의 동일 출처 정책 때문에 영상책 페이지가 YouTube iframe 내부 DOM을 직접 읽는 방식은 허용되지 않는다. YouTube 정책은 YouTube 애플리케이션 스크래핑과 문서화되지 않은 API 사용을 금지한다.
- YouTube Data API의 공개 영상 검색은 별도 API 자격 증명이 필요하며 기본 `search.list` 할당량은 하루 100회다. API 자격 증명을 공개 오픈소스 프로젝트에 삽입해서는 안 되고, API Services Terms §3.2의 법적 계약 연령 조건도 적용된다. 현재 사용자에게 약관 수락·API 프로젝트·키·OAuth 설정을 안내하지 않는다.
- 현재 확인된 범위에서 0원 지속, 무서버 GitHub Pages, 일반 시청자 권한, 공식 문서/정책 준수 조건을 모두 만족하는 자동 자막 취득 경로는 **미확인**이다. 모든 가능한 기술 경로가 존재하지 않는다고 단정하지 않는다.
- 상세 근거: [RESEARCH_BENCHMARKS.md §25](./RESEARCH_BENCHMARKS.md#25-일반-시청자-자막-자동-취득-공식-경로-재검증--2026-11-11), [PROJECT_STATUS.md VB-20](./PROJECT_STATUS.md#15-vb-20--일반-시청자-자막-자동-취득-공식-경로-재검증-2026-11-11).


## 17. 브라우저 STT 및 YouTube IFrame captions 모듈 조사 (2026-11-11)
- Web Speech API `SpeechRecognition`은 음성 인식 서비스다. 기본적으로 마이크 입력을 사용하거나 `start(audioTrack)`에 제공된 오디오 트랙을 받을 수 있다. YouTube iframe의 원본 오디오 트랙을 영상책이 공식적으로 읽을 수 있다는 근거는 확인하지 못했다.
- MDN은 일부 브라우저(Chrome 포함)에서 기본 SpeechRecognition이 서버 기반이며 음성이 웹 서비스로 전송될 수 있다고 설명한다. on-device 처리는 별도 지원/언어 팩이 필요하다.
- MDN browser compatibility data는 `processLocally`가 Chrome Android에서 지원되지 않는 것으로 표시한다. `getDisplayMedia` 또한 Chrome Android에서 지원되지 않는 것으로 표시한다.
- 따라서 마이크로 스피커 소리를 다시 듣는 실험은 사용자가 소리를 외부로 재생하고 마이크 권한을 주어야 하며, 에코 제거/주변 소음/인식 정확도/연속 동작/서버 전송 여부와 비용을 보장할 수 없다. 핵심 경로로 채택하지 않는다.
- YouTube IFrame API는 `captions` 모듈의 `fontSize`와 `reload` 옵션을 문서화한다. 자막 문장/큐/전체 대본 본문을 반환하는 옵션은 목록에 없다.
- 상세 근거: [RESEARCH_BENCHMARKS.md §26](./RESEARCH_BENCHMARKS.md#26-브라우저-stt와-youtube-iframe-captions-모듈-검증-2026-11-11), [PROJECT_STATUS.md VB-22](./PROJECT_STATUS.md#16-vb-22--브라우저-stt-및-iframe-captions-모듈-검증-2026-11-11).


## 18. 공개 자막 추출 생태계 조사 기준 및 결과 (2026-11-11)
- 10개를 넘는 서로 다른 검색 질의로 GitHub 저장소/소스 코드, npm 패키지, 기술 문서, Reddit 사용자 사례, YouTube 공식 정책을 비교했다.
- 실제 소스 확인 후보:
  - `jdepoix/youtube-transcript-api`: Python 요청 기반. 영상 페이지에서 caption track을 찾아 timedtext 본문을 가져오는 서버/CLI 성격.
  - `neurelectra-oss/youtube-captions`: Node.js axios 기반. InnerTube client profile과 timedtext 파싱, 프록시 agent 옵션을 사용.
  - `devhims/youtube-caption-extractor`: TypeScript fetch 기반. InnerTube client profile을 시도하고 caption track을 정규화. 샘플은 Next.js와 Cloudflare Container API 포함.
  - `kepano/defuddle`: 현재 페이지 DOM의 transcript를 먼저 확인하고, 별도 InnerTube/timedtext 경로도 가진다. 모바일 Safari CORS 문제 이슈가 확인됨.
  - `rapha30/yt-youtube-transcript`: Go CLI/라이브러리. Android/iOS InnerTube와 watch-page scrape fallback을 명시하고 자체 문서에서 비공식 endpoint의 취약성을 밝힘.
  - `yt-dlp`: Python CLI로 수동/자동 자막 파일을 저장하는 옵션 제공. 정적 브라우저 앱이 아님.
- Reddit 사용자 사례:
  - Obsidian Web Clipper 사례는 사용자가 YouTube transcript panel을 직접 열어야 하며, 페이지에 존재하는 DOM만 읽을 수 있다고 작성자가 답변.
  - 다른 Obsidian plugin 사례는 외부 Nootube 도구를 사용하고 자막이 없으면 Whisper로 전환한다고 작성자가 설명. 무료/무서버 독립 구현 근거가 아니다.
- 현재까지 적합성 판정: 공개 소스에 자막 추출 구현은 다수 존재하지만, 확인한 대표 사례는 문서화되지 않은 내부 API/스크래핑에 의존하거나 서버/CLI/외부 서비스가 필요하다. 브라우저 DOM 방식은 YouTube 원본 페이지 안에서 실행되는 구조이며 영상책 페이지에서 임베드 iframe을 읽는 방법이 아니다.
- 상세 비교와 출처: [RESEARCH_BENCHMARKS.md §27](./RESEARCH_BENCHMARKS.md#27-공개-자막-추출-프로젝트-및-커뮤니티-사례-비교-2026-11-11).


## 19. 스크래핑 유형별 조사 결과 (2026-11-11)
- 화면 DOM 읽기, 페이지 네트워크 응답 가로채기, 비공식 endpoint 직접 호출, 서버/헤드리스 브라우저를 분리해 평가해야 한다.
- 화면 DOM 사례: YouTube Copy Transcript, SubtideX, PromptTube. YouTube transcript panel을 열고 렌더링된 segment와 timestamp를 읽는다.
- 페이지 응답 가로채기 사례: youtube-transcript-downloader는 content script에서 YouTube 페이지의 fetch 응답을 관찰해 transcript data를 캐시하고, DOM을 fallback으로 사용한다. 네트워크 요청은 YouTube 내부 API와 연결되므로 순수 DOM 방식과 구분한다.
- 2026년 Obsidian Clipper 이슈에서 YouTube DOM selector 변경과 timedtext 0-byte/지연 사례가 함께 보고됐다.
- Android에서 Chrome은 확장 미지원, Firefox Android는 확장 지원하나 모든 확장 호환을 보장하지 않는다.
- 상세 내용: [RESEARCH_BENCHMARKS.md §28](./RESEARCH_BENCHMARKS.md#28-스크래핑-유형별-기술-정책-모바일-적합성-조사-2026-11-11).


## 20. Firefox Android 확장 연계 검토 — VB-25 (2026-11-12)
### 기술적 가능성
- Mozilla 공식 도움말에 따르면 Firefox for Android에서 AMO 또는 브라우저 확장 관리자에서 확장을 설치할 수 있다. 다만 일부 확장은 Android와 호환되지 않을 수 있다.
- WebExtensions API는 확장 백그라운드와 콘텐츠 스크립트 간 메시지 전달(runtime.sendMessage, tabs.sendMessage), 탭 검색(tabs.query), 확장 로컬 저장(storage.local)을 제공한다.
- 설계 후보: YouTube 탭의 콘텐츠 스크립트가 사용자가 이미 열어 둔 transcript panel의 렌더링 DOM을 읽고 video ID, timestamp, text cue를 확장 background에 전달 → background가 데이터를 임시 로컬 저장 또는 영상책 탭의 content script로 전달 → 영상책 페이지가 video ID와 cue를 연결해 표시한다. 사용자의 복사·붙여넣기는 필요하지 않은 설계다.
- 이 흐름은 WebExtensions API의 일반 기능을 조합한 설계 수준의 가능성이다. Firefox Android에서 content script, tabs messaging, storage, 실제 YouTube DOM selector가 함께 작동하는지는 실기기에서 검증하지 않았다.
### 설치·배포 제약
- Firefox Android는 확장을 지원하지만 모든 확장이 호환되는 것은 아니다.
- Firefox 정식/베타 버전은 Mozilla 서명이 된 확장이 필요하다. 자체 배포 확장도 서명을 받아야 하며, Android의 자체 배포 방식은 XPI 파일을 기기에 저장하고 파일에서 설치하는 추가 단계가 필요하다.
- AMO 공개 등록은 개발자 계정, 제출, 자동 검증 및 필요 시 수동 검토를 요구한다. 사용자에게 개발자 계정 생성/등록을 진행시키지 않았다.
- 따라서 설치 가능한 브라우저가 있다는 사실은 영상책 전용 확장의 배포·설치·사용성 검증을 대체하지 않는다.
### YouTube 정책 검토 — 채택 보류 사유
- 일반 YouTube Terms에는 robots.txt에 따른 공개 검색엔진 또는 YouTube의 사전 서면 허가 등 예외를 제외하고 자동화 수단으로 서비스에 접근하는 제한이 있다.
- YouTube API Services Developer Policies는 API Client가 YouTube Applications를 직접/간접 스크래핑하거나 스크랩된 데이터를 취득하는 것을 금지한다.
- 정책 정의상 API Client는 YouTube API Services를 사용하는 웹사이트/소프트웨어다. Developer Policies는 YouTube IFrame Player API를 YouTube API Services의 한 예로 명시한다. 영상책은 IFrame Player API를 사용하므로, 이 정책 조항이 영상책에 적용될 가능성을 무시할 수 없다.
- 사용자 클릭으로 DOM 추출을 시작하거나, 추출 대상이 이미 화면에 보이는 transcript라는 사실만으로 약관/정책상 허용된다고 단정하지 않는다.
- 법률 자문이나 개별 구현의 최종 법률 판단은 아니다. YouTube의 명확한 서면 승인 또는 적용 가능한 공식 허용 근거가 확인되지 않아 핵심 기능 채택은 보류한다.
### 현재 판정
- WebExtensions 기반 탭 간 전달: **설계상 가능성 있음 / Android 실기기 미검증**
- Firefox Android 확장 설치: **공식 지원 확인 / 개별 확장 호환 미검증**
- 일반 사용자용 자동 DOM 추출: **기술 후보 / 약관·정책상 채택 보류**
- 영상책 통합·배포: **미실행**
- 핵심 목표인 앱 내부 검색 → 자동 자막 취득 → 교정 → 표시/시간 동기화는 여전히 미해결이다.


## 21. YouTube 공식 문의·사전 서면 허가 경로 — VB-26 (2026-11-13)
### 확인된 공식 문구
- YouTube Terms of Service의 Permissions and Restrictions는 자동화 수단(robots, botnets, scrapers 등) 접근을 제한하며, YouTube의 사전 서면 허가를 예외로 명시한다.
- YouTube API Services Developer Policies III.E.6은 API Client가 YouTube/Google Applications를 직접 또는 간접 스크래핑하거나 스크랩된 데이터를 얻는 것을 금지하고, 공개 검색엔진에 대해서만 robots.txt 또는 YouTube의 사전 서면 승인 예외를 문구상 명시한다.
- 영상책은 YouTube IFrame Player API를 사용한다. 정책은 IFrame Player API를 API Services 예시로 명시하며 API Client를 API Services를 사용하는 웹사이트/앱으로 정의한다. 따라서 영상책이 API Client로 간주될 가능성이 높다.
- Terms의 사전 서면 허가가 API Developer Policies III.E.6의 API Client 금지에도 충분한 예외가 되는지 공식 답변을 확인하지 못했다. 일반 Terms 허가와 Developer Policies의 적용은 별도로 질문해야 한다.
### 실제 공식 문의 경로와 양식 확인
1. API Compliance Audit 안내
   - 공식 개발자 가이드는 서비스가 허용되는지 불확실한 경우 API Compliance Audit 신청을 안내한다.
   - 정책 문서의 UI 변경 등 사전 승인 문구에 연결된 양식도 실제로 열어 확인했다.
2. 양식의 실제 내용
   - 양식 제목: YouTube Data API Services — Audit and Quota Extension Form.
   - 요청 유형 선택은 추가 할당량 요청을 위한 규정 준수 감사 또는 YouTube가 요청한 재감사다.
   - 필수/요구 항목에 개인 법적 이름, 조직명, 주소/연락처, 기본 웹사이트, API Client URL, 개인정보처리방침 URL, API 프로젝트 번호, 사용 사례, 검토용 앱 접근/데모 정보 등이 포함된다.
   - 일반적인 사전 스크래핑 허가만 요청하는 독립 선택지는 확인하지 못했다.
   - 따라서 이 양식은 정책 적합성 검토를 위한 공식 절차이기는 하지만, 무프로젝트 상태의 개인이 스크래핑 예외만 신청할 수 있는 전용 양식이라고 확인되지 않았다.
3. Legal Support
   - YouTube 공식 고객센터는 legal@support.youtube.com을 Legal Support 연락처로 게시한다.
   - 해당 페이지는 법률 지원 연락처를 제공하지만, 자동화 접근 사전 허가 신청을 이 이메일로 접수한다고 명시하지 않는다.
   - 따라서 참고 가능한 일반 법률 연락처로만 분류하며, 승인 접수처라고 안내하지 않는다.
4. API 약관의 연령 조건
   - YouTube API Services Terms §3.2는 YouTube와 구속력 있는 계약을 체결할 법적 연령에 도달하지 않은 사람은 계약을 수락하거나 API Services를 사용해서는 안 된다고 명시한다.
   - 사용자에게 API 약관 동의, API 프로젝트/자격 증명 생성, 감사 양식 제출을 안내하지 않는다. 타인 명의 계정이나 대리 제출도 대안으로 제안하지 않는다.
### 현재 결론
- 일반 Terms에 사전 서면 허가 예외가 존재한다는 점: 확인됨.
- 스크래핑에 대한 일반 사용자용 전용 허가 신청 절차: 미확인.
- API Compliance Audit 양식의 실제 필드와 요청 유형: 확인됨.
- 감사 양식이 스크래핑 금지 예외를 부여하는 절차인지: 미확인.
- Legal Support 이메일이 사전 허가 접수처인지: 미확인.
- Developer Policies가 API Client scraping을 금지한다는 점: 확인됨.
- Terms 서면 허가만으로 Developer Policies도 면제되는지: 미확인.
- 허가 신청/서면 답변/승인: 미실행/미확보.
- 정책 허용 근거가 확인되기 전에는 스크래핑 구현·배포를 보류한다.
