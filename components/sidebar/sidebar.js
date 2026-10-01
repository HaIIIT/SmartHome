async function loadSidebar() {
  const container = document.getElementById("sidebarContainer");

  if (!container) {
    return;
  }

  try {
    const response = await fetch("../components/sidebar/sidebar.html");

    if (!response.ok) {
      throw new Error("Không thể tải Sidebar");
    }

    container.innerHTML = await response.text();

    // Sau khi HTML được load mới chạy chức năng
    setupSidebar();

    setActiveSidebar();

    setupLogout();
  } catch (error) {
    console.error("Sidebar Error:", error);
  }
}

/* =========================================
   OPEN / CLOSE
========================================= */

function setupSidebar() {
  const sidebar = document.getElementById("sidebar");

  const closeButton = document.getElementById("sidebarClose");

  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar) {
    return;
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  sidebar?.classList.add("open");

  overlay?.classList.add("show");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  sidebar?.classList.remove("open");

  overlay?.classList.remove("show");
}

/* =========================================
   ACTIVE PAGE
========================================= */

function setActiveSidebar() {
  const currentPage = document.body.dataset.page;

  const links = document.querySelectorAll(".sidebar-link[data-page]");

  links.forEach(function (link) {
    link.classList.remove("active");

    if (link.dataset.page === currentPage) {
      link.classList.add("active");
    }
  });
}

/* =========================================
   LOGOUT
========================================= */

function setupLogout() {
  const logoutButton = document.getElementById("logoutBtn");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", function () {
    window.location.href = "login.html";
  });
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", loadSidebar);
