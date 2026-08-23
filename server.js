import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ==================================================
// 보안 알림 저장 공간
// ==================================================

const alerts = [
  {
    id: 1,

    level: "critical",

    title: "비정상 로그인 탐지",

    source: "AWS CloudTrail",

    time: "방금 전",

    description:
      "평소와 다른 지역에서 관리자 계정 로그인이 감지되었습니다.",

    problem:
      "관리자 계정에서 평소 사용하지 않던 지역의 로그인이 발생했습니다.",

    risk:
      "관리자 계정 탈취 또는 비인가 접근일 가능성이 있습니다.",

    solution: [
      "로그인 IP와 접속 지역을 확인합니다.",
      "CloudTrail에서 최근 로그인 이력을 분석합니다.",
      "의심스러운 세션을 종료합니다.",
      "Access Key 및 비밀번호를 점검합니다.",
      "관리자 계정의 MFA 활성화 여부를 확인합니다.",
    ],

    priority: "즉시 확인 필요",
  },
];


// ==================================================
// 1. Slack으로 보안 알림 보내기
// ==================================================

app.post("/api/slack-alert", async (req, res) => {
  try {
    const {
      title,
      level,
      source,
      description,
      problem,
      risk,
      solution,
      priority,
    } = req.body;


    // ==============================================
    // 권장 대응 방법을 Slack용 문자열로 변환
    // ==============================================

    const solutionText = Array.isArray(solution)
      ? solution
          .map((item, index) => `${index + 1}. ${item}`)
          .join("\n")
      : solution || "권장 대응 방법이 없습니다.";


    // ==============================================
    // Slack 메시지
    // ==============================================

    const message = {
      text:
        `🚨 CloudGuard 보안 알림\n\n` +

        `🔴 위험도: ${level}\n` +

        `📌 제목: ${title}\n` +

        `📍 Source: ${source}\n\n` +

        `📝 내용\n` +
        `${description}\n\n` +

        `⚠ 문제점\n` +
        `${problem || "문제점 정보가 없습니다."}\n\n` +

        `🔍 위험 분석\n` +
        `${risk || "위험 분석 정보가 없습니다."}\n\n` +

        `🛠 권장 대응 방법\n` +
        `${solutionText}\n\n` +

        `🚨 우선순위\n` +
        `${priority || "확인 필요"}\n\n` +

        `⏰ 발생 시간\n` +
        `${new Date().toLocaleString("ko-KR")}`,
    };


    // ==============================================
    // Slack Webhook 전송
    // ==============================================

    const response = await fetch(
      process.env.SLACK_WEBHOOK_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
        },

        body: JSON.stringify(message),
      }
    );


    // ==============================================
    // Slack 오류 확인
    // ==============================================

    if (!response.ok) {
      throw new Error(
        `Slack 오류: ${response.status}`
      );
    }


    // ==============================================
    // 성공 응답
    // ==============================================

    res.json({
      success: true,
      message: "Slack 전송 성공",
    });

  } catch (error) {

    console.error(
      "Slack 전송 오류:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Slack 전송 실패",
    });
  }
});


// ==================================================
// 2. 모든 보안 알림 가져오기
// ==================================================

app.get("/api/alerts", (req, res) => {

  res.json(alerts);

});


// ==================================================
// 3. 새로운 보안 알림 저장하기
// ==================================================

app.post("/api/alerts", (req, res) => {

  try {

    const {
      level,
      title,
      source,
      description,
      problem,
      risk,
      solution,
      priority,
    } = req.body;


    // ==============================================
    // 새로운 알림 생성
    // ==============================================

    const newAlert = {

      id: Date.now(),

      level:
        level || "info",

      title:
        title || "새로운 보안 이벤트",

      source:
        source || "Unknown",

      time:
        "방금 전",

      description:
        description ||
        "새로운 보안 이벤트가 감지되었습니다.",


      // ============================================
      // 문제점
      // ============================================

      problem:
        problem ||
        "새로운 보안 이벤트가 감지되어 관리자 확인이 필요합니다.",


      // ============================================
      // 위험 분석
      // ============================================

      risk:
        risk ||
        "비정상적인 계정 활동이나 보안 정책 위반으로 이어질 가능성이 있습니다.",


      // ============================================
      // 권장 대응 방법
      // ============================================

      solution:
        Array.isArray(solution)
          ? solution
          : [
              "보안 이벤트의 상세 내용을 확인합니다.",
              "이벤트를 발생시킨 사용자와 IP를 확인합니다.",
              "관련 클라우드 리소스의 변경 사항을 확인합니다.",
              "의심스러운 활동이 확인되면 접근 권한을 제한합니다.",
              "CloudTrail 등 로그를 확인하여 추가적인 이상 활동을 분석합니다.",
            ],


      // ============================================
      // 우선순위
      // ============================================

      priority:
        priority ||
        (
          level === "critical"
            ? "즉시 확인 필요"
            : level === "warning"
            ? "주의 필요"
            : "변경 내용 확인"
        ),
    };


    // ==============================================
    // 알림 목록 맨 앞에 추가
    // ==============================================

    alerts.unshift(newAlert);


    // ==============================================
    // 성공 응답
    // ==============================================

    res.json({

      success: true,

      alert: newAlert,

    });

  } catch (error) {

    console.error(
      "알림 저장 오류:",
      error
    );

    res.status(500).json({

      success: false,

      message: "알림 저장 실패",

    });
  }
});


// ==================================================
// 4. 서버 실행
// ==================================================

app.listen(3001, () => {

  console.log(
    "CloudGuard Slack server running on port 3001"
  );

});