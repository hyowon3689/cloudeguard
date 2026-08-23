import { useState, useEffect } from "react";
import "./App.css";

function App() {

  // ==================================================
  // 선택된 보안 알림
  // ==================================================

  const [selectedAlert, setSelectedAlert] = useState(null);


  // ==================================================
  // 보안 알림 목록
  // ==================================================

  const [alerts, setAlerts] = useState([
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

      priority:
        "즉시 확인 필요",
    },

    {
      id: 2,

      level: "warning",

      title:
        "의심스러운 네트워크 트래픽",

      source: "VPC",

      time: "2분 전",

      description:
        "평균보다 높은 외부 통신량이 감지되었습니다.",

      problem:
        "평균적인 네트워크 사용량보다 높은 외부 통신량이 감지되었습니다.",

      risk:
        "비정상적인 외부 통신이 악성 프로그램의 통신이나 데이터 유출과 관련되어 있을 가능성이 있습니다.",

      solution: [
        "VPC Flow Logs를 확인합니다.",
        "통신이 발생한 IP 주소와 포트를 확인합니다.",
        "비정상적인 외부 IP와의 통신 여부를 확인합니다.",
        "필요한 경우 의심스러운 보안 그룹 규칙을 차단합니다.",
        "관련 EC2 인스턴스의 프로세스와 로그를 추가로 확인합니다.",
      ],

      priority:
        "주의 필요",
    },

    {
      id: 3,

      level: "info",

      title:
        "보안 정책 변경",

      source: "IAM",

      time: "5분 전",

      description:
        "IAM 관련 정책이 변경되었습니다.",

      problem:
        "IAM 또는 클라우드 환경의 보안 정책이 변경되었습니다. 변경 주체와 변경 내용을 확인해야 합니다.",

      risk:
        "권한이 과도하게 부여되거나 의도하지 않은 정책 변경이 발생했다면 공격자가 클라우드 리소스에 접근할 가능성이 있습니다.",

      solution: [
        "정책을 변경한 사용자 또는 역할을 확인합니다.",
        "AWS CloudTrail에서 정책 변경 기록을 확인합니다.",
        "변경된 권한의 범위를 검토합니다.",
        "불필요하게 추가된 권한이 있다면 제거합니다.",
        "정상적인 변경이 아니라면 이전 정책으로 복구합니다.",
      ],

      priority:
        "변경 내용 확인",
    },
  ]);


  // ==================================================
  // 서버에서 보안 알림 가져오기
  // ==================================================

  useEffect(() => {

    const loadAlerts = async () => {

      try {

        const response = await fetch(
          "http://localhost:3001/api/alerts"
        );


        if (!response.ok) {

          throw new Error(
            "알림 데이터를 가져오지 못했습니다."
          );

        }


        const data =
          await response.json();


        setAlerts(data);

      } catch (error) {

        console.error(
          "알림 불러오기 실패:",
          error
        );

      }

    };


    // 처음 한 번 실행

    loadAlerts();


    // 5초마다 확인

    const interval =
      setInterval(() => {

        loadAlerts();

      }, 5000);


    // 컴포넌트 종료 시 정리

    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==================================================
  // Critical 개수
  // ==================================================

  const criticalCount =
    alerts.filter(
      (alert) =>
        alert.level === "critical"
    ).length;


  // ==================================================
  // Warning 개수
  // ==================================================

  const warningCount =
    alerts.filter(
      (alert) =>
        alert.level === "warning"
    ).length;


  // ==================================================
  // 위험도 이름
  // ==================================================

  const levelName = {

    critical: "CRITICAL",

    warning: "WARNING",

    info: "INFO",

  };


  // ==================================================
  // 알림 상세 정보
  // ==================================================

  const getAlertDetails = (alert) => {

    // ----------------------------------------------
    // 이미 서버에서 상세 정보가 들어온 경우
    // ----------------------------------------------

    if (
      alert.problem &&
      alert.risk &&
      alert.solution &&
      alert.priority
    ) {

      return {

        problem:
          alert.problem,

        risk:
          alert.risk,

        solution:
          alert.solution,

        priority:
          alert.priority,

      };

    }


    // ----------------------------------------------
    // 비정상 로그인
    // ----------------------------------------------

    if (
      alert.title?.includes(
        "비정상 로그인"
      )
    ) {

      return {

        problem:
          "관리자 계정에서 평소 사용하지 않던 지역 또는 환경에서 로그인이 발생했습니다. 정상적인 관리자의 접속인지 확인이 필요합니다.",

        risk:
          "관리자 계정이 탈취되었거나 인증 정보가 유출되었을 가능성이 있습니다. 공격자가 관리자 권한을 이용하면 클라우드 리소스에 접근하거나 보안 설정을 변경할 수 있습니다.",

        solution: [

          "로그인 IP 주소와 접속 지역을 확인합니다.",

          "AWS CloudTrail에서 해당 계정의 최근 활동 내역을 확인합니다.",

          "의심스러운 로그인 세션이 있다면 즉시 종료합니다.",

          "관리자 계정의 비밀번호와 Access Key를 점검합니다.",

          "관리자 계정에 MFA가 활성화되어 있는지 확인합니다.",

        ],

        priority:
          "즉시 확인 필요",

      };

    }


    // ----------------------------------------------
    // 네트워크 트래픽
    // ----------------------------------------------

    if (
      alert.title?.includes(
        "네트워크 트래픽"
      )
    ) {

      return {

        problem:
          "평균적인 네트워크 사용량보다 높은 외부 통신량이 감지되었습니다.",

        risk:
          "비정상적인 외부 통신이 악성 프로그램의 통신이나 데이터 유출과 관련되어 있을 가능성이 있습니다.",

        solution: [

          "VPC Flow Logs를 확인합니다.",

          "통신이 발생한 IP 주소와 포트를 확인합니다.",

          "비정상적인 외부 IP와의 통신 여부를 확인합니다.",

          "필요한 경우 의심스러운 보안 그룹 규칙을 차단합니다.",

          "관련 EC2 인스턴스의 프로세스와 로그를 추가로 확인합니다.",

        ],

        priority:
          "주의 필요",

      };

    }


    // ----------------------------------------------
    // 보안 정책 변경
    // ----------------------------------------------

    if (
      alert.title?.includes(
        "보안 정책"
      )
    ) {

      return {

        problem:
          "IAM 또는 클라우드 환경의 보안 정책이 변경되었습니다. 변경 주체와 변경 내용을 확인해야 합니다.",

        risk:
          "권한이 과도하게 부여되거나 의도하지 않은 정책 변경이 발생했다면 공격자가 클라우드 리소스에 접근할 가능성이 있습니다.",

        solution: [

          "정책을 변경한 사용자 또는 역할을 확인합니다.",

          "AWS CloudTrail에서 정책 변경 기록을 확인합니다.",

          "변경된 권한의 범위를 검토합니다.",

          "불필요하게 추가된 권한이 있다면 제거합니다.",

          "정상적인 변경이 아니라면 이전 정책으로 복구합니다.",

        ],

        priority:
          "변경 내용 확인",

      };

    }


    // ----------------------------------------------
    // 기본값
    // ----------------------------------------------

    return {

      problem:
        "새로운 보안 이벤트가 감지되었습니다. 이벤트의 발생 원인과 관련 리소스를 확인해야 합니다.",

      risk:
        "보안 이벤트가 실제 공격이나 비정상적인 활동과 관련되어 있을 가능성이 있으므로 추가적인 분석이 필요합니다.",

      solution: [

        "이벤트 발생 시간과 관련 리소스를 확인합니다.",

        "관련 로그를 분석합니다.",

        "비정상적인 접근이나 활동이 있었는지 확인합니다.",

        "필요한 경우 관련 계정 또는 리소스의 접근을 제한합니다.",

      ],

      priority:

        alert.level === "critical"

          ? "즉시 확인 필요"

          : alert.level === "warning"

          ? "주의 필요"

          : "일반 확인 필요",

    };

  };


  // ==================================================
  // Slack으로 보안 알림 보내기
  // ==================================================

  const sendSlackAlert =
    async (securityAlert) => {

      try {

        // --------------------------------------------
        // 팝업과 동일한 상세 정보 가져오기
        // --------------------------------------------

        const details =
          getAlertDetails(
            securityAlert
          );


        // --------------------------------------------
        // 백엔드로 전송
        // --------------------------------------------

        const response =
          await fetch(
            "http://localhost:3001/api/slack-alert",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                title:
                  securityAlert.title,

                level:
                  levelName[
                    securityAlert.level
                  ],

                source:
                  securityAlert.source,

                description:
                  securityAlert.description,

                // ⭐ 추가
                problem:
                  details.problem,

                // ⭐ 추가
                risk:
                  details.risk,

                // ⭐ 추가
                solution:
                  details.solution,

                // ⭐ 추가
                priority:
                  details.priority,

              }),

            }
          );


        // --------------------------------------------
        // 응답 확인
        // --------------------------------------------

        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Slack 전송 실패"
          );

        }


        // --------------------------------------------
        // 성공
        // --------------------------------------------

        window.alert(
          "Slack으로 보안 알림을 전송했습니다."
        );

      } catch (error) {

        console.error(
          "Slack 전송 오류:",
          error
        );

        window.alert(
          "Slack 전송에 실패했습니다."
        );

      }

    };


  // ==================================================
  // 화면
  // ==================================================

  return (

    <div className="dashboard">


      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}

      <header className="header">

        <div className="logo-area">

          <div className="logo">

            <span>
              ☁
            </span>

          </div>


          <div className="logo-text">

            <h1>
              CloudGuard
            </h1>

            <p>
              SECURITY MONITORING
            </p>

          </div>

        </div>


        <div className="system-status">

          <span className="status-dot"></span>

          SYSTEM ONLINE

        </div>

      </header>


      {/* ============================================ */}
      {/* Main */}
      {/* ============================================ */}

      <main className="main">


        {/* ========================================== */}
        {/* 제목 */}
        {/* ========================================== */}

        <div className="page-title">

          <h2>
            Security Dashboard
          </h2>

          <p>
            클라우드 보안 이벤트를 실시간으로
            모니터링합니다.
          </p>

        </div>


        {/* ========================================== */}
        {/* 통계 */}
        {/* ========================================== */}

        <section className="stats">


          {/* 전체 이벤트 */}

          <div className="stat-card">

            <div className="stat-label">
              전체 이벤트
            </div>

            <div className="stat-value">
              {alerts.length}
            </div>

            <div className="stat-description">
              최근 24시간 동안 탐지된 이벤트
            </div>

          </div>


          {/* Critical */}

          <div className="stat-card stat-critical">

            <div className="stat-label">
              Critical
            </div>

            <div className="stat-value">
              {criticalCount}
            </div>

            <div className="stat-description">
              즉시 확인이 필요한 이벤트
            </div>

          </div>


          {/* Warning */}

          <div className="stat-card stat-warning">

            <div className="stat-label">
              Warning
            </div>

            <div className="stat-value">
              {warningCount}
            </div>

            <div className="stat-description">
              주의가 필요한 이벤트
            </div>

          </div>


          {/* 정상 */}

          <div className="stat-card stat-normal">

            <div className="stat-label">
              시스템 정상
            </div>

            <div className="stat-value">
              98.4%
            </div>

            <div className="stat-description">
              현재 클라우드 환경 상태
            </div>

          </div>

        </section>


        {/* ========================================== */}
        {/* Content Grid */}
        {/* ========================================== */}

        <div className="content-grid">


          {/* ======================================== */}
          {/* 실시간 보안 알림 */}
          {/* ======================================== */}

          <section className="panel">


            <div className="panel-header">

              <div className="panel-title">

                <div>

                  <h3>
                    실시간 보안 알림
                  </h3>

                  <p>
                    최근 탐지된 보안 이벤트
                  </p>

                </div>

              </div>


              {/* ================================== */}
              {/* 테스트 알림 버튼 */}
              {/* ================================== */}

              <button

                className="refresh-btn"

                onClick={async () => {

                  try {

                    // --------------------------------
                    // 새로운 테스트 알림
                    // --------------------------------

                    const newAlert = {

                      id:
                        Date.now(),

                      level:
                        "critical",

                      title:
                        "새로운 보안 이벤트 탐지",

                      source:
                        "AWS CloudTrail",

                      time:
                        "방금 전",

                      description:
                        "새로운 보안 이벤트가 감지되었습니다. 관리자 확인이 필요합니다.",

                      problem:
                        "새로운 보안 이벤트가 감지되어 관리자 확인이 필요합니다.",

                      risk:
                        "비정상적인 계정 활동이나 보안 정책 위반으로 이어질 가능성이 있습니다.",

                      solution: [

                        "보안 이벤트의 상세 내용을 확인합니다.",

                        "이벤트를 발생시킨 사용자와 IP를 확인합니다.",

                        "관련 클라우드 리소스의 변경 사항을 확인합니다.",

                        "의심스러운 활동이 확인되면 접근 권한을 제한합니다.",

                        "CloudTrail 등 로그를 확인하여 추가적인 이상 활동을 분석합니다.",

                      ],

                      priority:
                        "즉시 확인 필요",

                    };


                    // --------------------------------
                    // 1. 서버에 저장
                    // --------------------------------

                    const response =
                      await fetch(
                        "http://localhost:3001/api/alerts",
                        {
                          method:
                            "POST",

                          headers: {
                            "Content-Type":
                              "application/json",
                          },

                          body:
                            JSON.stringify({

                              level:
                                newAlert.level,

                              title:
                                newAlert.title,

                              source:
                                newAlert.source,

                              description:
                                newAlert.description,

                              problem:
                                newAlert.problem,

                              risk:
                                newAlert.risk,

                              solution:
                                newAlert.solution,

                              priority:
                                newAlert.priority,

                            }),

                        }
                      );


                    if (!response.ok) {

                      throw new Error(
                        "알림 저장 실패"
                      );

                    }


                    // --------------------------------
                    // 2. Slack 전송
                    // --------------------------------

                    await sendSlackAlert(
                      newAlert
                    );


                    // --------------------------------
                    // 3. 최신 알림 가져오기
                    // --------------------------------

                    const alertResponse =
                      await fetch(
                        "http://localhost:3001/api/alerts"
                      );


                    if (!alertResponse.ok) {

                      throw new Error(
                        "최신 알림을 가져오지 못했습니다."
                      );

                    }


                    const data =
                      await alertResponse.json();


                    setAlerts(
                      data
                    );


                  } catch (error) {

                    console.error(
                      "알림 생성 실패:",
                      error
                    );

                    window.alert(
                      "보안 알림 생성에 실패했습니다."
                    );

                  }

                }}

              >

                ↻ 새로고침

              </button>

            </div>


            {/* ===================================== */}
            {/* 알림 목록 */}
            {/* ===================================== */}

            <div className="alert-list">

              {alerts.map(
                (alert) => (

                  <div

                    key={
                      alert.id
                    }

                    className={
                      `alert-card alert-${alert.level}`
                    }

                    onClick={() =>
                      setSelectedAlert(
                        alert
                      )
                    }

                    style={{
                      cursor:
                        "pointer",
                    }}

                  >

                    <div className="alert-bar"></div>


                    <div className="alert-content">

                      <h4>
                        {
                          alert.title
                        }
                      </h4>


                      <p>
                        {
                          alert.description
                        }
                      </p>


                      <div className="alert-meta">

                        <span className="alert-level">

                          {
                            levelName[
                              alert.level
                            ]
                          }

                        </span>


                        <span>
                          {
                            alert.source
                          }
                        </span>

                      </div>

                    </div>


                    <div className="alert-time">

                      {
                        alert.time
                      }

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ======================================== */}
          {/* 보안 상태 */}
          {/* ======================================== */}

          <section className="panel security-panel">


            <div className="panel-header">

              <div className="panel-title">

                <div>

                  <h3>
                    보안 상태
                  </h3>

                  <p>
                    현재 클라우드 환경 상태
                  </p>

                </div>

              </div>

            </div>


            <div className="security-summary">

              <div className="security-summary-top">

                <div className="security-check">
                  ✓
                </div>

                시스템 정상

              </div>


              <p>
                현재 심각한 보안 위험은
                발견되지 않았습니다.
              </p>

            </div>


            <div className="service-list">


              {/* EC2 */}

              <div className="service">

                <div className="service-name">

                  <span className="service-dot"></span>

                  AWS EC2

                </div>

                <span className="service-status">
                  정상
                </span>

              </div>


              {/* S3 */}

              <div className="service">

                <div className="service-name">

                  <span className="service-dot"></span>

                  AWS S3

                </div>

                <span className="service-status">
                  정상
                </span>

              </div>


              {/* VPC */}

              <div className="service">

                <div className="service-name">

                  <span className="service-dot"></span>

                  VPC

                </div>

                <span className="service-status">
                  정상
                </span>

              </div>


              {/* IAM */}

              <div className="service">

                <div className="service-name">

                  <span className="service-dot"></span>

                  IAM

                </div>

                <span className="service-status">
                  정상
                </span>

              </div>


            </div>

          </section>

        </div>

      </main>


      {/* ============================================ */}
      {/* 보안 알림 상세 팝업 */}
      {/* ============================================ */}

      {selectedAlert && (

        <div

          onClick={() =>
            setSelectedAlert(
              null
            )
          }

          style={{

            position:
              "fixed",

            inset:
              0,

            background:
              "rgba(0,0,0,0.65)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            zIndex:
              1000,

            padding:
              "20px",

          }}

        >


          <div

            onClick={(e) =>
              e.stopPropagation()
            }

            style={{

              width:
                "520px",

              maxHeight:
                "85vh",

              overflowY:
                "auto",

              padding:
                "30px",

              borderRadius:
                "18px",

              background:
                "#101927",

              border:
                "1px solid #2a3850",

              boxShadow:
                "0 25px 70px rgba(0,0,0,.5)",

            }}

          >


            {/* ================================== */}
            {/* 상세 데이터 */}
            {/* ================================== */}

            {(() => {

              const details =
                getAlertDetails(
                  selectedAlert
                );


              return (

                <>


                  {/* 위험도 */}

                  <div

                    style={{

                      color:

                        selectedAlert.level ===
                        "critical"

                          ? "#ff5969"

                          : selectedAlert.level ===
                            "warning"

                          ? "#ffb43e"

                          : "#72a4ff",

                      fontSize:
                        "11px",

                      fontWeight:
                        700,

                      marginBottom:
                        "10px",

                    }}

                  >

                    {
                      levelName[
                        selectedAlert.level
                      ]
                    }

                  </div>


                  {/* 제목 */}

                  <h2

                    style={{

                      margin:
                        "0 0 12px",

                      color:
                        "#ffffff",

                      fontSize:
                        "24px",

                    }}

                  >

                    {
                      selectedAlert.title
                    }

                  </h2>


                  {/* 설명 */}

                  <p

                    style={{

                      color:
                        "#8b98ae",

                      lineHeight:
                        1.7,

                      marginBottom:
                        "18px",

                    }}

                  >

                    {
                      selectedAlert.description
                    }

                  </p>


                  {/* Source */}

                  <p

                    style={{

                      color:
                        "#66748b",

                      fontSize:
                        "12px",

                      marginBottom:
                        "24px",

                    }}

                  >

                    Source:{" "}

                    {
                      selectedAlert.source
                    }

                  </p>


                  {/* ================================= */}
                  {/* 문제점 */}
                  {/* ================================= */}

                  <div

                    style={{

                      marginBottom:
                        "20px",

                      padding:
                        "18px",

                      borderRadius:
                        "12px",

                      background:
                        "#171f2d",

                      border:
                        "1px solid #293850",

                    }}

                  >

                    <h3

                      style={{

                        margin:
                          "0 0 10px",

                        fontSize:
                          "14px",

                        color:
                          "#ff5969",

                      }}

                    >

                      ⚠ 문제점

                    </h3>


                    <p

                      style={{

                        margin:
                          0,

                        color:
                          "#c7d0df",

                        lineHeight:
                          1.7,

                        fontSize:
                          "13px",

                      }}

                    >

                      {
                        details.problem
                      }

                    </p>

                  </div>


                  {/* ================================= */}
                  {/* 위험 분석 */}
                  {/* ================================= */}

                  <div

                    style={{

                      marginBottom:
                        "20px",

                      padding:
                        "18px",

                      borderRadius:
                        "12px",

                      background:
                        "#171f2d",

                      border:
                        "1px solid #293850",

                    }}

                  >

                    <h3

                      style={{

                        margin:
                          "0 0 10px",

                        fontSize:
                          "14px",

                        color:
                          "#ffb43e",

                      }}

                    >

                      🔍 위험 분석

                    </h3>


                    <p

                      style={{

                        margin:
                          0,

                        color:
                          "#c7d0df",

                        lineHeight:
                          1.7,

                        fontSize:
                          "13px",

                      }}

                    >

                      {
                        details.risk
                      }

                    </p>

                  </div>


                  {/* ================================= */}
                  {/* 권장 대응 방법 */}
                  {/* ================================= */}

                  <div

                    style={{

                      marginBottom:
                        "20px",

                      padding:
                        "18px",

                      borderRadius:
                        "12px",

                      background:
                        "#171f2d",

                      border:
                        "1px solid #293850",

                    }}

                  >

                    <h3

                      style={{

                        margin:
                          "0 0 12px",

                        fontSize:
                          "14px",

                        color:
                          "#72a4ff",

                      }}

                    >

                      🛠 권장 대응 방법

                    </h3>


                    {details.solution.map(

                      (
                        solution,
                        index
                      ) => (

                        <div

                          key={
                            index
                          }

                          style={{

                            display:
                              "flex",

                            gap:
                              "10px",

                            marginBottom:

                              index ===
                              details.solution.length - 1

                                ? "0"

                                : "10px",

                          }}

                        >

                          <span

                            style={{

                              color:
                                "#72a4ff",

                              fontWeight:
                                700,

                              minWidth:
                                "18px",

                            }}

                          >

                            {
                              index + 1
                            }.

                          </span>


                          <span

                            style={{

                              color:
                                "#c7d0df",

                              lineHeight:
                                1.6,

                              fontSize:
                                "13px",

                            }}

                          >

                            {
                              solution
                            }

                          </span>

                        </div>

                      )

                    )}

                  </div>


                  {/* ================================= */}
                  {/* 우선순위 */}
                  {/* ================================= */}

                  <div

                    style={{

                      marginBottom:
                        "20px",

                      padding:
                        "15px",

                      borderRadius:
                        "10px",

                      background:

                        selectedAlert.level ===
                        "critical"

                          ? "rgba(255, 89, 105, 0.1)"

                          : selectedAlert.level ===
                            "warning"

                          ? "rgba(255, 180, 62, 0.1)"

                          : "rgba(114, 164, 255, 0.1)",

                      border:

                        selectedAlert.level ===
                        "critical"

                          ? "1px solid rgba(255, 89, 105, 0.3)"

                          : selectedAlert.level ===
                            "warning"

                          ? "1px solid rgba(255, 180, 62, 0.3)"

                          : "1px solid rgba(114, 164, 255, 0.3)",

                    }}

                  >

                    <span

                      style={{

                        color:
                          "#8b98ae",

                        fontSize:
                          "12px",

                      }}

                    >

                      우선순위

                    </span>


                    <div

                      style={{

                        marginTop:
                          "5px",

                        fontWeight:
                          700,

                        color:

                          selectedAlert.level ===
                          "critical"

                            ? "#ff5969"

                            : selectedAlert.level ===
                              "warning"

                            ? "#ffb43e"

                            : "#72a4ff",

                      }}

                    >

                      {
                        details.priority
                      }

                    </div>

                  </div>


                  {/* ================================= */}
                  {/* 닫기 */}
                  {/* ================================= */}

                  <button

                    onClick={() =>
                      setSelectedAlert(
                        null
                      )
                    }

                    style={{

                      marginTop:
                        "5px",

                      width:
                        "100%",

                      padding:
                        "12px",

                      border:
                        "1px solid #293850",

                      borderRadius:
                        "9px",

                      background:
                        "#172238",

                      color:
                        "#dce4f2",

                      cursor:
                        "pointer",

                      fontSize:
                        "14px",

                    }}

                  >

                    닫기

                  </button>


                </>

              );

            })()}

          </div>

        </div>

      )}

    </div>

  );
}

export default App;