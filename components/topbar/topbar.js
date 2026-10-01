async function loadTopbar() {
  const container = document.getElementById("topbarContainer");

  if (!container) {
    return;
  }

  try {
    const response = await fetch("../components/topbar/topbar.html");

    if (!response.ok) {
      throw new Error("Không thể tải Topbar");
    }

    container.innerHTML = await response.text();

    setupTopbar();

    updatePageInfo();
  } catch (error) {
    console.error("Topbar Error:", error);
  }
}

/* =========================================
   TOPBAR
========================================= */

function setupTopbar() {
  const menuButton = document.getElementById("menuButton");

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      /*
          openSidebar nằm trong sidebar.js
        */

      if (typeof openSidebar === "function") {
        openSidebar();
      }
    });
  }
}

/* =========================================
   PAGE INFO
========================================= */

function updatePageInfo() {
  const currentPage = document.body.dataset.page;

  const title = document.getElementById("pageTitle");

  const description = document.getElementById("pageDescription");

  if (!title || !description) {
    return;
  }

  const pages = {
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

      description: "Theo dõi và điều khiển thiết bị",
    },

    alerts: {
      title: "Cảnh báo",

      description: "Theo dõi các cảnh báo và sự kiện bất thường",
    },

    settings: {
      title: "Cài đặt",

      description: "Quản lý cài đặt hệ thống",
    },
  };

  const page = pages[currentPage];

  if (!page) {
    return;
  }

  title.textContent = page.title;

  description.textContent = page.description;
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", loadTopbar);
