/* =========================================
   LOAD ADMIN SIDEBAR
========================================= */

document.addEventListener("DOMContentLoaded", loadAdminSidebar);

async function loadAdminSidebar() {
  const container = document.getElementById("adminSidebarContainer");

  if (!container) {
    return;
  }

  try {
    const response = await fetch(
      "../components/admin-sidebar/admin-sidebar.html",
    );

    if (!response.ok) {
      throw new Error("Không thể tải Admin Sidebar.");
    }

    container.innerHTML = await response.text();

    setupAdminSidebar();
  } catch (error) {
    console.error("Admin Sidebar:", error);
  }
}

/* =========================================
   SETUP
========================================= */

function setupAdminSidebar() {
  const closeButton = document.getElementById("adminSidebarClose");

  const overlay = document.getElementById("adminSidebarOverlay");

  const logoutButton = document.getElementById("adminLogoutBtn");

  const adminName = document.getElementById("adminSidebarName");

  /* =====================================
     ADMIN INFO
  ===================================== */

  const currentUser = getCurrentAdmin();

  if (currentUser && currentUser.name && adminName) {
    adminName.textContent = currentUser.name;
  }

  /* =====================================
     CLOSE
  ===================================== */

  closeButton?.addEventListener("click", closeAdminSidebar);

  overlay?.addEventListener("click", closeAdminSidebar);

  /* =====================================
     LOGOUT
  ===================================== */

  logoutButton?.addEventListener("click", adminLogout);
}

/* =========================================
   LOGOUT
========================================= */

async function adminLogout() {
  const logoutButton = document.getElementById("adminLogoutBtn");

  /* =====================================
     DISABLE BUTTON
  ===================================== */

  if (logoutButton) {
    logoutButton.disabled = true;

    logoutButton.innerHTML = `
      <span class="admin-menu-icon">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </span>

      <span>Đang đăng xuất...</span>
    `;
  }

  try {
    /* ===================================
       HUY PHP SESSION
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
    console.error("Logout error:", error);
  } finally {
    /*
      Du PHP co loi thi van xoa
      thong tin frontend.

      Session protection se kiem tra
      lai khi truy cap trang bao ve.
    */

    localStorage.removeItem("smarthome_user");

    window.location.replace("login.html");
  }
}

/* =========================================
   GET CURRENT ADMIN
========================================= */

function getCurrentAdmin() {
  try {
    return JSON.parse(localStorage.getItem("smarthome_user"));
  } catch (error) {
    return null;
  }
}

/* =========================================
   OPEN SIDEBAR
========================================= */

function openAdminSidebar() {
  const sidebar = document.getElementById("adminSidebar");

  const overlay = document.getElementById("adminSidebarOverlay");

  sidebar?.classList.add("open");

  overlay?.classList.add("show");

  document.body.style.overflow = "hidden";
}

/* =========================================
   CLOSE SIDEBAR
========================================= */

function closeAdminSidebar() {
  const sidebar = document.getElementById("adminSidebar");

  const overlay = document.getElementById("adminSidebarOverlay");

  sidebar?.classList.remove("open");

  overlay?.classList.remove("show");

  document.body.style.overflow = "";
}

/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.openAdminSidebar = openAdminSidebar;

window.closeAdminSidebar = closeAdminSidebar;
