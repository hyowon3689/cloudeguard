CloudGuard

AWS 환경에서 발생하는 보안 이벤트를 탐지하고, 위험 상황을 대시보드와 실시간 알림을 통해 확인할 수 있도록 구현한 클라우드 보안 관제 프로젝트입니다.

📌 프로젝트 소개

CloudGuard는 AWS 환경에서 발생하는 보안 이벤트를 분석하여 사용자가 보안 상태를 직관적으로 확인하고 대응할 수 있도록 지원합니다.

주요 보안 이벤트를 위험도에 따라 분류하고, 탐지된 이벤트를 CloudGuard 대시보드에 표시합니다. 또한 실시간 통신을 통해 새로운 보안 이벤트가 발생했을 때 사용자에게 즉시 알림을 제공할 수 있도록 구성했습니다.

✨ 주요 기능

* AWS 보안 이벤트 탐지 및 표시
* 보안 위험도별 이벤트 관리
* 학생별 보안 점수 및 보안 상태 확인
* 보안 이벤트 상세 정보 및 대응 방법 제공
* 실시간 보안 알림 UI
* WebSocket 기반 실시간 이벤트 연동 구조
* Slack을 활용한 보안 이벤트 알림 연동 구조
* 보안 현황 및 이벤트 데이터 시각화

🖥️ 담당 구현

Frontend / 실시간 보안 알림 UI

* React + TypeScript 기반 보안 관제 대시보드 구현
* 보안 점수 및 이벤트 현황을 확인할 수 있는 UI 구현
* Critical, Warning 등 위험도별 보안 알림 표시
* 보안 이벤트 상세 정보 및 대응 방법 표시
* WebSocket을 통한 실시간 보안 이벤트 수신 구조 구성
* Slack 알림과 대시보드 알림이 연계될 수 있도록 프론트엔드 구조 구성

🛠️ 기술 스택

구분	기술
Frontend	React
Language	TypeScript
Build Tool	Vite
Runtime	Node.js
Real-time	WebSocket
Cloud	AWS
Security Event	AWS CloudTrail
Notification	Slack Webhook
Development	Visual Studio Code

🚀 실행 방법

1. 프로젝트 클론

git clone <repository-url>
cd <project-directory>

2. 패키지 설치

npm install

3. 환경변수 설정

프로젝트에서 사용하는 환경변수가 있다면 .env 파일을 생성하여 설정합니다.

WEBSOCKET_URL=<WebSocket 서버 주소>

Slack Webhook은 보안상 프론트엔드 코드에 직접 노출하지 않고 서버 측 환경변수로 관리합니다.

SLACK_WEBHOOK_URL=<Slack Webhook 주소>

※ 실제 WebSocket 주소 및 Slack Webhook URL은 프로젝트 팀에서 제공받은 값을 사용합니다.

4. 개발 서버 실행

npm run dev

실행 후 터미널에 표시되는 로컬 주소로 접속합니다.

http://localhost:5173

🔔 실시간 알림 동작 구조

AWS CloudTrail
      ↓
보안 이벤트 탐지
      ↓
이벤트 분석 / 위험도 분류
      ↓
 ┌───────────────┐
 ↓               ↓
WebSocket       Slack
 ↓               ↓
CloudGuard      팀 채널
Dashboard

AWS 환경에서 보안 이벤트가 탐지되면 이벤트 처리 서버에서 해당 이벤트를 분석하고 위험도를 분류합니다.

분석된 이벤트는 WebSocket을 통해 CloudGuard 대시보드로 전달되어 실시간 알림으로 표시되며, 필요한 경우 Slack을 통해 프로젝트 팀에도 알림을 전달합니다.

📷 화면

보안 관제 대시보드

프로젝트의 보안 점수, 보안 이벤트 및 위험도별 알림 현황을 확인할 수 있습니다.

보안 이벤트 상세 화면

탐지된 보안 이벤트의 발생 원인, 위험도 및 대응 방법을 확인할 수 있습니다.

Slack 보안 알림

탐지된 주요 보안 이벤트를 프로젝트 팀의 Slack 채널에서 확인할 수 있습니다.

👥 프로젝트 역할

* Frontend: CloudGuard 보안 관제 대시보드 및 실시간 알림 UI
* Backend: 보안 이벤트 처리 및 서버 API
* AWS: 클라우드 환경 및 보안 이벤트 수집
* Notification: Slack 기반 보안 이벤트 알림