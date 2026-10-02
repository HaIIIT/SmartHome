/* =========================================================
   SMART HOME - GLOBAL NOTIFICATION SYSTEM
   - Toast: phản hồi thao tác thành công / lỗi / cảnh báo / thông tin
   - Emergency Modal: cảnh báo cảm biến cần người dùng xác nhận
   ========================================================= */

(function () {
  const STORAGE_KEY = "sm_acknowledged_alerts";
  const emergencyQueue = [];
  let emergencyShowing = false;

  function ensureToastRoot() {
    let root = document.getElementById("smNotificationRoot");

    if (!root) {
      root = document.createElement("div");
      root.id = "smNotificationRoot";
      root.setAttribute("aria-live", "polite");
      document.body.appendChild(root);
    }

    return root;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.showNotification = function ({
    type = "info",
    title = "Thông báo",
    message = "",
    duration = 4000,
  } = {}) {
    const allowed = ["success", "error", "warning", "info"];
    if (!allowed.includes(type)) type = "info";

    const root = ensureToastRoot();
    const toast = document.createElement("div");
    toast.className = `sm-toast ${type}`;

    toast.innerHTML = `
      <button class="sm-toast-close" type="button" aria-label="Đóng thông báo">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="sm-toast-title">${escapeHTML(title)}</div>
      <div class="sm-toast-message">${escapeHTML(message)}</div>

      <div class="sm-toast-progress">
        <span style="animation-duration:${duration}ms"></span>
      </div>
    `;

    root.appendChild(toast);

    let removed = false;

    const remove = () => {
      if (removed) return;
      removed = true;
      toast.classList.add("leaving");
      setTimeout(() => toast.remove(), 250);
    };

    toast.querySelector(".sm-toast-close")?.addEventListener("click", remove);
    setTimeout(remove, duration);

    return toast;
  };

  function getAcknowledgedIds() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveAcknowledgedId(id) {
    if (!id) return;

    const ids = getAcknowledgedIds();

    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  }

  function isAcknowledged(id) {
    return id ? getAcknowledgedIds().includes(id) : false;
  }

  function ensureEmergencyModal() {
    let overlay = document.getElementById("smEmergencyOverlay");

    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "sm-emergency-overlay";
    overlay.id = "smEmergencyOverlay";

    overlay.innerHTML = `
      <section class="sm-emergency-modal"
               role="alertdialog"
               aria-modal="true"
               aria-labelledby="smEmergencyTitle">

        <div class="sm-emergency-header">
          <div class="sm-emergency-symbol">
            <i class="fa-solid fa-exclamation"></i>
          </div>

          <div class="sm-emergency-header-text">
            <small>SMART HOME SECURITY</small>
            <h2>CẢNH BÁO KHẨN CẤP</h2>
          </div>
        </div>

        <div class="sm-emergency-body">
          <div class="sm-emergency-sensor" id="smEmergencySensor"></div>

          <h3 id="smEmergencyTitle"></h3>

          <p class="sm-emergency-message" id="smEmergencyMessage"></p>

          <div class="sm-emergency-data">
            <div class="sm-emergency-data-item">
              <span>Giá trị ghi nhận</span>
              <strong class="danger-value" id="smEmergencyValue">--</strong>
            </div>

            <div class="sm-emergency-data-item">
              <span>Vị trí</span>
              <strong id="smEmergencyLocation">--</strong>
            </div>

            <div class="sm-emergency-data-item">
              <span>Thời gian</span>
              <strong id="smEmergencyTime">--</strong>
            </div>

            <div class="sm-emergency-data-item">
              <span>Trạng thái</span>
              <strong class="danger-value">Chưa xác nhận</strong>
            </div>
          </div>

          <div class="sm-emergency-actions">
            <button class="sm-emergency-button sm-emergency-secondary"
                    id="smEmergencyLater"
                    type="button">
              <i class="fa-regular fa-clock"></i>
              Xem sau
            </button>

            <button class="sm-emergency-button sm-emergency-primary"
                    id="smEmergencyConfirm"
                    type="button">
              <i class="fa-solid fa-check"></i>
              Xác nhận cảnh báo
            </button>
          </div>

          <div class="sm-emergency-queue" id="smEmergencyQueue"></div>
        </div>
      </section>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function renderEmergency(alert) {
    const overlay = ensureEmergencyModal();

    document.getElementById("smEmergencySensor").textContent =
      alert.sensor || "CẢM BIẾN";

    document.getElementById("smEmergencyTitle").textContent =
      alert.title || "Phát hiện trạng thái bất thường!";

    document.getElementById("smEmergencyMessage").textContent =
      alert.message || "Hệ thống vừa phát hiện một cảnh báo cần được kiểm tra.";

    document.getElementById("smEmergencyValue").textContent =
      alert.value || "--";

    document.getElementById("smEmergencyLocation").textContent =
      alert.location || "--";

    document.getElementById("smEmergencyTime").textContent =
      alert.time || new Date().toLocaleString("vi-VN");

    const queueText = document.getElementById("smEmergencyQueue");
    const pending = emergencyQueue.length;

    queueText.textContent =
      pending > 0 ? `Còn ${pending} cảnh báo đang chờ xác nhận` : "";

    const confirmButton = document.getElementById("smEmergencyConfirm");
    const laterButton = document.getElementById("smEmergencyLater");

    confirmButton.onclick = function () {
      /*
        FRONTEND DEMO:
        localStorage chỉ giúp ghi nhớ trên trình duyệt này.

        Khi có PHP/MySQL:
        thay phần này bằng API cập nhật:
        alerts.status = 'acknowledged'
        alerts.acknowledged_at = NOW()
        alerts.acknowledged_by = user_id

        Chỉ sau khi server trả về thành công mới đóng modal.
      */
      saveAcknowledgedId(alert.id);

      overlay.classList.remove("show");
      emergencyShowing = false;

      showNotification({
        type: "success",
        title: "Đã xác nhận cảnh báo",
        message: `${alert.sensor || "Cảm biến"} đã được ghi nhận.`,
        duration: 3500,
      });

      setTimeout(showNextEmergency, 240);
    };

    laterButton.onclick = function () {
      /*
        "Xem sau" chỉ đóng tạm thời.
        KHÔNG đánh dấu cảnh báo đã xác nhận.
        Vì vậy khi tải lại trang, backend vẫn có thể gửi lại cảnh báo này.
      */
      overlay.classList.remove("show");
      emergencyShowing = false;

      setTimeout(showNextEmergency, 240);
    };

    requestAnimationFrame(() => overlay.classList.add("show"));
  }

  function showNextEmergency() {
    if (emergencyShowing) return;

    while (emergencyQueue.length) {
      const alert = emergencyQueue.shift();

      if (alert.id && isAcknowledged(alert.id)) {
        continue;
      }

      emergencyShowing = true;
      renderEmergency(alert);
      return;
    }
  }

  window.showEmergencyAlert = function (alert = {}) {
    if (alert.id && isAcknowledged(alert.id)) return;

    const alreadyQueued = emergencyQueue.some(
      (item) => item.id && item.id === alert.id,
    );

    if (alreadyQueued) return;

    emergencyQueue.push(alert);
    showNextEmergency();
  };

  /*
    Dùng hàm này khi backend trả về danh sách cảnh báo chưa xác nhận
    lúc người dùng vừa mở / tải lại trang.
  */
  window.showPendingEmergencyAlerts = function (alerts = []) {
    if (!Array.isArray(alerts)) return;

    alerts.forEach((alert) => {
      if (!alert.id || !isAcknowledged(alert.id)) {
        emergencyQueue.push(alert);
      }
    });

    showNextEmergency();
  };

  /*
    DEMO NHANH - bỏ comment để test:

    document.addEventListener("DOMContentLoaded", function () {
      showEmergencyAlert({
        id: "alert-demo-001",
        sensor: "MQ-135 · Chất lượng không khí",
        title: "Phát hiện chất lượng không khí nguy hiểm!",
        message: "Nồng độ khí đang vượt ngưỡng an toàn. Vui lòng kiểm tra khu vực ngay.",
        value: "780 ppm",
        location: "Phòng khách",
        time: "20:09 · 02/10/2026"
      });
    });
  */
})();
