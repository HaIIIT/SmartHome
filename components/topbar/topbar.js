async function loadTopbar() {
  const container = document.getElementById("topbarContainer");
  if (!container) return;

  try {
    const response = await fetch("../components/topbar/topbar.html");
    if (!response.ok) throw new Error("Không thể tải topbar.");

    container.innerHTML = await response.text();

    initializeTopbar();
  } catch (error) {
    console.error("Topbar error:", error);
  }
}

function initializeTopbar() {
  const page = document.body.dataset.page || "dashboard";

  const pageConfig = {
    dashboard: {
      title: "Tổng quan",
      description: "Theo dõi và quản lý ngôi nhà của bạn",
    },
    sensors: {
      title: "Cảm biến",
      description: "Theo dõi dữ liệu cảm biến trong ngôi nhà",
    },
    devices: {
      title: "Thiết bị",
      description: "Theo dõi và điều khiển các thiết bị",
    },
    alerts: {
      title: "Cảnh báo",
      description: "Theo dõi lịch sử và trạng thái cảnh báo",
    },
    settings: {
      title: "Cài đặt",
      description: "Quản lý tài khoản và cấu hình hệ thống",
    },
  };

  const config = pageConfig[page] || pageConfig.dashboard;
  const pageTitle = document.getElementById("pageTitle");
  const pageDescription = document.getElementById("pageDescription");

  if (pageTitle) pageTitle.textContent = config.title;
  if (pageDescription) pageDescription.textContent = config.description;

  /* MOBILE SIDEBAR */
  document.getElementById("menuButton")?.addEventListener("click", function () {
    if (typeof window.openSidebar === "function") {
      window.openSidebar();
    }
  });

  /* DROPDOWNS */
  const notificationButton = document.getElementById("notificationButton");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const userProfileButton = document.getElementById("userProfileButton");
  const userDropdown = document.getElementById("userDropdown");
  const userArrow = document.getElementById("userArrow");

  function closeNotificationDropdown() {
    notificationDropdown?.classList.remove("show");
    notificationButton?.classList.remove("active");
    notificationButton?.setAttribute("aria-expanded", "false");
  }

  function closeUserDropdown() {
    userDropdown?.classList.remove("show");
    userProfileButton?.classList.remove("active");
    userProfileButton?.setAttribute("aria-expanded", "false");
    userArrow?.classList.remove("rotate");
  }

  notificationButton?.addEventListener("click", function (event) {
    event.stopPropagation();

    const willOpen = !notificationDropdown.classList.contains("show");
    closeUserDropdown();

    notificationDropdown.classList.toggle("show", willOpen);
    notificationButton.classList.toggle("active", willOpen);
    notificationButton.setAttribute("aria-expanded", String(willOpen));
  });

  userProfileButton?.addEventListener("click", function (event) {
    event.stopPropagation();

    const willOpen = !userDropdown.classList.contains("show");
    closeNotificationDropdown();

    userDropdown.classList.toggle("show", willOpen);
    userProfileButton.classList.toggle("active", willOpen);
    userProfileButton.setAttribute("aria-expanded", String(willOpen));
    userArrow?.classList.toggle("rotate", willOpen);
  });

  notificationDropdown?.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  userDropdown?.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("click", function () {
    closeNotificationDropdown();
    closeUserDropdown();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNotificationDropdown();
      closeUserDropdown();
    }
  });

  /* MARK ALL NOTIFICATIONS READ */
  const markAllReadButton = document.getElementById("markAllReadButton");
  const notificationDot = document.getElementById("notificationDot");
  const notificationSummary = document.getElementById("notificationSummary");

  markAllReadButton?.addEventListener("click", function () {
    document
      .querySelectorAll("#topbarNotificationList .notification-item")
      .forEach(function (item) {
        item.classList.remove("unread");
      });

    notificationDot?.classList.add("hidden");

    if (notificationSummary) {
      notificationSummary.textContent = "Không có cảnh báo chưa đọc";
    }
  });

  /* LOGOUT */
  document
    .getElementById("topbarLogoutButton")
    ?.addEventListener("click", function () {
      window.location.href = "login.html";
    });
}

document.addEventListener("DOMContentLoaded", loadTopbar);
