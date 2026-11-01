# 설치 및 Git 업로드

이 폴더가 프로젝트 루트입니다. ZIP 바깥 폴더를 저장소 루트에 한 겹 더 넣지 마세요.

## 로컬 확인

Node.js 22 이상 설치 후 프로젝트 폴더의 터미널에서 실행합니다.

```sh
npm ci
npm test
npm run build
npm run dev
```

표시된 주소의 `/Re-chant/`로 접속합니다. 곡 목록에서 음원팩 ZIP을 설치합니다. 새 배포 후에도 같은 브라우저와 같은 주소를 쓰면 설치 음원과 기록이 유지됩니다. 다른 도메인/포트/브라우저에는 자동으로 이전되지 않습니다.

## 기존 Git 저장소 업데이트 (권장)

1. 기존 저장소에서 먼저 `git status`로 미완료 작업을 확인하고 보관합니다.
2. 기존 저장소 폴더에 이 소스 폴더의 내용을 복사합니다. `.github`와 `.gitignore`도 포함합니다. 기존 `.git` 폴더는 유지합니다.
3. `npm ci`, `npm test`, `npm run build`로 확인합니다.
4. 터미널에서 변경 목록을 확인한 뒤 업로드합니다.

```sh
git status
git diff --stat
git add src public tests e2e docs tools .github .gitignore package.json package-lock.json vite.config.ts tsconfig.json playwright.config.ts index.html README.md README-V1.md
git diff --cached --stat
git commit -m "Stabilize V1 Studio runtime practice playback"
git push origin main
```

현재 브랜치가 main이 아니면 실제 브랜치명을 사용합니다. 충돌이 나면 강제 push하지 말고 기존 변경을 합친 후 다시 테스트합니다. 원격 저장소 주소와 계정 인증은 사용자의 실제 저장소에 맞게 설정합니다.

## 새 저장소에 처음 올리는 경우

GitHub에서 빈 저장소 `Re-chant`를 생성하고 아래 명령을 실행합니다. `YOUR_ACCOUNT`는 실제 계정으로 바꿉니다.

```sh
git init
git branch -M main
git add .
git status
git commit -m "Release Rechant Web V1 stable runtime"
git remote add origin https://github.com/YOUR_ACCOUNT/Re-chant.git
git push -u origin main
```

GitHub Settings → Pages → Source를 GitHub Actions로 설정합니다. `.github/workflows/deploy-pages.yml`이 테스트와 빌드 후 dist를 배포합니다. Actions 탭에서 성공을 확인합니다. 소스만 업로드하며 node_modules, dist, 테스트 임시 결과, MP3 음원팩은 커밋하지 않습니다.

현재 Vite base는 `/Re-chant/`입니다. 저장소 이름이 다르거나 독립 도메인에 배포한다면 vite.config.ts의 base를 실제 경로에 맞추고 다시 빌드합니다. 루트 도메인은 `/`를 사용합니다.

## 다음 곡 업데이트

Studio에서 웹 콘텐츠팩을 내보냅니다. `public/content/`를 새 팩의 전체 내용으로 교체합니다. manifest.json / songs / assets가 바로 그 아래에 있어야 합니다. 작업공간 백업을 넣지 마세요.

콘텐츠팩 버전을 올리고 테스트와 빌드 후 위 Git 절차로 한 번에 배포합니다. 곡 수가 달라졌다면 현재 fixture 총계 테스트를 새 팩의 실제 검증된 수치로 갱신합니다. 문구나 싱크를 테스트 통과 목적으로 바꾸지 마세요.

음원이 같으면 기존 설치본을 재사용합니다. 음원이 달라졌다면 Studio에서 새 requiredAudio와 별도의 새 음원팩을 생성하고 다운로드 링크를 갱신합니다. MP3를 public에 넣지 않습니다.

## 배포 후 수동 확인

Glow Up 전체/힌트/원본 모드, Pretty Girl의 `(girl!)` 힌트와 `(함성)` 표시, 음원 뒤 마지막 응원, 무음 구간 정지·재개·탐색, 새로고침 후 기록/음원 유지를 확인합니다. 기존 기기의 사이트 데이터를 지우지 마세요.

Playwright 브라우저가 있는 환경에서는 `npx playwright install chromium` 후 `npm run test:e2e`로 화면 회귀 검사를 실행할 수 있습니다. 실제 음원팩 검사에는 환경변수 RECHANT_AUDIO_PACK으로 ZIP 경로를 지정합니다. 예: PowerShell에서 `$env:RECHANT_AUDIO_PACK='C:\Downloads\Rechant-Audio-Pack.zip'` 후 테스트합니다. 경로가 없으면 실제 음원 시나리오만 명시적으로 건너뜁니다. e2e/app.spec.ts는 구형 v0.3 fixture를 사용하는 역사 자료이며 현재 설정에서 제외됩니다.
