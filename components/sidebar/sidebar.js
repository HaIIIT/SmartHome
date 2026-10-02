/* =========================================
   SMART HOME - SIDEBAR
========================================= */

/* =========================================
   LOAD SIDEBAR
========================================= */

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

    /* =====================================
       SETUP SAU KHI LOAD HTML
    ===================================== */

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

  closeButton?.addEventListener("click", closeSidebar);

  overlay?.addEventListener("click", closeSidebar);
}

/* =========================================
   OPEN SIDEBAR
========================================= */

function openSidebar() {
  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  sidebar?.classList.add("open");

  overlay?.classList.add("show");
}

/* =========================================
   CLOSE SIDEBAR
========================================= */

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
   SETUP LOGOUT
========================================= */

function setupLogout() {
  const logoutButton = document.getElementById("logoutBtn");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", logout);
}

/* =========================================
   LOGOUT
========================================= */

async function logout() {
  const logoutButton = document.getElementById("logoutBtn");

  /* =====================================
     LOADING
  ===================================== */

  if (logoutButton) {
    logoutButton.disabled = true;

    logoutButton.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>

      <span>
        Đang đăng xuất...
      </span>
    `;
  }

  try {
    /* ===================================
       GOI PHP LOGOUT
    =================================== */

    const response = await fetch("../php/logout.php", {
      method: "POST",

      credentials: "same-origin",

      cache: "no-store",
    });

    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Phản hồi đăng xuất không hợp lệ.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data?.message || "Không thể đăng xuất.");
    }
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    /* ===================================
       XOA FRONTEND SESSION
    =================================== */

    localStorage.removeItem("smarthome_user");

    /* ===================================
       VE LOGIN
    =================================== */

    window.location.replace("login.html");
  }
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", loadSidebar);

/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.openSidebar = openSidebar;

window.closeSidebar = closeSidebar;
