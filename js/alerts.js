/* =========================================

   DEMO ALERT DATA

\========================================= */

const alertsData = [
  {
    id: 1,
    source: "temperature",
    sensor: "DHT11",
    sensorType: "Cảm biến nhiệt độ",
    location: "Phòng khách",
    level: "warning",
    title: "Nhiệt độ cao",
    message: "Nhiệt độ phòng vượt ngưỡng cảnh báo.",
    value: "36°C",
    date: "2026-10-01",
    time: "16:25",
    startDate: "2026-10-01",
    startTime: "16:25",
    endDate: null,
    endTime: null,
    resolved: false,
  },
  {
    id: 2,
    source: "temperature",
    sensor: "DHT11",
    sensorType: "Cảm biến nhiệt độ",
    location: "Phòng khách",
    level: "warning",
    title: "Nhiệt độ tăng",
    message: "Nhiệt độ phòng tăng cao hơn mức bình thường.",
    value: "34°C",
    date: "2026-09-29",
    time: "13:40",
    startDate: "2026-09-29",
    startTime: "13:40",
    endDate: "2026-09-29",
    endTime: "13:52",
    resolved: true,
  },
  {
    id: 3,
    source: "humidity",
    sensor: "DHT11",
    sensorType: "Cảm biến độ ẩm",
    location: "Phòng khách",
    level: "warning",
    title: "Độ ẩm cao",
    message: "Độ ẩm không khí vượt ngưỡng đã thiết lập.",
    value: "88%",
    date: "2026-09-30",
    time: "07:15",
    startDate: "2026-09-30",
    startTime: "07:15",
    endDate: "2026-09-30",
    endTime: "07:28",
    resolved: true,
  },
  {
    id: 4,
    source: "humidity",
    sensor: "DHT11",
    sensorType: "Cảm biến độ ẩm",
    location: "Phòng khách",
    level: "info",
    title: "Độ ẩm bất thường",
    message: "Hệ thống ghi nhận thay đổi độ ẩm đáng chú ý.",
    value: "82%",
    date: "2026-09-27",
    time: "21:08",
    startDate: "2026-09-27",
    startTime: "21:08",
    endDate: "2026-09-27",
    endTime: "21:16",
    resolved: true,
  },
  {
    id: 5,
    source: "air",
    sensor: "MQ-135",
    sensorType: "Cảm biến chất lượng không khí",
    location: "Phòng khách",
    level: "danger",
    title: "Chất lượng không khí kém",
    message: "MQ-135 phát hiện chất lượng không khí ở mức nguy hiểm.",
    value: "780 ppm",
    date: "2026-10-01",
    time: "21:17",
    startDate: "2026-10-01",
    startTime: "21:17",
    endDate: null,
    endTime: null,
    resolved: false,
  },
  {
    id: 6,
    source: "air",
    sensor: "MQ-135",
    sensorType: "Cảm biến chất lượng không khí",
    location: "Phòng khách",
    level: "warning",
    title: "Nồng độ khí tăng",
    message: "Chất lượng không khí đang giảm và cần được kiểm tra.",
    value: "650 ppm",
    date: "2026-09-28",
    time: "16:40",
    startDate: "2026-09-28",
    startTime: "16:40",
    endDate: "2026-09-28",
    endTime: "16:49",
    resolved: true,
  },
  {
    id: 7,
    source: "air",
    sensor: "MQ-135",
    sensorType: "Cảm biến chất lượng không khí",
    location: "Phòng khách",
    level: "warning",
    title: "Không khí cần chú ý",
    message: "Giá trị cảm biến MQ-135 cao hơn mức thông thường.",
    value: "610 ppm",
    date: "2026-09-20",
    time: "11:25",
    startDate: "2026-09-20",
    startTime: "11:25",
    endDate: "2026-09-20",
    endTime: "11:31",
    resolved: true,
  },
  {
    id: 8,
    source: "motion",
    sensor: "PIR",
    sensorType: "Cảm biến chuyển động",
    location: "Khu vực cửa chính",
    level: "warning",
    title: "Phát hiện chuyển động",
    message: "Phát hiện chuyển động tại khu vực cửa chính.",
    value: "Có chuyển động",
    date: "2026-10-01",
    time: "22:52",
    startDate: "2026-10-01",
    startTime: "22:52",
    endDate: null,
    endTime: null,
    resolved: false,
  },
  {
    id: 9,
    source: "motion",
    sensor: "PIR",
    sensorType: "Cảm biến chuyển động",
    location: "Khu vực cửa chính",
    level: "info",
    title: "Ghi nhận chuyển động",
    message: "PIR ghi nhận hoạt động tại khu vực giám sát.",
    value: "Có chuyển động",
    date: "2026-09-29",
    time: "18:32",
    startDate: "2026-09-29",
    startTime: "18:32",
    endDate: "2026-09-29",
    endTime: "18:35",
    resolved: true,
  },
  {
    id: 10,
    source: "door",
    sensor: "RFID",
    sensorType: "Kiểm soát truy cập RFID",
    location: "Cửa chính",
    level: "danger",
    title: "RFID không hợp lệ",
    message: "Phát hiện thẻ RFID không có quyền truy cập tại cửa chính.",
    value: "Từ chối",
    date: "2026-10-01",
    time: "09:41",
    startDate: "2026-10-01",
    startTime: "09:41",
    endDate: null,
    endTime: null,
    resolved: false,
  },
  {
    id: 11,
    source: "door",
    sensor: "Remote Access",
    sensorType: "Điều khiển cửa từ xa",
    location: "Cửa chính",
    level: "info",
    title: "Cửa được mở từ xa",
    message: "Cửa chính được mở bằng chức năng điều khiển từ xa.",
    value: "Thành công",
    date: "2026-09-30",
    time: "15:20",
    startDate: "2026-09-30",
    startTime: "15:20",
    endDate: "2026-09-30",
    endTime: "15:21",
    resolved: true,
  },
  {
    id: 12,
    source: "door",
    sensor: "RFID",
    sensorType: "Kiểm soát truy cập RFID",
    location: "Cửa chính",
    level: "info",
    title: "RFID hợp lệ",
    message: "Người dùng xác thực RFID thành công tại cửa chính.",
    value: "Cho phép",
    date: "2026-09-30",
    time: "11:05",
    startDate: "2026-09-30",
    startTime: "11:05",
    endDate: "2026-09-30",
    endTime: "11:06",
    resolved: true,
  },
];

/* =========================================

   SOURCE CONFIG

\========================================= */

const sourceConfig = {
  temperature: {
    name: "Nhiệt độ",

    icon: "fa-temperature-half",
  },

  humidity: {
    name: "Độ ẩm",

    icon: "fa-droplet",
  },

  air: {
    name: "Không khí",

    icon: "fa-wind",
  },

  motion: {
    name: "Chuyển động",

    icon: "fa-person-walking",
  },

  door: {
    name: "Cửa & RFID",

    icon: "fa-door-closed",
  },
};

/* =========================================

   CURRENT FILTER

\========================================= */

let currentSource = "all";

/* =========================================

   ELEMENTS

\========================================= */

const alertList = document.getElementById("alertList");

const emptyState = document.getElementById("emptyState");

const resultCount = document.getElementById("resultCount");

const historyTitle = document.getElementById("historyTitle");

const sourceFilterBadge = document.getElementById("sourceFilterBadge");

const levelFilter = document.getElementById("levelFilter");

const statusFilter = document.getElementById("statusFilter");

const fromDate = document.getElementById("fromDate");

const toDate = document.getElementById("toDate");

const sourceCards = document.querySelectorAll(".source-card");

const showAllSources = document.getElementById("showAllSources");

const clearFilterButton = document.getElementById("clearFilterButton");

/* =========================================

   LEVEL

\========================================= */

function getLevelName(level) {
  const names = {
    danger: "Nguy hiểm",

    warning: "Cảnh báo",

    info: "Thông tin",
  };

  return names[level] || "Thông tin";
}

/* =========================================

   SOURCE STATISTICS

\========================================= */

function updateSourceStatistics() {
  Object.keys(sourceConfig).forEach(function (source) {
    const sourceAlerts = alertsData.filter(function (alert) {
      return alert.source === source;
    });

    const pending = sourceAlerts.filter(function (alert) {
      return !alert.resolved;
    }).length;

    const totalElement = document.getElementById(source + "Total");

    const pendingElement = document.getElementById(source + "Pending");

    if (totalElement) {
      totalElement.textContent = sourceAlerts.length;
    }

    if (pendingElement) {
      pendingElement.textContent = pending;
    }
  });
}

/* =========================================

   GLOBAL STATISTICS

\========================================= */

function updateGlobalStatistics() {
  const danger = alertsData.filter(function (alert) {
    return alert.level === "danger";
  }).length;

  const unresolved = alertsData.filter(function (alert) {
    return !alert.resolved;
  }).length;

  const resolved = alertsData.filter(function (alert) {
    return alert.resolved;
  }).length;

  document.getElementById("totalAlerts").textContent = alertsData.length;

  document.getElementById("dangerAlerts").textContent = danger;

  document.getElementById("unresolvedAlerts").textContent = unresolved;

  document.getElementById("resolvedAlerts").textContent = resolved;
}

/* =========================================

   GET FILTERED ALERTS

\========================================= */

function getFilteredAlerts() {
  return alertsData.filter(function (alert) {
    /* SOURCE */

    if (currentSource !== "all" && alert.source !== currentSource) {
      return false;
    }

    /* LEVEL */

    if (levelFilter.value !== "all" && alert.level !== levelFilter.value) {
      return false;
    }

    /* STATUS */

    if (statusFilter.value === "pending" && alert.resolved) {
      return false;
    }

    if (statusFilter.value === "resolved" && !alert.resolved) {
      return false;
    }

    /* FROM DATE */

    if (fromDate.value && alert.date < fromDate.value) {
      return false;
    }

    /* TO DATE */

    if (toDate.value && alert.date > toDate.value) {
      return false;
    }

    return true;
  });
}

/* =========================================

   RENDER

\========================================= */

function renderAlerts() {
  if (!alertList) {
    return;
  }

  const filteredAlerts = getFilteredAlerts();

  /*

    Mới nhất lên đầu

  */

  filteredAlerts.sort(function (a, b) {
    const first = new Date(`${a.date}T${a.time}`);

    const second = new Date(`${b.date}T${b.time}`);

    return second - first;
  });

  alertList.innerHTML = "";

  if (resultCount) {
    resultCount.textContent = `${filteredAlerts.length} cảnh báo`;
  }

  if (filteredAlerts.length === 0) {
    if (emptyState) {
      emptyState.classList.add("show");
    }

    return;
  }

  if (emptyState) {
    emptyState.classList.remove("show");
  }

  filteredAlerts.forEach(function (alert) {
    const source = sourceConfig[alert.source];

    const item = document.createElement("div");

    item.className = `alert-item ${alert.level}`;

    item.innerHTML = `



        <div class="alert-item-icon">



          <i

            class="fa-solid

            ${source.icon}"

          ></i>



        </div>





        <div class="alert-body">



          <div class="alert-title-row">



            <strong>

              ${alert.title}

            </strong>



            <span class="alert-level">

              ${getLevelName(alert.level)}

            </span>



          </div>





          <p>

            ${alert.message}

          </p>





          <div class="alert-meta">



            <span>



              <i class="fa-solid fa-microchip"></i>



              ${alert.sensor}



            </span>





            <span class="alert-value">



              <i class="fa-solid fa-chart-simple"></i>



              ${alert.value}



            </span>





            <span>



              <i class="fa-regular fa-calendar"></i>



              ${formatDate(alert.date)}



            </span>





            <span>



              <i class="fa-regular fa-clock"></i>



              ${alert.time}



            </span>



          </div>



        </div>





                <div class="alert-actions">
          <button class="detail-button" type="button" data-detail-id="${alert.id}">
            <span>Xem chi tiết</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <button
            class="resolve-button ${alert.resolved ? "resolved" : ""}"
            type="button"
            data-id="${alert.id}"
            ${alert.resolved ? "disabled" : ""}
          >
            <i class="fa-solid ${alert.resolved ? "fa-check" : "fa-check-double"}"></i>
            ${alert.resolved ? "Đã xử lý" : "Xử lý"}
          </button>
        </div>




      `;

    alertList.appendChild(item);
  });

  setupResolveButtons();
  setupDetailButtons();
}

/* =========================================

   FORMAT DATE

\========================================= */

function formatDate(dateString) {
  const parts = dateString.split("-");

  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

/* =========================================

   SELECT SOURCE

\========================================= */

function selectSource(source) {
  currentSource = source;

  sourceCards.forEach(function (card) {
    card.classList.toggle("active", card.dataset.source === source);
  });

  if (showAllSources) {
    showAllSources.classList.toggle("active", source === "all");
  }

  if (source === "all") {
    historyTitle.textContent = "Tất cả cảnh báo";

    sourceFilterBadge.textContent = "Tất cả nguồn";
  } else {
    historyTitle.textContent = `Cảnh báo ${sourceConfig[source].name}`;

    sourceFilterBadge.textContent = sourceConfig[source].name;
  }

  renderAlerts();

  /*

    Cuộn nhẹ xuống lịch sử

  */

  const historyPanel = document.querySelector(".history-panel");

  if (historyPanel) {
    historyPanel.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  }
}

/* =========================================

   SOURCE EVENTS

\========================================= */

sourceCards.forEach(function (card) {
  card.addEventListener("click", function () {
    selectSource(card.dataset.source);
  });
});

if (showAllSources) {
  showAllSources.addEventListener("click", function () {
    selectSource("all");
  });
}

/* =========================================

   FILTER EVENTS

\========================================= */

[levelFilter, statusFilter, fromDate, toDate].forEach(function (element) {
  if (!element) {
    return;
  }

  element.addEventListener("change", renderAlerts);
});

/* =========================================

   CLEAR FILTER

\========================================= */

if (clearFilterButton) {
  clearFilterButton.addEventListener("click", function () {
    currentSource = "all";

    levelFilter.value = "all";

    statusFilter.value = "all";

    fromDate.value = "";

    toDate.value = "";

    sourceCards.forEach(function (card) {
      card.classList.remove("active");
    });

    showAllSources.classList.add("active");

    historyTitle.textContent = "Tất cả cảnh báo";

    sourceFilterBadge.textContent = "Tất cả nguồn";

    renderAlerts();
  });
}

/* =========================================

   RESOLVE

\========================================= */

function setupResolveButtons() {
  const buttons = document.querySelectorAll(".resolve-button:not(.resolved)");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.id);

      const alert = alertsData.find(function (item) {
        return item.id === id;
      });

      if (!alert) {
        return;
      }

      alert.resolved = true;

      updateGlobalStatistics();

      updateSourceStatistics();

      renderAlerts();
    });
  });
}

/* =========================================
   ALERT DETAIL MODAL
========================================= */

const alertDetailModal = document.getElementById("alertDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const closeDetailFooter = document.getElementById("closeDetailFooter");
const detailMainIcon = document.getElementById("detailMainIcon");
const detailTitle = document.getElementById("detailTitle");
const detailLevel = document.getElementById("detailLevel");
const detailStatus = document.getElementById("detailStatus");
const detailMessage = document.getElementById("detailMessage");
const detailSensor = document.getElementById("detailSensor");
const detailSensorType = document.getElementById("detailSensorType");
const detailLocation = document.getElementById("detailLocation");
const detailValue = document.getElementById("detailValue");
const detailStartTime = document.getElementById("detailStartTime");
const detailEndTime = document.getElementById("detailEndTime");
const detailDuration = document.getElementById("detailDuration");

function calculateDuration(alert) {
  if (!alert.startDate || !alert.startTime) return "--";
  if (!alert.endDate || !alert.endTime) return "Đang cảnh báo";

  const start = new Date(`${alert.startDate}T${alert.startTime}`);
  const end = new Date(`${alert.endDate}T${alert.endTime}`);
  const difference = end - start;

  if (difference < 0) return "--";

  const totalMinutes = Math.floor(difference / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours} giờ ${minutes} phút`;
  if (hours > 0) return `${hours} giờ`;
  return `${minutes} phút`;
}

function formatDateTime(date, time) {
  if (!date || !time) return "Chưa kết thúc";
  return `${formatDate(date)} - ${time}`;
}

function openAlertDetail(id) {
  const alert = alertsData.find(function (item) {
    return item.id === id;
  });

  if (!alert || !alertDetailModal) return;

  const source = sourceConfig[alert.source];

  if (detailMainIcon) {
    detailMainIcon.className = `detail-main-icon ${alert.level}`;
    detailMainIcon.innerHTML = `<i class="fa-solid ${source.icon}"></i>`;
  }

  if (detailTitle) detailTitle.textContent = alert.title;

  if (detailLevel) {
    detailLevel.className = `detail-level ${alert.level}`;
    detailLevel.textContent = getLevelName(alert.level);
  }

  if (detailStatus) {
    detailStatus.className = `detail-status ${alert.resolved ? "resolved" : "pending"}`;
    detailStatus.textContent = alert.resolved ? "Đã xử lý" : "Chưa xử lý";
  }

  if (detailMessage) detailMessage.textContent = alert.message;
  if (detailSensor) detailSensor.textContent = alert.sensor || "--";
  if (detailSensorType) detailSensorType.textContent = alert.sensorType || "--";
  if (detailLocation) detailLocation.textContent = alert.location || "--";
  if (detailValue) detailValue.textContent = alert.value || "--";
  if (detailStartTime)
    detailStartTime.textContent = formatDateTime(
      alert.startDate,
      alert.startTime,
    );
  if (detailEndTime)
    detailEndTime.textContent = formatDateTime(alert.endDate, alert.endTime);
  if (detailDuration) detailDuration.textContent = calculateDuration(alert);

  alertDetailModal.classList.add("show");
  alertDetailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-modal-open");
}

function hideAlertDetail() {
  if (!alertDetailModal) return;
  alertDetailModal.classList.remove("show");
  alertDetailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-modal-open");
}

function setupDetailButtons() {
  const buttons = document.querySelectorAll(".detail-button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      openAlertDetail(Number(button.dataset.detailId));
    });
  });
}

if (closeDetailModal)
  closeDetailModal.addEventListener("click", hideAlertDetail);
if (closeDetailFooter)
  closeDetailFooter.addEventListener("click", hideAlertDetail);

if (alertDetailModal) {
  alertDetailModal.addEventListener("click", function (event) {
    if (event.target === alertDetailModal) hideAlertDetail();
  });
}

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    alertDetailModal &&
    alertDetailModal.classList.contains("show")
  ) {
    hideAlertDetail();
  }
});

/* =========================================

   START

\========================================= */

document.addEventListener("DOMContentLoaded", function () {
  updateGlobalStatistics();

  updateSourceStatistics();

  renderAlerts();
});
