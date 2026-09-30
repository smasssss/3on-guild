# 3ON 교권보호국 포털

빌드 도구와 서버가 필요 없는 정적 웹사이트입니다. `index.html`을 열거나 폴더 전체를 GitHub Pages에 올리면 공략사진, 길드전x서배, 영웅가이드를 볼 수 있습니다.

## 배포

1. GitHub에서 새 저장소를 만듭니다. 기존 6ON 저장소와 별개로 만드세요.
2. 이 폴더 **안의 파일과 폴더**를 새 저장소의 루트에 업로드합니다. `index.html`이 저장소 최상위에 있어야 합니다.
3. 저장소 **Settings → Pages → Build and deployment → Deploy from a branch**를 선택합니다.
4. Branch를 `main`, 폴더를 `/ (root)`로 선택하고 Save합니다.

모든 사이트 자산은 상대 경로를 사용하므로 `username.github.io/저장소이름/` 형태의 서브경로에서도 작동합니다.

## 관리자 성장추적

사용자가 제공한 최신 `3ON_길드원_성장추적_2026-09-30_R1반영.html`을 `data/3on-growth-2026-09-30.html`에 변경 없이 포함했습니다. 관리자 로그인 후 같은 화면 안에서 원본의 검색, 정렬, 최근 7일 그래프, 누적 성장, 직전 대비, 명단·등급 변동과 전체 기록이 열립니다. 원본 자체가 CSS, JavaScript와 데이터를 모두 포함하므로 별도 빌드가 필요하지 않습니다. 이후 자료를 갱신할 때는 이 파일을 새 성장추적 HTML로 교체하면 됩니다.

## 자료와 변경

- `assets/guide/`: 3ON VIP 사이트 공략사진 탭에서 확인한 30장. 사이트 내부에 복사해 외부 이미지 링크 없이 표시합니다.
- `assets/icons/`: Nopay님 시간표에 쓰이는 정적 아이콘.
- `assets/hero/`: 영웅가이드에서 확보한 정적 삽화. 텍스트 정보는 `data/guide-data.js`에 요약·재구성했습니다.
- `data/3on-growth-2026-09-30.html`: 사용자가 제공한 9월 30일 R1 반영 성장추적 원본. 원본 파일과 SHA-256 값이 일치합니다.
- 길드전x서배 시간표는 2026-09-30에 확인한 요일별 활동·점수 경로·팁을 정적으로 기록했습니다. 원본의 실시간 시계, 직접 목표값 변경, 이미지 판독 기능은 포함되지 않았습니다.
- 출처: [3ON VIP 공략사진](https://3on-vip-fivnrx.v2.appdeploy.ai/?utm_source=chatgpt.com), [Nopay님 길드전 시간표](https://duhdi.life/butler-dev/la252.html), [영웅 교양서](https://duhdi.life/butler-dev/battle-guide-draft.html).

## 관리자 잠금의 한계

관리자 입력값은 Web Crypto SHA-256 해시와 사전 계산된 다이제스트를 비교하며, 성공 상태는 브라우저 탭의 `sessionStorage`에 저장됩니다. 하지만 정적 GitHub Pages의 클라이언트 잠금은 **진짜 인증이나 데이터 비공개가 아닙니다**. HTML·JavaScript·배포된 모든 파일은 방문자가 직접 열 수 있습니다. 민감한 길드원 자료를 공개 저장소에 올리기 전에 별도 서버 인증이나 접근 제어를 적용해야 합니다. 이 설명은 공개 사이트 화면에는 표시하지 않습니다.
